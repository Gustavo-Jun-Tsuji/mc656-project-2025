import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteForm from "../components/RouteForm";
import MapComponent from "../components/MapComponent";
import Header from "../components/Header";
import api from "../api";
import "../styles/CreateRoutePage.css";

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

      // Add image if one is selected
      if (formData.image) {
        routeData.append("image", formData.image);
      }

      await api.createRoute(routeData);
      alert("Route created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating route:", error);
      alert("Failed to create route. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="page-container create-route-page">
        <h2 className="page-title">Criar Nova Rota</h2>

        <div className="side-by-side-container">
          {/* Form Section */}
          <div className="form-section">
            <RouteForm formData={formData} setFormData={setFormData} />

            {/* Image Upload Section */}
            <div className="image-upload-section">
              <h3>Imagem da Rota</h3>
              <div className="form-group">
                <label htmlFor="route-image">Selecione uma imagem:</label>
                <input
                  type="file"
                  id="route-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <MapComponent
              coordinates={formData.coordinates}
              setCoordinates={(coords) =>
                setFormData({ ...formData, coordinates: coords })
              }
              center={[-22.817166, -47.069806]} // Centro do ciclo básico
              zoom={16}
            />
          </div>
        </div>

        <div className="buttons">
          <button className="btn cancel" onClick={handleCancel}>
            CANCELAR
          </button>
          <button className="btn submit" onClick={handleSubmit}>
            ENVIAR
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateRoutePage;
