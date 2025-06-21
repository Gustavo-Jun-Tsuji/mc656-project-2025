import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/forms/ProgressBar";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState(0);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Estados para controlar campos confirmados (após blur)
  const [confirmedFields, setConfirmedFields] = useState({
    username: false,
    email: false,
    password: false,
    password2: false,
  });

  const { register, error } = useAuth();
  const navigate = useNavigate();

  // Atualizar progresso baseado nos campos confirmados E com conteúdo
  useEffect(() => {
    let currentProgress = 0;

    if (confirmedFields.username && username.trim().length > 0)
      currentProgress += 25;
    else if (confirmedFields.username && username.trim().length === 0)
      setConfirmedFields((prev) => ({ ...prev, username: false }));

    if (confirmedFields.email && email.trim().length > 0) currentProgress += 25;
    else if (confirmedFields.email && email.trim().length === 0)
      setConfirmedFields((prev) => ({ ...prev, email: false }));

    if (confirmedFields.password && password.length > 0) currentProgress += 25;
    else if (confirmedFields.password && password.length === 0)
      setConfirmedFields((prev) => ({ ...prev, password: false }));

    if (confirmedFields.password2 && password2.length > 0) {
      currentProgress += 25;
    } else if (confirmedFields.password2 && password2.length === 0) {
      setConfirmedFields((prev) => ({ ...prev, password2: false }));
    }

    setProgress(currentProgress);
  }, [confirmedFields, username, email, password, password2]);

  // Handlers para os eventos de blur
  const handleBlur = (field) => {
    setConfirmedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormError("");

    // Validate passwords match
    if (password !== password2) {
      setFormError("As senhas não coincidem.");
      return;
    }

    const success = await register({
      username,
      email,
      password,
    });

    if (success) {
      setFormError("");

      setTimeout(() => {
        setShowWelcomePopup(true);
      }, 800);
    }
  };

  const handleClosePopup = () => {
    setShowWelcomePopup(false);
    navigate("/login");
  };

  return (
    <>
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
          <h2 className="text-2xl font-bold text-center mb-6">
            Crie uma conta
          </h2>
          <ProgressBar progress={progress} />
          {(error || formError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {formError || error}
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
                onBlur={() => handleBlur("username")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                required
              />
            </div>

            {/* Campo de email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
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
                onBlur={() => handleBlur("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                required
              />
            </div>

            {/* Campo de confirmação de senha */}
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirme a senha
              </label>
              <input
                id="password2"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                onBlur={() => handleBlur("password2")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Registrar
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="text-secondary hover:text-secondary-dark font-medium"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>

      {showWelcomePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-transform duration-300 animate-fade-in-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Bem-vindo ao UniMaps!</h3>
              <p className="text-gray-600 mb-6">
                Sua conta foi criada com sucesso. Agora você pode explorar todos
                os recursos disponíveis!
              </p>
              <button
                onClick={handleClosePopup}
                className="bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
              >
                Continuar para login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
