import React, { useState, useRef, useEffect } from "react";
import TAG_OPTIONS from "../../tags";
import PropTypes from "prop-types";
import TagChip from "./TagChip";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";

const TagSelector = ({
  selectedTags = [],
  setSelectedTags = () => {},
  placeholder = "",
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const filteredOptions = TAG_OPTIONS.filter(
    (tag) =>
      tag.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSelect = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setSearch("");
    setTimeout(() => {
      if (inputRef.current === document.activeElement) {
        setOpen(true);
      }
    }, 0);
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
        <span className="font-semibold text-primary-dark">
          {tag.slice(index, index + search.length)}
        </span>
        {tag.slice(index + search.length)}
      </>
    );
  };

  return (
    <div className="relative w-fit rounded-xl">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag, index) => (
          <TagChip key={index} tag={tag} onRemove={handleRemove} />
        ))}
      </div>
      <div className="relative">
        {!open ? (
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-5  0 border border-orange-300 text-orange-500 hover:bg-orange-200 transition"
            onClick={() => setOpen(true)}
            tabIndex={0}
            aria-label="Adicionar tag"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <Input
            ref={inputRef}
            type="text"
            value={search}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 100)}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredOptions.length > 0) {
                e.preventDefault();
                handleSelect(filteredOptions[0]);
              }
            }}
            placeholder={placeholder}
            className="w-[200px]"
          />
        )}
        {open && (
          <div className="absolute z-10 mt-1 w-[200px] bg-white border border-gray-200 rounded-md shadow-lg overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((tag) => (
                <button
                  key={tag}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(tag)}
                  className="w-full text-left px-4 py-2 hover:bg-primary/10 focus:bg-primary/20 transition-colors"
                  type="button"
                  role="option"
                  tabIndex={0}
                >
                  {highlightMatch(tag, search)}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                Nenhuma tag encontrada
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

TagSelector.propTypes = {
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  setSelectedTags: PropTypes.func,
  placeholder: PropTypes.string,
};

export default TagSelector;
