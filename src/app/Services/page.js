import NavMenu from '@/components/NavBar'
import React from 'react'
import { Nav } from 'react-bootstrap'

function Services() {
  return (
  <>
    <NavMenu />
    <div>
      <h1>Services Page</h1>
      <p>Welcome to the Services section!</p>
      <p>Here you can manage your services offered to customers.</p>
      <p>Use the navigation menu to explore other sections.</p>
      <p>For assistance, please contact support.</p>
    </div>
    </>
  )
}

export default Services
