/* eslint-disable no-console */
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/bookDetailCompo.css";
import { FavoriteContext } from "../context/FavoriteContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const BookDetailComponent = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(false);
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/book/${id}`);
        setBook(response.data);
      } catch (error) {
        setError(true);
        console.error("Fetch error:", error);
      }
    };

    fetchBook();
  }, [id]);

  if (error) return <div>Error loading the book details.</div>;
  if (!book) return <div>Loading...</div>;

  const isFavorite = favorites.some((favBook) => favBook.id === id);
  const pdfAvailable = book.accessInfo?.pdf?.isAvailable;
  const pdfLink = book.accessInfo?.pdf?.acsTokenLink;
  const buyLink = book.saleInfo?.buyLink;
  const readLink = book.accessInfo?.webReaderLink;

  return (
    <div>
      <Navbar />
      <div className="bookDetailContainer-custom">
        <button
          className="backButton-custom"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
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
          <div className="bookButtons-custom">
            <a
              href={pdfAvailable ? pdfLink : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="pdfButton-custom"
              onClick={(e) => {
                if (!pdfAvailable) {
                  e.preventDefault();
                  alert("PDF not available.");
                }
              }}
            >
              View PDF
            </a>
            <a
              href={buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="buyButton-custom"
            >
              Buy Link
            </a>
            <a
              href={readLink}
              target="_blank"
              rel="noopener noreferrer"
              className="readButton-custom"
            >
              Read Now
            </a>
          </div>
          <button
            className="heart-icon-bdc"
            onClick={() => toggleFavorite({ id, ...book.volumeInfo })}
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

export default BookDetailComponent;
