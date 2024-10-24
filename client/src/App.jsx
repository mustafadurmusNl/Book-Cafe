import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import { Toaster } from "react-hot-toast";
import CategoryAndPreferences from "./components/CategorySelection";
import BookRecommendationPage from "./pages/BookRecommandationPage";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/Home/Home";
import BookDetailComponent from "./components/BookDetailCompo";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoriteProvider } from "./context/FavoriteContext";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryAndPreferences />} />
          <Route path="/recommendations" element={<BookRecommendationPage />} />
          <Route path="/book/:id" element={<BookDetailComponent />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </FavoriteProvider>
    </AuthProvider>
  );
};

export default App;

