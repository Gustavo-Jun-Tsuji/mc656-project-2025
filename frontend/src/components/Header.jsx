import SearchBar from "./SearchBar";
import SideMenu from "./SideMenu";

const Header = () => {
  return (
    <header className="bg-primary-dark h-[120px] w-full flex items-center px-12 shadow-md">
      {/* Lado esquerdo - Menu e Logo com largura fixa */}
      <div className="w-[220px] flex items-center">
        <div className="flex justify-start">
          <SideMenu userName="Fulano de Tal" />
        </div>
        <a href="/" className="ml-12 flex items-center">
          LOGO
        </a>
      </div>

      {/* Centro - Barra de pesquisa */}
      <div className="flex-1 flex justify-center h-full items-center">
        <div className="w-full max-w-[500px] h-[50px] flex items-center relative">
          <SearchBar />
        </div>
      </div>

      {/* Lado direito - Espaçador com mesma largura do lado esquerdo para equilibrar */}
      <div className="w-[220px]"></div>
    </header>
  );
};

export default Header;
