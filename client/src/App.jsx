/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import ReferencePage from "./pages/ReferencePage";
import { Toaster } from "react-hot-toast";

const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserList />} />
          <Route path="/user/create" element={<CreateUser />} />
          <Route path="/reference" element={<ReferencePage />} />
        </Routes>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<AuthForm />} />
      </Routes>
    </>
  );
};

export default App;
