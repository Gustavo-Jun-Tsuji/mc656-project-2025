import React from "react";
import "../styles/StatsDisplay.css";
import PropTypes from "prop-types";

const StatsDisplay = ({ coordinates }) => {
  // Calculate total distance
  const calculateTotalDistance = () => {
    if (!coordinates || coordinates.length < 2) return 0;

    let distance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const p1 = coordinates[i];
      const p2 = coordinates[i + 1];

      // Haversine formula
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(p2[0] - p1[0]);
      const dLon = toRad(p2[1] - p1[1]);
      const lat1 = toRad(p1[0]);
      const lat2 = toRad(p2[0]);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance += R * c;
    }

    return Number(distance).toFixed(2);
  };

  const distance = calculateTotalDistance();
  const walkingTime = (distance * 12).toFixed(0); // Rough estimate: 5km/h = 12 min/km

  return (
    <div className="stats-display">
      <h3>Route Statistics</h3>
      <div className="stats-item">
        <span>Total Distance:</span>
        <span>{distance} km</span>
      </div>
      <div className="stats-item">
        <span>Est. Walking Time:</span>
        <span>{walkingTime} min</span>
      </div>
      <div className="stats-item">
        <span>Points:</span>
        <span>{coordinates?.length || 0}</span>
      </div>
    </div>
  );
};

StatsDisplay.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

export default StatsDisplay;
