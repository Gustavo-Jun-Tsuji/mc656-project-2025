import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRoutePage from "./pages/CreateRoutePage";
import RouteDetailsPage from "./pages/RouteDetailsPage";
import MyRoutesPage from "./pages/MyRoutesPage";
import "./styles/App.css";
import ComponentsPage from "./pages/ComponetsPage";
import { ACCESS_TOKEN_KEYNAME, REFRESH_TOKEN_KEYNAME } from "./constants";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LikedRoutesPage from "./pages/LikedRoutesPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import RouteHistoryPage from "./pages/RouteHistoryPage";
import ExploreRoutesPage from "./pages/ExploreRoutesPage";
import FirstPage from "./pages/LandingPage";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

// Conditional home route that checks authentication
const ConditionalHomeRoute = () => {
  // Check if there's a token in localStorage
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN_KEYNAME);
  
  // If authenticated, show HomePage; otherwise show FirstPage
  return isAuthenticated ? <HomePage /> : <FirstPage />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app pt-20">
          {/* Added padding to avoid overlap with header */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<Logout />} />
            
            {/* Conditional Home Route */}
            <Route path="/" element={<ConditionalHomeRoute />} />

            {/* Protected Routes */}
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <ExploreRoutesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-routes"
              element={
                <ProtectedRoute>
                  <MyRoutesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/liked-routes"
              element={
                <ProtectedRoute>
                  <LikedRoutesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/routes/search"
              element={
                <ProtectedRoute>
                  <SearchResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/routes/create"
              element={
                <ProtectedRoute>
                  <CreateRoutePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/routes/:id"
              element={
                <ProtectedRoute>
                  <RouteDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/route-history"
              element={
                <ProtectedRoute>
                  <RouteHistoryPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
            <Route path="/components/" element={<ComponentsPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;