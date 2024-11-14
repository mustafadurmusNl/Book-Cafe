import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faStar,
  faThumbsUp,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import SearchBooks from "./SearchBooks";
import ProfileImageHandler from "./ProfileImageHandler";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import icccon from "../../public/image/image.png";

const Navbar = () => {
  const { isLoggedIn, user, setIsLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="bc-navbar">
      <div className="bc-navbar-logo">
        <Link to="/">
          <img src={icccon} alt="Book Cafe" />
          <h1>Book Cafe</h1>
        </Link>
      </div>
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
        </ul>
      </div>
      <div className="bc-navbar-right">
        {isLoggedIn ? (
          <>
            <span className="welcome">📚 Welcome, {user.name}! ☕️📚</span>
            <ProfileImageHandler
              name={user.name}
              setIsLoggedIn={setIsLoggedIn}
              navigate={navigate}
            />
          </>
        ) : (
          <>
            <span className="welcome">Welcome to Book Cafe</span>

            <Link to="/profile">
              <FontAwesomeIcon
                icon={faUserCircle}
                size="lg"
                className="profile-icon"
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
ProfileImageHandler.propTypes = {
  name: PropTypes.string.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
export default Navbar;
