/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "../Styles/FavoritesPage.css";
import Navbar from "../components/Navbar";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]); // Manage favorites locally
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get user ID from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      if (!user) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const userId = user.id;
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}api/users/${userId}/favoriteBooks`,
        );
        setFavorites(response.data); // Set the favorites from API
      } catch (err) {
        setError("Failed to load favorite books.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, [user]);

  // Handle toggling favorites
  const toggleFavorite = async (book) => {
    try {
      const isFavorite = favorites.some((favBook) => favBook.id === book.id);
      const userId = user.id;
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}api/users/${userId}/favoriteBook/${book.id}`,
        );
        const updatedFavorites = favorites.filter(
          (favBook) => favBook.id !== book.id,
        );
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Update local storage
      } else {
        // Add to favorites
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}api/users/${userId}/favoriteBook`,
          {
            bookId: book.id,
          },
        );
        const updatedFavorites = [...favorites, book];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Update local storage
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update favorite books.");
    }
  };

  if (loading) return <p>Loading favorite books...</p>;
  if (error) return <p>{error}</p>;

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
              src={
                book.volumeInfo.imageLinks?.thumbnail || "/default-image.jpg"
              }
              alt={book.volumeInfo.title || "No Title"}
              className="favorite-thumbnail-custom"
            />
            <Link to={`/book/${book.id}`} className="favorite-title-custom">
              {book.volumeInfo.title}
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
