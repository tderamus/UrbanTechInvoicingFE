'use client';

import React, { useEffect, useState } from 'react'
import NavMenu from '@/components/NavBar'
import { Table, Button } from 'react-bootstrap'
import { getAllCustomers } from '@/api/CustomerData'

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCustomers()
      .then((data) => {
        // If your API returns { customers: [...] }
        if (Array.isArray(data)) {
          setCustomers(data);
        } else if (Array.isArray(data.$values)) {
          setCustomers(data.$values);
        } else {
          setCustomers([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('Customers data:', customers);
  }, [customers]);
  return (
    <>
      <NavMenu />
      <div>
          <Button className="btn btn-primary mb-3" onClick={() => window.location.href = '/customers/new'}>
            Add New Customer
          </Button>
        </div>

      <div>
        
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>EDIT</th>
                <th>DELETE</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.name}</td>
                  <td>{customer.emailAddress}</td>
                  <td>{customer.phoneNumber}</td>
                  <td>EDIT</td>
                  <td>DELETE</td>
                  {/* Add more cells as needed */}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  )
}

export default Customers
