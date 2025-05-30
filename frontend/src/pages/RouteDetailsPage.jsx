import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MapComponent from "../components/map/MapComponent";
import api from "../api";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

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
        console.log("Fetching route with ID:", id);
        const response = await api.getRoute(id);
        const data = response.data;
        console.log("Route data received:", data);
        setRouteData(data);
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
    navigate("/");
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
          {/* Conteúdo principal */}
          <div className="flex gap-[50px]">
            <div className="flex flex-col flex-1 items-center">
              {/* Details Section - Single Card */}
              <div className="flex flex-col h-full w-full">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                  {/* Display route image if available */}
                  {routeData.image && (
                    <div className="mb-6">
                      <img
                        src={routeData.image}
                        alt={`Imagem da rota ${routeData.title}`}
                        className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow"
                      />
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-dark mb-2">
                        Título
                      </h3>
                      <p className="text-gray-700">{routeData.title}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-secondary-dark mb-2">
                        Descrição
                      </h3>
                      <p className="text-gray-700">
                        {routeData.description || "Sem descrição"}
                      </p>
                    </div>

                    <div className="detail-item voting-section">
                      <dt>Avaliação:</dt>
                      <dd className="votes-container">
                        <button
                          className={`vote-btn upvote ${
                            routeData.user_vote === "upvote" ? "active" : ""
                          }`}
                          onClick={() => handleVote("upvote")}
                          disabled={voteLoading}
                        >
                          👍 {routeData.upvotes_count || 0}
                        </button>
                        <button
                          className={`vote-btn downvote ${
                            routeData.user_vote === "downvote" ? "active" : ""
                          }`}
                          onClick={() => handleVote("downvote")}
                          disabled={voteLoading}
                        >
                          👎 {routeData.downvotes_count || 0}
                        </button>
                      </dd>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-dark mb-2">
                          Local de início
                        </h3>
                        <p className="text-gray-700">
                          {routeData.starting_location || "Não especificado"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-secondary-dark mb-2">
                          Local de término
                        </h3>
                        <p className="text-gray-700">
                          {routeData.ending_location || "Não especificado"}
                        </p>
                      </div>
                    </div>

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

              <div className="mt-6">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-secondary-dark text-xl h-12 w-[250px]"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-8 h-8" />
                  Voltar
                </Button>
              </div>
            </div>

            {/* Map Section */}
            <div className="flex flex-col flex-1 items-center">
              <div className="w-full h-full flex flex-col justify-between">
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow flex-1 max-h-[530px]">
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
      </div>
    </>
  );
};

export default RouteDetailsPage;
