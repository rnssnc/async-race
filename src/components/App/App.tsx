import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.sass';

import '../../styles/fonts.sass';
import '../../styles/global.sass';
import '../../styles/variables.sass';

import ErrorBoundry from '../ErrorBoundry/ErrorBoundry';
import Header from '../Header/Header';
import GaragePage from '../pages/Garage';
import WinnersPage from '../pages/Winners';

export default class App extends React.Component {
  state = {
    garagePage: {
      page: 1,
    },
  };

  render() {
    const { garagePage } = this.state;

    return (
      <ErrorBoundry>
        <Router>
          <Header />

          <Switch>
            <Route exact path="/">
              <GaragePage page={garagePage.page} onUnmount={this.onGaragePageUnmount} />
            </Route>
            <Route path="/winners">
              <WinnersPage />
            </Route>
          </Switch>
        </Router>
      </ErrorBoundry>
    );
  }

  onGaragePageUnmount = (page: number) => {
    this.setState({ garagePage: { page } });
  };
}
