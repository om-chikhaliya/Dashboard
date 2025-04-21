import { motion } from "framer-motion";
import {
  Monitor,
  Archive,
  ShoppingCart,
  Settings,
  LogOut,
  List,
  Menu,
  X,
  DollarSign,
  HelpCircle
} from "react-feather";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { User, ChevronLeft, ChevronRight, Info } from "lucide-react";

function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { icon: Monitor, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Archive, label: "Mismatch Lots", path: "/mismatchlot" },
    { icon: List, label: "Wanted List", path: "/wishlist" },
    { icon: DollarSign, label: "Avg Price", path: "/price" },
    { icon: Info, label: "Logs", path: "/logs" },
    { icon: User, label: "Users", path: "/users" },
    { icon: Settings, label: "Settings", path: "/setting" },
    { icon: HelpCircle, label: "Help and Guide", path: "/help" },
  ];

  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const userRole = localStorage.getItem("role"); // Get role from localStorage

  // Filter menu items based on user role
  const filteredMenuItems = userRole === "admin"
    ? menuItems // Show all items for admin
    : menuItems.filter(item => 
        item.label === "Dashboard" || 
        item.label === "Orders" || 
        item.label === "Mismatch Lots" || 
        item.label === "Wanted List"
    );

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 1025;
      setIsMobile(mobileView);
      if (mobileView) setIsOpen(false); // Auto-close sidebar on small screens
      else setIsOpen(true); // Keep sidebar open on large screens
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* {isMobile && (
        <button className="fixed top-7 left-8 z-50 p-2 bg-white rounded-full shadow-md" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      )} */}

      <motion.div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 w-[240px] transition-all`}
        animate={{ x: isOpen ? 0 : -240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Sidebar Header */}
        <Link to='/dashboard'>
        <div className="flex items-center justify-between p-4 cursor-pointer">
          <span className="text-[20px] font-extrabold border-b-4 border-[#bbe90b]">BrickOsys</span>
          {/* {isMobile && (
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          )} */}
        </div>
        </Link>

        {/* Sidebar Navigation */}
        <nav className="nav-menu p-4">
          {filteredMenuItems.map((item, index) => (
            <div key={item.label || index}>
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${(location.pathname === "/pickupitems" && item.path === "/orders") || isActive ? "active" : ""}`
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

        {/* Toggle Button for Sidebar */}
        <button
          className={`absolute top-6 transition-all bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow-md ${isOpen ? "-right-5" : "-right-[50px]"
            }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </motion.div>
    </>
  );
}

export default Sidebar;
