import React, { useState } from "react";
import TAG_OPTIONS from "../tags";
import "../styles/Tags.css";

const TagSelector = ({ selectedTags, setSelectedTags, placeholder }) => {
  const [search, setSearch] = useState("");
  const filteredOptions = TAG_OPTIONS.filter(
    tag =>
      tag.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleSelect = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setSearch("");
  };

  const handleRemove = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
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
    <div style={{ position: 'relative' }}>
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
        onChange={e => setSearch(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{ marginBottom: "0.3em" }}
      />
      {search && (
        <div className="tag-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(tag => (
            <div
              key={tag}
              onClick={() => handleSelect(tag)}
              className="tag-dropdown-option"
              onMouseDown={e => e.preventDefault()} // evita perder foco do input
            >
              {highlightMatch(tag, search)}
            </div>
          ))
          ) : (
            <div className="tag-dropdown-empty">Nenhuma tag encontrada</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;