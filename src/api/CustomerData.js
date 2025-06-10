import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;

// API Call to get all customers
const getAllCustomers = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched customers:", data);
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
    fetch(`${endpoint}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      console.error("Error creating customer:", error);
      reject(error);
    });
  }
);

export { getAllCustomers, createCustomer };
