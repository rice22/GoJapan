import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <h1>Go Japan</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/seasons">Seasons</Link></li>
        <li><Link to="/articles">Articles</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
