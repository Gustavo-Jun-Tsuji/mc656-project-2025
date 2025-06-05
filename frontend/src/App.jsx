import React from "react";
import { AuthProvider } from "./context/AuthContext";
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
import RouteHistoryPage from './pages/RouteHistoryPage';
import FullRouteHistoryPage from './pages/FullRouteHistoryPage';


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app pt-20">
          {/* Added padding to avoid overlap with header */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-routes"
              element={
                // Add this route
                <ProtectedRoute>
                  <MyRoutesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/liked-routes"
              element={
                // Add this route
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

            <Route
              path="/route-history-full"
              element={
                <ProtectedRoute>
                  <FullRouteHistoryPage />
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
