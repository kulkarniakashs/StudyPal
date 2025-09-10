// pages/index.tsx
import DropdownMenu from "./components/DropDownMenu";

const HomePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <DropdownMenu/>
    </div>
  );
};

export default HomePage;
