import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MapComponent from "../components/map/MapComponent";
import api from "../api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  MapPin,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

const RouteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState({
    title: "",
    description: "",
    starting_location: "",
    ending_location: "",
    coordinates: [],
    distance: 0,
    created_at: "",
    image: null,
    tags: [],
    username: "",
    upvotes_count: 0,
    downvotes_count: 0,
    user_vote: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const response = await api.getRoute(id);
        const data = response.data;
        setRouteData(data);

        await api.addToHistory(id);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching route:", err);
        setError("Failed to load route details");
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page instead of home
  };

  const handleVote = async (voteType) => {
    if (voteLoading) return;

    try {
      setVoteLoading(true);
      const response = await api.voteRoute(id, voteType);

      setRouteData((prev) => ({
        ...prev,
        upvotes_count: response.data.upvotes_count,
        downvotes_count: response.data.downvotes_count,
        user_vote: response.data.user_vote,
      }));
    } catch (err) {
      console.error("Error voting:", err);
    } finally {
      setVoteLoading(false);
    }
  };

  // Use useMemo to stabilize the center coordinates
  const centerCoordinates = useMemo(() => {
    return routeData.coordinates && routeData.coordinates.length > 0
      ? routeData.coordinates[0]
      : [-22.817166, -47.069806];
  }, [routeData.coordinates]);

  // Format date for display
  const formattedDate = useMemo(() => {
    if (!routeData.created_at) return "";
    return new Date(routeData.created_at).toLocaleDateString();
  }, [routeData.created_at]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light flex items-center justify-center pt-20">
          <div className="text-xl">Carregando...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light flex items-center justify-center pt-20">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light flex flex-col pt-20">
        <div className="flex flex-col rounded-3xl shadow-2xl p-[80px] pt-[30px] pb-[30px] w-4/5 mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-secondary-dark text-xl h-12"
              onClick={handleBack}
            >
              <ArrowLeft className="w-6 h-6" />
              Voltar
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex gap-[50px] h-[600px]">
            {/* Details Section */}
            <div className="flex-1">
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-full overflow-y-auto">
                <div className="space-y-6">
                  {/* Route Image or Placeholder - Same as ExpandedRouteCard */}
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                    {routeData.image ? (
                      <img
                        src={routeData.image}
                        alt={routeData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center text-gray-400">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm font-medium">Sem imagem</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title and Description - Similar to ExpandedRouteCard */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h1 className="font-semibold text-2xl text-secondary-dark">
                        {routeData.title}
                      </h1>

                      {/* Voting section */}
                      <div className="flex gap-2 ml-6">
                        <button
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                            routeData.user_vote === "upvote"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-white border-gray-300 text-gray-600 hover:bg-green-50"
                          }`}
                          onClick={() => handleVote("upvote")}
                          disabled={voteLoading}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {routeData.upvotes_count || 0}
                          </span>
                        </button>
                        <button
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                            routeData.user_vote === "downvote"
                              ? "bg-red-100 border-red-300 text-red-700"
                              : "bg-white border-gray-300 text-gray-600 hover:bg-red-50"
                          }`}
                          onClick={() => handleVote("downvote")}
                          disabled={voteLoading}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {routeData.downvotes_count || 0}
                          </span>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-base leading-relaxed">
                      {routeData.description || "Sem descrição"}
                    </p>
                  </div>

                  {/* Origin to Destination - Same as ExpandedRouteCard */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {routeData.starting_location || "Origem"}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span className="font-medium">
                        {routeData.ending_location || "Destino"}
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-dark mb-2">
                        Criado em
                      </h3>
                      <p className="text-gray-700">
                        {formattedDate || "Data não disponível"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-secondary-dark mb-2">
                        Criado por
                      </h3>
                      <p className="text-gray-700">
                        {routeData.username || "Usuário desconhecido"}
                      </p>
                    </div>
                  </div>

                  {/* Tags - Same style as ExpandedRouteCard */}
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-dark mb-2">
                      Tags
                    </h3>
                    {routeData.tags && routeData.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {routeData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-primary-light text-secondary-dark px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700">Sem tags</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section - Same height as details */}
            <div className="flex-1">
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow h-full">
                <MapComponent
                  coordinates={routeData.coordinates || []}
                  center={centerCoordinates}
                  zoom={16}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteDetailsPage;
