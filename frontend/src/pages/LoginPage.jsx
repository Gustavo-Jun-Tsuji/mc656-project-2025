import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const translateError = (errorMessage) => {
    const errorTranslations = {
      "No active account found with the given credentials":
        "Nenhuma conta ativa foi encontrada",
    };

    return errorTranslations[errorMessage] || errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <>
      {/* Background de mapa que cobre toda a tela */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/UnicampMap.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      />

      <div className="fixed inset-0 z-5 bg-gradient-to-br from-secondary-very_light/85 via-secondary-very_light/85 to-primary-light/85" />

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-6">Entrar</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {translateError(error)}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col justify-center"
          >
            {/* Campo de nome de usuário */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome de Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                required
              />
            </div>

            {/* Campo de senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Não possui uma conta?{" "}
            <Link
              to="/register"
              className="text-secondary hover:text-secondary-dark font-medium"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
