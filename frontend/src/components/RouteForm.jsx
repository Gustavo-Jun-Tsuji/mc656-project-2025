import React from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import TagSelector from "./TagSelector";
import ImageUpload from "./ImageUpload";

const RouteForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (file) => {
    setFormData({ ...formData, image: file });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">
          Criar rota
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="starting_location">Origem</Label>
            <Input
              id="starting_location"
              name="starting_location"
              value={formData.starting_location}
              onChange={handleChange}
              placeholder="Origem"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ending_location">Destino</Label>
            <Input
              id="ending_location"
              name="ending_location"
              value={formData.ending_location}
              onChange={handleChange}
              placeholder="Destino"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coordinates">Pontos</Label>
          <Input
            id="coordinates"
            readOnly
            value={`${formData.coordinates?.length || 0} pontos`}
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <TagSelector
            selectedTags={formData.tags}
            setSelectedTags={(tags) => setFormData({ ...formData, tags })}
            placeholder="Tags (opcional)"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ...other fields */}

          <ImageUpload
            label="Foto do Trajeto"
            onChange={handleImageChange}
            value={formData.image}
            className="w-24 md:w-32"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
