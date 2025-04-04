import React, { useState } from "react";
import { Eye, EyeOff } from "react-feather"; // Import icons
import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "./helper/api";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const CreateUserForm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    

    const userData = {
      email: email,
      password: password,
    };
    
    try {
      // Send POST request to API
      const response = await api.post('/auth/create-user', userData);
      
      toast.success(response.data.message)

      navigate('/dashboard')

    } catch (error) {
      toast.error(error.response.data.error)
      
    }

  };

  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""} `}>
      <ToastContainer position="top-right" />
        <Header />

        <div className="flex justify-center items-center max-h-screen max-w-screen p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-2/3 lg:w-2/4 min-h-[400px]">
            {/* Form Header */}
            <div className="flex justify-center items-center">
              <h2 className="text-2xl font-bold text-center border-b-4 border-[#bbe90b] pb-2">
                Create User
              </h2>
            </div>

            {/* Form */}
            <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              {/* Password Field with Eye Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password Field with Eye Toggle */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full p-3 border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-lg pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-lg mt-4 hover:bg-gray-700"
                disabled={!email || !password || !confirmPassword || error}
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
