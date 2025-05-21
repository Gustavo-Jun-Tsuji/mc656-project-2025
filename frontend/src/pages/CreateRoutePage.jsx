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
    tags: [],
  });

  const handleCancel = () => {
    navigate("/");
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

      await api.createRoute(formData);
      alert(`${formData.title} agora está na plataforma!`);
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
            <RouteForm 
            formData={formData} 
            setFormData={setFormData} 
            />
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
