import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faSearch,
  faStar,
  faPlus,
  faSignOutAlt,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileImage, setProfileImage] = useState("/image/pro1.png");
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedName = JSON.parse(localStorage.getItem("username"));
    setIsLoggedIn(loggedInStatus);
    setName(storedName);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.setItem("isLoggedIn", false);
    setIsLoggedIn(false);
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", true);

    setIsLoggedIn(true);

    navigate("/");
  };

  const handleRegister = () => {
    localStorage.setItem("isLoggedIn", true);

    setIsLoggedIn(true);
    navigate("/");
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

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null; // Hide navbar on login/register pages
  }

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
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
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
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Upload Photo</span>
                  </li>
                  <li>{name}</li>
                  <li onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
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
        <div className="bc-navbar-right">
          <a href="#Form">
            {" "}
            <button className="fancy-button" onClick={handleLogin}>
              <span>Login</span>
            </button>
          </a>
          <a href="#Form">
            {" "}
            <button className="fancy-button" onClick={handleRegister}>
              <span>Register</span>
            </button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
