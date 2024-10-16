/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import axios
import "./AuthForm.css";
import backgroundImage from "../../public/images/5.jpg";
import left from "../../public/images/13.gif";
import right from "../../public/images/11.gif";
import logo from "../../public/images/logo.png";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const checkLoggedInUser = async () => {
      // Check if the token exists in the cookies
      const token = Cookies.get("token");

      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/users/me",
            {
              withCredentials: true, // Ensure cookies are sent
            },
          );
          if (response.data) {
            navigate("/category");
          }
        } catch (error) {
          console.error("Error checking logged-in user:", error);
        }
      } else {
        console.log("No token found, user is not logged in.");
      }
    };
    checkLoggedInUser();
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        },
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(`Welcome back, ${response.data.name}!`);
        navigate("/category");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          name,
          email,
          password,
        },
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        navigate("/prefrence");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/api/auth/google/callback", "_self");
    navigate("/category");
  };

  return (
    <div className="container">
      <img className="left" src={left} alt="" />
      <img className="right" src={right} alt="" />
      <img className="ground" src={backgroundImage} alt="" />
      <div className="all">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="log" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button className="regist" onClick={() => setIsLogin((prev) => !prev)}>
          {isLogin ? " Register" : " Login"}
        </button>
        <div>
          <button className="google-button" onClick={handleGoogleLogin}>
            <img src={logo} alt="" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
