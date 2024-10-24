import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  // useEffect(() => {
  //   if (favorites.length > 0) {
  //     localStorage.setItem("favorites", JSON.stringify(favorites));
  //   }
  // }, [favorites]);  useEffect(() => {
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (book) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some(
        (favBook) => favBook.id === book.id,
      );
      if (isFavorite) {
        return prevFavorites.filter((favBook) => favBook.id !== book.id);
      } else {
        return [...prevFavorites, book];
      }
    });
  };
  const clearFavoritesOnLogout = () => {
    setFavorites([]);
    localStorage.removeItem("favorites"); // Clear localStorage on logout
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, toggleFavorite, clearFavoritesOnLogout }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

FavoriteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};