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
  const [error, setError] = useState(null);

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

  // Fetch routes based on selected category
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchTerm = searchParams.get("search") || "";
        const orderBy = getCategoryOrderBy(category);

        const response = await api.searchRoutes(searchTerm, orderBy);
        setRoutes(response.data.results || response.data || []);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Falha ao carregar rotas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [category, searchParams]);

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", newCategory);
    setSearchParams(newParams);
  };

  // Custom header with category tabs
  const customHeader = (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Tabs
          defaultValue={category}
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              <span>Em Alta</span>
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>Mais Curtidas</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
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
      showResultsCount={false}
      showVoteButtons={true}
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
