import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import ImageUpload from "../components/ImageUpload";
import TagSelector from "../components/TagSelector";

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
    <form className="max-w-xl mx-auto p-6 rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Label htmlFor="route-name" className="text-xl">
            Nome da Rota
          </Label>
          <span className="text-xs text-gray-500">
            {formData.title.length}/40
          </span>
        </div>
        <Input
          id="route-name"
          name="title"
          maxLength={40}
          value={formData.title}
          onChange={handleChange}
          className="!text-xl"
        />
      </div>

      <div className="flex gap-6 mb-6 items-center">
        <div className="flex flex-col flex-1 gap-4">
          <div>
            <Label htmlFor="route-start">Início da Rota</Label>
            <Input
              id="route-start"
              name="starting_location"
              value={formData.starting_location}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="route-end">Fim da Rota</Label>
            <Input
              id="route-end"
              name="ending_location"
              value={formData.ending_location}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-w-[120px] h-full">
          <Label htmlFor="route-end">Fim da Rota</Label>
          <ImageUpload
            onChange={handleImageChange}
            value={formData.image}
            className="w-full"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Label htmlFor="route-description" className="text-xl">
            Descrição da Rota
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
        />
      </div>
      <div className="mb-8">
        <Label htmlFor="route-description">Tags</Label>
        <TagSelector
          selectedTags={formData.tags}
          setSelectedTags={(tags) => setFormData({ ...formData, tags })}
        />
      </div>
    </form>
  );
}
