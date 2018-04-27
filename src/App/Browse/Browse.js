import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  PageHeader,
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
      .then(results => this.setState({ web3: results.web3 }))
      .catch(() => console.log('Error finding web3.'));
  }

  render() {
    return (
      <div className="browse">
        <NavBar />
        <Grid>
          <Row className="headerRow">
            <Col xs={12} md={6} mdOffset={3}>
              <PageHeader>
                Check out all the new bots!
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <p>things go here</p>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Browse);
