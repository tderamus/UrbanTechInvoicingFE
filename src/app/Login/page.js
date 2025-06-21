"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/api/UserAuth";
import NavMenu from "@/components/NavBar";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await LoginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err) {
      alert("Login failed");
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
      router.push("/Register");
    }
  };

  return (
  <>
    <NavMenu />
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
    </>
  );
}

export default LoginPage;
// This code is a simple login page for a React application using Next.js.
