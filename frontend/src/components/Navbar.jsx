import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/search">Search</Link>
    </nav>
  );
}

export default Navbar;
