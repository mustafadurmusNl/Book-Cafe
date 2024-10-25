
import { useEffect } from "react"; // Import useEffect
import PropTypes from "prop-types"; // Import PropTypes
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Use useNavigate to handle navigation

  useEffect(() => {
    if (!user) {
      // If user is not authenticated, navigate to the homepage
      navigate("/", { replace: true });
      
      // Wait for navigation to complete, then scroll down
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 10); // Adjust delay as necessary
    }
  }, [user, navigate]);

  // If user is authenticated, return children; otherwise return null
  return user ? children : null; // Prevent rendering protected content for unauthenticated users
};
// Define prop types
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children should be a React node
};

export default ProtectedRoute;
