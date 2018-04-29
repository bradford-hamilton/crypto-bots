import React from 'react';
import { NavItem, Navbar, Nav } from 'react-bootstrap';

const NavBar = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">Crypto Bots</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="/browse">
        Browse Bots
      </NavItem>
      <NavItem eventKey={1} href="/my-bots">
        My Bots
      </NavItem>
    </Nav>
  </Navbar>
);

export default NavBar;
