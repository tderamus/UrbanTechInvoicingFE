import { clientCredentials } from "@/utils/client";

const endpoint = `${clientCredentials.databaseURL}`;

// Login API Call

const LoginUser = (email, password) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:email, password:password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Login successful:", data);
          resolve(data);
        } else {
          reject(data.message || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        reject(error);
      });
  });

// Register API Call
const RegisterUser = (name, email, password) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success){
        resolve(data);
      } else {
        reject(data.message || "Registration failed");
      }
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      reject(error);
    });
  }
);

// Logout API Call
const LogoutUser = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          resolve(data);
        } else {
          reject(data.message || "Logout failed");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        reject(error);
      });
  });

export { LoginUser, RegisterUser, LogoutUser };
// This module provides functions to handle user authentication, including login, registration, and logout.
