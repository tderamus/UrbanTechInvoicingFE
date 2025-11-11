import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;

// API Call to get all customers
const getAllCustomers = () =>
  new Promise((resolve, reject) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; // <-- moved inside
    fetch(`${endpoint}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status} - ${errorText}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new Error("Invalid content-type, expected JSON");
        }
      })
      .then((data) => {
        if (Array.isArray(data)) {
          resolve(data);
        } else if (Array.isArray(data.$values)) {
          resolve(data.$values);
        } else {
          reject("No customers found or invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        reject(error);
      });
  });

// API Call to create a new customer
const createCustomer = (customerData) =>
  new Promise((resolve, reject) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${endpoint}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(customerData),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error creating customer:", error);
        reject(error);
      });
  });

// API Call to update an existing customer
const updateCustomer = (customerId, customerData) =>
  new Promise((resolve, reject) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${endpoint}/customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(customerData),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error updating customer:", error);
        reject(error);
      });
  });

// API Call to delete a customer
const deleteCustomer = (customerId) =>
  new Promise((resolve, reject) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${endpoint}/customers/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (response.ok) {
          resolve("Customer deleted successfully");
        } else {
          reject("Failed to delete customer");
        }
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
        reject(error);
      });
  });

export { getAllCustomers, createCustomer, updateCustomer, deleteCustomer };
