import React from 'react';
import { Link } from 'react-router-dom';

import './Header.sass';

const Header = () => {
  return (
    <header className="header">
      <Link className="logotype nav__link" to="/">
        <span className="logotype__text-top">ASYNC</span>{' '}
        <span className="logotype__text-bottom">RACE</span>
      </Link>
      <nav className="nav header-nav">
        <Link className="nav__link" to="/">
          Garage
        </Link>
        <Link className="nav__link" to="/winners">
          Winners
        </Link>
      </nav>
    </header>
  );
};

export default Header;
