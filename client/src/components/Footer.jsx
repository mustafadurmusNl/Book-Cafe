import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <p>&copy; {new Date().getFullYear()} Book Cafee. All rights reserved.</p>
      <p>
        Create by : @
        <a href="https://github.com/HackYourFuture/cohort48-project-group-B/tree/develop">
          Cohort 48 Group B
        </a>
      </p>
    </div>
  );
};

export default Footer;
