import SearchBar from "./SearchBar";
import SideMenu from "./SideMenu";

const Header = () => {
  return (
    <header className="bg-primary-dark h-[120px] w-full flex items-center justify-between px-4 shadow-md">
      {/* Side Menu com mais espaço */}
      <div className="min-w-[150px]">
        <SideMenu userName="Fulano de Tal" />
      </div>

      {/* Barra de pesquisa centralizada */}
      <div className="flex-1 max-w-md mx-auto">
        <SearchBar />
      </div>

      {/* Espaço equivalente para manter a barra de pesquisa centralizada */}
      <div className="min-w-[150px]"></div>
    </header>
  );
};

export default Header;
