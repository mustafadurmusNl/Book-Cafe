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

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10&startIndex=${(page - 1) * 10}`,
      );
      setBooks((prevBooks) => [...prevBooks, ...response.data.items]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
