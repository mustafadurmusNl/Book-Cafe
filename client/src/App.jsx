import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import Navbar from "./components/Navbar";
import { CategoryProvider } from "./context/CategoryContext";
import ReferencePage from "./pages/ReferencePage";


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

    </>
  );
};

export default App;
