import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import "../styles/RouteCard.css";

const RouteCard = ({ route, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Format the creation date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Format distance to show in km with 1 decimal place
  const formatDistance = (distance) => {
    if (distance === null || distance === undefined) return "Unknown";
    return `${distance.toFixed(1)} km`;
  };

  // Handle delete button click
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        setIsDeleting(true);
        await api.deleteRoute(route.id);
        if (onDelete) onDelete(route.id);
      } catch (error) {
        console.error("Error deleting route:", error);
        alert("Failed to delete route. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="route-card">
      <div className="route-card-image">
        {route.image ? (
          <img src={route.image} alt={route.title} />
        ) : (
          <div className="route-card-no-image">No Image</div>
        )}
      </div>

      <div className="route-card-content">
        <h3 className="route-card-title">{route.title}</h3>

        <div className="route-card-metadata">
          <div className="route-card-metadata-item">
            <span className="route-card-metadata-label">Distance:</span>
            <span className="route-card-metadata-value">
              {formatDistance(route.distance)}
            </span>
          </div>

          <div className="route-card-metadata-item">
            <span className="route-card-metadata-label">Created:</span>
            <span className="route-card-metadata-value">
              {formatDate(route.created_at)}
            </span>
          </div>
        </div>

        <p className="route-card-description">
          {route.description
            ? route.description.length > 100
              ? `${route.description.substring(0, 100)}...`
              : route.description
            : "No description provided"}
        </p>

        <div className="route-card-locations">
          <div className="route-card-location">
            <span className="route-card-location-label">From:</span>
            <span className="route-card-location-value">
              {route.starting_location || "Not specified"}
            </span>
          </div>

          <div className="route-card-location">
            <span className="route-card-location-label">To:</span>
            <span className="route-card-location-value">
              {route.ending_location || "Not specified"}
            </span>
          </div>
        </div>

        {route.tags && route.tags.length > 0 && (
          <div className="route-card-tags">
            {route.tags.map((tag, index) => (
              <span key={index} className="route-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="route-card-actions">
        <Link
          to={`/routes/${route.id}`}
          className="route-card-button view-button"
        >
          View Details
        </Link>
        <button
          onClick={handleDelete}
          className="route-card-button delete-button"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default RouteCard;
