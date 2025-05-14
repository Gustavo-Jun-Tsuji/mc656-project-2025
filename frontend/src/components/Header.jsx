import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/routes/create">Create Route</Link>
      </nav>
    </header>
  );
};

export default Header;
