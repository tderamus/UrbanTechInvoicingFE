"use client";

import React, { useEffect, useState } from "react";
import NavMenu from "@/components/NavBar";
import { Table, Button, Form } from "react-bootstrap";
import {
  getAllPayments,
  createPayments,
  updatePayments, 
  deletePayments,
} from "@/api/PaymentData";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    paymentType: "",
    paymentDate: "",
    paymentAmount: 0.0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(null);

  useEffect(() => {
    getAllPayments()
      .then((data) => {
        if (Array.isArray(data)) {
          setPayments(data);
        } else if (Array.isArray(data.$values)) {
          setPayments(data.$values);
        } else {
          setPayments([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [formSubmitted]); // Refresh list when new payment is added

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (payment) => {
    setUpdatingPayment(payment);
    setFormData({
      paymentType: payment.paymentType,
      paymentDate: payment.paymentDate,
      paymentAmount: payment.paymentAmount,
    });
    setShowForm(true);
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await deletePayments(paymentId);
        setPayments((prev) =>
          prev.filter((payment) => payment.paymentId !== paymentId)
        );
        setSuccess("Payment deleted successfully!");
      } catch (err) {
        setError("Error deleting payment");
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
      if (updatingPayment) {
        await updatePayments(updatingPayment.paymentId, formData);
        setSuccess("Payment updated successfully!");
      } else {
        await createPayments(formData);
        setSuccess("Payment created successfully!");
      }
      setFormSubmitted((prev) => !prev);
      setFormData({ paymentType: "", paymentDate: "", paymentAmount: 0.0 });
      setShowForm(false);
      setUpdatingPayment(null);
    } catch (err) {
      setError("Error saving payment");
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
            Add New Payment
          </Button>
        ) : (
          <>
            <h4>
              {updatingPayment ? "Edit Payment" : "Create New Payment"}
            </h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formPaymentType">
                <Form.Label>Payment Type</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  placeholder="Enter payment type"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPaymentDate">
                <Form.Label>Payment Date</Form.Label>
                <Form.Control
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  placeholder="Enter Date of Payment"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPaymentAmount">
                <Form.Label>Payment Amount</Form.Label>
                <Form.Control
                  type="decimal"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  placeholder="Enter amount of payment"
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}

              <Button variant="primary" type="submit" disabled={creating}>
                {creating
                  ? updatingPayment
                    ? "Updating..."
                    : "Creating..."
                  : updatingPayment
                  ? "Update Payment"
                  : "Create Payment"}
              </Button>
              <Button
                variant="secondary"
                className="ml-3 ms-2"
                onClick={() => {
                  setShowForm(false);
                  setUpdatingPayment(null);
                  setFormData({ paymentType: "", paymentDate: "", paymentAmount: 0.0 });
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
                  <th>Payment Type</th>
                  <th>Payment Date</th>
                  <th>Payment Amount</th>
                  <th>EDIT</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td>{payment.paymentType}</td>
                    <td>{payment.paymentDate}</td>
                    <td>{payment.paymentAmount}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(payment)}
                      >
                        EDIT
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(payment.paymentId)}
                      >
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

export default Payments;
