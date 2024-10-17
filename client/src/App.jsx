import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import BookRecommendationPage from "./pages/BookRecommandationPage";

const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <Navbar />}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/recommendations" element={<BookRecommendationPage />} />
      </Routes>
    </>
  );
};

export default App;
