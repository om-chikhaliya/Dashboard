import { useState } from "react";
import { Search, ChevronDown, User, Settings, LogOut, Plus } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
// import { Input } from "postcss";
import Input from "./ui/Input";
import CreateUserForm from "./CreateUserForm";

function Header({ handleSearch, searchTerm }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove token
    navigate("/"); // Redirect to login
  };

  const handleSetting = () => {
    
    navigate("/setting"); // Redirect to login
  };

  return (
    <header className="dashboard-header rounded-xl card-shadow">
      {location.pathname === "/orders" ? (
        <div className="relative">
          {/* <input type="text" value={searchTerm} onChange={(e) => onChange(e.target.value)} placeholder="Search..." className="search-input" /> */}
          <Input
            placeholder="Search Orders"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      ) : (<div className="text-lg font-bold">Welcome to Brickosys</div>)}


      <div className="relative"></div>
      <div className="account-dropdown">
        <div
          className="flex items-center gap-3"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {localStorage.getItem('role') === "admin" && (
            <button
              className="p-2 rounded-full text-black transition"
              onClick={() => navigate("/createuser")} // Navigate to /createuser
            >
              <Plus size={20} />
            </button>
          )}
          <img
            src="https://c8.alamy.com/comp/2RFFRCC/photo-of-impressed-nice-cheerful-person-raise-arms-open-mouth-cant-believe-wear-lime-cropped-top-isolated-on-violet-color-background-2RFFRCC.jpg"
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{localStorage.getItem("username")}</span>
          <ChevronDown size={16} />
        </div>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="account-dropdown-content"
            >
              <div className="py-1">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <User size={16} />
                  Profile
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault(); // Prevents page reload
                    handleSetting(); // Calls the logout function
                  }}
                >
                  <Settings size={16} />
                  Settings
                </a>
                <hr className="my-1  " />
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault(); // Prevents page reload
                    handleLogout(); // Calls the logout function
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    
    </header>
  );
}

export default Header;
