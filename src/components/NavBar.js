"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./nav.module.css";

function NavMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token or user info from localStorage/sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className={styles.navbar}>
      <ul>
        <li><Link href="/">Home</Link></li>
        {isLoggedIn && (
          <>
            <li><Link href="/Customers">Customers</Link></li>
            <li><Link href="/Invoices">Invoices</Link></li>
            <li><Link href="/Products">Products</Link></li>
            <li><Link href="/Services">Services</Link></li>
            <li><Link href="/Payments">Payments</Link></li>
            <li><Link href="/Logout">Logout</Link></li>
          </>
        )}
        {!isLoggedIn && (
          <>
            <li><Link href="/Login">Login</Link></li>
            <li><Link href="/Register">Register</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default NavMenu;
