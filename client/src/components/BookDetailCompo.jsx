/* eslint-disable no-console */
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/bookDetailCompo.css"; // Ensure your CSS file is correctly linked
import { FavoriteContext } from "../context/FavoriteContext"; // Import the context for favorites
import Navbar from "../components/Navbar"; // Import the Navbar component
import axios from "axios"; // Import axios for API calls

const BookDetailComponent = () => {
  const { id } = useParams(); // Get the book ID from the URL parameters
  const [book, setBook] = useState(null); // State to hold book data
  const [error, setError] = useState(false); // State to manage errors
  const { favorites, toggleFavorite } = useContext(FavoriteContext); // Access favorites context
  const navigate = useNavigate(); // Hook for navigation

  // Fetch the book details when the component mounts or when the ID changes
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `${process.env.BASE_SERVER_URL}/api/book/detail/${id}`,
        ); // Make API call to fetch book details
        setBook(response.data); // Set book data
      } catch (error) {
        setError(true); // Handle error by updating state
        console.error("Fetch error:", error);
      }
    };

    fetchBook(); // Call the function to fetch book details
  }, [id]); // Dependency array to refetch on ID change
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
  // Render error message if there is an error
  if (error) return <div>Error loading the book details.</div>;
  // Render loading message while fetching book data
  if (!book) return <div>Loading...</div>;

  // Determine if the book is in favorites
  const isFavorite = favorites.some((favBook) => favBook.id === id);
  const pdfAvailable = book.accessInfo?.pdf?.isAvailable; // Check if PDF is available
  const pdfLink = book.accessInfo?.pdf?.acsTokenLink; // Link to PDF
  const buyLink = book.saleInfo?.buyLink; // Link to buy the book
  const readLink = book.accessInfo?.webReaderLink; // Link to read the book online

  // Debugging: Log the links to console
  console.log("PDF Link:", pdfLink);
  console.log("Buy Link:", buyLink);
  console.log("Read Link:", readLink);

  return (
    <div>
      <div className="navbar-container">
        <Navbar /> {/* Render Navbar */}
        <button
          className="backButton-custom"
          onClick={() => navigate(-1)} // Navigate back to the previous page
          aria-label="Go back"
        >
          <FaArrowLeft /> {/* Back button icon */}
        </button>
      </div>
      <div className="bookDetailContainer-custom">
        <div className="bookImage-custom">
          <img
            src={book.volumeInfo?.imageLinks?.thumbnail || "/default-image.jpg"}
            alt={book.volumeInfo?.title || "No Title"}
          />
        </div>
        <div className="bookInfo-custom">
          <h3 className="bookH-custom">{book.volumeInfo?.title}</h3>
          <div className="bookMeta-custom">
            <span>Category: {book.volumeInfo?.categories?.[0] || "N/A"}</span>
            <span>
              Author: {book.volumeInfo?.authors?.join(", ") || "Unknown"}
            </span>
            <span>
              Published Year: {book.volumeInfo?.publishedDate || "N/A"}
            </span>
          </div>
          <p className="bookDescription-custom">
            {book.volumeInfo?.description ||
              "No detailed description available."}
          </p>
          <div className="bookButtons-custom buttonContainer-custom">
            {pdfAvailable && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="pdfButton-custom"
              >
                View PDF
              </a>
            )}
            {buyLink && (
              <a
                href={buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="buyButton-custom"
              >
                Buy Link
              </a>
            )}
            {readLink && (
              <a
                href={readLink}
                target="_blank"
                rel="noopener noreferrer"
                className="readButton-custom"
              >
                Read Now
              </a>
            )}
          </div>
          <button
            className="heart-icon-bdc"
            onClick={() => {
              toggleFavorite({ id, ...book.volumeInfo });
              handleFavoriteSubmit(book);
            }}
            style={{ color: isFavorite ? "red" : "white" }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailComponent; // Export the component
