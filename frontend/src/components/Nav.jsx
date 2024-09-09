import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust the path as necessary

function Nav() {
  return (
    <nav className="py-4">
      <div className="mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="mr-6 h-8" /> {/* Logo with a set height */}
          <ul className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-white hover:text-blue-500">Home</Link>
            </li>
            <li>
              <Link to="/stats" className="text-white hover:text-blue-500">Stats</Link>
            </li>
            <li>
              <Link to="/userstats" className="text-white hover:text-blue-500">Users</Link>
            </li>
            <li>
              <Link to="/path" className="text-white hover:text-blue-500">Path</Link>
            </li>
            <li>
              <Link to="/questions" className="text-white hover:text-blue-500">Questions</Link>
            </li>
            <li>
              <Link to="/status" className="text-white hover:text-blue-500">Review</Link>
            </li>
          </ul>
        </div>
        <div>
          <Link to="/contact" className="hover:bg-blue-700 border-spacing-1 text-white font-bold py-2 px-4 rounded">
            Contact Us
          </Link>
          <Link to="/about" className="hover:bg-blue-700 border-spacing-1 text-white font-bold py-2 px-4 rounded">About</Link>

        </div>
      </div>
    </nav>
  );
}

export default Nav;
