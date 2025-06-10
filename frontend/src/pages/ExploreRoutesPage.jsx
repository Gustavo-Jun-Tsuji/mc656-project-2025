import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RouteListPage from "./RouteListPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, ThumbsUp, Clock, Compass } from "lucide-react";
import { api } from "@/api";

const ExploreRoutesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentOrderBy, setCurrentOrderBy] = useState("trending");

  // Get category from URL params or default to "trending"
  const category = searchParams.get("category") || "trending";

  // Map category to order_by parameter for API
  const getCategoryOrderBy = (cat) => {
    switch (cat) {
      case "liked":
        return "liked";
      case "recent":
        return "-created_at";
      case "trending":
      default:
        return "trending";
    }
  };

  // Fetch routes based on selected category and filters
  useEffect(() => {
    const orderBy = getCategoryOrderBy(category);
    const searchTerm = searchParams.get("search") || "";

    // Reset routes when category changes
    setRoutes([]);
    setCurrentPage(1);
    setCurrentSearch(searchTerm);
    setCurrentOrderBy(orderBy);

    fetchRoutes(1, searchTerm, orderBy, true);
  }, [category, searchParams]);

  const fetchRoutes = async (
    page = 1,
    search = "",
    orderBy = "trending",
    reset = true
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
      console.error("Error fetching routes:", err);
      setError("Falha ao carregar rotas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      fetchRoutes(currentPage + 1, currentSearch, currentOrderBy, false);
    }
  };

  const handleFilterChange = (search, orderBy) => {
    // Reset to page 1 when filters change
    setRoutes([]);
    setCurrentPage(1);
    fetchRoutes(1, search, orderBy, true);
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", newCategory);

    // Reset search when changing categories
    newParams.delete("search");

    setSearchParams(newParams);
  };

  // Custom header with banner and category selection
  const customHeader = (
    <div className="space-y-6">
      {/* Banner Title */}
      <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white border-0 shadow-lg">
        <CardContent className="py-8 px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="h-12 w-12 text-blue-200" />
            <h1 className="text-4xl font-bold tracking-tight">
              Explorar Rotas
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Descubra as rotas mais incríveis, populares e recentes da comunidade
          </p>
        </CardContent>
      </Card>

      {/* Category Selection */}
      <Card className="shadow-md">
        <CardContent className="py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Escolha uma Categoria
            </h2>
            <p className="text-gray-600">
              Explore diferentes tipos de rotas baseadas nas suas preferências
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Trending Button */}
            <Button
              variant={category === "trending" ? "default" : "outline"}
              size="lg"
              onClick={() => handleCategoryChange("trending")}
              disabled={loading || loadingMore}
              className={`h-24 flex flex-col items-center justify-center gap-3 text-lg font-medium transition-all duration-200 ${
                category === "trending"
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg scale-105"
                  : "border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 hover:scale-105"
              }`}
            >
              <Flame className="h-8 w-8" />
              <div>
                <div className="font-bold">Em Alta</div>
                <div className="text-sm opacity-80">Trending agora</div>
              </div>
            </Button>

            {/* Liked Button */}
            <Button
              variant={category === "liked" ? "default" : "outline"}
              size="lg"
              onClick={() => handleCategoryChange("liked")}
              disabled={loading || loadingMore}
              className={`h-24 flex flex-col items-center justify-center gap-3 text-lg font-medium transition-all duration-200 ${
                category === "liked"
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg scale-105"
                  : "border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:scale-105"
              }`}
            >
              <ThumbsUp className="h-8 w-8" />
              <div>
                <div className="font-bold">Mais Curtidas</div>
                <div className="text-sm opacity-80">Top favoritas</div>
              </div>
            </Button>

            {/* Recent Button */}
            <Button
              variant={category === "recent" ? "default" : "outline"}
              size="lg"
              onClick={() => handleCategoryChange("recent")}
              disabled={loading || loadingMore}
              className={`h-24 flex flex-col items-center justify-center gap-3 text-lg font-medium transition-all duration-200 ${
                category === "recent"
                  ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg scale-105"
                  : "border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:scale-105"
              }`}
            >
              <Clock className="h-8 w-8" />
              <div>
                <div className="font-bold">Recentes</div>
                <div className="text-sm opacity-80">Últimas adicionadas</div>
              </div>
            </Button>
          </div>

          {/* Category Description */}
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 font-medium">
              {category === "trending" && (
                <>
                  <span className="text-orange-600">Rotas em Alta:</span> Rotas
                  populares com base na atividade recente da comunidade
                </>
              )}
              {category === "liked" && (
                <>
                  <span className="text-green-600">Mais Curtidas:</span> Rotas
                  com maior número de votos positivos dos usuários
                </>
              )}
              {category === "recent" && (
                <>
                  <span className="text-purple-600">Recentes:</span> As rotas
                  mais recentemente adicionadas à plataforma
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Route list title based on category
  const getTitle = () => {
    switch (category) {
      case "liked":
        return "Rotas Mais Curtidas";
      case "recent":
        return "Rotas Recentes";
      case "trending":
      default:
        return "Rotas em Alta";
    }
  };

  return (
    <RouteListPage
      title={getTitle()}
      routes={routes}
      loading={loading}
      error={error}
      showTitle={false}
      showResultsCount={true}
      showVoteButtons={true}
      showSearchFilter={false}
      showOrderByButtons={false}
      enableInfiniteScroll={true}
      enableServerSideFiltering={true}
      onLoadMore={handleLoadMore}
      onFilterChange={handleFilterChange}
      hasNextPage={hasNextPage}
      loadingMore={loadingMore}
      totalCount={totalCount}
      customHeader={customHeader}
      emptyStateMessage={`Nenhuma rota ${
        category === "liked"
          ? "curtida"
          : category === "recent"
          ? "recente"
          : "em alta"
      } encontrada`}
    />
  );
};

export default ExploreRoutesPage;
