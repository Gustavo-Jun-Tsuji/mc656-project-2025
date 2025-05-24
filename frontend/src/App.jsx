import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRoutePage from "./pages/CreateRoutePage";
import RouteDetailsPage from "./pages/RouteDetailsPage";
import "./styles/App.css";
import ComponentsPage from "./pages/ComponetsPage";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes/create" element={<CreateRoutePage />} />
          <Route path="/routes/:id" element={<RouteDetailsPage />} />
          <Route path="/components/" element={<ComponentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
