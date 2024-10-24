import React, { useEffect, useState } from "react";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/BookRecommendationPage.css";
import Navbar from "../components/Navbar";
import { FavoriteContext } from "../context/FavoriteContext";
const BookRecommendationPage = () => {
  const [booksByPreference, setBooksByPreference] = useState({});
  const [booksByFavoriteAuthors, setBooksByFavoriteAuthors] = useState([]);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();

  // Fetch user preferences from API
  const fetchUserPreferences = async () => {
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
            books: response.data || [],
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
      setLoading(false);
    } catch (error) {
      setError("Error fetching books.");
      setLoading(false);
    }
  };
  const fetchBooksByFavoriteAuthors = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${user}/favoriteAuthors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBooksByFavoriteAuthors(response.data || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books by favorite authors.");
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
      fetchBooksForPreferences(page);
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Function to save the favorite author
  const handleSaveAuthor = async (author) => {
    if (!user || !token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    console.log("Authorization Token:", token); // Log token

    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${user}/favoriteAuthors`,
        { author },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Save Author Response:", response.data);
    } catch (error) {
      console.error(
        "Failed to save author:",
        error.response ? error.response.data : error.message,
      );
      setError("Failed to save author.");
    }
  };

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-page">
      <Navbar />

      {/* Section for Favorite Authors' Books */}
      {booksByFavoriteAuthors.length > 0 && (
        <div className="book-category">
          <h2>Books by Your Favorite Authors</h2>
          <div className="book-grid">
            {booksByFavoriteAuthors.map((book) => (
              <div
                key={book.id}
                className="book-item"
                onClick={() => handleSaveAuthor(book.volumeInfo.authors[0])}
              >
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
            ))}
          </div>
        </div> 
                          imageLinks: book.volumeInfo.imageLinks,
                          description: book.volumeInfo.description,
                        })
                      }
                      style={{ color: isFavorite ? "red" : "white" }}
                    >
      className="book-thumbnail"
                      onClick={() => navigate(`/book/${book.id}`)}
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
