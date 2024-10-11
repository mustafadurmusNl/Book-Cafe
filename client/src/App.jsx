import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import { Helmet } from "react-helmet-async";
import favicon from "../public/assets/favicon.ico";
import Navbar from "./components/Navbar";

const App = () => {
  const location = useLocation();
  return (
    <>
      <Helmet>
        <title>Book Cafe</title>
        <meta name="description" content="Find your favorite books at Book Cafe." />
        <link rel="icon" href={favicon}/>
      </Helmet>
      <Nav />
      {location.pathname === "/" && <Navbar />}
      {location.pathname === "/nav" && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
      </Routes>
    </>
  );
};

export default App;
