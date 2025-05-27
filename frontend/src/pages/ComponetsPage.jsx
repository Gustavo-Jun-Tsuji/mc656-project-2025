import React, { useState } from "react";
import TagSelector from "../components/forms/TagSelector";
import TagChip from "../components/ui/TagChip";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import ImageUpload from "../components/forms/ImageUpload";
import { Button } from "../components/ui/button";
import { ArrowLeft, Route, Search } from "lucide-react";
import RouteForm from "../components/RouteForm";
import MapComponent from "../components/map/MapComponent";
import SearchBar from "../components/SearchBar";

function TagSelectorDemo() {
  const [tags, setTags] = useState([]);
  return (
    <div className="mb-8">
      <TagSelector
        selectedTags={tags}
        setSelectedTags={setTags}
        placeholder="Tags (opcional)"
      />
    </div>
  );
}

export default function ComponentsPage() {
  const [formData, setFormData] = useState({
    title: "",
    starting_location: "",
    ending_location: "",
    description: "",
    image: null,
    tags: [],
  });

  const [coordinates, setCoordinates] = useState([]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Catálogo de Componentes</h1>

      <h2 className="text-lg font-bold mb-2">Tag</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <TagChip tag={"teste"} />
      </div>

      <h2 className="text-lg font-bold mt-8 mb-2">Inputs</h2>
      <div className="flex flex-wrap gap-2 mb-4 w-fit">
        <Label htmlFor="input-demo">Input</Label>
        <Input id="input-demo" placeholder="Digite algo..." />
      </div>
      <div className="flex flex-wrap gap-2 mb-4 w-fit">
        <Label htmlFor="textarea-demo">Textarea</Label>
        <Textarea id="textarea-demo" placeholder="Digite um texto maior..." />
      </div>

      <h2 className="text-lg font-bold mt-8 mb-2">Image Upload</h2>
      <div className="flex flex-wrap gap-2 mb-4 w-fit">
        <ImageUpload className="w-[120px]" />
      </div>

      <h2 className="text-lg font-bold mt-8 mb-2">Buttons</h2>
      <div className="flex flex-wrap gap-2 mb-4 w-fit">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-400 text-black font-normal rounded-xl px-8"
          type="button"
        >
          Criar Rota
        </Button>
      </div>

      <h2 className="text-lg font-bold mt-2">Tags Selector</h2>
      <TagSelectorDemo />

      <h2 className="text-lg font-bold mt-2">Create Route Form</h2>
      <div className="max-w-xl ">
        <RouteForm formData={formData} setFormData={setFormData} />
      </div>

      <h2 className="text-lg font-bold mt-2">Map Component</h2>
      <div className="max-w-3xl mb-8" style={{ height: "500px" }}>
        <MapComponent
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          center={[-23.55052, -46.633308]} // exemplo: São Paulo
          zoom={13}
          readOnly={false}
        />
      </div>
      <div>
        <SearchBar />
      </div>
      <div className="h-12"></div>
    </div>
  );
}
