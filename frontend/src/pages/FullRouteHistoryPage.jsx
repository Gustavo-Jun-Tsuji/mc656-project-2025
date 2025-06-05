import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouteListPage from "./RouteListPage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import routeHistoryService from "../services/routeHistoryService";

const FullRouteHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const fullHistory = await routeHistoryService.getHistory();
        // Format data with ALL required fields
        const formattedHistory = fullHistory.map(entry => ({
          id: entry.route_id,
          title: entry.title || "Rota sem título",
          description: entry.description || "",
          starting_location: entry.starting_location || "Origem não especificada",
          ending_location: entry.ending_location || "Destino não especificado",
          created_at: entry.viewed_at,
          viewed_at: entry.viewed_at,
          distance: entry.distance || 0,
          upvotes_count: entry.upvotes_count || 0,
          downvotes_count: entry.downvotes_count || 0,
          user_vote: entry.user_vote || null,
          coordinates: entry.coordinates || [],
          user: entry.user || { username: "" }
        }));
        setHistory(formattedHistory);
      } catch (error) {
        console.error("Error fetching full history:", error);
        setError("Não foi possível carregar o histórico completo");
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

  // Pass HistoryHeader as customHeader instead of wrapping the whole component
  const HistoryHeader = (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => navigate('/route-history')}
      >
        <ArrowLeft size={18} />
        <span>Voltar</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-2"
        onClick={handleClearHistory}
      >
        <Trash2 size={18} />
        <span>Limpar histórico</span>
      </Button>
    </div>
  );

  return (
    <RouteListPage
      title="Histórico Completo de Rotas"
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

export default FullRouteHistoryPage;