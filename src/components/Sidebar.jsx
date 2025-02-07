import { motion } from "framer-motion";
import {
  Monitor,
  Archive,
  ShoppingCart,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} from "react-feather";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { icon: Monitor, label: "Dashboard", active: true, path: "/" },
    { icon: Archive, label: "Inventory", path: "/inventory" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help", path: "/help" },
    { icon: LogOut, label: "Log out", path: "/logout" },
  ];

  return (
    <>
      <motion.div
        className="sidebar"
        animate={{ width: isOpen ? 240 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="logo">
          {/* <img src="/nucleus-logo.svg" alt="Nucleus" /> */}
          <span className="text-[20px] font-extrabold">BrickOsys</span>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item, index) => (
            <div key={item.label || index}>
              {item.label === "Log out" && <hr className="border-gray-400" />}
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${
                    (location.pathname === "/pickupitems" &&
                      item.path === "/orders") ||
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </motion.div>

      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Menu size={24} />
      </button>
    </>
  );
}

export default Sidebar;
