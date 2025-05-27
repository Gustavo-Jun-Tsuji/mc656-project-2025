import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import RouteCard from "../components/RouteCard";
import Header from "../components/Header";
import "../styles/MyRoutesPage.css";

const MyRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyRoutes = async () => {
      try {
        setLoading(true);
        const response = await api.getMyRoutes();
        setRoutes(response.data.results || response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching my routes:", err);
        setError("Failed to load your routes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRoutes();
  }, []);

  return (
    <div className="page-container">
      <Header />
      <div className="content-container">
        <div className="page-header">
          <h1>My Routes</h1>
          <p>View and manage all your created routes</p>
          {user && <p className="welcome-message">Welcome, {user.username}!</p>}
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading your routes...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="routes-container">
            {routes.length > 0 ? (
              routes.map((route) => <RouteCard key={route.id} route={route} />)
            ) : (
              <div className="no-routes-container">
                <p>You haven't created any routes yet.</p>
                <Link to="/routes/create" className="create-route-link">
                  Create Your First Route
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="actions-container">
          <Link to="/routes/create" className="action-button create-button">
            Create New Route
          </Link>
          <Link to="/" className="action-button secondary-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyRoutesPage;
