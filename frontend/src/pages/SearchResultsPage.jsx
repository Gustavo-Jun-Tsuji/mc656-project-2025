import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "@/api";
import RouteListPage from "./RouteListPage";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("q") || "";

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState(searchQuery);
  const [currentOrderBy, setCurrentOrderBy] = useState("-created_at"); // Use backend-compatible default

  useEffect(() => {
    if (searchQuery) {
      setRoutes([]);
      setCurrentPage(1);
      setCurrentSearch(searchQuery);
      fetchSearchResults(1, searchQuery, currentOrderBy, true);
    } else {
      setLoading(false);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (
    page = 1,
    search = "",
    orderBy = "-created_at",
    reset = false
  ) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const response = await api.searchRoutes(page, search, orderBy);
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
      setError("Erro ao buscar rotas");
      console.error("Erro ao buscar rotas:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      fetchSearchResults(currentPage + 1, currentSearch, currentOrderBy, false);
    }
  };

  const handleFilterChange = (search, orderBy) => {
    setRoutes([]);
    setCurrentPage(1);
    fetchSearchResults(1, search, orderBy, true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!searchQuery) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum termo de busca fornecido.
            </p>
            <Button onClick={handleGoBack} variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <RouteListPage
        title={`Resultados para "${searchQuery}"`}
        routes={routes}
        loading={loading}
        error={error}
        showSearchFilter={false}
        showOrderByButtons={true}
        showVoteButtons={true}
        enableInfiniteScroll={true}
        enableServerSideFiltering={true}
        onLoadMore={handleLoadMore}
        onFilterChange={handleFilterChange}
        hasNextPage={hasNextPage}
        loadingMore={loadingMore}
        totalCount={totalCount}
        emptyStateMessage={`Nenhuma rota encontrada para "${searchQuery}". Tente usar termos diferentes.`}
        customHeader={
          <div className="mb-4">
            <Button onClick={handleGoBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SearchResultsPage;
