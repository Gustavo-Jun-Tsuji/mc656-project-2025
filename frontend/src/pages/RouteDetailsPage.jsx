import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MapComponent from "../components/map/MapComponent";
import api from "../api";
import "../styles/RouteDetailsPage.css";

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
    user_vote: null
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
      
      setRouteData(prev => ({
        ...prev,
        upvotes_count: response.data.upvotes_count,
        downvotes_count: response.data.downvotes_count,
        user_vote: response.data.user_vote
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

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="page-container route-details-page">
        <h2 className="page-title">Detalhes da Rota</h2>

        <div className="side-by-side-container">
          {/* Details Section */}
          <div className="details-section">
            {/* Display route image if available */}
            {routeData.image && (
              <div className="route-image-container">
                <img
                  src={routeData.image}
                  alt={`Imagem da rota ${routeData.title}`}
                  className="route-image"
                />
              </div>
            )}

            <dl className="details-list">
              <div className="detail-item">
                <dt>Título:</dt>
                <dd>{routeData.title}</dd>
              </div>

              <div className="detail-item">
                <dt>Descrição:</dt>
                <dd className="description">
                  {routeData.description || "Sem descrição"}
                </dd>
              </div>

              <div className="detail-item voting-section">
                <dt>Avaliação:</dt>
                <dd className="votes-container">
                  <button 
                    className={`vote-btn upvote ${routeData.user_vote === "upvote" ? "active" : ""}`}
                    onClick={() => handleVote("upvote")}
                    disabled={voteLoading}
                  >
                    👍 {routeData.upvotes_count || 0}
                  </button>
                  <button 
                    className={`vote-btn downvote ${routeData.user_vote === "downvote" ? "active" : ""}`}
                    onClick={() => handleVote("downvote")}
                    disabled={voteLoading}
                  >
                    👎 {routeData.downvotes_count || 0}
                  </button>
                </dd>
              </div>

              <div className="detail-item">
                <dt>Local de início:</dt>
                <dd>{routeData.starting_location || "Não especificado"}</dd>
              </div>

              <div className="detail-item">
                <dt>Local de término:</dt>
                <dd>{routeData.ending_location || "Não especificado"}</dd>
              </div>

              <div className="detail-item">
                <dt>Distância:</dt>
                <dd>
                  {routeData.distance
                    ? `${routeData.distance.toFixed(2)} km`
                    : "Não calculada"}
                </dd>
              </div>

              <div className="detail-item">
                <dt>Duração estimada:</dt>
                <dd>
                  {routeData.distance
                    ? `${Math.round(routeData.distance * 12)} min`
                    : "Não calculada"}
                </dd>
              </div>

              <div className="detail-item">
                <dt>Criado em:</dt>
                <dd>{formattedDate || "Data não disponível"}</dd>
              </div>

              {/* Add author information here */}
              <div className="detail-item">
                <dt>Criado por:</dt>
                <dd>{routeData.username || "Usuário desconhecido"}</dd>
              </div>

              <div className="detail-item">
                <dt>Tags:</dt>
                <dd>
                  {routeData.tags && routeData.tags.length > 0 ? (
                    <div className="tags-list">
                      {routeData.tags.map((tag, index) => (
                        <span key={index} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Sem tags"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Map Section */}
          <div className="map-section">
            {console.log(routeData.coordinates, centerCoordinates)}
            <MapComponent
              coordinates={routeData.coordinates || []}
              center={centerCoordinates}
              zoom={16}
              readOnly={true}
            />
          </div>
        </div>

        <div className="buttons">
          <button className="btn back" onClick={handleBack}>
            VOLTAR
          </button>
        </div>
      </div>
    </>
  );
};

export default RouteDetailsPage;