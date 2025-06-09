import React from 'react'
import NavMenu from '@/components/NavBar'
import { Nav } from 'react-bootstrap'

function Customers() {
  return (
    <>
    <NavMenu />
    <div>
      Congratulations! You have successfully navigated to the Customers page.
      <p>Here you can manage your customers.</p>
      <p>Use the navigation menu to explore other sections.</p>
    </div>
    </>
  )
}

export default Customers
