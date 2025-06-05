import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouteListPage from "./RouteListPage";
import { Button } from "@/components/ui/button";
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
        const recentHistory = await routeHistoryService.getRecentHistory(20);
        // Format data to match the expected structure for RouteListPage with ALL required fields
        const formattedHistory = recentHistory.map(entry => ({
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

  // Add a custom footer component with "See More" button
  const HistoryFooter = () => (
    <div className="flex justify-center mt-8">
      <Button 
        onClick={() => navigate('/route-history-full')}
        variant="outline"
        className="border-primary-dark text-primary-dark hover:bg-primary-light"
      >
        Ver histórico completo
      </Button>
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
      footer={history.length >= 20 ? <HistoryFooter /> : null}
    />
  );
};

export default RouteHistoryPage;