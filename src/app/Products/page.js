"use client";

import React, { useEffect, useState } from "react";
import NavMenu from "@/components/NavBar";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/ProductData";
import { Table, Button, Form } from "react-bootstrap";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.$values)) {
          setProducts(data.$values);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [formSubmitted]); // Refresh list when new product is added

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setUpdatingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts((prev) =>
          prev.filter((product) => product.productId !== productId)
        );
        setSuccess("Product deleted successfully.");
      } catch (error) {
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    const product = {
      productName: formData.productName,
      description: formData.description,
    };

    try {
      if (updatingProduct) {
        await updateProduct(updatingProduct.productId, formData);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(formData);
        setSuccess("Product created successfully.");
      }
      setFormSubmitted((prev) => !prev);
      setShowForm(false);
      setFormData({ productName: "", description: "" });
      setUpdatingProduct(null);
    } catch (err) {
      setError("Failed to save product. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <NavMenu />
      <div className="m-3">
        {!showForm ? (
          <Button className="mb-3" onClick={() => setShowForm(true)}>
            Add New Product
          </Button>
        ) : (
          <>
            <h4>{updatingProduct ? "Update Product" : "Create New Product"}</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                />
              </Form.Group>
              {error && <p className="text-danger mt-2">{error}</p>}
              {success && <p className="text-success mt-2">{success}</p>}
              <Button
                variant="primary"
                type="submit"
                disabled={creating}
                className="mt-3"
              >
                {creating
                  ? updatingProduct
                    ? "Updating..."
                    : "Creating..."
                  : updatingProduct
                  ? "Update Product"
                  : "Create Product"}
              </Button>
              <Button
                variant="secondary"
                className="mt-3 ms-2"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ productName: "", description: "" });
                  setUpdatingProduct(null);
                }}
              >
                Cancel
              </Button>
            </Form>
          </>
        )}
      </div>

      {!showForm && (
        <div className="m-3">
          <h4>Product List</h4>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>EDIT</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(product.productId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </>
  );
}

export default Products;
