import {Navbar, Nav} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export const Header = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (!session) {
    return(
      <div className="map-navbar">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">The Bike Center</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/volunteer">Volunteer</Nav.Link>
              <Nav.Link href="/map">Map</Nav.Link>
              <Nav.Link href="/api/auth/signin">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
  return(
    <div className="map-navbar">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">The Bike Center</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href={`/volunteer/${session?.user?.id}`}>Volunteer</Nav.Link>
            <Nav.Link href="/map">Map</Nav.Link>
            <Nav.Link href={`/profile/${session?.user?.id}`}>Profile</Nav.Link>
            <Nav.Link href="/api/auth/signout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
};

export default Header