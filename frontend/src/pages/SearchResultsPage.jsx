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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.searchRoutes(searchQuery);
      setRoutes(response.data.results || response.data || []);
    } catch (err) {
      setError("Erro ao buscar rotas");
      console.error("Erro ao buscar rotas:", err);
    } finally {
      setLoading(false);
    }
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
      {/* Back Button */}
      <div className="absolute top-6 left-4 z-10">
        <Button
          onClick={handleGoBack}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <RouteListPage
        title={`Resultados para "${searchQuery}"`}
        routes={routes}
        loading={loading}
        error={error}
        showSearchFilter={false}
        showFilterByButtons={true}
        emptyStateMessage={`Nenhuma rota encontrada para "${searchQuery}". Tente usar termos diferentes.`}
      />
    </div>
  );
};

export default SearchResultsPage;
