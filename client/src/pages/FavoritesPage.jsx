import React, { useContext } from "react";
import { FavoriteContext } from "../context/FavoriteContext";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "../Styles/FavoritesPage.css";
import Navbar from "../components/Navbar";
import { FaArrowLeft } from "react-icons/fa";

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return <p>No favorite books yet!</p>;
  }

  return (
    <div className="favorites-page-custom">
      <Navbar />
      <button className="backButton-custom" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>
      <h1>Your Favorite Books</h1>
      <div className="favorites-grid-custom">
        {favorites.map((book) => (
          <div key={book.id} className="favorite-item-custom">
            <img
              src={book.imageLinks?.thumbnail || "/default-image.jpg"}
              alt={book.title || "No Title"}
              className="favorite-thumbnail-custom"
            />
            <Link to={`/book/${book.id}`} className="favorite-title-custom">
              {book.title}
            </Link>
            <FaHeart
              className={`favorite-heart-custom ${favorites.some((favBook) => favBook.id === book.id) ? "red" : ""}`}
              onClick={() => toggleFavorite(book)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
