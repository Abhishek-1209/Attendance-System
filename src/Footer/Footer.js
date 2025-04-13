import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Smart Attendance System</p>
    </footer>
  );
};

export default Footer;
