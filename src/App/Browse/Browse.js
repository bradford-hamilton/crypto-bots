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
import './Browse.css';

class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = { web3: null, botsForSale: [] };
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({ web3: results.web3 });
        this.listBots();
      })
      .catch(() => console.log('Error finding web3.'));
  }

  async listBots() {
    const contract = require('truffle-contract');
    const botCore = contract(BotCore);

    botCore.setProvider(this.state.web3.currentProvider);

    const botCoreInstance = await botCore.deployed();
    const botIds = await botCoreInstance.listBotIds();
    const botPrices = await botCoreInstance.listBotPrices();
    const botOwners = await botCoreInstance.listBotOwners();
    const botsForSale = botIds.map((botId, i) => ({
      id: botId.toNumber(),
      price: this.state.web3.fromWei(botPrices[i].toNumber(), 'ether'),
      owner: botOwners[i],
    }));

    this.setState({ botsForSale });
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
                Bot Marketplace
              </PageHeader>
            </Col>
          </Row>
          <Row className="bot-row">
            {this.state.botsForSale.map(bot => (
              <Col xs={12} md={4} key={bot.id} className="bot-card-wrapper">
                <div className="bot-card">
                  <Image src={`https://robohash.org/${bot.id}`} rounded />
                  <p className="bot-id">Bot #{bot.id}</p>
                  <p className="price">Price: {bot.price} ether</p>
                  <p className="address">Owner Address: {bot.owner}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Browse);
