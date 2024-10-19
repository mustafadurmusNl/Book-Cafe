/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/BookRecommendationPage.css";
import Navbar from "../components/Navbar";

const BookRecommendationPage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);

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

  const fetchBooks = async () => {
    if (!Array.isArray(userPreferences) || userPreferences.length === 0) return;

    try {
      const query = userPreferences.join("+");
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${query}&maxResults=16&startIndex=${(page - 1) * 10}`,
      );

      if (response.data.items) {
        setBooks((prevBooks) => [...prevBooks, ...response.data.items]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUserPreferences();
  }, []);
  useEffect(() => {
    fetchBooks();
  }, [userPreferences, page]);
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
  }, [books]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-page">
      <Navbar />
      <h1 className="book-title-header">Book Recommendations</h1>
      <div className="book-grid">
        {books.map((book) => (
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
        ))}
      </div>
    </div>
  );
};

export default BookRecommendationPage;
