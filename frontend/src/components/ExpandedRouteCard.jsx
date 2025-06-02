import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import {
  ArrowRight,
  Trash2,
  Clock,
  MapPin,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Route,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ExpandedRouteCard = ({
  route: initialRoute,
  showDeleteButton = false,
  showVoteButtons = false,
  onRouteDeleted, // Optional callback when route is deleted
  onRouteUpdated, // Optional callback when route is updated (after voting)
}) => {
  const navigate = useNavigate();
  const [route, setRoute] = useState(initialRoute);
  const [isDeleting, setIsDeleting] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);

  const username = route.username || route.user?.username || "Usuário";
  const avatarSeed = username;
  const avatarFallback = username.charAt(0).toUpperCase();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleting) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja deletar a rota "${route.title}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await api.deleteRoute(route.id);

      if (onRouteDeleted) {
        onRouteDeleted(route.id);
      }
    } catch (error) {
      console.error("Erro ao deletar rota:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVote = async (e, voteType) => {
    e.stopPropagation();
    if (voteLoading) return;

    setVoteLoading(true);
    try {
      const response = await api.voteRoute(route.id, voteType);

      // Update local state with new vote counts
      const updatedRoute = {
        ...route,
        upvotes_count: response.data.upvotes_count,
        downvotes_count: response.data.downvotes_count,
        user_vote: response.data.user_vote,
      };

      setRoute(updatedRoute);

      if (onRouteUpdated) {
        onRouteUpdated(updatedRoute);
      }
    } catch (error) {
      console.error("Erro ao votar:", error);
    } finally {
      setVoteLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/routes/${route.id}`);
  };

  const formatDistance = (distance) => {
    if (!distance) return null;
    const numDistance = parseFloat(distance);
    return isNaN(numDistance) ? null : numDistance.toFixed(2);
  };

  return (
    <Card className="cursor-pointer group transition-all duration-200 shadow-md border border-gray-200 hover:border-primary-dark/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary-dark">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${avatarSeed}`}
              />
              <AvatarFallback className="bg-primary-dark text-primary-foreground text-sm">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-secondary-dark">{username}</div>
              <div className="text-xs text-gray-500">
                {new Date(route.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Vote buttons */}
            {showVoteButtons && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleVote(e, "upvote")}
                  disabled={voteLoading}
                  className={`p-1.5 ${
                    route.user_vote === "upvote"
                      ? "text-green-600 bg-green-50"
                      : "text-gray-400 hover:text-green-600"
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span className="text-xs ml-1">
                    {route.upvotes_count || 0}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleVote(e, "downvote")}
                  disabled={voteLoading}
                  className={`p-1.5 ${
                    route.user_vote === "downvote"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-400 hover:text-red-600"
                  }`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  <span className="text-xs ml-1">
                    {route.downvotes_count || 0}
                  </span>
                </Button>
              </>
            )}

            {showDeleteButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-500 ml-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0" onClick={handleCardClick}>
        <div className="space-y-4">
          {/* Route Image or Placeholder */}
          <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
            {route.image ? (
              <img
                src={route.image}
                alt={route.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center text-gray-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">Sem imagem</p>
                </div>
              </div>
            )}
          </div>

          {/* Route Title */}
          <div>
            <h3 className="font-semibold text-lg text-secondary-dark mb-2">
              {route.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {route.description}
            </p>
          </div>

          {/* Route Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  {route.starting_location || "Origem"}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-red-600" />
                <span className="font-medium">
                  {route.ending_location || "Destino"}
                </span>
              </div>
            </div>

            {formatDistance(route.distance) && (
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                <Route className="h-4 w-4" />
                <span>{formatDistance(route.distance)} km</span>
              </div>
            )}

            {/* Tags */}
            {route.tags && route.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {route.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-light text-secondary-dark px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpandedRouteCard;
