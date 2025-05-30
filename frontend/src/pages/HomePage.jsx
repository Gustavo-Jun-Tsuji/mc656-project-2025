import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import api from "../api";
import LatestRoute from "../components/LatestRoute";
import MapComponent from "../components/map/MapComponent";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import

const HomePage = () => {
  const navigate = useNavigate(); // Add this hook
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentHoveredRoute, setCurrentHoveredRoute] = useState(null);

  // Define callback function
  const handleHoveredRouteChange = (route) => {
    setCurrentHoveredRoute(route);
    // console.log("Rota atualizada:", route);
  };

  // Add this useMemo to calculate center coordinates
  const centerCoordinates = useMemo(() => {
    if (currentHoveredRoute?.coordinates?.length > 0) {
      // If there are coordinates, use the first one as center
      return currentHoveredRoute.coordinates[0];
    }
    // Default coordinates (you can use any default location)
    return [-22.817166, -47.069806]; // Default to Unicamp coordinates
  }, [currentHoveredRoute]);

  // This useEffect should be at the component level
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routesResponse = await api.getAllRoutes();
        setRoutes(routesResponse.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching routes:", error);
        setError("Falha ao carregar as rotas. Tente novamente mais tarde.");
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  // Enhanced loading and error states
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light">
        <div className="text-center p-4">
          <div className="loading text-xl mb-2">Carregando rotas...</div>
          <div className="loading-spinner h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light">
        <div className="text-center p-4">
          <div className="error text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light flex flex-col pt-10">
        <div className="flex flex-row gap-12 p-4 w-4/5 mx-auto">
          <div className="flex-1">
            <div className="rounded-lg shadow-md h-[650px]">
              <div className="map-section h-full">
                <MapComponent
                  coordinates={currentHoveredRoute?.coordinates || []}
                  center={centerCoordinates}
                  zoom={16}
                  readOnly={true}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-[550px] flex items-center">
            <LatestRoute
              routes={routes}
              onHoveredRouteChange={handleHoveredRouteChange}
            />
          </div>
          <button
            onClick={() => navigate("/routes/create")}
            className="fixed bottom-12 right-12 bg-primary-dark hover:bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-colors duration-200 z-50"
            aria-label="Criar nova rota"
            title="Criar nova rota"
          >
            <PlusIcon size={36} />
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
