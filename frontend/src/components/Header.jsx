import SearchBar from "./SearchBar";
import SideMenu from "./SideMenu";
import logo from "../assets/logo-3.png";

const Header = () => {
  return (
    <header className="bg-primary-dark/80 backdrop-blur h-20 w-full flex items-center px-12 pl-6 shadow-md fixed top-0 z-50">
      {/* Lado esquerdo - Menu e Logo com largura fixa */}
      <div className="max-w-[220px] flex items-center">
        <div className="flex justify-start">
          <SideMenu userName="Fulano de Tal" />
        </div>
        <a href="/" className="ml-6 flex items-center">
          <img src={logo} alt="UniMaps Logo" className="" />
        </a>
      </div>

      {/* Centro - Barra de pesquisa */}
      <div className="flex-1 flex justify-center h-full items-center">
        <div className="w-full max-w-[500px] h-[50px] flex items-center relative">
          <SearchBar />
        </div>
      </div>

      {/* Lado direito - Botão de logout */}
      <div className="w-[220px] flex justify-end items-center">
        <a
          href="/logout"
          className="text-white font-bold hover:text-gray-300 transition-colors duration-300"
        >
          Sair
        </a>
      </div>
    </header>
  );
};

export default Header;
