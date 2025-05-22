import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const SearchBar = () => {
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
    if (searchResults.length > 0) {
      navigateToRoute(searchResults[0].id);
    }
  };

  const navigateToRoute = (routeId) => {
    navigate(`/routes/${routeId}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search routes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="search-input"
        />
      </form>

      {showSuggestions && searchResults.length > 0 && (
        <div className="suggestions-dropdown">
          {searchResults.map((route) => (
            <button
              key={route.id}
              className="suggestion-item"
              onClick={() => navigateToRoute(route.id)}
              type="button"
              tabIndex={0}
              aria-label={`View route: ${route.title}`}
            >
              <div className="route-title">{route.title}</div>
              <div className="route-description">
                {route.description?.substring(0, 50)}
                {route.description?.length > 50 ? "..." : ""}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
