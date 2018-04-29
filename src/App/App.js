import React, { Component } from 'react';
import {
  PageHeader,
  Grid,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { withRouter } from 'react-router';
import getWeb3 from '../utils/getWeb3';
import NavBar from './NavBar/NavBar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { web3: null };
    this.renderBrowse = this.renderBrowse.bind(this);
  }

  renderBrowse() {
    this.props.history.push('/browse');
  }

  componentWillMount() {
    getWeb3
      .then(results => this.setState({ web3: results.web3 }))
      .catch(() => console.log('Error finding web3.'));
  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <Grid>
          <Row className="headerRow">
            <Col xs={12} md={6} mdOffset={3}>
              <PageHeader>
                Welcome To Crypto Bots!
              </PageHeader>
            </Col>
          </Row>
          <Row className="getStartedRow">
            <Col xs={12} md={6} mdOffset={3}>
              <Button
                bsStyle="primary"
                bsSize="large"
                onClick={this.renderBrowse}
              >
                Start Collecting!
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(App);
