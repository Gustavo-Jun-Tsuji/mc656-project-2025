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

  return (
    <RouteListPage
      title="Rotas Curtidas"
      routes={routes}
      loading={loading}
      error={error}
      showLikeButton={true}
      showSearchFilter={true}
      showOrderByButtons={true}
      showVoteButtons={true}
      emptyStateMessage="Você ainda não curtiu nenhuma rota. Explore e encontre rotas interessantes!"
    />
  );
};

export default LikedRoutesPage;
