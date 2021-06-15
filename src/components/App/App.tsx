import React from 'react';

import './App.sass';

import '../../styles/fonts.sass';
import '../../styles/global.sass';
import '../../styles/variables.sass';

import ErrorBoundry from '../ErrorBoundry/ErrorBoundry';
import Header from '../Header/Header';
import GaragePage from '../pages/Garage';
import WinnersPage from '../pages/Winners';

const PAGES: Record<string, string> = {
  garage: 'garage',
  winners: 'winners',
};

type TState = {
  currentPage: string;
};
export default class App extends React.Component {
  state: TState = {
    currentPage: PAGES.garage,
  };

  setCurrentPageHashToState = () => {
    const hash = window.location.hash.slice(1).toLowerCase();

    for (const item in PAGES) {
      if (item === hash) {
        this.setState({ currentPage: PAGES[hash] });
        return;
      }
    }

    this.setState({ currentPage: PAGES.garage });
  };

  componentDidMount() {
    this.setCurrentPageHashToState();
    window.addEventListener('hashchange', this.setCurrentPageHashToState);
  }

  render() {
    const { currentPage } = this.state;

    const isCurrentPageGarage = currentPage === PAGES.garage;
    console.log(isCurrentPageGarage);
    return (
      <ErrorBoundry>
        <Header />
        <main className="main">
          <GaragePage isVisible={isCurrentPageGarage} />

          <WinnersPage isVisible={!isCurrentPageGarage} />
        </main>
      </ErrorBoundry>
    );
  }
}
