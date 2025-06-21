"use client";
import React from "react";
import { useRouter } from "next/navigation";
import NavMenu from "@/components/NavBar";

function LogOut() {
  const router = useRouter();
  // Check if the user is logged in
  
    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/Login'; 
    
    };

  return (
    <>
      <NavMenu />

      <div>
        <h1>Logout Page</h1>
        <p>Click the button to log out.</p>
        <button
          onClick={() => {handleLogout()}}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default LogOut;
