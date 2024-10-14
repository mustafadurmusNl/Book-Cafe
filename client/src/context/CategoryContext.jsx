import React, { createContext, useState, useContext } from "react";

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

export const useCategory = () => {
  return useContext(CategoryContext);
};
