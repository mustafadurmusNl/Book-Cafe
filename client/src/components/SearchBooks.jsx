import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import "../Styles/SearchBooks.css";

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // Access isLoggedIn from AuthContext

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!isLoggedIn) {
      // If user is not logged in, prevent search and scroll to login form
      toast.error("Please log in to search for books.");
      const formElement = document.getElementById("Form");
      if (formElement) {
        window.scrollTo({
          top: formElement.offsetTop,
          behavior: "smooth",
        });
      }
      return;
    }

    if (!searchTerm.trim()) return;
    try {
      const response = await axios.get(
        `api/books/search?query=${encodeURIComponent(searchTerm)}`,
      );
      setSearchResults(response.data.items || []);
    } catch (error) {
      alert("Error fetching data:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="search-books-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="search-icon"
          onClick={handleSearchSubmit}
        />
      </div>
      {searchResults.length > 0 && (
        <ul className="search-results-list">
          {searchResults.map((book) => (
            <li
              key={book.id}
              className="search-result-item"
              onClick={() => handleBookClick(book.id)}
            >
              <div className="book-title">{book.volumeInfo.title}</div>
              <div className="book-author">
                {book.volumeInfo.authors?.join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBooks;
