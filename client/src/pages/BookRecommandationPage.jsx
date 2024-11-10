/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/BookRecommendationPage.css";
import Navbar from "../components/Navbar";
import { FavoriteContext } from "../context/FavoriteContext";
import { logInfo } from "../util/logger";

// Unique book filtering function
const filterUniqueBooks = (books) => {
  if (!Array.isArray(books)) {
      console.error("Expected an array but received:", books);
      return [];
  }
  const uniqueBooks = new Map();
  books.forEach((book) => {
      if (!uniqueBooks.has(book.id)) {
          uniqueBooks.set(book.id, book);
      }
  });
  return Array.from(uniqueBooks.values());
};


const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <button className="scroll-to-top" onClick={scrollToTop}>
        ↑
      </button>
    )
  );
};

const BookRecommendationPage = () => {
  const [booksByPreference, setBooksByPreference] = useState({});
  const [booksByFavoriteAuthors, setBooksByFavoriteAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();

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
        `${process.env.BASE_SERVER_URL}/api/users/${user.id}/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUserPreferences(response.data.preferences || []);
    } catch (err) {
      console.error("Error fetching preferences:", err);
      setError("Failed to fetch user preferences.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksForPreferences = async () => {
    if (userPreferences.length === 0) return;
    setLoading(true);

    try {
      const fetchPromises = userPreferences.map((preference) => {
        return axios
          .get(`${process.env.BASE_SERVER_URL}/api/recommendedBooks`, {
            params: {
              preference,
              startIndex: Math.floor(Math.random() * 10) + 1,
            },
          })
          .then((response) => ({
            preference,
            books: Array.isArray(response.data)
              ? filterUniqueBooks(response.data)
              : [],
          }));
      });

      const results = await Promise.all(fetchPromises);
      const newBooksByPreference = results.reduce(
        (acc, { preference, books }) => ({
          ...acc,
          [preference]: [...(acc[preference] || []), ...books],
        }),
        { ...booksByPreference },
      );

      setBooksByPreference(newBooksByPreference);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksByFavoriteAuthors = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.BASE_SERVER_URL}/api/users/${user.id}/favoriteAuthors`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("Favorite authors fetched", response.data);
      const books = Array.isArray(response.data) ? response.data : [];
      console.log("Books by favorite authors:", books);
        setBooksByFavoriteAuthors(filterUniqueBooks(books));
    } catch (err) {
      console.error("Error fetching favorite authors:", err);
      setError("Failed to fetch books by favorite authors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPreferences();
    fetchBooksByFavoriteAuthors();
  }, []);

  useEffect(() => {
    if (userPreferences.length > 0) {
      fetchBooksForPreferences();
    }
  }, [userPreferences]);

  const handleFavoriteSubmit = async (book) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      await axios.post(
        `${process.env.BASE_SERVER_URL}/api/users/${user.id}/favoriteBook`,
        { bookId: book.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Book saved to favorites");
    } catch (err) {
      console.error("Failed to save favorite book:", err.message);
      setError("Failed to save favorite book.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-page">
      <Navbar />
      {booksByFavoriteAuthors.length > 0 && (
        <div className="book-category">
          <h2>Books by Your Favorite Authors</h2>
          <div className="book-grid">
            {booksByFavoriteAuthors.map((book) => (
              <div key={book.id} className="book-item">
                <button
                  className="heart-icon"
                  onClick={() => {
                    toggleFavorite(book);
                    handleFavoriteSubmit(book);
                  }}
                  style={{
                    color: favorites.some((fav) => fav.id === book.id)
                      ? "red"
                      : "white",
                  }}
                >
                  ♥
                </button>
                <p className="authorname">{book.volumeInfo.authors[0]}</p>
                <Link to={`/book/${book.id}`}>
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title}
                    className="book-thumbnail"
                  />
                </Link>
                <Link to={`/book/${book.id}`} className="book-title">
                  {book.volumeInfo.title}
                </Link>
                <p className="book-info">
                  {book.volumeInfo.description?.slice(0, 100) ||
                    "No description available."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(booksByPreference).map((preference) => (
        <div key={preference} className="book-category">
          <h2>Best {preference} Books</h2>
          <div className="book-grid">
            {booksByPreference[preference].length > 0 ? (
              booksByPreference[preference].map((book) => (
                <div key={book.id} className="book-item">
                  <button
                    className="heart-icon"
                    onClick={() => {
                      toggleFavorite(book);
                      handleFavoriteSubmit(book);
                    }}
                    style={{
                      color: favorites.some((fav) => fav.id === book.id)
                        ? "red"
                        : "white",
                    }}
                  >
                    ♥
                  </button>
                  <div className="book-author">
                    Author :{" "}
                    {book.volumeInfo.authors
                      ? book.volumeInfo.authors.join(", ")
                      : "Unknown Author"}
                  </div>

                  <Link to={`/book/${book.id}`}>
                    {book.volumeInfo.imageLinks?.thumbnail ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className="book-thumbnail"
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <div
                        className="placeholder-cover"
                        style={{ cursor: "pointer" }}
                      >
                        <p className="book-title">{book.volumeInfo.title}</p>
                      </div>
                    )}
                  </Link>
                  <Link to={`/book/${book.id}`} className="book-title">
                    {book.volumeInfo.title}
                  </Link>
                  <div className="book-info">
                    {book.volumeInfo.description
                      ? book.volumeInfo.description.slice(0, 100) + "..."
                      : "No description available."}
                  </div>
                </div>
              ))
            ) : (
              <p>No books found for this preference.</p>
            )}
          </div>
        </div>
      ))}

      <ScrollToTopButton />
    </div>
  );
};

export default BookRecommendationPage;
