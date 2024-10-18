import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import BookRecommendation from "./components/BookRecommendation";
import CategoryAndPreferences from "./components/CategorySelection";
const App = () => {
  const location = useLocation();
  return (
    <>
      <Nav />
      {location.pathname === "/" && <Navbar />}
      {location.pathname === "/nav" && <Nav />}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/categories" element={<CategoryAndPreferences />} />
        <Route path="/recommendations" element={<BookRecommendation />} />
      </Routes>
    </>
  );
};

export default App;
