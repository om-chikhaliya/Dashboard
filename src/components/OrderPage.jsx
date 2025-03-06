import OrderPageContent from "./OrderContentPage";
import Sidebar from "./Sidebar";
import { useState } from "react";


function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}></Sidebar>
      <div className={isSidebarOpen ? "main-content sidebar-open" : "px-4 py-4"}>
        <OrderPageContent />
      </div>
    </div>
  );
}

export default MainLayout;
