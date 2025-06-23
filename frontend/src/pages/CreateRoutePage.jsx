import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteForm from "../components/RouteForm";
import MapComponent from "../components/map/MapComponent";
import Header from "../components/Header";
import api from "../api";
import { Button } from "../components/ui/button";
import { ArrowLeft, Route } from "lucide-react";

const CreateRoutePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_location: "",
    ending_location: "",
    coordinates: [],
    image: null, // Add image to state
    tags: [],
  });

  // Add image preview state
  const [imagePreview, setImagePreview] = useState(null);

  const handleCancel = () => {
    navigate("/");
  };

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setFormData({
        ...formData,
        image: selectedImage,
      });

      // Create preview URL
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title) {
        alert("Please enter a title for the route");
        return;
      }

      if (!formData.starting_location) {
        alert("Please enter a starting location");
        return;
      }

      if (!formData.ending_location) {
        alert("Please enter an ending location");
        return;
      }

      if (!formData.description) {
        alert("Please enter a description for the route");
        return;
      }

      if (formData.coordinates.length < 2) {
        alert("Please add at least two points to create a route");
        return;
      }

      // Create FormData for multipart/form-data submission (needed for file upload)
      const routeData = new FormData();
      routeData.append("title", formData.title);
      routeData.append("description", formData.description);

      if (formData.starting_location) {
        routeData.append("starting_location", formData.starting_location);
      }

      if (formData.ending_location) {
        routeData.append("ending_location", formData.ending_location);
      }

      routeData.append("coordinates", JSON.stringify(formData.coordinates));

      routeData.append("tags", JSON.stringify(formData.tags));

      // Add image if one is selected
      if (formData.image) {
        routeData.append("image", formData.image);
      }

      await api.createRoute(routeData);
      alert("Rota criada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar rota:", error);
      alert("Erro ao criar rota. Por favor, tente novamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light flex flex-col pt-10">
        <div className="flex flex-col rounded-3xl shadow-2xl p-[80px] pt-[30px] pb-[30px] w-4/5 mx-auto">
          {/* Conteúdo principal */}
          <div className="flex gap-[50px] ">
            <div className="flex flex-col flex-1 items-center">
              {/* Formulário */}
              <div className="flex flex-col h-full w-full">
                <RouteForm formData={formData} setFormData={setFormData} />
              </div>
              <div>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-secondary-dark text-xl h-12 w-[250px]"
                  onClick={handleCancel}
                >
                  <ArrowLeft className="w-8 h-8" />
                  Voltar
                </Button>
              </div>
            </div>

            {/* Mapa */}
            <div className="flex flex-col flex-1 items-center">
              <div className="w-full h-full flex flex-col justify-between">
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow flex-1 max-h-[530px]">
                  <MapComponent
                    coordinates={formData.coordinates}
                    setCoordinates={(coords) =>
                      setFormData({ ...formData, coordinates: coords })
                    }
                    center={[-22.817166, -47.069806]}
                    zoom={16}
                  />
                </div>
                <div className="flex justify-center mt-[50px]">
                  <Button
                    className="bg-primary-dark hover:bg-orange-400 text-secondary-dark text-xl rounded-xl px-8 w-[250px] h-12"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Criar Rota
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Botões na parte inferior */}
          <div className="flex justify-evenly mt-8"></div>
        </div>
      </div>
    </>
  );
};

export default CreateRoutePage;
