import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import OrderPage from "./components/OrderPage";
import PickUpItemsPage from "./components/PickUpItemPage";
import "./index.css";
import LoginSignup from "./components/Login";
import ExpandingButtonForm from "./components/ExpandingButtonForm";
import CreateUserForm from "./components/CreateUserForm";

const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role"); // Retrieve role from localStorage

  if (!token) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" />; // Redirect to dashboard if role doesn't match
  }

  return element;
};


function App() {
  return (
    <Router>
      <div className="max-h-screen">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/createuser" element={<ProtectedRoute element={<CreateUserForm />} requiredRole="admin"/>} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/orders" element={<ProtectedRoute element={<OrderPage />} />} />
          <Route path="/pickorders" element={<ProtectedRoute element={<PickUpItemsPage />} />} />
          <Route path="/addkeys" element={<ProtectedRoute element={<ExpandingButtonForm />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
