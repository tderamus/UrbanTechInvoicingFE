import Image from "next/image";
import styles from "./page.module.css";
import { getAllCustomers } from "@/api/CustomerData";
import NavMenu from "@/components/NavBar";


getAllCustomers().then((customers) => {
  console.log("Fetched customers:", customers);
}).catch((error) => {
  console.error("Error fetching customers:", error);
});

export default function Home() {
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
          width={300}
          height={300}
        />
      </div>

      <div className={styles.grid}>
        <Image
          src="/UrbanTechConsulting.png"
          alt="Urban Tech Logo"
          className={styles.center}
          width={200}
          height={200}
        />
      </div>
    </main>
  );
}
