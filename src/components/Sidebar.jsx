import { motion } from "framer-motion";
import {
  Monitor,
  Archive,
  ShoppingCart,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X
} from "react-feather";
import { useState, useEffect } from "react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { icon: Monitor, label: "Dashboard", active: true, path: "/dashboard" },
    { icon: Archive, label: "Mismatch Lots", path: "/mismatchlot" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Settings, label: "Settings", path: "/setting" },
    // { icon: HelpCircle, label: "Help", path: "/help" },
    
  ];
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);


  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 770;
      setIsMobile(mobileView);
      if (mobileView) setIsOpen(false); // Automatically close sidebar on resize if small/medium screen
      else setIsOpen(true); // Keep sidebar open on large screens
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove token
    navigate("/"); // Redirect to login
  };

  return (
    <>
      {isMobile && (
        <button className="fixed top-7 left-8 z-50 p-2 bg-white rounded-full shadow-md" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      )}

      <motion.div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 w-[240px]`}
        animate={{ x: isOpen ? 0 : -240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between p-4">
          <span className="text-[20px] font-extrabold border-b-4 border-[#bbe90b]">BrickOsys</span>
          {isMobile && (
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="nav-menu p-4">
          {menuItems.map((item, index) => (
            <div key={item.label || index}>
              
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${(location.pathname === "/pickupitems" && item.path === "/orders") ||
                    isActive
                    ? "active"
                    : ""
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </div>
          ))}
          <hr className="border-gray-400" />
          <button
            className="nav-item w-full flex items-center gap-3 p-3 text-red-600 rounded-md transition"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </nav>
      </motion.div>
    </>
  );
}

export default Sidebar;
