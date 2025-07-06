import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


// API Call to get all payments
const getAllPayments = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/payments`, {
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
          reject("No payments found or invalid data format");
        }
      })

      .catch((error) => {
        console.error("Error fetching payments:", error);
        reject(error);
      });
  });

  // API Call to create a new payment
   const createPayments = (paymentData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(paymentData),
    })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      console.error("Error creating payment:", error);
      reject(error);
    });
  }
);

// API Call to update an existing payment
const updatePayments = (paymentId, paymentData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/payments/${paymentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(paymentData),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error updating payment:", error);
        reject(error);
      });
  });

// API Call to delete a payment
const deletePayments = (paymentId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/payments/${paymentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
    })
      .then((response) => {
        if (response.ok) {
          resolve("payment deleted successfully");
        } else {
          reject("Failed to delete payment");
        }
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
        reject(error);
      });
  });

export { getAllPayments, createPayments, updatePayments, deletePayments };
