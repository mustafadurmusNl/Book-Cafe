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

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (book) => {
    let updatedFavorites = [...favorites];
    const isFavorite = updatedFavorites.some(
      (favBook) => favBook.id === book.id,
    );

    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter(
        (favBook) => favBook.id !== book.id,
      );
    } else {
      updatedFavorites.push(book);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const clearFavoritesOnLogout = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
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

FavoriteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
