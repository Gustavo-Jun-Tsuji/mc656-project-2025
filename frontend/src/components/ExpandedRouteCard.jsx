import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Trash2, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ExpandedRouteCard = ({
  route,
  showDeleteButton = false,
  onDelete,
  onLike,
  isLiked = false,
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const username = route.username || route.user?.username || "Usuário";
  const avatarSeed = username;
  const avatarFallback = username.charAt(0).toUpperCase();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(route.id);
    } catch (error) {
      console.error("Erro ao deletar rota:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (onLike) {
      await onLike(route.id, !isLiked);
    }
  };

  const handleCardClick = () => {
    navigate(`/routes/${route.id}`);
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

          <div className="flex items-center gap-2">
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-2 ${
                  isLiked ? "text-red-500" : "text-gray-400"
                } hover:text-red-500`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            )}

            {showDeleteButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0" onClick={handleCardClick}>
        <div className="space-y-4">
          {/* Route Image */}
          {route.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={route.image}
                alt={route.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}

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
            {/* Origin to Destination */}
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

            {/* Additional Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                {route.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{route.duration}</span>
                  </div>
                )}
                {route.difficulty && (
                  <Badge variant="outline" className="text-xs">
                    {route.difficulty}
                  </Badge>
                )}
              </div>

              {route.likes_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{route.likes_count}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {route.tags && route.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {route.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
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
