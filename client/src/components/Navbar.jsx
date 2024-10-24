import React, { useState, useRef, useEffect, useContext } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileImage, setProfileImage] = useState("/image/pro1.png");
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); // Moved useNavigate here
  const [name, Setname] = useState("");
  const [email, setEmail] = useState("");

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const getname = JSON.parse(localStorage.getItem("username"));
    const getEmail = JSON.parse(localStorage.getItem("email"));
    Setname(getname);
    setEmail(getEmail || "user@example.com");
    setIsLoggedIn(loggedInStatus);
  }, [Location]);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); // Corrected "toke" to "token"
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/", { replace: true }); // Use navigate here
  };
  // const handleLogin = () => {
  //   localStorage.setItem("isLoggedIn", true);
  //   setIsLoggedIn(true);
  // };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result); // ذخیره تصویر در localStorage
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
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);
  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    const userName = localStorage.getItem("username");
    if (userEmail && userName) {
      setEmail(userEmail);
      Setname(userName);
    }
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedInStatus);
      if (!loggedInStatus) {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);
  useEffect(() => {
    const checkLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(checkLoggedIn);
  }, []); // این useEffect تنها زمان بارگذاری کامپوننت اجرا می‌شود، ممکن است نیاز باشد که وابستگی‌های دیگری به آن اضافه کنید.

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
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
              <li className="welcome">📚 hello, {name} 😍 📚</li>
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
                    <span>Photo</span>
                  </li>
                  <li>{email || "user@example.com"}</li>
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
          <button className="fancy-button" onClick={navigateToRegister}>
            Register
          </button>
          <button className="fancy-button" onClick={navigateToLogin}>
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
