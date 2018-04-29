import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Browse from './App/Browse/Browse';
import MyBots from './App/MyBots/MyBots';
import App from './App/App';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/browse" component={Browse} />
      <Route exact path="/my-bots" component={MyBots} />
      <Route path="/" component={App} />
    </Switch>
  </Router>,
document.getElementById('root'));
