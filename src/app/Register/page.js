"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterUser } from "@/api/UserAuth";
import NavMenu from "@/components/NavBar";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await RegisterUser(formData.username, formData.email, formData.password);
      alert("Registration successful! You can now log in.");
      router.push("/Login");
    } catch (err) {
      alert("Registration failed");
      // Log the error to the console for debugging
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
    <NavMenu />
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Username"
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Register
      </button>
    </form>
    </>
  );
}
export default RegisterPage;
