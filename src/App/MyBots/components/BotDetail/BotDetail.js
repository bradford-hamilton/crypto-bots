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
      allowView: false
    };
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
          botId: this.props.match.params.id
        });
        this.retreiveBot();
      })
      .catch(() => console.log('Error finding web3.'));
  }

  async retreiveBot() {
    const contract = require('truffle-contract');
    const botCore = contract(BotCore);

    botCore.setProvider(this.state.web3.currentProvider);

    const accounts = await this.state.web3.eth.accounts;
    const botCoreInstance = await botCore.deployed();
    let ownerAddress = await botCoreInstance.getOwnerByIndex(this.state.botId);

    if (ownerAddress === accounts[0]) this.setState({ allowView: true });
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
                Bot {this.state.botId}
              </PageHeader>
            </Col>
          </Row>
          {this.state.allowView ? (
            <Row className="bot-row">
              <Col xs={12} md={6} mdOffset={3} className="bot-card-wrapper">
                <div className="bot-card">
                  <Image src={`https://robohash.org/${this.state.botId}`} rounded />
                  <p className="bot-id">Bot #{this.state.botId}</p>
                  <div className="add-bot-to-marketplace">
                    <Button
                      onClick={() => {}}
                      bsStyle="info"
                      bsSize="large"
                      block
                      >
                      Add to marketplace
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          ) : <h1>You don't own this bot</h1>}
        </Grid>
      </div>
    );
  }
}

export default withRouter(BotDetail);
