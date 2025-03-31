import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import OrderPage from "./components/OrderPage";
import PickUpItemsPage from "./components/PickUpItemPage";
import "./index.css";
import LoginSignup from "./components/Login";
import ExpandingButtonForm from "./components/ExpandingButtonForm";
import CreateUserForm from "./components/CreateUserForm";
import Setting from "./components/Setting";
import Header from "./components/Header";
import accessdenied from './assets/accessdenied2.png'
import { Unmatchlot } from "./components/Unmatchlot";
import Users from "./components/Users";
import { WishList } from "./components/WishList";
import {Price} from './components/Price';

import AdminLogs from "./components/AdminLogs";
import ProfilePage from "./components/Profile";

const ProtectedRoute = ({ element, requiredRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (<div className="app">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`main-content lg:ml-[240px]`}>

        <Header />
        <div className="flex justify-center items-center p-6">
          <img src={accessdenied} alt="" className="w-80 h-80 object-contain" />
        </div>

      </div>
    </div>)

  }

  return element;
};


function App() {
  return (
    <Router>
      <div className="max-h-screen">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/createuser" element={<ProtectedRoute element={<CreateUserForm />} requiredRole="admin" />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/orders" element={<ProtectedRoute element={<OrderPage />} />} />
          <Route path="/mismatchlot" element={<ProtectedRoute element={<Unmatchlot />} />} />
          <Route path="/pickorders" element={<ProtectedRoute element={<PickUpItemsPage />} />} />
          <Route path="/addkeys" element={<ProtectedRoute element={<ExpandingButtonForm />} />} />
          <Route path="/setting" element={<ProtectedRoute element={<Setting />} requiredRole="admin" />} />
          <Route path="/users" element={<ProtectedRoute element={<Users />} requiredRole="admin" />} />
          <Route path="/wishlist" element={<ProtectedRoute element={<WishList />}  />} />
          <Route path="/price" element={<ProtectedRoute element={<Price />} requiredRole="admin" />} />
          <Route path="/logs" element={<ProtectedRoute element={<AdminLogs />} requiredRole="admin" />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
