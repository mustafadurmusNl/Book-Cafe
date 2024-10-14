import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const updateCategories = (categories) => {
    setSelectedCategories(categories);
  };

  return (
    <CategoryContext.Provider value={{ selectedCategories, updateCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useCategory = () => {
  return useContext(CategoryContext);
};
