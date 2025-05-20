import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { api } from "../api";


const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchTerm.trim()) {
      const fetchSuggestions = async () => {
        try {
          const response = await api.searchRoutes(searchTerm);
          setSearchResults(response.data.results || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Erro ao buscar sugestões:", error);
          setSearchResults([]);
        }
      };
      
      const debounceTimer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchResults.length > 0){
      navigateToRoute(searchResults[0].id);
    }
  }

  const navigateToRoute = (routeId) => {
    navigate(`/routes/${routeId}`);
    setSearchTerm("");
    setShowSuggestions(false);
  }

  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search routes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={ () => searchTerm && setShowSuggestions(true) }
            onBlur={ () => setTimeout( () => setShowSuggestions(false), 200) }
            className="search-input"/>
        </form>

        {showSuggestions && searchResults.length > 0 && (
          <div className="suggestions-dropdown">
            {
              searchResults.map( (route) => (
                <div
                  key={route.id}
                  className="suggestion-item"
                  onClick={() => navigateToRoute(route.id)}
                >
                  <div className="route-title">{route.title}</div>
                  <div>
                    {route.description?.substring(0, 50)}...
                  </div>
                </div>
              )
              )
            }
          </div>
        )}

      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/routes/create">Create Route</Link>
      </nav>
    </header>
  );
};

export default Header;
