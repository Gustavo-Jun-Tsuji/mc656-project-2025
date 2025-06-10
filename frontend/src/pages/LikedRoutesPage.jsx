import React, { useState, useEffect } from "react";
import { api } from "@/api";
import RouteListPage from "./RouteListPage";

const LikedRoutesPage = () => {
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
    fetchLikedRoutes();
  }, []);

  const fetchLikedRoutes = async (
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

      const response = await api.getLikedRoutes(page, search, orderBy);
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
      setError("Erro ao carregar rotas curtidas");
      console.error("Erro ao buscar rotas curtidas:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      fetchLikedRoutes(currentPage + 1, currentSearch, currentOrderBy, false);
    }
  };

  const handleFilterChange = (search, orderBy) => {
    // Reset to page 1 when filters change
    setRoutes([]);
    setCurrentPage(1);
    fetchLikedRoutes(1, search, orderBy, true);
  };

  const handleRoutesUpdate = (updatedRoutes) => {
    setRoutes(updatedRoutes);
    // Update total count if routes were modified
    setTotalCount((prevCount) =>
      Math.max(0, prevCount - (routes.length - updatedRoutes.length))
    );
  };

  return (
    <RouteListPage
      title="Rotas Curtidas"
      routes={routes}
      loading={loading}
      error={error}
      showDeleteButton={false} // Users shouldn't be able to delete other people's routes
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
      emptyStateMessage="Você ainda não curtiu nenhuma rota. Explore e encontre rotas interessantes!"
    />
  );
};

export default LikedRoutesPage;
