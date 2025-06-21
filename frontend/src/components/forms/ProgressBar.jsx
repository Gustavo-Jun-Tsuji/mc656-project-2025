import React, { useState, useEffect } from "react";

const ProgressBar = ({ progress }) => {
  // Estado para controlar a animação da bandeira
  const [showFlag, setShowFlag] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setShowFlag(true);
    } else {
      setShowFlag(false);
    }
  }, [progress]);

  // Calcular posições dos pontos intermediários com ícones específicos
  const checkpoints = [
    {
      position: 0,
      label: "Nome",
      icon: "", // Marcador de local/início
      isSpecialIcon: true,
    },
    {
      position: 25,
      label: "Email",
    },
    {
      position: 50,
      label: "Senha",
    },
    {
      position: 75,
      label: "Confirmação",
    },
    {
      position: 100,
      label: "Fim",
      icon: "🚩",
      isSpecialIcon: true,
    },
  ];

  return (
    <div className="w-full my-5 px-2.5">
      {/* Adiciona estilo para a animação de subida */}
      <style jsx>{`
        @keyframes riseUp {
          0% {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          70% {
            transform: translate(-50%, -15%);
            opacity: 1;
          }
          85% {
            transform: translate(-50%, 5%);
          }
          100% {
            transform: translate(-50%, 0%);
          }
        }
        .flag-rise {
          animation: riseUp 0.5s ease-in-out forwards;
        }
      `}</style>

      {/* Route track */}
      <div className="h-2 bg-gray-200 rounded relative my-8">
        {/* Progress bar */}
        <div
          className="h-full bg-secondary transition-all duration-500 ease-in-out rounded"
          style={{ width: `${progress}%` }}
        />

        {/* Checkpoints */}
        {checkpoints.map((checkpoint, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2"
            style={{ left: `${checkpoint.position}%` }}
          >
            {checkpoint.isSpecialIcon && checkpoint.position === 0 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-base">
                <span className="text-secondary transition-colors duration-300">
                  {checkpoint.icon}
                </span>
              </div>
            )}

            {checkpoint.isSpecialIcon &&
              checkpoint.position === 100 &&
              showFlag && (
                <div className="absolute -top-6 left-[85%] text-base flag-rise">
                  <span className="text-secondary transition-colors duration-300">
                    {checkpoint.icon}
                  </span>
                </div>
              )}

            <div
              className={`w-4 h-4 rounded-full ${
                progress >= checkpoint.position
                  ? "bg-secondary border-secondary-light shadow-sm shadow-secondary-light/50"
                  : "bg-white border border-gray-300"
              } transition-all duration-300`}
            ></div>

            <span
              className={`absolute top-5 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap ${
                progress >= checkpoint.position
                  ? "font-bold text-secondary"
                  : "text-gray-600"
              }`}
            >
              {checkpoint.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
