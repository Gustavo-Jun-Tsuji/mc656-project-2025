import { useEffect, useRef, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix Leaflet's default icon path issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Set up the default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom component to initialize the draw control
function DrawControl({ onCreated }) {
  const map = useMap();
  const featGroupRef = useRef(null);

  useEffect(() => {
    if (!map.drawControl && featGroupRef.current) {
      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          rectangle: false,
          circle: false,
          circlemarker: false,
          polygon: false,
          marker: false,
          polyline: true,
        },
        edit: {
          featureGroup: featGroupRef.current,
        },
      });

      map.addControl(drawControl);
      map.drawControl = drawControl;

      map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        if (featGroupRef.current) {
          featGroupRef.current.addLayer(layer);
        }

        // For polylines
        if (layer instanceof L.Polyline) {
          const coordinates = layer
            .getLatLngs()
            .map((point) => [point.lat, point.lng]);

          if (onCreated) {
            onCreated({ layer, coordinates });
          }
        }
      });
    }

    return () => {
      if (map.drawControl) {
        map.removeControl(map.drawControl);
        delete map.drawControl;
      }
    };
  }, [map, onCreated]);

  return (
    <FeatureGroup ref={featGroupRef}>
      {/* Layers added here will be available for editing */}
    </FeatureGroup>
  );
}

// Add center, zoom and readOnly props
const MapComponent = ({
  coordinates = [],
  setCoordinates = null,
  center = null,
  zoom = 13,
  readOnly = false,
}) => {
  // Use useMemo for initial state to avoid unnecessary re-renders
  const initialPathCoordinates = useMemo(() => coordinates, []);
  const [pathCoordinates, setPathCoordinates] = useState(
    initialPathCoordinates
  );

  // Use useMemo for map center to stabilize it
  const defaultCenter = useMemo(() => [51.505, -0.09], []);
  const [mapCenter, setMapCenter] = useState(center || defaultCenter);

  // Get user location if no center is provided - only runs once
  useEffect(() => {
    if (!center && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []); // Empty dependency array - only run once

  // Update local state when coordinates change from props
  // Using JSON.stringify to compare arrays for true equality
  useEffect(() => {
    const currentCoordinatesStr = JSON.stringify(pathCoordinates);
    const newCoordinatesStr = JSON.stringify(coordinates);

    if (currentCoordinatesStr !== newCoordinatesStr) {
      setPathCoordinates(coordinates);
    }
  }, [coordinates]);

  // When center prop changes, update state - but only if it's different
  useEffect(() => {
    if (center && (mapCenter[0] !== center[0] || mapCenter[1] !== center[1])) {
      setMapCenter(center);
    }
  }, [center]);

  // When drawing is created, update both local state and parent component
  const handleCreated = ({ coordinates }) => {
    setPathCoordinates(coordinates);
    if (setCoordinates) {
      setCoordinates(coordinates);
    }
  };

  // Calculate statistics for the path - memoize this calculation
  const distance = useMemo(() => {
    if (!pathCoordinates || pathCoordinates.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < pathCoordinates.length - 1; i++) {
      const point1 = L.latLng(pathCoordinates[i][0], pathCoordinates[i][1]);
      const point2 = L.latLng(
        pathCoordinates[i + 1][0],
        pathCoordinates[i + 1][1]
      );
      totalDistance += point1.distanceTo(point2);
    }

    return (totalDistance / 1000).toFixed(2); // Convert to km
  }, [pathCoordinates]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <span style={{ marginLeft: "10px" }}>
          {pathCoordinates.length > 0
            ? `${pathCoordinates.length} pontos no caminho • Distância: ${distance} km`
            : readOnly
            ? "Não há caminho para mostrar"
            : "Desenho o caminho com as ferramentas à direita →"}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Show either draw controls or just the polyline depending on readOnly */}
          {!readOnly ? (
            <DrawControl onCreated={handleCreated} />
          ) : (
            pathCoordinates.length >= 2 && (
              <Polyline positions={pathCoordinates} color="blue" weight={5} />
            )
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
