/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/CategorySelection.css";
import { logError, logInfo } from "../../../server/src/util/logging";
import Cookies from "js-cookie";
import background from "../../public/images/9.jpg";

const CategoryAndPreferences = () => {
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "food",
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const preferencesResponse = await axios.put(
        `http://localhost:3000/api/users/${user}`,
        { preferences: selectedCategories },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage(preferencesResponse.data.message);
      setError(null);
      navigate("/recommendations");
    } catch (err) {
      // Handle error
      logError("Error:", err);
      const errorMessage =
        err.response?.data?.error || "An error occurred. Please try again.";
      setError(errorMessage);
      setMessage("");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Select Categories</h1>
      <p>Select the categories you are interested in:</p>
      {error && <div className="error-message">{error}</div>}
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-item ${selectedCategories.includes(category) ? "selected" : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={selectedCategories.length === 0}>
        Confirm Selection and Update Preferences
      </button>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default CategoryAndPreferences;
