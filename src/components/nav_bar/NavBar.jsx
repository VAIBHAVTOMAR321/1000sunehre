import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

import "../../assets/css/navbar.css";
// import gyandharaLogo from "../../assets/images/gyandharalogo.png";

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar expand="lg" expanded={expanded} onToggle={setExpanded} fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo-wrapper">
          {/* <img 
            src={gyandharaLogo} 
            alt="Gyandhara Logo" 
            className="navbar-logo"
          /> */}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-custom">
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={Link} to="/" className="nav-link-item" onClick={() => setExpanded(false)}>
              <span className="nav-link-dot"></span>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/CourseItems" className="nav-link-item" onClick={() => setExpanded(false)}>
              <span className="nav-link-dot"></span>
              Courses
            </Nav.Link>

            <Nav.Link as={Link} to="/Login" className="nav-link-item" onClick={() => setExpanded(false)}>
              <span className="nav-link-dot"></span>
              Login
            </Nav.Link>

            <Nav.Link as={Link} to="/StudentRegistration" className="register-btn" onClick={() => setExpanded(false)}>
              Register Now
              <span className="register-btn-arrow">→</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;