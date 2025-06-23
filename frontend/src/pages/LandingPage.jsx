import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { MapPin, Route as RouteIcon, Users, Heart } from "lucide-react";

const FirstPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <>
      {/* Background map that covers the entire screen */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/UnicampMap.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      />

      {/* Gradient overlay */}
      <div className="fixed inset-0 z-5 bg-gradient-to-br from-secondary-very_light/85 via-secondary-very_light/85 to-primary-light/85" />

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8 flex flex-col">
          {/* Welcome section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-dark mb-4">
              Descubra e Compartilhe Rotas na Unicamp!
            </h1>
            <p className="text-gray-700 mb-4">
              Bem-vindo ao UniMaps, uma plataforma desenvolvida para incentivar e facilitar a 
              mobilidade ativa no campus da Unicamp.
            </p>
            <p className="text-gray-700 mb-6">
              Uma solução tecnológica e divertida pensada para melhorar a 
              qualidade de vida das pessoas que frequentam o campus, promovendo deslocamentos 
              mais saudáveis, eficientes e sustentáveis.
            </p>
          </div>

          {/* Features section - simplified */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <MapPin className="text-primary-dark w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1 text-secondary-dark">Crie Rotas</h3>
              <p className="text-sm text-gray-600">
                Desenhe e compartilhe os melhores caminhos pelo campus.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <RouteIcon className="text-primary-dark w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1 text-secondary-dark">Descubra Caminhos</h3>
              <p className="text-sm text-gray-600">
                Encontre rotas ideais para sua caminhada .
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Heart className="text-primary-dark w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1 text-secondary-dark">Qualidade de Vida</h3>
              <p className="text-sm text-gray-600">
                Promova hábitos mais saudáveis e sustentáveis em seus deslocamentos.
              </p>
            </div>
          </div>

          {/* Additional paragraph about benefits */}
          <div className="text-center mb-8">
            <p className="text-gray-700">
              Com o UniMaps, você pode descobrir caminhos mais agradáveis, seguros e eficientes para se 
              deslocar no campus, contribuindo para um estilo de vida mais ativo e sustentável.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-2">
            <button
              onClick={handleLoginClick}
              className="w-full md:w-auto bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Entrar
            </button>
            <button
              onClick={handleRegisterClick}
              className="w-full md:w-auto bg-white border border-secondary text-secondary hover:bg-secondary-light hover:text-secondary-dark font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Cadastrar
            </button>
          </div>

          {/* Footer text */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© 2025 UniMaps. Todos os direitos reservados.</p>
            <p className="mt-1">
              Um projeto desenvolvido para MC656
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FirstPage;