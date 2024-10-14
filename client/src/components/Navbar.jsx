import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faSearch,
  faStar,
  faPlus,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileImage, setProfileImage] = useState("/image/pro1.png");
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelectPopup = () => {
    fileInputRef.current.click();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/image/image.png" alt="Book Cafe" />
        <h1>Book Cafe</h1>
      </div>

      {isLoggedIn ? (
        <>
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
                  <li onClick={triggerFileSelectPopup}>
                    <FontAwesomeIcon icon={faPlus} /> Photo
                  </li>
                  <li>{"user@example.com"}</li>
                  <li onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </li>
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
        </>
      ) : (
        <div className="navbar-right">
          <button className="fancy-button" onClick={handleLogin}>
            Register
          </button>
          <button className="fancy-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
