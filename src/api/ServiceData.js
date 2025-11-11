import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


// API Call to get all Services
const getAllServices = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/services`, {
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
          reject("No services found or invalid data format");
        }
      })

      .catch((error) => {
        console.error("Error fetching services:", error);
        reject(error);
      });
  });

  // API Call to create a new Service
   const createService = (serviceData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(serviceData),
    })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      console.error("Error creating service:", error);
      reject(error);
    });
  }
);

// API Call to update an existing service
const updateService = (serviceId, serviceData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/Services/${serviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(serviceData),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error updating service:", error);
        reject(error);
      });
  });

// API Call to delete a service
const deleteService = (serviceId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/Services/${serviceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
    })
      .then((response) => {
        if (response.ok) {
          resolve("Service deleted successfully");
        } else {
          reject("Failed to delete Service");
        }
      })
      .catch((error) => {
        console.error("Error deleting Service:", error);
        reject(error);
      });
  });

export { getAllServices, createService, updateService, deleteService };
