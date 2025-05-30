import React, { useState, useEffect } from "react";
import { api } from "@/api";
import RouteListPage from "./RouteListPage";

const LikedRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLikedRoutes();
  }, []);

  const fetchLikedRoutes = async () => {
    try {
      setLoading(true);
      const response = await api.getLikedRoutes(); // You'll need to implement this API call
      setRoutes(response.data);
    } catch (err) {
      setError("Erro ao carregar rotas favoritas");
      console.error("Erro ao buscar rotas favoritas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeRoute = async (routeId, isLiked) => {
    try {
      if (isLiked) {
        await api.likeRoute(routeId);
      } else {
        await api.unlikeRoute(routeId);
        // Remove from liked routes when unliked
        setRoutes(routes.filter((route) => route.id !== routeId));
      }
    } catch (err) {
      console.error("Erro ao curtir/descurtir rota:", err);
      throw err;
    }
  };

  return (
    <RouteListPage
      title="Rotas Favoritas"
      routes={routes}
      loading={loading}
      error={error}
      showLikeButton={true}
      showSearchFilter={true}
      onLikeRoute={handleLikeRoute}
      emptyStateMessage="Você ainda não favoritou nenhuma rota. Explore e encontre rotas interessantes!"
    />
  );
};

export default LikedRoutesPage;
