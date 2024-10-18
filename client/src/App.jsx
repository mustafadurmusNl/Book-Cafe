/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import Navbar from "./components/Navbar";
import { CategoryProvider } from "./context/CategoryContext";
import ReferencePage from "./pages/ReferencePage";
import { Toaster } from "react-hot-toast";
import BookRecommendation from "./components/BookRecommendation";
import CategoryAndPreferences from "./components/CategorySelection";
const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <Navbar />}

      <CategoryProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserList />} />
          <Route path="/user/create" element={<CreateUser />} />
          <Route path="/reference" element={<ReferencePage />} />
        </Routes>
      </CategoryProvider>
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
