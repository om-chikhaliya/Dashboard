import React, { useState } from "react";
import { Eye, EyeOff } from "react-feather"; // Import icons
import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "./helper/api";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const CreateUserForm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();


    try {
      
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
  
      if (password !== confirmPassword) {
        setError("Passwords and confirm password must same!");
        return;
      }
  
      setError(""); // Clear any previous errors when validation is successful
  
      const userData = {
        email: email,
        password: password,
      };

      const response = await api.post('/auth/create-user', userData);

      toast.success(response.data.message);
      navigate('/users');

    } catch (error) {
      toast.error(error.response.data.error);
    }
    finally{
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear error if password is valid (length >= 8)
    if (e.target.value.length >= 8) {
      setError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Clear error if passwords match
    if (e.target.value === password) {
      setError("");
    }
  };

  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <ToastContainer position="top-right" />
        <Header />

        <div className="flex justify-center items-center max-h-screen max-w-screen p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-2/3 lg:w-2/4 min-h-[400px]">
            <div className="flex justify-center items-center">
              <h2 className="text-2xl font-bold text-center border-b-4 border-[#bbe90b] pb-2">
                Create User
              </h2>
            </div>

            <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange} // Handle password change
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

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange} // Handle confirm password change
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

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-lg mt-4 hover:bg-gray-700"
                disabled={!email || !password || !confirmPassword || error}
              >
                {loading ? <ClipLoader size={20} color={'#ffffff'}></ClipLoader> : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;

