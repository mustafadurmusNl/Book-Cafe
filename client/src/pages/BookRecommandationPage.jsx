import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/BookRecommendationPage.css";
import Navbar from "../components/Navbar";
import { FavoriteContext } from "../context/FavoriteContext";
import { AuthContext } from "../context/AuthContext"; // اضافه کردن AuthContext

const BookRecommendationPage = () => {
  const { isLoggedIn } = useContext(AuthContext); // استفاده از وضعیت ورود
  const [booksByPreference, setBooksByPreference] = useState({});
  const [booksByFavoriteAuthors, setBooksByFavoriteAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    if (isLoggedIn) {
      navigate(`/book/${bookId}`); // هدایت به صفحه جزئیات کتاب
    } else {
      navigate("/login"); // هدایت به صفحه لاگین اگر کاربر وارد نشده باشد
    }
  };
  useEffect(() => {
    // در اینجا بررسی وضعیت ورود کاربر در صورت نیاز
    if (!isLoggedIn) {
      navigate("/recommendations"); // هدایت به صفحه لاگین در صورت عدم ورود
    } else {
      // Fetch the favorite books data
      setLoading(true);
    }
  }, [isLoggedIn, navigate]);

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
    } catch (err) {
      // console.error("Error fetching preferences:", err);
      setError("Failed to fetch user preferences.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch books for each preference query
  const fetchBooksForPreferences = async () => {
    if (!Array.isArray(userPreferences) || userPreferences.length === 0) return;

    setLoading(true);

    try {
      const fetchPromises = userPreferences.map((preference) => {
        const currentBooks = booksByPreference[preference] || [];
        const startIndex = currentBooks.length;

        return axios
          .get("http://localhost:3000/api/recommendedBooks", {
            params: {
              preference,
              startIndex,
            },
          })
          .then((response) => ({
            preference,
            books: Array.isArray(response.data) ? response.data : [],
          }));
      });

      const results = await Promise.all(fetchPromises);

      const newBooksByPreference = results.reduce(
        (acc, { preference, books }) => {
          if (books.length === 0) {
            setHasMore(false);
          }
          acc[preference] = [...(acc[preference] || []), ...books];
          return acc;
        },
        { ...booksByPreference },
      );

      setBooksByPreference(newBooksByPreference);
    } catch (error) {
      // console.error("Error fetching books:", error);
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
        `http://localhost:3000/api/users/${user}/favoriteAuthors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBooksByFavoriteAuthors(
        Array.isArray(response.data) ? response.data : [],
      );
    } catch (err) {
      // console.error("Error fetching favorite authors:", err);
      setError("Failed to fetch books by favorite authors.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user preferences once on component mount
  useEffect(() => {
    fetchUserPreferences();
    fetchBooksByFavoriteAuthors();
  }, []);

  // Fetch books whenever preferences or page changes
  useEffect(() => {
    if (userPreferences.length > 0) {
      fetchBooksForPreferences();
    }
  }, [userPreferences, page]);

  // Infinite scroll event handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 300
    ) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  // Attach scroll event listener on component mount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [loading, hasMore]);

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-page">
      <Navbar isLoggedIn={true} />
      {booksByFavoriteAuthors.length > 0 && (
        <div className="book-category">
          <h2>Books by Your Favorite Authors</h2>
          <div className="book-grid">
            {booksByFavoriteAuthors.map((book) => {
              const isFavorite = favorites.some(
                (favBook) => favBook.id === book.id,
              );
              return (
                <div
                  key={book.id}
                  className="book-item"
                  onClick={() => handleBookClick(book.id)} // استفاده از handleBookClick
                >
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
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="book-thumbnail"
                    />
                  ) : (
                    <div className="placeholder-cover">
                      <p className="book-title">{book.volumeInfo.title}</p>
                      <p className="book-author">
                        {book.volumeInfo.authors.join(", ")}
                      </p>
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
              );
            })}
          </div>
        </div>
      )}

      {/* Section for User Preferences' Books */}
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
                  <div
                    key={book.id}
                    className="book-item"
                    onClick={() => handleBookClick(book.id)} // استفاده از handleBookClick
                  >
                    <button
                      className="heart-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // جلوگیری از هدایت به صفحه BookDetail
                        toggleFavorite({
                          id: book.id,
                          title: book.volumeInfo.title,
                          imageLinks: book.volumeInfo.imageLinks,
                          description: book.volumeInfo.description,
                        });
                      }}
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
