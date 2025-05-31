import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import ExpandedRouteCard from "../components/ExpandedRouteCard";
import Header from "../components/Header";

const RouteListPage = ({
  title,
  routes = [],
  loading = false,
  error = null,
  showDeleteButton = false,
  showLikeButton = false,
  showSearchFilter = false,
  showFilterByButtons = false,
  onDeleteRoute,
  onLikeRoute,
  emptyStateMessage = "Nenhuma rota encontrada",
}) => {
  const [filteredRoutes, setFilteredRoutes] = useState(routes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all"); // all, liked, recent

  useEffect(() => {
    setFilteredRoutes(routes);
  }, [routes]);

  useEffect(() => {
    let filtered = routes;

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

    // Apply category filter
    if (filterBy === "recent") {
      filtered = filtered.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (filterBy === "liked") {
      filtered = filtered.sort(
        (a, b) => (b.likes_count || 0) - (a.likes_count || 0)
      );
    }

    setFilteredRoutes(filtered);
  }, [searchTerm, filterBy, routes]);

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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800 text-center">
                {title}
              </CardTitle>

              {(showSearchFilter || showFilterByButtons) && (
                <div className="space-y-4 pt-4">
                  {/* Search Bar */}
                  {showSearchFilter && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={`Buscar em ${title}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  )}

                  {/* Filter Buttons */}
                  {showFilterByButtons && (
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant={filterBy === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterBy("all")}
                      >
                        Todas
                      </Button>
                      <Button
                        variant={filterBy === "recent" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterBy("recent")}
                      >
                        Mais Recentes
                      </Button>
                      <Button
                        variant={filterBy === "liked" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterBy("liked")}
                      >
                        Mais Curtidas
                      </Button>
                    </div>
                  )}
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
                  onDelete={onDeleteRoute}
                  onLike={showLikeButton ? onLikeRoute : undefined}
                  isLiked={route.is_liked}
                />
              ))}
            </div>
          )}

          {filteredRoutes.length > 0 && (
            <div className="text-center mt-8 text-gray-500">
              {filteredRoutes.length} rota
              {filteredRoutes.length !== 1 ? "s" : ""} encontrada
              {filteredRoutes.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RouteListPage;
