import { useEffect, useRef, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Polyline,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import MapHeader from "./MapHeader";
import MapFooter from "./MapFooter";

// Fix Leaflet's default icon path issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import PropTypes from "prop-types";

// Set up the default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const startIcon = new L.Icon({
  iconUrl:
    "https://img.icons8.com/?size=100&id=Oy6rGo29AK6S&format=png&color=000000",
  iconSize: [40, 40],
  iconAnchor: [20, 34],
});

const endIcon = new L.Icon({
  iconUrl:
    "https://img.icons8.com/?size=100&id=8W4MiLVFCP1e&format=png&color=000000",
  iconSize: [40, 40],
  iconAnchor: [15, 37],
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
          polyline: {
            shapeOptions: {
              weight: 4,
            },
            metric: true,
            feet: false,
            showLength: true,
            icon: new L.Icon({
              iconUrl:
                "https://img.icons8.com/?size=100&id=30567&format=png&color=000000",
              iconSize: [30, 30],
              iconAnchor: [15, 25],
            }),
          },
        },
        edit: {
          featureGroup: featGroupRef.current,
          poly: {
            // Personalização dos marcadores durante a edição
            icon: new L.DivIcon({
              iconSize: new L.Point(8, 8),
              className:
                "leaflet-div-icon leaflet-editing-icon custom-vertex-icon",
            }),
          },
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
      map.on(L.Draw.Event.EDITED, (e) => {
        const layers = e.layers;
        layers.eachLayer((layer) => {
          if (layer instanceof L.Polyline) {
            const coordinates = layer
              .getLatLngs()
              .map((point) => [point.lat, point.lng]);
            if (onCreated) {
              onCreated({ layer, coordinates });
            }
          }
        });
      });

      map.on(L.Draw.Event.DELETED, (e) => {
        // Se todos os pontos foram removidos, envie uma array vazia
        if (onCreated) {
          onCreated({ coordinates: [] });
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

DrawControl.propTypes = {
  onCreated: PropTypes.func,
};

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

    return Number((totalDistance / 1000).toFixed(2));
  }, [pathCoordinates]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Usando o componente MapHeader extraído */}
      <MapHeader readOnly={readOnly} />

      {/* Container do mapa com altura explícita */}
      <div style={{ height: "500px", width: "100%" }} className="flex-1">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => {
            // Força o redimensionamento do mapa após renderização
            setTimeout(() => {
              mapInstance.invalidateSize();
            }, 100);
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Show either draw controls or just the polyline depending on readOnly */}
          {!readOnly ? (
            <>
              <DrawControl onCreated={handleCreated} />
              {pathCoordinates.length >= 2 && (
                <>
                  <Marker position={pathCoordinates[0]} icon={startIcon} />
                  <Marker
                    position={pathCoordinates[pathCoordinates.length - 1]}
                    icon={endIcon}
                  />
                </>
              )}
            </>
          ) : (
            pathCoordinates.length >= 2 && (
              <>
                <Polyline positions={pathCoordinates} color="blue" weight={5} />
                <Marker position={pathCoordinates[0]} icon={startIcon} />
                <Marker
                  position={pathCoordinates[pathCoordinates.length - 1]}
                  icon={endIcon}
                />
              </>
            )
          )}
        </MapContainer>
      </div>
      <MapFooter
        points={pathCoordinates.length}
        distance={distance}
        eta={distance > 0 ? `${Math.round((distance / 5) * 60)} min` : "--"}
      />
    </div>
  );
};

MapComponent.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  setCoordinates: PropTypes.func,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  readOnly: PropTypes.bool,
};

export default MapComponent;
