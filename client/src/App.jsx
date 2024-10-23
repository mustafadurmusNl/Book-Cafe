/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import CategoryAndPreferences from "./components/CategorySelection";
import BookRecommendationPage from "./pages/BookRecommandationPage";

import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/Home/Home";

const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <Navbar />}

      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<CategoryAndPreferences />} />
        <Route path="/recommendations" element={<BookRecommendationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
