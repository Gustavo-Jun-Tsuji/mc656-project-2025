import React, { useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { Label } from "./ui/label";

const ImageUpload = ({
  label = "",
  onChange,
  value = null,
  className = "",
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(
    value && typeof value === "object" && "url" in value ? value.url : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Call the parent onChange handler with the file
    if (onChange) onChange(file);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange(null);
  };

  return (
    <div className={`${className}`}>
      <Label className="text-navy-700 font-medium">{label}</Label>
      <div
        className="w-full h-28 border border-primary-dark rounded-md cursor-pointer relative overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm z-10"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-primary-dark w-full h-full">
            <ImageIcon />
            <span className="text-xs text-center">Selecione uma imagem</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
