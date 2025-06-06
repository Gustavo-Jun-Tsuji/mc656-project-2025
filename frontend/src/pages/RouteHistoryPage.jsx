import React, { useState, useEffect } from "react";
import RouteListPage from "./RouteListPage";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { api } from "@/api";

const RouteHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.getRouteHistory();
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Não foi possível carregar o histórico de rotas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await api.clearHistory();
        setHistory([]);
      } catch (error) {
        console.error("Error clearing history:", error);
        alert("Erro ao limpar o histórico. Tente novamente.");
      }
    }
  };

  // Custom header with clear history button
  const HistoryHeader = (
    <div className="flex justify-end mb-4">
      {history.length > 0 && (
        <Button
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-2"
          onClick={handleClearHistory}
        >
          <Trash2 size={18} />
          <span>Limpar histórico</span>
        </Button>
      )}
    </div>
  );

  return (
    <RouteListPage
      title="Histórico de Rotas"
      routes={history}
      loading={loading}
      error={error}
      showSearchFilter={true}
      showOrderByButtons={false}
      emptyStateMessage="Você ainda não visualizou nenhuma rota"
      customHeader={HistoryHeader}
    />
  );
};

export default RouteHistoryPage;
