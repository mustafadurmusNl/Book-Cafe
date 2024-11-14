import { useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("User not found. Please log in.");

      navigate("/", { replace: true });

      setTimeout(() => {
        const formElement = document.getElementById("Form");
        if (formElement) {
          window.scrollTo({
            top: formElement.offsetTop,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
