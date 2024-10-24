import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
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
  const location = useLocation();
  const shouldShowAuthForm = ![
    "/recommendations",
    "/favorites",
    "/book/:id",
  ].includes(location.pathname);

  return (
    <AuthProvider>
      <FavoriteProvider>
        <div className="app-container">
          {location.pathname === "/" && <Navbar />}

          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoryAndPreferences />} />
            <Route
              path="/recommendations"
              element={<BookRecommendationPage />}
            />
            <Route path="/book/:id" element={<BookDetailComponent />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {shouldShowAuthForm && <AuthForm />}
          <Footer />
        </div>
      </FavoriteProvider>
    </AuthProvider>
  );
};
export default App;
