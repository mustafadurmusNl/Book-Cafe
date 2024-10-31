import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { logError } from "../util/logger";
import PropTypes from "prop-types";
const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { user } = useAuth(); // Use user from AuthContext

  useEffect(() => {
    const fetchSelectedCategories = async () => {
      if (user) {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${process.env.BASE_SERVER_URL}/api/users/${user.id}/preferences`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const preferences = response.data.preferences || [];
          setSelectedCategories(preferences);
        } catch (error) {
          logError("Error fetching categories:", error);
        }
      }
    };

    fetchSelectedCategories();
  }, [user]); // Fetch categories when user changes

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

export const useCategory = () => useContext(CategoryContext);
