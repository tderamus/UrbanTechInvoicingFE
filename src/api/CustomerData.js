import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
      if (data) {
        const customersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        resolve(customersArray);
      } else {
        reject("No customers found");
      }
    })
    .catch((error) => {
      console.error("Error fetching customers:", error);
      reject(error);
    });
  });

  export { getAllCustomers };
