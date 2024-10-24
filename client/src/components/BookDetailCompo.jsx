import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/bookDetailCompo.css";
import { FavoriteContext } from "../context/FavoriteContext";
import Navbar from "../components/Navbar";

const BookDetailComponent = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(false);
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/bookDetail/${id}`,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBook(data.volumeInfo);
      } catch (error) {
        setError(true);
      }
    };
    fetchBook();
  }, [id]);

  if (error) return <div>Error loading the book details.</div>;
  if (!book) return <div>Loading...</div>;

  const isFavorite = favorites.some((favBook) => favBook.id === id);

  return (
    <div>
      <Navbar isLoggedIn={true} />
      <div className="bookDetailContainer-custom">
        <button className="backButton-custom" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="bookImage-custom">
          <img
            src={book.imageLinks?.thumbnail || "/default-image.jpg"}
            alt={book.title || "No Title"}
          />
        </div>
        <div className="bookInfo-custom">
          <h3 className="bookH-custom">{book.title}</h3>
          <div className="bookMeta-custom">
            <span>Category: {book.categories?.[0]}</span>
            <span>Author: {book.authors?.join(", ")}</span>
            <span>Published Year: {book.publishedDate}</span>
          </div>
          <p className="bookDescription-custom">
            {book.description || "No detailed description available."}
          </p>
          <div className="bookButtons-custom">
            <a
              href={book.pdf?.downloadLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="pdfButton-custom"
            >
              View PDF
            </a>
            <button className="buyButton-custom">Buy Link</button>
          </div>
          <button
            className="heart-icon-bdc"
            onClick={() => toggleFavorite({ id, ...book })}
            style={{ color: isFavorite ? "red" : "white" }}
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailComponent;
