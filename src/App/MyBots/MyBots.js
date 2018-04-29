import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Image,
} from 'react-bootstrap';
import { withRouter } from 'react-router';
import getWeb3 from '../../utils/getWeb3';
import NavBar from '../NavBar/NavBar';
import BotCore from '../../../build/contracts/BotCore.json';
import './MyBots.css';

class MyBots extends Component {
  constructor(props) {
    super(props);
    this.state = { web3: null, myBotIds: [] };
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({ web3: results.web3 });
        this.listMyBots();
      })
      .catch(() => console.log('Error finding web3.'));
  }

  async listMyBots() {
    const contract = require('truffle-contract');
    const botCore = contract(BotCore);

    botCore.setProvider(this.state.web3.currentProvider);

    const accounts = await this.state.web3.eth.accounts;
    const botCoreInstance = await botCore.deployed();
    let myBotIds = await botCoreInstance.tokensOfOwner(accounts[0]);
    myBotIds = myBotIds.map(id => id.toNumber());

    this.setState({ myBotIds });
  }


  render() {
    if (!this.state.web3) return <h1>Loading...</h1>;

    return (
      <div className="browse">
        <NavBar />
        <Grid>
          <Row className="headerRow">
            <Col xs={12} md={6} mdOffset={3}>
              <PageHeader>
                My Bots
              </PageHeader>
            </Col>
          </Row>
          <Row className="bot-row">
            {this.state.myBotIds.map(id => (
              <Col xs={12} md={4} key={id} className="bot-card-wrapper">
                <div className="bot-card">
                  <Image src={`https://robohash.org/${id}`} rounded />
                  <p className="bot-id">Bot #{id}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(MyBots);
