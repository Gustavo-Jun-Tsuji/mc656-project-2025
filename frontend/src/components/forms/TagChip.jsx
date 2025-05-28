import React from "react";
import PropTypes from "prop-types";

const TagChip = ({ tag, onRemove }) => (
  <span
    className="flex items-center bg-primary text-dark-dark px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-primary/20 transition-colors"
    onClick={() => onRemove(tag)}
    tabIndex={0}
    role="button"
    aria-label={`Remover ${tag}`}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onRemove(tag)}
  >
    {tag}
    <span className="ml-1 text-dark-dark">×</span>
  </span>
);

TagChip.propTypes = {
  tag: PropTypes.string,
  onRemove: PropTypes.func,
};

export default TagChip;
