import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import api from './helper/api';
import { useNavigate } from "react-router-dom";
import img1 from '../assets/noorder.png'
import { ToastContainer, toast } from "react-toastify";

const LoginSignup = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: '',
  });
  const [signupErrors, setSignupErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Check if credentials are saved in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setLoginData({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }, []);

  // Validate form fields
  const validateLogin = () => {
    let isValid = true;
    let errors = {};

    if (!loginData.email || !/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (loginData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    setLoginErrors(errors);
    return isValid;
  };

  const validateSignup = () => {
    let isValid = true;
    let errors = {};

    if (!signupData.email || !/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (signupData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
      isValid = false;
    }

    setSignupErrors(errors);
    return isValid;
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    // Remove error on change
    if (e.target.name === 'email' && loginErrors.email) {
      setLoginErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }
    if (e.target.name === 'password' && loginErrors.password) {
      setLoginErrors((prevErrors) => ({ ...prevErrors, password: '' }));
    }
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });

    // Remove error on change
    if (e.target.name === 'email' && signupErrors.email) {
      setSignupErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }
    if (e.target.name === 'password' && signupErrors.password) {
      setSignupErrors((prevErrors) => ({ ...prevErrors, password: '' }));
    }
    if (e.target.name === 'confirmPassword' && signupErrors.confirmPassword) {
      setSignupErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine which form is active (login or signup)
    if (activeTab === 'login' && validateLogin()) {
      try {

        // Login API Request
        const loginResponse = await axios.post("http://localhost:4000/api/auth/login", {
          email: loginData.email,
          password: loginData.password,
        });

        // Store access token
        localStorage.setItem("accessToken", loginResponse.data.token);
        localStorage.setItem("role", loginResponse.data.role);
        localStorage.setItem("username", loginData.email);

        // Save credentials if "Remember Me" is checked
        if (loginData.rememberMe) {
          localStorage.setItem("rememberedEmail", loginData.email);
          localStorage.setItem("rememberedPassword", loginData.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }


        const idResponse = await api.get('/keys/my-keys');


        // Check if all four IDs exist
        // const hasAllIds = await idResponse.data.bricklink && idResponse.data.brickowl;

        // Navigate based on the response
        // navigate(hasAllIds ? "/dashboard" : "/addkeys");

        // setTimeout(() => {
        navigate(idResponse.data ? "/dashboard" : "/addkeys");
        // }, 500);

      } catch (error) {
        toast.error(error.response.data.error)

      }

    } else if (activeTab === 'signup' && validateSignup()) {

      // Send signup request using Axios
      axios.post('http://localhost:4000/api/auth/register-admin', {
        email: signupData.email,
        password: signupData.password
      })
        .then(response => {
          toast.success(response.data.message)
          setActiveTab('login')
        })
        .catch(error => {
          toast.error(error.response.data.error)
        });
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      // Call your backend forgot password API here
      const response = await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute inset-0 bg-cover bg-center blur-lg" style={{ backgroundImage: `url(${img1})` }} />
      <div className="relative z-10 w-full max-w-lg p-10 bg-white shadow-lg rounded-xl border border-gray-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome to Brickosys!</h2>
          <p className="text-gray-600">Please sign in to continue or create a new account</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-6 py-3 w-full text-lg font-semibold rounded-t-lg transition-colors duration-300 ${activeTab === 'login' ? 'border-b-4 border-[#d4ff1f] text-black' : 'text-gray-800 hover:bg-gray-100'}`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`px-6 py-3 w-full text-lg font-semibold rounded-t-lg transition-colors duration-300 ${activeTab === 'signup' ? 'border-b-4 border-[#d4ff1f] text-black' : 'text-gray-800 hover:bg-gray-100'}`}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        {activeTab === 'login' ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-800 mb-2">Email</label>
              <input
                id="loginEmail"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter your email"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
              />
              {loginErrors.email && <p className="text-red-500 text-sm">{loginErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-800 mb-2">Password</label>
              <div className="relative">
                <input
                  id="loginPassword"
                  name="password"
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                />
                <span
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute top-5 right-3 cursor-pointer"
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {loginErrors.password && <p className="text-red-500 text-sm">{loginErrors.password}</p>}
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-gray-800">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={loginData.rememberMe}
                  onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                />
                Remember Me
              </label>
              {/* <a href="#" className="text-sm text-gray-800 hover:underline">Forgot Password?</a> */}
              <span
                className="text-sm text-gray-800 hover:underline cursor-pointer"
                onClick={() => {
                  if (!loginData.email.trim()) {
                    toast.error("Please enter your email to reset your password.");
                  } else {
                    handleForgotPassword(loginData.email);
                  }
                }}
              >
                Forgot Password?
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none transition duration-300"
            >
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-800 mb-2">Email</label>
              <input
                id="signupEmail"
                name="email"
                type="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="Enter your email"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
              />
              {signupErrors.email && <p className="text-red-500 text-sm">{signupErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-800 mb-2">Password</label>
              <div className="relative">
                <input
                  id="signupPassword"
                  name="password"
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Enter your password"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                />
                <span
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute top-5 right-3 cursor-pointer"
                >
                  {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {signupErrors.password && <p className="text-red-500 text-sm">{signupErrors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showSignupConfirmPassword ? 'text' : 'password'}
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm your password"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                />
                <span
                  onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                  className="absolute top-5 right-3 cursor-pointer"
                >
                  {showSignupConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {signupErrors.confirmPassword && <p className="text-red-500 text-sm">{signupErrors.confirmPassword}</p>}
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-gray-800">
                <input type="checkbox" className="mr-2" />
                I agree to the Terms & Conditions
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none transition duration-300"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>

  );
};

export default LoginSignup;
