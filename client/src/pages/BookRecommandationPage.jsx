import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/BookRecommendationPage.css";
import Navbar from "../components/Navbar";
import { FavoriteContext } from "../context/FavoriteContext";

const BookRecommendationPage = () => {
  const [booksByPreference, setBooksByPreference] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();

  // Fetch user preferences from API
  const fetchUserPreferences = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${user}/preferences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data && Array.isArray(response.data.preferences)) {
        setUserPreferences(response.data.preferences);
      } else {
        setError("User preferences not found or invalid.");
        setUserPreferences([]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user preferences.");
      setLoading(false);
    }
  };

  // Fetch books for each preference query
  // Modify the API call to your backend
  const fetchBooksForPreferences = async () => {
    if (!Array.isArray(userPreferences) || userPreferences.length === 0) return;

    setLoading(true);

    try {
      // For each user preference, make a separate API call to your backend
      const fetchPromises = userPreferences.map((preference) => {
        const currentBooks = booksByPreference[preference] || [];
        const startIndex = currentBooks.length; // Start after the last fetched book

        // Call your backend instead of Google Books API
        return axios
          .get("http://localhost:3000/api/recommendedBooks", {
            params: {
              preference,
              startIndex,
            },
          })
          .then((response) => ({
            preference,
            books: response.data || [], // Return books from backend response
          }));
      });

      // Wait for all promises to resolve
      const results = await Promise.all(fetchPromises);

      // Organize books by preference
      const newBooksByPreference = results.reduce(
        (acc, { preference, books }) => {
          if (books.length === 0) {
            setHasMore(false); // No more books available
          }
          acc[preference] = [...(acc[preference] || []), ...books]; // Append new books
          return acc;
        },
        { ...booksByPreference },
      ); // Spread existing state

      setBooksByPreference(newBooksByPreference);
      setLoading(false);
    } catch (error) {
      setError("Error fetching books.");
      setLoading(false);
    }
  };

  // Fetch user preferences once on component mount
  useEffect(() => {
    fetchUserPreferences();
  }, []);

  // Fetch books whenever preferences or page changes
  useEffect(() => {
    if (userPreferences.length > 0) {
      fetchBooksForPreferences(page);
    }
  }, [userPreferences, page]);

  // Infinite scroll event handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 300 // Trigger loading when 300px from bottom
    ) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  // Attach scroll event listener on component mount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  }, [loading, hasMore]);

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-page">
      <Navbar />
      {/* <h1 className="book-title-header">Book Recommendations</h1> */}
      {Object.keys(booksByPreference).map((preference) => (
        <div key={preference} className="book-category">
          <h2>Best {preference} Books</h2>
          <div className="book-grid">
            {booksByPreference[preference].length > 0 ? (
              booksByPreference[preference].map((book) => {
                const isFavorite = favorites.some(
                  (favBook) => favBook.id === book.id,
                );
                return (
                  <div key={book.id} className="book-item">
                    <button
                      className="heart-icon"
                      onClick={() =>
                        toggleFavorite({
                          id: book.id,
                          title: book.volumeInfo.title,
                          imageLinks: book.volumeInfo.imageLinks,
                          description: book.volumeInfo.description,
                        })
                      }
                      style={{ color: isFavorite ? "red" : "white" }}
                    >
                      ♥
                    </button>
                    <img
                      src={
                        book.volumeInfo.imageLinks?.thumbnail ||
                        "/default-image.jpg"
                      }
                      alt={book.volumeInfo.title || "No Title"}
                      className="book-thumbnail"
                      onClick={() => navigate(`/book/${book.id}`)}
                    />
                    <Link to={`/book/${book.id}`} className="book-title">
                      {book.volumeInfo.title}
                    </Link>
                    <div className="book-info">
                      {book.volumeInfo.description
                        ? book.volumeInfo.description.slice(0, 100) + "..."
                        : "No description available."}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No books available for {preference}.</p>
            )}
          </div>
        </div>
      ))}
      {loading && <p>Loading more books...</p>}
    </div>
  );
};

export default BookRecommendationPage;
