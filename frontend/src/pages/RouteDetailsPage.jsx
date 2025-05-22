import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MapComponent from "../components/MapComponent";
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <dt>Criado em:</dt>
                <dd>{formattedDate || "Data não disponível"}</dd>
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
