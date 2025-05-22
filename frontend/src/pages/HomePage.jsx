import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import api from "../api";

const HomePage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await api.getAllRoutes();
        let data = response.data.results ?? response.data;
        if (!Array.isArray(data)) {
          data = [];
        }
        setRoutes(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching routes:", error);
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <>
      <Header />
      <div className="home-page">
        <div className="content">
          <div className="header-actions">
            <h1>My Routes</h1>
            <Link to="/routes/create" className="create-btn">
              Create New Route
            </Link>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="routes-list">
              {routes.length === 0 ? (
                <p>No routes found. Create your first route!</p>
              ) : (
                routes.map((route) => (
                  <div key={route.id} className="route-card">
                    <h3>{route.title}</h3>
                    <p>{route.description}</p>
                    <div className="route-details">
                      <span>
                        From: {route.starting_location || "Not specified"}
                      </span>
                      <span>
                        To: {route.ending_location || "Not specified"}
                      </span>
                      <span>
                        Distance: {route.distance?.toFixed(2) || "0"} km
                      </span>
                    </div>
                    <Link to={`/routes/${route.id}`} className="view-btn">
                      View Details
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
