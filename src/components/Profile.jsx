import React, { useState, useEffect } from "react";
import api from "./helper/api"; // Assuming you have an API helper to manage requests
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import User from '../assets/user.jpg'
import { ClipLoader } from "react-spinners";
import { X } from 'lucide-react'

const ProfilePage = () => {
    // States for user data
    const [userData, setUserData] = useState({
        email: "",
        username: "",
        role: "",
    });
    const [newUsername, setNewUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [updatepwdloading, setUpdatepwdloading] = useState(false);

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get("/keys/user_details"); // Get user details from the API
                setUserData(response.data);
                setNewUsername(response.data.username); // Set the username to be editable
            } catch (error) {
                toast.error("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Handle the save button click
    const handleSave = async () => {
        try {
            // Check if the username has changed
            if (newUsername !== userData.username) {
                await api.post("/keys/user_details_update", { newUsername: newUsername }); // Send the updated username to the API
                toast.success("Username updated successfully!");
                setUserData((prev) => ({ ...prev, username: newUsername })); // Update the userData state with the new username
            } else {
                toast.info("No changes to save.");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            toast.error("Failed to update username.");
        }
    };

    const [newPassword, setNewPassword] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleUpdatePassword = async () => {
        setUpdatepwdloading(true);
        if (!newPassword) {
            toast.error("Please enter a new password!");
            setUpdatepwdloading(false);
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            setUpdatepwdloading(false);
            return;
        }

        try {
            await api.post("/admin/users/password", {
                email: userData.email,
                newPassword: newPassword
            });

            localStorage.removeItem('passwordReset');
            toast.success("Password updated successfully!");
            setErrorMessage("");
            setShowPasswordModal(false);
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password.");
        }finally{
            setUpdatepwdloading(false);
        }
    };

    const openPasswordModal = () => {

        setNewPassword("");
        setShowPasswordModal(true);
    };

    return (
        <div className="">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className={isSidebarOpen ? "main-content sidebar-open" : "px-4 py-4"}>
                <Header />
                <ToastContainer position="top-right" autoClose={3000} />
                {loading ? <div className="flex justify-center items-center h-[700px]"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> : <div className="grid gap-4">



                    <div className="container mx-auto p-6 max-w-[60%]">

                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            {/* <div className="flex justify-center mb-6">
                                
                                <img
                                    src={User}
                                    alt="Profile"
                                    className="rounded-full w-32 h-32 object-cover"
                                />
                            </div> */}

                            <div className="mb-4">
                                <label className="block text-gray-600 font-semibold">Email</label>
                                <input
                                    type="text"
                                    value={userData.email}
                                    disabled
                                    className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg"
                                />
                            </div>

                            {/* <div className="mb-4">
                                <label className="block text-gray-600 font-semibold">Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg"
                                />
                            </div> */}

                            <div className="mb-4">
                                <label className="block text-gray-600 font-semibold">Role</label>
                                <input
                                    type="text"
                                    value={userData.role}
                                    disabled
                                    className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg"
                                />
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => openPasswordModal()}
                                    className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Update Password
                                </button>
                                {/* <button
                                    onClick={handleSave}
                                    className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save
                                </button> */}
                            </div>
                        </div>
                    </div>

                </div>}
            </div>

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Update Password</h2>
                            <X className="cursor-pointer" onClick={() => setShowPasswordModal(false)} />
                        </div>
                        <p className="text-gray-600 mb-4">Updating password for <strong>{userData.email}</strong></p>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 p-2 rounded-md mb-4"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        {/* Display error message if password length is less than 8 */}
                        {errorMessage && (
                            <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
                        )}

                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
                            onClick={handleUpdatePassword}
                            disabled={updatepwdloading}
                        >
                            {updatepwdloading ? <ClipLoader size={20} color={'#ffffff'}></ClipLoader> : 'Update Password'}
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default ProfilePage;
