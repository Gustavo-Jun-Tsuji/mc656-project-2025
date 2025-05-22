import React, { useState } from "react";
import TAG_OPTIONS from "../tags";
import "../styles/Tags.css";
import PropTypes from "prop-types";

const TagSelector = ({ selectedTags, setSelectedTags, placeholder }) => {
  const [search, setSearch] = useState("");
  const filteredOptions = TAG_OPTIONS.filter(
    (tag) =>
      tag.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleSelect = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setSearch("");
  };

  const handleRemove = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const highlightMatch = (tag, search) => {
    if (!search) return tag;
    const index = tag.toLowerCase().indexOf(search.toLowerCase());
    if (index === -1) return tag;
    return (
      <>
        {tag.slice(0, index)}
        <strong>{tag.slice(index, index + search.length)}</strong>
        {tag.slice(index + search.length)}
      </>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="tags-list">
        {selectedTags.map((tag, index) => (
          <span key={index} className="tag-pill">
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="tag-remove-btn"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{ marginBottom: "0.3em" }}
      />
      {search && (
        <div className="tag-dropdown" role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelect(tag)}
                className="tag-dropdown-option"
                onMouseDown={(e) => e.preventDefault()} // evita perder foco do input
                type="button"
                role="option"
                tabIndex={0}
              >
                {highlightMatch(tag, search)}
              </button>
            ))
          ) : (
            <div className="tag-dropdown-empty" role="status">
              Nenhuma tag encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
};

TagSelector.propTypes = {
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  setSelectedTags: PropTypes.func,
  placeholder: PropTypes.string,
};

export default TagSelector;
