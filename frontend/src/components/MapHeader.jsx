import React from "react";
import PropTypes from "prop-types";

const MapHeader = ({ pathCoordinates, distance, readOnly }) => {
  const getHeaderMessage = () => {
    if (pathCoordinates.length > 0) {
      return `${pathCoordinates.length} pontos no caminho • Distância: ${distance} km`;
    }

    if (readOnly) {
      return "Não há caminho para mostrar";
    }

    return "Desenhe o caminho com as ferramentas à direita →";
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
      }}
    >
      <span style={{ marginLeft: "10px" }}>{getHeaderMessage()}</span>
    </div>
  );
};

MapHeader.propTypes = {
  pathCoordinates: PropTypes.arrayOf(PropTypes.object),
  distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
};

export default MapHeader;
