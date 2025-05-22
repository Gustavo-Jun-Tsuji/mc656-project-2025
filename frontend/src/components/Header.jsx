import { Link } from "react-router-dom";
import "../styles/Header.css";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <SearchBar />
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/routes/create">Create Route</Link>
      </nav>
    </header>
  );
};

export default Header;
