import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, MapPin, ThumbsUp, Flag, Compass, History } from "lucide-react";
import { api } from "../api";

const SideMenu = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const userName = user?.username || "Usuário";
  const avatarSeed = userName;
  const avatarFallback = userName.charAt(0) || "U";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-primary-dark" // 100px × 100px
        >
          <Menu size={48} className="min-w-[30px] min-h-[30px]" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-blue-100 w-[280px]">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <SheetDescription className="sr-only">
          Menu lateral com opções de navegação do usuário
        </SheetDescription>
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-12 w-12 bg-primary-dark">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${avatarSeed}`}
            />
            <AvatarFallback className="bg-primary-dark text-primary-foreground">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-blue-950 font-medium text-lg">
              {userName}
            </span>
            <a href="/logout" className="text-sm text-red-600 hover:underline">
              Sair
            </a>
          </div>
        </div>

        <nav className="flex flex-col">
          <Link
            to="/my-routes"
            className="flex items-center gap-3 p-4 text-blue-900 hover:bg-blue-200 border-b transition-colors"
          >
            <MapPin size={20} />
            <span className="text-lg">Minhas Rotas</span>
          </Link>
          <Link
            to="/liked-routes"
            className="flex items-center gap-3 p-4 text-blue-900 hover:bg-blue-200 border-b transition-colors"
          >
            <ThumbsUp size={20} />
            <span className="text-lg">Rotas Curtidas</span>
          </Link>
          <Link
            to="/explore"
            className="flex items-center gap-3 p-4 text-blue-900 hover:bg-blue-200 border-b transition-colors"
          >
            <Compass size={20} />
            <span className="text-lg">Explorar Rotas</span>
          </Link>
          <Link
            to="/route-history"
            className="flex items-center gap-3 p-4 text-blue-900 hover:bg-blue-200 border-b transition-colors"
          >
            <History size={20} />
            <span className="text-lg">Histórico de Rotas</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
