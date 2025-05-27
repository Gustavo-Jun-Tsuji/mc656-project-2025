import SearchBar from "./SearchBar";
import SideMenu from "./SideMenu";

const Header = () => {
  return (
    <header className="bg-primary-dark h-[120px] w-full flex items-center px-12 shadow-md">
      <div className="min-w-[100px] flex justify-start">
        <SideMenu userName="Fulano de Tal" />
      </div>

      <div className="flex-1 flex justify-center h-full items-center">
        <div className="w-full max-w-[500px] h-[50px] flex items-center relative">
          <SearchBar />
        </div>
      </div>

      <div className="min-w-[100px]"></div>
    </header>
  );
};

export default Header;
