import OrderPageContent from "./OrderContentPage";
import Sidebar from "./Sidebar";
import { useSidebar } from "./helper/SidebarContext";


function MainLayout() {
  const { isSidebarOpen } = useSidebar();
  return (
    <div className="app">
      <Sidebar></Sidebar>
      <div className={isSidebarOpen ? "main-content" : "main-content sidebar-closed"}>
        <OrderPageContent />
      </div>
    </div>
  );
}

export default MainLayout;
