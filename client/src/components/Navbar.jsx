import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faSearch,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/image/image.png" alt="Book Cafe" />
        <h1>Book Cafe</h1>
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>

      <div className="navbar-left">
        <ul className="navbar-links">
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/categories">
              <FontAwesomeIcon icon={faList} /> <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/favorites">
              <FontAwesomeIcon icon={faStar} /> <span>Favorites</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <Link to="/profile">
              <FontAwesomeIcon icon={faUser} /> <span>Profile</span>
            </Link>
            <button className="fancy-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="navbar-auth">
            <button className="fancy-button">Register</button>
            <button className="fancy-button">Login</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
