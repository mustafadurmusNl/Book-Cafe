import React from "react";
import TEST_ID from "./Home.testid";
import Landing from "../../components/Landing";
import AuthForm from "../../components/AuthForm";
import { useEffect,useState } from "react";
const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Check if the user is logged in from localStorage
    useEffect(() => {
      const checkLoginStatus = () => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Update state based on token presence
    };

    // Call the checkLoginStatus function on component mount
    checkLoginStatus();

    // Optionally, you can add an event listener for storage changes
    window.addEventListener("storage", checkLoginStatus);

    return () => {
        window.removeEventListener("storage", checkLoginStatus);
    };

    }, []);
  return (
    <div data-testid={TEST_ID.container}>
     <Landing />
     {!isLoggedIn && <AuthForm />}

    </div>
  );
};

export default Home;
