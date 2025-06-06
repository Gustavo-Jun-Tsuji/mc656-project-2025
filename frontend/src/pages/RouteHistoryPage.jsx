import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouteListPage from "./RouteListPage";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import routeHistoryService from "../services/routeHistoryService";

const RouteHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Get all history, not just recent
        const fullHistory = await routeHistoryService.getHistory();
        // Format data to match the expected structure for RouteListPage with ALL required fields
        const formattedHistory = fullHistory.map(entry => ({
          id: entry.route_id,
          title: entry.title || "Rota sem título",
          description: entry.description || "",
          starting_location: entry.starting_location || "Origem não especificada",
          ending_location: entry.ending_location || "Destino não especificado",
          created_at: entry.viewed_at, // Use view time for date sorting
          viewed_at: entry.viewed_at,
          distance: entry.distance || 0,
          upvotes_count: entry.upvotes_count || 0, // Required for "liked" sorting
          downvotes_count: entry.downvotes_count || 0,
          user_vote: entry.user_vote || null,
          coordinates: entry.coordinates || [],
          user: entry.user || { username: "" }
        }));
        setHistory(formattedHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Não foi possível carregar o histórico de rotas");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
      try {
        await routeHistoryService.clearHistory();
        setHistory([]);
      } catch (error) {
        console.error("Error clearing history:", error);
        alert('Erro ao limpar o histórico. Tente novamente.');
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
      showOrderByButtons={true}
      emptyStateMessage="Você ainda não visualizou nenhuma rota"
      customHeader={HistoryHeader}
    />
  );
};

export default RouteHistoryPage;