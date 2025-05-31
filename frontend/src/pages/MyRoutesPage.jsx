import React, { useState, useEffect } from "react";
import { api } from "@/api";
import RouteListPage from "./RouteListPage";

const MyRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyRoutes();
  }, []);

  const fetchMyRoutes = async () => {
    try {
      setLoading(true);
      const response = await api.getMyRoutes(); // You'll need to implement this API call
      setRoutes(response.data);
    } catch (err) {
      setError("Erro ao carregar suas rotas");
      console.error("Erro ao buscar rotas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      await api.deleteRoute(routeId);
      setRoutes(routes.filter((route) => route.id !== routeId));
    } catch (err) {
      console.error("Erro ao deletar rota:", err);
      throw err;
    }
  };

  return (
    <RouteListPage
      title="Minhas Rotas"
      routes={routes}
      loading={loading}
      error={error}
      showDeleteButton={true}
      showSearchFilter={true}
      showFilterByButtons={true}
      onDeleteRoute={handleDeleteRoute}
      emptyStateMessage="Você ainda não criou nenhuma rota. Que tal criar a primeira?"
    />
  );
};

export default MyRoutesPage;
