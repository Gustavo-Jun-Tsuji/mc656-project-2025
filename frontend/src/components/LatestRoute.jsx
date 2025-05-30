import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/api";
import RouteCard from "@/components/RouteCard";

const LatestRoutes = ({ routes = [], onHoveredRouteChange }) => {
  const [error, setError] = useState(null);
  const [hoveredRoute, setHoveredRoute] = useState(null);

  const handleRouteHover = (route) => {
    setHoveredRoute(route);
  };

  useEffect(() => {
    if (onHoveredRouteChange) {
      onHoveredRouteChange(hoveredRoute);
    }
  }, [hoveredRoute, onHoveredRouteChange]);

  // Mostrar mensagem de erro se ocorrer
  if (error) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-secondary-dark text-xl">
            Últimas Rotas Adicionadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl rounded-xl p-5 bg-secondary-very_light border h-full flex flex-col">
      <CardHeader className="pb-8 border-b border-secondary-light flex-shrink-0">
        <CardTitle className="text-blue-800 text-xl text-center">
          Últimas Rotas Adicionadas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {routes
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((route, index) => (
              <div
                key={route.id}
                className={`${
                  index !== routes.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <RouteCard route={route} onRouteHover={handleRouteHover} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestRoutes;
