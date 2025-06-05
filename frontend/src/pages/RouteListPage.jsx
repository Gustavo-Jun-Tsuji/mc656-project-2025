import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ExpandedRouteCard from "../components/ExpandedRouteCard";
import Header from "../components/Header";

const RouteListPage = ({
  title,
  routes = [],
  loading = false,
  error = null,
  showDeleteButton = false,
  showVoteButtons = false,
  showSearchFilter = false,
  showOrderByButtons = false,
  onRoutesUpdate, // Optional callback to update routes in parent
  emptyStateMessage = "Nenhuma rota encontrada",
  footer = null, // Add support for custom footer
  customHeader = null, // Add support for custom header
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredRoutes, setFilteredRoutes] = useState(routes);
  const [localRoutes, setLocalRoutes] = useState(routes);

  // Get state from URL params
  const searchTerm = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || "recent";

  useEffect(() => {
    setLocalRoutes(routes);
  }, [routes]);

  useEffect(() => {
    let filtered = [...localRoutes]; // Use local routes for filtering

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (route) =>
          route.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.starting_location
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          route.ending_location
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply ordering
    if (orderBy === "recent") {
      filtered = filtered.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (orderBy === "liked") {
      filtered = filtered.sort(
        (a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0)
      );
    } else if (orderBy === "longest") {
      filtered = filtered.sort((a, b) => (b.distance || 0) - (a.distance || 0));
    }

    setFilteredRoutes(filtered);
  }, [searchTerm, orderBy, localRoutes]);

  const updateSearchTerm = (newSearchTerm) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSearchTerm.trim()) {
      newParams.set("search", newSearchTerm);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const updateOrderBy = (newOrderBy) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("orderBy", newOrderBy);
    setSearchParams(newParams);
  };

  const handleRouteDeleted = (routeId) => {
    const updatedRoutes = localRoutes.filter((route) => route.id !== routeId);
    setLocalRoutes(updatedRoutes);

    // Notify parent component if callback provided
    if (onRoutesUpdate) {
      onRoutesUpdate(updatedRoutes);
    }
  };

  const handleRouteUpdated = (updatedRoute) => {
    const updatedRoutes = localRoutes.map((route) =>
      route.id === updatedRoute.id ? updatedRoute : route
    );
    setLocalRoutes(updatedRoutes);

    // Notify parent component if callback provided
    if (onRoutesUpdate) {
      onRoutesUpdate(updatedRoutes);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando rotas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {customHeader}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800 text-center">
                {title}
              </CardTitle>

              {(showSearchFilter || showOrderByButtons) && (
                <div className="space-y-4 pt-4">
                  {/* Search Bar */}
                  {showSearchFilter && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={`Buscar em ${title}...`}
                        value={searchTerm}
                        onChange={(e) => updateSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  )}

                  {/* Order By Buttons */}
                  {showOrderByButtons && (
                    <div className="space-y-2">
                      <p className="text-center text-sm text-gray-600">
                        Ordenar por:
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant={orderBy === "recent" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateOrderBy("recent")}
                        >
                          Mais Recentes
                        </Button>
                        <Button
                          variant={orderBy === "liked" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateOrderBy("liked")}
                        >
                          Mais Curtidas
                        </Button>
                        <Button
                          variant={
                            orderBy === "longest" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => updateOrderBy("longest")}
                        >
                          Mais Longas
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {filteredRoutes.length > 0 && (
                <div className="text-center mt-4 text-gray-500">
                  {filteredRoutes.length} rota
                  {filteredRoutes.length !== 1 ? "s" : ""} encontrada
                  {filteredRoutes.length !== 1 ? "s" : ""}
                </div>
              )}
            </CardHeader>
          </Card>
          
          {filteredRoutes.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <p className="text-gray-500 text-lg">{emptyStateMessage}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutes.map((route) => (
                <ExpandedRouteCard
                  key={route.id}
                  route={route}
                  showDeleteButton={showDeleteButton}
                  showVoteButtons={showVoteButtons}
                  onRouteDeleted={handleRouteDeleted}
                  onRouteUpdated={handleRouteUpdated}
                />
              ))}
            </div>
          )}
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </>
  );
};

export default RouteListPage;
