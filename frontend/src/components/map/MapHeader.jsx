import React from "react";
import PropTypes from "prop-types";

const MapHeader = ({ readOnly }) => {
  const getHeaderMessage = () => {
    if (readOnly) {
      return "Mapa:";
    }

    return "Desenhe o caminho com as ferramentas à direita →";
  };

  return (
    <div className="p-2 bg-white border-b border-gray-300 flex items-center">
      <span className="ml-2">{getHeaderMessage()}</span>
    </div>
  );
};

MapHeader.propTypes = {
  pathCoordinates: PropTypes.arrayOf(PropTypes.object),
  distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
};

export default MapHeader;
