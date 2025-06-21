import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


// API Call to get all Products
const getAllProducts = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/products`, {
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
          reject("No Products found or invalid data format");
        }
      })

      .catch((error) => {
        console.error("Error fetching products:", error);
        reject(error);
      });
  });

  // API Call to create a new Product
   const createProduct = (productData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(productData),
    })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      console.error("Error creating product:", error);
      reject(error);
    });
  }
);

// API Call to update an existing Product
const updateProduct = (productId, productData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/Products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error updating Product:", error);
        reject(error);
      });
  });

// API Call to delete a Product
const deleteProduct = (productId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Access-Control-Allow-Origin": "*", // Allow CORS for all origins
      },
    })
      .then((response) => {
        if (response.ok) {
          resolve("Product deleted successfully");
        } else {
          reject("Failed to delete product");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        reject(error);
      });
  });

export { getAllProducts, createProduct, updateProduct, deleteProduct };
