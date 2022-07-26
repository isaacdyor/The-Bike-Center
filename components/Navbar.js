import {Navbar, Nav} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';


export const Header = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  //CORS
  
  //Navbar Styling

  const brand_style = {
    paddingLeft: "15px",
    paddingRight: "15px",
    height: "40px",
    width: "70px",  
  }
  const link_style = {
    paddingRight: "14px",
  }
  const log_style = {
    backgroundColor : "white",
    color : "#212529",
    border : "none",
    borderRadius : "30%",
    marginLeft : "20px",
    fontWeight : "bold",
  }

  if (!session) {
    return(
      <div className="map-navbar">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/" style={brand_style}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQAiSbUgqCbN_h3H7g5tjIZK4ljpN7cOAOFg&usqp=CAU" style={brand_style}/>The Bike Center
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto" style={link_style}>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/volunteer">Volunteer</Nav.Link>
              <Nav.Link href="/map">Map</Nav.Link>
              <Nav.Link href="/api/auth/signin" style={log_style}>Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
  return(
    <div className="map-navbar">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/" style={brand_style}><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQAiSbUgqCbN_h3H7g5tjIZK4ljpN7cOAOFg&usqp=CAU" style={brand_style}/>The Bike Center</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" style={link_style}>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href={`/volunteer/${session?.user?.id}`}>Volunteer</Nav.Link>
            <Nav.Link href="/map">Map</Nav.Link>
            <Nav.Link href="/donation">Donation Form</Nav.Link>
            <Nav.Link href={`/profile/${session?.user?.id}`}>Profile</Nav.Link>
            <Nav.Link href="/api/auth/signout" style={log_style}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
};

export default Header