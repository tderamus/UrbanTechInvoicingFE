"use client";

import React, { useEffect, useState } from "react";
import NavMenu from "@/components/NavBar";
import { Table, Button, Form } from "react-bootstrap";
import {
  getAllInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "@/api/InvoiceData";
import { clientCredentials } from "@/utils/client";
const endpoint = `${clientCredentials.databaseURL}`;
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customerId: "",
    status: "",
    invoiceDate: "",
    dueDate: "",
    invoiceTotal: 0.0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingInvoices, setUpdatingInvoices] = useState(null);
  const [customers, setCustomers] = useState([]);

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};


  useEffect(() => {
    fetch(`${endpoint}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else if (Array.isArray(data.$values)) {
          setCustomers(data.$values);
        }
      })
      .catch((err) => console.error("Error loading customers:", err));
  }, []);

  useEffect(() => {
    getAllInvoices()
      .then((data) => {
        if (Array.isArray(data)) {
          setInvoices(data);
        } else if (Array.isArray(data.$values)) {
          setInvoices(data.$values);
        } else {
          setInvoices([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [formSubmitted]); // Refresh list when new invoice is added

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (invoice) => {
    setUpdatingInvoices(invoice);
    setFormData({
      customerId: invoice.customerId || "",
      status: invoice.status || "",
      invoiceDate: formatDate(invoice.invoiceDate) || "",
      dueDate: formatDate(invoice.dueDate) || "",
      invoiceTotal: invoice.invoiceTotal || 0.0,
    });
    setShowForm(true);
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(invoiceId);
        setInvoices((prev) =>
          prev.filter((invoice) => invoice.invoiceId !== invoiceId)
        );
      } catch (err) {
        setError("Error deleting invoice");
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
      const payload = {
        customerId: formData.customerId || null,
        invoiceDate: new Date(formData.invoiceDate).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        status: parseInt(formData.status),
        invoiceTotal: parseFloat(formData.invoiceTotal),
      };

      if (updatingInvoices) {
        await updateInvoice(updatingInvoices.invoiceId, payload);
        setSuccess("Invoice updated successfully!");
      } else {
        await createInvoice(payload);
        setSuccess("Invoice created successfully!");
      }

      setFormSubmitted((prev) => !prev);
      setFormData({
        customerId: "",
        status: "",
        invoiceDate: "",
        dueDate: "",
        invoiceTotal: 0.0,
      });
      setShowForm(false);
      setUpdatingInvoices(null);
    } catch (err) {
      console.error("Invoice submission error:", err);
      setError("Error saving invoice");
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
            Add New Invoice
          </Button>
        ) : (
          <>
            <h4>{updatingInvoices ? "Edit Invoice" : "Create New Invoice"}</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCustomer">
                <Form.Label>Customer</Form.Label>
                <Form.Select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option
                      key={customer.customerId}
                      value={customer.customerId}
                    >
                      {customer.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a status</option>
                  {[
                    "Paid",
                    "Unpaid",
                    "Overdue",
                    "Cancelled",
                    "Refunded",
                    "PartiallyPaid",
                    "Pending",
                    "Draft",
                    "AwaitingPayment",
                  ].map((status, index) => (
                    <option key={index} value={index}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formInvoiceDate">
                <Form.Label>Invoice Date</Form.Label>
                <Form.Control
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDueDate">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formTotal">
                <Form.Label>Invoice Total</Form.Label>
                <Form.Control
                  type="number"
                  name="invoiceTotal"
                  value={formData.invoiceTotal}
                  onChange={handleChange}
                  required
                  step="0.01"
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}

              <Button variant="primary" type="submit" disabled={creating}>
                {creating
                  ? updatingInvoices
                    ? "Updating..."
                    : "Creating..."
                  : updatingInvoices
                  ? "Update invoices"
                  : "Create invoices"}
              </Button>
              <Button
                variant="secondary"
                className="ml-3 ms-2"
                onClick={() => {
                  setShowForm(false);
                  setUpdatingInvoices(null);
                  setFormData({ name: "", emailAddress: "", phoneNumber: "" });
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Invoice Date</th>
                  <th>Invoice Due Date</th>
                  <th>Invoice Status</th>
                  <th>Invoice Total</th>
                  <th>EDIT</th>
                  <th>DELETE</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.invoiceId}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{formatDate(invoice.invoiceDate)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>{invoice.status}</td>
                    <td>{invoice.invoiceTotal}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(invoice)}
                      >
                        EDIT
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(invoices.invoicesId)}
                      >
                        DELETE
                      </Button>
                    </td>
                    <td>
                      <Button variant="success">ADD PAYMENT</Button>
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

export default Invoices;
