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
    console.log(formData);
  };

  const handleImageChange = (file) => {
    setFormData({ ...formData, image: file });
    console.log(formData);
  };

  return (
    <form className="max-w-xl mx-auto p-6 rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Label htmlFor="route-name" className="text-lg font-semibold">
            Nome da Rota
          </Label>
          <span className="text-xs text-gray-500">
            {formData.title.length}/30
          </span>
        </div>
        <Input
          id="route-name"
          name="title"
          placeholder="Nome da Rota"
          maxLength={30}
          value={formData.title}
          onChange={handleChange}
          className="bg-orange-50 border border-orange-300 focus:border-orange-400 focus:ring-0 rounded-xl mt-1"
        />
      </div>

      <div className="flex gap-6 mb-6 items-center">
        <div className="flex flex-col flex-1 gap-4">
          <div>
            <Label htmlFor="route-start" className="text-base">
              Início da Rota
            </Label>
            <Input
              id="route-start"
              name="starting_location"
              placeholder="Início da Rota"
              value={formData.starting_location}
              onChange={handleChange}
              className="bg-orange-50 border border-orange-300 focus:border-orange-400 focus:ring-0 rounded-xl mt-1"
            />
          </div>
          <div>
            <Label htmlFor="route-end" className="text-base">
              Fim da Rota
            </Label>
            <Input
              id="route-end"
              name="ending_location"
              placeholder="Fim da Rota"
              value={formData.ending_location}
              onChange={handleChange}
              className="bg-orange-50 border border-orange-300 focus:border-orange-400 focus:ring-0 rounded-xl mt-1"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-w-[120px] h-full">
          <span className="text-xs mb-1">Foto do Trajeto</span>
          <ImageUpload
            className="w-24 h-28 border border-orange-300 bg-white rounded-xl"
            onChange={handleImageChange}
            value={formData.image}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Label htmlFor="route-description" className="text-base">
            Descrição da Rota
          </Label>
          <span className="text-xs text-gray-500">
            {formData.description.length}/200
          </span>
        </div>
        <Textarea
          id="route-description"
          name="description"
          placeholder="Descrição da Rota"
          maxLength={200}
          value={formData.description}
          onChange={handleChange}
          className="bg-orange-50 border border-orange-300 focus:border-orange-400 focus:ring-0 rounded-xl mt-1 min-h-[80px]"
        />
      </div>
      <div className="mb-8">
        <TagSelector
          selectedTags={formData.tags}
          setSelectedTags={(tags) => setFormData({ ...formData, tags })}
          placeholder="Tags (opcional)"
        />
      </div>
    </form>
  );
}
