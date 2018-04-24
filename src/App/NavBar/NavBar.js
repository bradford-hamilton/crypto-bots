import React from 'react';
import {
  MenuItem,
  NavDropdown,
  NavItem,
  Navbar,
  Nav,
} from 'react-bootstrap';

const NavBar = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#home">Crypto Cars</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">
        Link
      </NavItem>
      <NavItem eventKey={2} href="#">
        Link
      </NavItem>
      <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
        <MenuItem eventKey={3.1}>Action</MenuItem>
        <MenuItem eventKey={3.2}>Another action</MenuItem>
        <MenuItem eventKey={3.3}>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={3.4}>Separated link</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
);

export default NavBar;
