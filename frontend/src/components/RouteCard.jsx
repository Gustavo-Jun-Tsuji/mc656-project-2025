import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RouteCard = ({ route, onRouteHover }) => {
  const navigate = useNavigate();

  const username = route.username || "Usuário";
  const avatarSeed = username;
  const avatarFallback = route.user?.username?.charAt(0) || "F";

  // Handler para quando o mouse entra no card
  const handleMouseEnter = () => {
    if (onRouteHover) {
      onRouteHover(route);
    }
  };

  // Handler para quando o mouse sai do card (opcional)
  const handleMouseLeave = () => {
    if (onRouteHover) {
      onRouteHover(null);
    }
  };

  return (
    <Card
      className="cursor-pointer group transition-colors w-full rounded-md"
      onClick={() => navigate(`/routes/${route.id}`)}
      onMouseEnter={handleMouseEnter}
    >
      <CardContent className="p-4 rounded-md bg-secondary-very_light border-b border-secondary-light group-hover:bg-primary-very_light transition-colors">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12 bg-primary-dark">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${avatarSeed}`}
              />
              <AvatarFallback className="bg-primary-dark text-primary-foreground">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <span className="text-md font-medium text-secondary-dark">
              {username}
            </span>
          </div>

          <div className="text-center">
            <div className="font-medium text-secondary-dark text-md">
              {route.title}
            </div>
            <div className="text-xs text-secondary-dark   mt-1">
              {route.description?.substring(0, 40)}
              {route.description?.length > 40 ? "..." : ""}
            </div>
          </div>

          <div>
            <div className="text-xs px-3 py-1 border border-primary-dark rounded-md text-secondary-dark flex items-center">
              <span>{route.starting_location}</span>
              <ArrowRight className="h-3 w-3 mx-1 text-secondary-dark" />
              <span>{route.ending_location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteCard;
