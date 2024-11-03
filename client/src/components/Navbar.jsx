import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faStar,
  faPlus,
  faSignOutAlt,
  faSignInAlt,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import SearchBooks from "./SearchBooks";
import icoc from "../../public/images/image.png";
import icoo from "../../public/images/pro1.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  // const [name, setName] = useState("");
  const [showLoginText, setShowLoginText] = useState(false);
  const [name, setName] = useState(
    JSON.parse(localStorage.getItem("username")) || "",
  );

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("favorites");
    setIsLoggedIn(false);
    navigate("/");
  };
  // };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/login");
  };

  const triggerFileSelectPopup = () => {
    fileInputRef.current.click();
  };

  const handleRegister = () => {
    localStorage.setItem("isLoggedIn", true);
    setIsLoggedIn(true);
    navigate("/");
  };

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfileImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

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
    return null;
  }

  useEffect(() => {
    if (location.hash === "#Form" || location.pathname === "/") {
      setShowLoginText(true);
      setName("");
    } else {
      const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
      const storedName = JSON.parse(localStorage.getItem("username"));
      setIsLoggedIn(loggedInStatus);
      setShowLoginText(false);
      setName(storedName || "");
    }
  }, [location.hash, location.pathname]);

  return (
    <nav className="bc-navbar">
      <div className="bc-navbar-logo">
        <Link to="/">
          <img src={icoc} alt="Book Cafe" />
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
              <li className="welcome">
                📚 {isLoggedIn ? `Hello, ${name}!` : ""} 📚
              </li>
            </ul>
          </div>
          <div className="bc-navbar-right">
            <div className="profile-image-container" onClick={toggleDropdown}>
              <img src={icoo} alt="User Profile" className="profile-image" />
              <span className="profile-tooltip">Profile</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <ul>
                  <li
                    onClick={triggerFileSelectPopup}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Upload Photo</span>
                  </li>
                  <li>{name}</li>
                  <li
                    onClick={showLoginText ? handleLogin : handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      icon={showLoginText ? faSignInAlt : faSignOutAlt}
                    />
                    <span>{showLoginText ? "Login" : "Logout"}</span>
                  </li>
                </ul>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              // onChange={handleImageUpload}
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
