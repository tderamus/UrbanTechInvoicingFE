import React from 'react'
import Link from 'next/link';
import { NavBar, Container, Nav, Button } from 'react-bootstrap';
import styles from './nav.module.css';

function NavMenu() {
  return (
    <div className={styles.navbar}>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/customers">Customers</Link></li>
        <li><Link href="/invoices">Invoices</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/services">Services</Link></li>
        <li><Link href="/payments">Payments</Link></li>
      </ul>    
    </div>
  )
}

export default NavMenu
