"use client";

import React, { useEffect, useState } from "react";
import NavMenu from "@/components/NavBar";
import { Table, Button } from "react-bootstrap";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/api/CustomerData";
import { Form } from "react-bootstrap";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    emailAddress: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingCustomer, setUpdatingCustomer] = useState(null);

  useEffect(() => {
    getAllCustomers()
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else if (Array.isArray(data.$values)) {
          setCustomers(data.$values);
        } else {
          setCustomers([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [formSubmitted]); // Refresh list when new customer is added

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (customer) => {
    setUpdatingCustomer(customer);
    setFormData({
      name: customer.name,
      emailAddress: customer.emailAddress,
      phoneNumber: customer.phoneNumber,
    });
    setShowForm(true);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(customerId);
        setCustomers((prev) =>
          prev.filter((customer) => customer.customerId !== customerId)
        );
        setSuccess("Customer deleted successfully!");
      } catch (err) {
        setError("Error deleting customer");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    setFormSubmitted(false);

    try {
      if (updatingCustomer) {
        await updateCustomer(updatingCustomer.customerId, formData);
        setSuccess("Customer updated successfully!");
      } else {
        await createCustomer(formData);
        setSuccess("Customer created successfully!");
      }
      setFormSubmitted(true);
      setFormData({ name: "", emailAddress: "", phoneNumber: "" });
      setShowForm(false);
      setUpdatingCustomer(null);
    } catch (err) {
      setError("Error saving customer");
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
            Add New Customer
          </Button>
        ) : (
          <>
            <h4>
              {updatingCustomer ? "Edit Customer" : "Create New Customer"}
            </h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}

              <Button variant="primary" type="submit" disabled={creating}>
                {creating
                  ? updatingCustomer
                    ? "Updating..."
                    : "Creating..."
                  : updatingCustomer
                  ? "Update Customer"
                  : "Create Customer"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
                className="ml-2"
              >
                Cancel
              </Button>
            </Form>
          </>
        )}
      </div>

      {!showForm && (
        <div className="m-3">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>EDIT</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td>{customer.name}</td>
                    <td>{customer.emailAddress}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(customer)}>
                        EDIT
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(customer.customerId)}>
                        DELETE
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

export default Customers;
