import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import ExpandedRouteCard from "../components/ExpandedRouteCard";
import { api } from "@/api";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Flame, ThumbsUp, Clock, Compass, MapPin } from "lucide-react";

const ExploreRoutesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "trending";

  // State for different route categories
  const [trendingRoutes, setTrendingRoutes] = useState([]);
  const [likedRoutes, setLikedRoutes] = useState([]);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [nearbyRoutes, setNearbyRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Change tab handler
  const handleTabChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", value);
    setSearchParams(newParams);
  };

  // Fetch routes based on category
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch trending routes (could be based on recent popularity)
        const trendingResponse = await api.searchRoutes("", {
          orderBy: "trending",
        });
        setTrendingRoutes(
          trendingResponse.data.results || trendingResponse.data || []
        );

        // Fetch most liked routes
        const likedResponse = await api.searchRoutes("", { orderBy: "liked" });
        setLikedRoutes(likedResponse.data.results || likedResponse.data || []);

        // Fetch recent routes
        const recentResponse = await api.searchRoutes("", {
          orderBy: "recent",
        });
        setRecentRoutes(
          recentResponse.data.results || recentResponse.data || []
        );

        // Fetch nearby routes (could be based on user location)
        const nearbyResponse = await api.searchRoutes("", {
          orderBy: "distance",
        });
        setNearbyRoutes(
          nearbyResponse.data.results || nearbyResponse.data || []
        );
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Falha ao carregar rotas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando rotas...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-red-500">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-primary text-white"
                >
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-secondary-very_light via-secondary-very_light to-primary-light">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800 text-center">
                Explorar Rotas
              </CardTitle>
              <p className="text-center text-gray-600 mt-2">
                Descubra novas rotas populares, recentes e próximas a você
              </p>
            </CardHeader>
          </Card>

          <Tabs
            defaultValue={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span>Em Alta</span>
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>Mais Curtidas</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Recentes</span>
              </TabsTrigger>
              <TabsTrigger value="nearby" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Próximas</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending">
              {trendingRoutes.length === 0 ? (
                <Card className="p-12 text-center">
                  <CardContent>
                    <p className="text-gray-500 text-lg">
                      Nenhuma rota em alta encontrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingRoutes.map((route) => (
                    <ExpandedRouteCard
                      key={route.id}
                      route={route}
                      showVoteButtons={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="liked">
              {likedRoutes.length === 0 ? (
                <Card className="p-12 text-center">
                  <CardContent>
                    <p className="text-gray-500 text-lg">
                      Nenhuma rota curtida encontrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedRoutes.map((route) => (
                    <ExpandedRouteCard
                      key={route.id}
                      route={route}
                      showVoteButtons={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent">
              {recentRoutes.length === 0 ? (
                <Card className="p-12 text-center">
                  <CardContent>
                    <p className="text-gray-500 text-lg">
                      Nenhuma rota recente encontrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentRoutes.map((route) => (
                    <ExpandedRouteCard
                      key={route.id}
                      route={route}
                      showVoteButtons={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="nearby">
              {nearbyRoutes.length === 0 ? (
                <Card className="p-12 text-center">
                  <CardContent>
                    <p className="text-gray-500 text-lg">
                      Nenhuma rota próxima encontrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nearbyRoutes.map((route) => (
                    <ExpandedRouteCard
                      key={route.id}
                      route={route}
                      showVoteButtons={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ExploreRoutesPage;
