import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RouteListPage from "./RouteListPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, ThumbsUp, Clock } from "lucide-react";
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

  // Custom header with category tabs
  const customHeader = (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Tabs
          value={category}
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger
              value="trending"
              className="flex items-center gap-2"
              disabled={loading || loadingMore}
            >
              <Flame className="h-4 w-4" />
              <span>Em Alta</span>
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="flex items-center gap-2"
              disabled={loading || loadingMore}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Mais Curtidas</span>
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="flex items-center gap-2"
              disabled={loading || loadingMore}
            >
              <Clock className="h-4 w-4" />
              <span>Recentes</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-center text-sm text-gray-600 mt-3">
          {category === "trending" &&
            "Rotas populares com base na atividade recente"}
          {category === "liked" && "Rotas com mais votos positivos"}
          {category === "recent" && "Rotas mais recentemente adicionadas"}
        </div>
      </CardContent>
    </Card>
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
      showOrderByButtons={false} // Disable order buttons since categories handle ordering
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
