import React from 'react'
import Link from 'next/link';
import { NavBar, Container, Nav, Button } from 'react-bootstrap';
import styles from './nav.module.css';

function NavMenu() {
  return (
    <div className={styles.navbar}>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/Customers">Customers</Link></li>
        <li><Link href="/Invoices">Invoices</Link></li>
        <li><Link href="/Products">Products</Link></li>
        <li><Link href="/Services">Services</Link></li>
        <li><Link href="/Payments">Payments</Link></li>
      </ul>    
    </div>
  )
}

export default NavMenu
