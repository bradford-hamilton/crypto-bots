import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader, Image, Button, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router';
import Loader from 'react-loader';
import getWeb3 from '../../../../utils/getWeb3';
import NavBar from '../../../NavBar/NavBar';
import BotCore from '../../../../../build/contracts/BotCore.json';
import './BotDetail.css';

class BotDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      botId: null,
      allowView: false,
      alreadyForSale: false,
      show: false,
      salePrice: '0.00',
      botCoreInstance: null,
      ownerAddress: null,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateSalePrice = this.updateSalePrice.bind(this);
    this.listOnMarketplace = this.listOnMarketplace.bind(this);
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
          botId: Number(this.props.match.params.id),
        });
        this.retreiveBot();
      })
      .catch(() => console.log('Error finding web3.'));
  }

  handleClose() {
    this.setState({ show: false, salePrice: '0.00' });
  }

  handleOpen() {
    this.setState({ show: true });
  }

  updateSalePrice(event) {
    this.setState({ salePrice: event.target.value });
  }

  listOnMarketplace() {
    this.state.botCoreInstance.addBotToMarketPlace(
      this.state.botId,
      this.state.web3.toWei(Number(this.state.salePrice), 'ether'),
      this.state.ownerAddress,
      {
        from: this.state.ownerAddress,
        to: this.state.botCoreInstance.address,
        gas: 1500000,
      }
    );

    this.handleClose();
  }

  async retreiveBot() {
    const contract = require('truffle-contract');
    const botCore = contract(BotCore);

    botCore.setProvider(this.state.web3.currentProvider);

    const accounts = await this.state.web3.eth.accounts;
    const botCoreInstance = await botCore.deployed();

    let ownerAddress = await botCoreInstance.getOwnerByIndex(this.state.botId);
    let botsOnMarketplace = await botCoreInstance.listBotIds();
    const alreadyForSale = botsOnMarketplace
      .map(id => id.toNumber())
      .includes(this.state.botId);

    if (ownerAddress === accounts[0]) {
      this.setState({ allowView: true, alreadyForSale });
    }

    this.setState({
      botCoreInstance,
      ownerAddress: accounts[0],
    });
  }


  render() {
    return (
      <div className="browse">
        <NavBar />
        <Grid>
          <Row className="headerRow">
            <Col xs={12} md={6} mdOffset={3}>
              <PageHeader>
                Bot {this.state.botId}
              </PageHeader>
            </Col>
          </Row>
          <Loader loaded={!!this.state.web3}>
            {this.state.allowView ? (
              <Row className="bot-row">
                <Col xs={12} md={6} mdOffset={3} className="bot-card-wrapper">
                  <div className="bot-card">
                    <Image src={`https://robohash.org/${this.state.botId}`} rounded />
                    <p className="bot-id">Bot #{this.state.botId}</p>
                    {!this.state.alreadyForSale ? (
                      <div className="add-bot-to-marketplace">
                        <Button
                          onClick={this.handleOpen}
                          bsStyle="info"
                          bsSize="large"
                          block
                          >
                          Add to marketplace
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3>Currently listed on marketplace</h3>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            ) : <h1>You don't own this bot</h1>}
          </Loader>
        </Grid>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title className="modal-title">
              List Your Bot on the Marketplace
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
              Please select sale price in Ether
              <input
                className="modal-input"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={this.state.salePrice}
                onChange={this.updateSalePrice}
              />
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <Button bsSize="large" onClick={this.handleClose}>Close</Button>
            <Button
              bsSize="large"
              bsStyle="primary"
              onClick={this.listOnMarketplace}
            >
              List on marketplace!
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withRouter(BotDetail);
