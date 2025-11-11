import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


// API Call to get all invoices
const getAllInvoices = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/invoices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
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
        // Check if data is an array or has a $values property
        // and resolve accordingly
        if (Array.isArray(data)) {
          resolve(data);
        } else if (Array.isArray(data.$values)) {
          resolve(data.$values);
        } else {
          reject("No invoices found or invalid data format");
        }
      })

      .catch((error) => {
        console.error("Error fetching invoices:", error);
        reject(error);
      });
  });

  // API Call to create a new invoice
   const createInvoice = (invoiceData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(invoiceData),
    })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      console.error("Error creating invoice:", error);
      reject(error);
    });
  }
);

// API Call to update an existing invoice
const updateInvoice = (invoiceId, invoiceData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/invoices/${invoiceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(invoiceData),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error updating invoice:", error);
        reject(error);
      });
  });

// API Call to delete a invoice
const deleteInvoice = (invoiceId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/invoices/${invoiceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
    })
      .then((response) => {
        if (response.ok) {
          resolve("invoice deleted successfully");
        } else {
          reject("Failed to delete invoice");
        }
      })
      .catch((error) => {
        console.error("Error deleting invoice:", error);
        reject(error);
      });
  });

export { getAllInvoices, createInvoice, updateInvoice, deleteInvoice };
