// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import SearchBooks from "./SearchBooks";
import ProfileImageHandler from "./ProfileImageHandler";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  const [profileImage, setProfileImage] = useState("/image/pro1.png");
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState(
    JSON.parse(localStorage.getItem("username")) || "",
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRouteChange = () => {
      const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedInStatus);
    };
    handleRouteChange();
  }, [location.pathname]);

  useEffect(() => {
    const storedName = JSON.parse(localStorage.getItem("username"));
    setName(storedName || "");
    return () => {};
  }, []);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); 
      document.removeEventListener("mousedown", closeDropdown);
    }; 
  }, []);

    
  return (
       <nav className="bc-navbar">
      <div className="bc-navbar-logo">
        <Link to="/">
          <img src="/image/image.png" alt="Book Cafe" />
          <h1>Book Cafe</h1>
        </Link>
      </div>

      {isLoggedIn ? (
        <>
          <div className="bc-navbar-search">
            <SearchBooks />
          </div>
          <div className="bc-navbar-left">
            <ul className="bc-navbar-links">
              <li>
                <Link to="/">
                  <FontAwesomeIcon icon={faHome} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/categories">
                  <FontAwesomeIcon icon={faList} />
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link to="/favorites">
                  <FontAwesomeIcon icon={faStar} />
                  <span>Favorites</span>
                </Link>
              </li>
              <li>
                <Link to="/recommendations">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span>Recommendations</span>
                </Link>
              </li>
              <li className="welcome">📚 Hello, {name}! 📚</li>
            </ul>
          </div>
          <div className="bc-navbar-right">
            <ProfileImageHandler
              name={name}
              setIsLoggedIn={setIsLoggedIn}
              navigate={navigate}
            />
          </div>
        </>
      ) : (
        <div className="bc-navbar-right">
          <a href="#Form">
            <button className="fancy-button" onClick={() => navigate("/login")}>
              <span>Login</span>
            </button>
          </a>
          <a href="#Form">
            <button
              className="fancy-button"
              onClick={() => navigate("/register")}
            >
              <span>Register</span>
            </button>
          </a>
        </div>
      )}

      <div className="bc-navbar-search">
        <SearchBooks />
      </div>
      <div className="bc-navbar-left">
        <ul className="bc-navbar-links">
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/categories">
              <FontAwesomeIcon icon={faList} />
              <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/favorites">
              <FontAwesomeIcon icon={faStar} />
              <span>Favorites</span>
            </Link>
          </li>
          <li>
            <Link to="/recommendations">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>Recommendations</span>
            </Link>
          </li>
          <li className="welcome">
            📚 {isLoggedIn ? `Hello, ${name}!` : "Welcome to Book Cafe!"} 📚
          </li>
        </ul>
      </div>
      <div className="bc-navbar-right">
        <div className="profile-image-container" onClick={toggleDropdown}>
          <img
            src={profileImage}
            alt="User Profile"
            className="profile-image"
          />
          <span className="profile-tooltip">Profile</span>
        </div>
        {showDropdown && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <ul>
              {isLoggedIn ? (
                <>
                  <li
                    onClick={triggerFileSelectPopup}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Upload Photo</span>
                  </li>
                  <li>{name}</li>
                  <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                  </li>
                </>
              ) : (
                <li
                  onClick={() => navigate("/login")}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Login</span>
                </li>
              )}
            </ul>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
