import { useState } from "react";
import { Search, ChevronDown, User, Settings, LogOut } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
// import { Input } from "postcss";
import Input from "./ui/Input";

function Header({ handleSearch, searchTerm }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="dashboard-header rounded-xl card-shadow">
      {location.pathname === "/orders" && (
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
      )}
      <div className="relative"></div>
      <div className="account-dropdown">
        <div
          className="flex items-center gap-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src="https://c8.alamy.com/comp/2RFFRCC/photo-of-impressed-nice-cheerful-person-raise-arms-open-mouth-cant-believe-wear-lime-cropped-top-isolated-on-violet-color-background-2RFFRCC.jpg"
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">John Doe</span>
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
                >
                  <Settings size={16} />
                  Settings
                </a>
                <hr className="my-1  " />
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
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
