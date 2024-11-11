import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { logError } from "../util/logger";
import { useAuth } from "../context/AuthContext";

const ProfileImageHandler = ({ name }) => {
  const defaultImage = "/image/pro1.png";
  const [profileImage, setProfileImage] = useState(defaultImage);
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch profile image if the user is logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.BASE_SERVER_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setProfileImage(response.data.profileImage || defaultImage); // Use default if no profile image
      } catch (error) {
        logError("Error fetching user profile:", error);
        setProfileImage(defaultImage); // Fallback to default on error
      }
    };

    if (localStorage.getItem("isLoggedIn") === "true") {
      fetchUserProfile();
    }
  }, []);

  // Upload the image and return the URL
  const uploadImageToAPI = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post(
        `${process.env.BASE_SERVER_URL}/api/profile/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return response.data.profileImageUrl; // URL of the uploaded image
    } catch (error) {
      logError("Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      uploadImageToAPI(file)
        .then((uploadedImageUrl) => {
          setProfileImage(uploadedImageUrl);
          setProfileImage(imageUrl); // Update the profile image immediately
        })
        .catch((error) => {
          logError("Error uploading image:", error);
        });
    }
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
    <div className="profile-image-container" onClick={toggleDropdown}>
      <img
        src={profileImage}
        alt="User Profile"
        className="profile-image"
        onError={() => setProfileImage(defaultImage)} // Fallback to default on error
      />
      <span className="profile-tooltip">Profile</span>
      {showDropdown && (
        <div className="dropdown-menu" ref={dropdownRef}>
          <ul>
            <li
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Upload Photo</span>
            </li>
            <li>{name}</li>
            <li onClick={logout} style={{ cursor: "pointer" }}>
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
  );
};

// Prop types validation
ProfileImageHandler.propTypes = {
  name: PropTypes.string,
};

export default ProfileImageHandler;
