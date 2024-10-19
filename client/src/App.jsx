/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import CategoryAndPreferences from "./components/CategorySelection";
import BookRecommendationPage from "./pages/BookRecommandationPage";
import Landing from "./components/Landing";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <>
      <Landing />
      <AuthForm />
    </>
  );
};
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
      </Routes>
      <Footer />
    </>
  );
};

export default App;
