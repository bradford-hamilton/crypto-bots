import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Image,
  Button,
} from 'react-bootstrap';
import { withRouter } from 'react-router';
import contract from 'truffle-contract';
import getWeb3 from '../../utils/getWeb3';
import NavBar from '../NavBar/NavBar';
import BotCore from '../../../build/contracts/BotCore.json';
import './Browse.css';

class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      botsForSale: [],
      botCoreInstance: null,
      accounts: []
    };
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
    const botCore = contract(BotCore);
    botCore.setProvider(this.state.web3.currentProvider);
    const botCoreInstance = await botCore.deployed();
    const accounts = await this.state.web3.eth.accounts;

    this.setState({ botCoreInstance, accounts });

    const botIds = await this.state.botCoreInstance.listBotIds();
    const botPrices = await this.state.botCoreInstance.listBotPrices();
    const botOwners = await this.state.botCoreInstance.listBotOwners();
    const botsForSale = botIds.map((botId, i) => ({
      id: botId.toNumber(),
      price: this.state.web3.fromWei(botPrices[i].toNumber(), 'ether'),
      owner: botOwners[i],
    }));

    this.setState({ botsForSale });
  }

  async buyBotHandler(tokenId, ownerAddress, price) {
    this.state.botCoreInstance
      .buyBotFromMarketplace(tokenId, ownerAddress, {
        from: this.state.accounts[0],
        to: this.state.botCoreInstance.address,
        value: this.state.web3.toWei(price, 'ether'),
        gas: 1500000,
      });
  }

  render() {
    if (!this.state.web3) return <h1>Loading...</h1>;
    console.log(this.state.accounts);
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
            {this.state.botsForSale.map(bot => {
              if (this.state.accounts[0] === bot.owner) return null;
              return (
                <Col xs={12} md={4} key={bot.id} className="bot-card-wrapper">
                  <div className="bot-card">
                    <Image src={`https://robohash.org/${bot.id}`} rounded />
                    <p className="bot-id">Bot #{bot.id}</p>
                    <p className="price">Current Price: {bot.price} ether</p>
                    <p className="address">Owner Address: {bot.owner}</p>
                    <div className="buy-button">
                      <Button
                        onClick={() => this.buyBotHandler(bot.id, bot.owner, bot.price)}
                        bsStyle="success"
                        bsSize="large"
                        block
                        >
                          Buy for {bot.price} Ether
                      </Button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Browse);
