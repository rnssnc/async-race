import React from 'react';

import './Header.sass';

const Header = () => {
  return (
    <header className="header">
      <div className="logotype nav__link">
        <span className="logotype__text-top">ASYNC</span>{' '}
        <span className="logotype__text-bottom">RACE</span>
      </div>
      <nav className="nav header-nav">
        <a className="nav__link" href="#garage">
          Garage
        </a>
        <a className="nav__link" href="#winners">
          Winners
        </a>
      </nav>
    </header>
  );
};

export default Header;
