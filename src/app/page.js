"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import { getAllCustomers } from "@/api/CustomerData";
import NavMenu from "@/components/NavBar";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/Login"); // ✅ Go to login if no token
      return;
    }

    // Token exists — optionally validate it with the backend
    getAllCustomers()
      .then((customers) => {
        console.log("Fetched customers:", customers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        localStorage.removeItem("token");
        router.push("/Login"); // Invalid token, force login
      });
  }, [pathname, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className={styles.main}>
      <NavMenu />
      <div className={styles.description}>
        <p>Welcome to the Customer Management System</p>
        <p>Manage your customers efficiently!</p>
      </div>

      <div className={styles.center}>
        <Image
          src="/UrbanTechConsulting.png"
          alt="Customer Management"
          className={styles.logo}
          width={400}
          height={400}
        />
      </div>
    </main>
  );
}
