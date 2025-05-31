import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ArrowRight } from "lucide-react";

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
    if (searchTerm.trim()) {
      // Navigate to search results page with the search term
      navigate(`/routes/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const navigateToRoute = (routeId) => {
    navigate(`/routes/${routeId}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full h-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar Rotas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full min-h-[50px] pl-10 pr-4 py-2 bg-primary-light placeholder:text-lg"
            style={{ textAlign: searchTerm ? "left" : "center" }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
      </form>

      {showSuggestions && searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md border border-input shadow-md overflow-hidden">
          {searchResults.map((route) => {
            const matchesOrigin =
              route.starting_location?.toLowerCase() ===
              searchTerm.toLowerCase();
            const matchesDestination =
              route.ending_location?.toLowerCase() === searchTerm.toLowerCase();

            return (
              <Button
                key={route.id}
                variant="ghost"
                className="w-full h-auto justify-start px-4 py-2 flex flex-col items-start gap-0 text-left hover:bg-accent hover:text-accent-foreground border-b last:border-0"
                onClick={() => navigateToRoute(route.id)}
                type="button"
                tabIndex={0}
                aria-label={`View route: ${route.title}`}
              >
                <div className="font-medium text-base w-full truncate flex justify-between">
                  <span>{route.title}</span>
                  <div className="flex">
                    <div className="flex text-xs text-muted-foreground w-full items-center justify-center">
                      <span
                        className={
                          matchesOrigin
                            ? "bg-secondary-light px-2 py-0.5 rounded text-center inline-flex items-center justify-center"
                            : "inline-flex items-center justify-center"
                        }
                      >
                        {route.starting_location || "Origem"}
                      </span>
                      <ArrowRight className="h-3 w-3 text-secondary mx-1" />
                      <span
                        className={
                          matchesDestination
                            ? "bg-secondary-light px-2 py-0.5 rounded text-center inline-flex items-center justify-center"
                            : "inline-flex items-center justify-center"
                        }
                      >
                        {route.ending_location || "Destino"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {route.description?.substring(0, 50)}
                    {route.description?.length > 50 ? "..." : ""}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
