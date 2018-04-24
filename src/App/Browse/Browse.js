import React, { Component } from 'react';
import {
  MenuItem,
  NavDropdown,
  NavItem,
  Navbar,
  Nav,
} from 'react-bootstrap';
import { withRouter } from 'react-router';
import getWeb3 from '../../utils/getWeb3';
import NavBar from '../NavBar/NavBar';
import './Browse.css';

class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = { web3: null };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    getWeb3
      .then((results) => {
        this.setState({ web3: results.web3 });
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  render() {
    return (
      <div className="browse">
        <NavBar />
        <h1>Browse Page</h1>
      </div>
    );
  }
}

export default withRouter(Browse);
