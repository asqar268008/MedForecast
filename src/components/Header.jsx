// Header.js
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="company-header">
      <img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" className="company-logo" />
      <h3 className="company-name">MedForecast</h3>
    </div>
  );
};

export default Header;
