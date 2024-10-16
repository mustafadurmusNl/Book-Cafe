import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import axios from "axios"; // For making API calls
import "../Styles/CategorySelection.css"; // Import the CSS file for styling
import { logError, logInfo } from "../../../server/src/util/logging";
import Cookies from "js-cookie";
import background from "../../public/images/9.jpg";

const CategorySelection = () => {
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category),
      ); // Unselect if already selected
    } else {
      setSelectedCategories([...selectedCategories, category]); // Select new category
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    const token = Cookies.get("token");
    logInfo("tokenn", token);
    if (!token) {
      logError("Token not found! User may not be authenticated.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/categories",
        { categories: selectedCategories },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the header
          },
        },
      ); // Adjust the API URL

      if (response.status === 200) {
        navigate("/recommendations"); // Redirect to book recommendation page
      }
    } catch (error) {
      // Handle error appropriately
      logError("Error saving categories:", error);
      setError(
        "An error occurred while saving your categories. Please try again.",
      );
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
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error message */}
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
        Confirm Selection
      </button>
    </div>
  );
};

export default CategorySelection;
