import React from "react";

const MapHeader = ({ pathCoordinates, distance, readOnly }) => {
  return (
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
          : "Desenhe o caminho com as ferramentas à direita →"}
      </span>
    </div>
  );
};

export default MapHeader;
