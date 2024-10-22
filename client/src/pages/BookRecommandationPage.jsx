import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/BookRecommendationPage.css";
import Navbar from "../components/Navbar";
const apiKey = process.env.API_KEY;

const BookRecommendationPage = () => {
  const [booksByPreference, setBooksByPreference] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const [hasMore, setHasMore] = useState(true);

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
  const fetchBooksForPreferences = async () => {
    if (!Array.isArray(userPreferences) || userPreferences.length === 0) return;

    setLoading(true);

    try {
      // For each user preference, make a separate API call
      const fetchPromises = userPreferences.map((preference) => {
        const currentBooks = booksByPreference[preference] || [];
        const startIndex = currentBooks.length; // Start after the last fetched book

        return axios
          .get(
            `https://www.googleapis.com/books/v1/volumes?q=${preference}&key=${apiKey}&maxResults=16&startIndex=${startIndex}`,
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
      {Object.keys(booksByPreference).map((preference) => (
        <div key={preference} className="book-category">
          <h2>Best {preference} Books</h2>
          <div className="book-grid">
            {booksByPreference[preference].length > 0 ? (
              booksByPreference[preference].map((book) => (
                <div key={book.id} className="book-item">
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="book-thumbnail"
                    />
                  ) : (
                    <div className="placeholder-cover">
                      <p className="book-title">{book.volumeInfo.title}</p>
                      <p className="book-author">{book.volumeInfo.authors}</p>
                    </div>
                  )}
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
      {loading && <p>Loading more books...</p>}
    </div>
  );
};

export default BookRecommendationPage;
