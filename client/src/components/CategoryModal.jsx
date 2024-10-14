import React from "react";
import { useCategory } from "../context/CategoryContext";
import "../Styles/CategoryModal.css";

const CategoryModal = () => {
  const { selectedCategories } = useCategory();
  const genres = ["Romance", "Science", "Fiction", "Horror", "Fantasy"];

  return (
    <div className="category-modal">
      <h2>Select Your Favorite Genres</h2>
      <div className="genre-container">
        {genres.map((genre) => (
          <div className="genre-box" key={genre}>
            <span className="genre-name">{genre}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoryModal;
