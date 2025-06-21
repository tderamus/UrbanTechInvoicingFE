"use client";

import React, { useEffect, useState } from "react";
import NavMenu from "@/components/NavBar";
import { Table, Button, Form } from "react-bootstrap";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "@/api/ServiceData";

function Services() {
  const [Services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingService, setUpdatingService] = useState(null);
  

  useEffect(() => {
    getAllServices()
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        } else if (Array.isArray(data.$values)) {
          setServices(data.$values);
        } else {
          setServices([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [formSubmitted]); // Refresh list when new Service is added

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (service) => {
    setUpdatingService(service);
    setFormData({
      serviceName: service.serviceName,
      description: service.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this Service?")) {
      try {
        await deleteService(serviceId);
        setServices((prev) =>
          prev.filter((service) => service.serviceId !== serviceId)
        );
        setSuccess("Service deleted successfully!");
      } catch (err) {
        setError("Error deleting Service");
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
      if (updatingService) {
        await updateService(updatingService.serviceId, formData);
        setSuccess("Service updated successfully!");
      } else {
        console.log("Creating new service with data:", formData);
        await createService(formData);
        setSuccess("Service created successfully!");
      }
      setFormSubmitted((prev) => !prev);
      setFormData({ serviceName: "", description: "" });
      setShowForm(false);
      setUpdatingService(null);
    } catch (err) {
      setError("Error saving Service");
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
            Add New Service
          </Button>
        ) : (
          <>
            <h4>{updatingService ? "Edit Service" : "Create New Service"}</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="serviceName">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="Enter Service name"
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
                  placeholder="Enter service description"
                  required
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}

              <Button variant="primary" type="submit" disabled={creating}>
                {creating
                  ? updatingService
                    ? "Updating..."
                    : "Creating..."
                  : updatingService
                  ? "Update Service"
                  : "Create Service"}
              </Button>
              <Button
                variant="secondary"
                className="ml-3 ms-2"
                onClick={() => {
                  setShowForm(false);
                  setUpdatingService(null);
                  setFormData({ serviceName: "", description: "" });
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
            <p>Loading services...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sercice Name</th>
                  <th>Description</th>
                  <th>EDIT</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {Services.map((service) => (
                  <tr key={service.serviceId}>
                    <td>{service.serviceName}</td>
                    <td>{service.description}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(service)}
                      >
                        EDIT
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(service.serviceId)}
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

export default Services;
