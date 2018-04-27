import React from 'react';
import { NavItem, Navbar, Nav } from 'react-bootstrap';

const NavBar = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">Crypto Cars</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">
        Link
      </NavItem>
      <NavItem eventKey={2} href="#">
        Link
      </NavItem>
    </Nav>
  </Navbar>
);

export default NavBar;
