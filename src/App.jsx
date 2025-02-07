import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import OrderPage from "./components/OrderPage";
import PickUpItemsPage from "./components/PickUpItemPage";
import "./index.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />{" "}
            {/* Default route for Dashboard */}
            <Route path="/orders" element={<OrderPage />} />{" "}
            {/* Route for Order page */}
            <Route path="/pickorders" element={<PickUpItemsPage />} />{" "}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
