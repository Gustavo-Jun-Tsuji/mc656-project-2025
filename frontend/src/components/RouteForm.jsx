import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import ImageUpload from "./forms/ImageUpload";
import TagSelector from "./forms/TagSelector";

export default function RouteForm({ formData, setFormData }) {
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (file) => {
    setFormData({ ...formData, image: file });
  };

  return (
    <form className="w-full mx-auto rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Label htmlFor="route-name" className="text-2xl">
            Nome
          </Label>
          <span className="text-xs text-gray-500">
            {formData.title.length}/30
          </span>
        </div>
        <Input
          id="route-name"
          name="title"
          maxLength={30}
          value={formData.title}
          onChange={handleChange}
          className="!text-2xl h-[50px]"
        />
      </div>

      <div className="flex gap-20 mb-6 items-center w-full h-[200px]">
        <div className="flex flex-col flex-1 gap-10 h-full">
          <div>
            <Label htmlFor="route-start">Origem</Label>
            <Input
              id="route-start"
              name="starting_location"
              value={formData.starting_location}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="route-end">Destino</Label>
            <Input
              id="route-end"
              name="ending_location"
              value={formData.ending_location}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 h-full">
          <ImageUpload onChange={handleImageChange} value={formData.image} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Label htmlFor="route-description" className="text-2xl">
            Descrição
          </Label>
          <span className="text-xs text-gray-500">
            {formData.description.length}/200
          </span>
        </div>
        <Textarea
          id="route-description"
          name="description"
          maxLength={200}
          value={formData.description}
          onChange={handleChange}
          className="h-[100px]"
        />
      </div>
      <div>
        <Label htmlFor="route-description" className="text-2xl">
          Tags
        </Label>
        <TagSelector
          selectedTags={formData.tags}
          setSelectedTags={(tags) => setFormData({ ...formData, tags })}
        />
      </div>
    </form>
  );
}
