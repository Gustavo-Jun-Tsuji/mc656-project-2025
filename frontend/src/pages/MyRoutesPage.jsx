import React, { useState, useEffect } from "react";
import { api } from "@/api";
import RouteListPage from "./RouteListPage";

const MyRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentOrderBy, setCurrentOrderBy] = useState("-created_at");

  useEffect(() => {
    fetchMyRoutes();
  }, []);

  const fetchMyRoutes = async (
    page = 1,
    search = "",
    orderBy = "-created_at",
    reset = true
  ) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const response = await api.getMyRoutes(page, search, orderBy);
      const newRoutes = response.data.results || response.data || [];

      if (reset || page === 1) {
        setRoutes(newRoutes);
      } else {
        setRoutes((prevRoutes) => [...prevRoutes, ...newRoutes]);
      }

      setHasNextPage(!!response.data.next);
      setTotalCount(response.data.count || newRoutes.length);
      setCurrentPage(page);
      setCurrentSearch(search);
      setCurrentOrderBy(orderBy);
    } catch (err) {
      setError("Erro ao carregar suas rotas");
      console.error("Erro ao buscar suas rotas:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      fetchMyRoutes(currentPage + 1, currentSearch, currentOrderBy, false);
    }
  };

  const handleFilterChange = (search, orderBy) => {
    // Reset to page 1 when filters change
    setRoutes([]);
    setCurrentPage(1);
    fetchMyRoutes(1, search, orderBy, true);
  };

  const handleRoutesUpdate = (updatedRoutes) => {
    setRoutes(updatedRoutes);
    // Optionally update total count if a route was deleted
    setTotalCount((prevCount) =>
      Math.max(0, prevCount - (routes.length - updatedRoutes.length))
    );
  };

  return (
    <RouteListPage
      title="Minhas Rotas"
      routes={routes}
      loading={loading}
      error={error}
      showDeleteButton={true}
      showSearchFilter={true}
      showOrderByButtons={true}
      showVoteButtons={true}
      enableInfiniteScroll={true}
      enableServerSideFiltering={true}
      onLoadMore={handleLoadMore}
      onFilterChange={handleFilterChange}
      onRoutesUpdate={handleRoutesUpdate}
      hasNextPage={hasNextPage}
      loadingMore={loadingMore}
      totalCount={totalCount}
      emptyStateMessage="Você ainda não criou nenhuma rota. Que tal criar a primeira?"
    />
  );
};

export default MyRoutesPage;
