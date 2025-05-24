import React from "react";
import PropTypes from "prop-types";
import { MapPin, Ruler, Timer } from "lucide-react";
import { Label } from "../ui/label";

export default function MapFooter({ points, distance, eta }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 text-sm gap-6">
      <span className="flex items-center gap-1">
        <MapPin className="w-4 h-4 text-primary-dark" />
        <Label>Pontos:</Label>
        <span>{points}</span>
      </span>
      <span className="flex items-center gap-1">
        <Ruler className="w-4 h-4 text-primary-dark" />
        <Label>Distância:</Label>
        <span>{distance} km</span>
      </span>
      <span className="flex items-center gap-1">
        <Timer className="w-4 h-4 text-primary-dark" />
        <Label>ETA</Label>
        <span>{eta}</span>
      </span>
    </div>
  );
}

MapFooter.propTypes = {
  points: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  eta: PropTypes.string.isRequired,
};
