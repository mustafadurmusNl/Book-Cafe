import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../Styles/AuthForm.css";
import backgroundImage from "../../public/images/5.jpg";
import left from "../../public/images/13.gif";
import right from "../../public/images/11.gif";
import logo from "../../public/images/logo.png";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle } from "react-icons/fa";

const AuthForm = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMatched, setIsMatched] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.BASE_SERVER_URL}/api/users/login`,
        { email, password },
      );
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.id));
        localStorage.setItem("username", JSON.stringify(response.data.name));
      }
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(`Welcome back, ${response.data.name}!`);
        login(response.data);
        navigate("/recommendations");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.BASE_SERVER_URL}/api/users/register`,
        { name, email, password, confirmPassword },
      );

      if (data.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.id));
        localStorage.setItem("username", JSON.stringify(data.name));

        toast.success(data.message);
        login(data);
        navigate("/categories");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.open(
      `${process.env.BASE_SERVER_URL}/api/auth/google/callback`,
      "_self",
    );
  };

  useEffect(() => {
    setIsMatched(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  return (
    <div className="container-auth" id="Form">
      <img className="left-auth" src={left} alt="" />
      <img className="right-auth" src={right} alt="" />
      <img className="ground-auth" src={backgroundImage} alt="" />
      <div className="all-auth">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div className="form-group-auth">
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
          <div className="form-group-auth">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group-auth">
            <label htmlFor="password">Password:</label>
            <div className="input-with-icon-auth">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isMatched && (
                <FaCheckCircle className="check-icon-auth show-auth" />
              )}
            </div>
          </div>
          {!isLogin && (
            <div className="form-group-auth">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="input-with-icon-auth">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                />
                {isMatched && (
                  <FaCheckCircle className="check-icon-auth show-auth" />
                )}
              </div>
            </div>
          )}
          <button className="log-auth" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          className="regist-auth"
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin ? " Register" : " Login"}
        </button>
        <div>
          <button className="google-button-auth" onClick={handleGoogleLogin}>
            <img src={logo} alt="" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
