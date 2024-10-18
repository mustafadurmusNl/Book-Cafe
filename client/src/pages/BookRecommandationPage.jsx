/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/BookRecommendationPage.css";
import Navbar from "../components/Navbar";

const BookRecommendationPage = () => {
  const [booksByPreference, setBooksByPreference] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);

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
      console.error("Error fetching preferences:", err);
      setError("Failed to fetch user preferences.");
      setLoading(false);
    }
  };

  // Fetch books for each preference query
  const fetchBooksForPreferences = async () => {
    if (!Array.isArray(userPreferences) || userPreferences.length === 0) return;

    setLoading(true);

    try {
      // For each user preference, make a separate API call
      const fetchPromises = userPreferences.map((preference) => {
        return axios
          .get(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${preference}&maxResults=32&startIndex=${(page - 1) * 10}`,
          )
          .then((response) => ({
            preference,
            books: response.data.items || [],
          }));
      });

      // Wait for all promises to resolve
      const results = await Promise.all(fetchPromises);

      // Organize books by preference
      const newBooksByPreference = results.reduce(
        (acc, { preference, books }) => {
          acc[preference] = books;
          return acc;
        },
        {},
      );

      // Merge new books into the existing state
      setBooksByPreference((prevBooksByPreference) => ({
        ...prevBooksByPreference,
        ...newBooksByPreference,
      }));

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
      fetchBooksForPreferences();
    }
  }, [userPreferences, page]);

  // Scroll event to trigger pagination
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [booksByPreference]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-page">
      <Navbar />
      <h1 className="book-title-header">Book Recommendations</h1>

      {/* Display books grouped by preference */}
      {Object.keys(booksByPreference).map((preference) => (
        <div key={preference} className="book-category">
          <h2>{preference}</h2>{" "}
          {/* Show the preference as the category header */}
          <div className="book-grid">
            {booksByPreference[preference].length > 0 ? (
              booksByPreference[preference].map((book) => (
                <div key={book.id} className="book-item">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title}
                    className="book-thumbnail"
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
              ))
            ) : (
              <p>No books available for {preference}.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookRecommendationPage;
