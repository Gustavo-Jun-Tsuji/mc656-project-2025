import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import ExpandedRouteCard from "../components/ExpandedRouteCard";
import Header from "../components/Header";

const RouteListPage = ({
  title,
  routes = [],
  loading = false,
  error = null,
  showTitle = true,
  showResultsCount = true,
  showDeleteButton = false,
  showVoteButtons = false,
  showSearchFilter = false,
  showOrderByButtons = false,
  onRoutesUpdate,
  emptyStateMessage = "Nenhuma rota encontrada",
  footer = null,
  customHeader = null,
  // Infinite scroll props
  enableInfiniteScroll = false,
  onLoadMore,
  hasNextPage = false,
  loadingMore = false,
  totalCount = 0,
  enableServerSideFiltering = false,
  onFilterChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredRoutes, setFilteredRoutes] = useState(routes);
  const [localRoutes, setLocalRoutes] = useState(routes);
  const [searchInputValue, setSearchInputValue] = useState("");
  const observerRef = useRef();
  const searchTimeoutRef = useRef();

  // Get state from URL params - using backend-compatible values
  const searchTerm = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || "-created_at"; // Default to most recent

  // Initialize search input with URL param
  useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setLocalRoutes(routes);
  }, [routes]);

  // Infinite scroll observer
  const lastRouteElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && onLoadMore) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasNextPage, onLoadMore]
  );

  useEffect(() => {
    if (!enableServerSideFiltering) {
      let filtered = [...localRoutes];

      // Apply search filter
      if (searchTerm.trim()) {
        filtered = filtered.filter(
          (route) =>
            route.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            route.starting_location
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            route.ending_location
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            route.tags?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply client-side ordering to match backend logic
      if (showOrderByButtons) {
        if (orderBy === "-created_at") {
          filtered = filtered.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        } else if (orderBy === "liked") {
          // Client-side approximation of backend "liked" logic
          filtered = filtered.sort((a, b) => {
            const aNet = (a.upvotes_count || 0) - (a.downvotes_count || 0);
            const bNet = (b.upvotes_count || 0) - (b.downvotes_count || 0);
            return bNet - aNet;
          });
        } else if (orderBy === "trending") {
          // For client-side, we'll just use upvotes as approximation
          filtered = filtered.sort(
            (a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0)
          );
        }
      }

      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(localRoutes);
    }
  }, [
    searchTerm,
    orderBy,
    localRoutes,
    showOrderByButtons,
    enableServerSideFiltering,
  ]);

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const updateSearchTerm = (newSearchTerm) => {
    updateSearchParams({ search: newSearchTerm });

    if (enableServerSideFiltering && onFilterChange) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        onFilterChange(newSearchTerm, orderBy);
      }, 500);
    }
  };

  const updateOrderBy = (newOrderBy) => {
    updateSearchParams({ orderBy: newOrderBy });

    if (enableServerSideFiltering && onFilterChange) {
      onFilterChange(searchTerm, newOrderBy);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    updateSearchTerm(value);
  };

  const handleRouteDeleted = (routeId) => {
    const updatedRoutes = localRoutes.filter((route) => route.id !== routeId);
    setLocalRoutes(updatedRoutes);

    if (onRoutesUpdate) {
      onRoutesUpdate(updatedRoutes);
    }
  };

  const handleRouteUpdated = (updatedRoute) => {
    const updatedRoutes = localRoutes.map((route) =>
      route.id === updatedRoute.id ? updatedRoute : route
    );
    setLocalRoutes(updatedRoutes);

    if (onRoutesUpdate) {
      onRoutesUpdate(updatedRoutes);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (loading && localRoutes.length === 0) {
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

  const displayCount = enableServerSideFiltering
    ? totalCount
    : filteredRoutes.length;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {customHeader}
          <Card className="mb-6">
            <CardHeader>
              {showTitle && (
                <CardTitle className="text-2xl text-blue-800 text-center">
                  {title}
                </CardTitle>
              )}

              {(showSearchFilter || showOrderByButtons) && (
                <div className="space-y-4 pt-4">
                  {/* Search Bar */}
                  {showSearchFilter && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={`Buscar em ${title}...`}
                        value={searchInputValue}
                        onChange={handleSearchInputChange}
                        className="pl-10"
                      />
                    </div>
                  )}

                  {/* Order By Buttons - using backend-compatible values */}
                  {showOrderByButtons && (
                    <div className="space-y-2">
                      <p className="text-center text-sm text-gray-600">
                        Ordenar por:
                      </p>
                      <div className="flex gap-2 justify-center flex-wrap">
                        <Button
                          variant={
                            orderBy === "-created_at" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => updateOrderBy("-created_at")}
                          disabled={loading || loadingMore}
                        >
                          Mais Recentes
                        </Button>
                        <Button
                          variant={orderBy === "liked" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateOrderBy("liked")}
                          disabled={loading || loadingMore}
                        >
                          Mais Curtidas
                        </Button>
                        <Button
                          variant={
                            orderBy === "trending" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => updateOrderBy("trending")}
                          disabled={loading || loadingMore}
                        >
                          Trending
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showResultsCount && displayCount > 0 && (
                <div className="text-center mt-4 text-gray-500">
                  {displayCount} rota{displayCount !== 1 ? "s" : ""} encontrada
                  {displayCount !== 1 ? "s" : ""}
                  {enableInfiniteScroll &&
                    enableServerSideFiltering &&
                    filteredRoutes.length < displayCount && (
                      <span className="text-sm block">
                        Mostrando {filteredRoutes.length} de {displayCount}
                      </span>
                    )}
                </div>
              )}
            </CardHeader>
          </Card>

          {filteredRoutes.length === 0 && !loading ? (
            <Card className="p-12 text-center">
              <CardContent>
                <p className="text-gray-500 text-lg">{emptyStateMessage}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutes.map((route, index) => (
                  <div
                    key={route.id}
                    ref={
                      enableInfiniteScroll &&
                      index === filteredRoutes.length - 1
                        ? lastRouteElementRef
                        : null
                    }
                  >
                    <ExpandedRouteCard
                      route={route}
                      showDeleteButton={showDeleteButton}
                      showVoteButtons={showVoteButtons}
                      onRouteDeleted={handleRouteDeleted}
                      onRouteUpdated={handleRouteUpdated}
                    />
                  </div>
                ))}
              </div>

              {/* Loading more indicator */}
              {enableInfiniteScroll && loadingMore && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-gray-600">
                      Carregando mais rotas...
                    </span>
                  </div>
                </div>
              )}

              {/* End of results indicator */}
              {enableInfiniteScroll &&
                !hasNextPage &&
                filteredRoutes.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Todas as rotas foram carregadas
                    </p>
                  </div>
                )}
            </>
          )}

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </>
  );
};

export default RouteListPage;
