import React, { useState, useEffect } from "react";
import api from "./helper/api"; // Assuming you have an API helper to manage requests
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import User from '../assets/user.jpg'
import { ClipLoader } from "react-spinners";

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

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get("/keys/user_details"); // Get user details from the API
                setUserData(response.data);
                setNewUsername(response.data.username); // Set the username to be editable
            } catch (error) {
                console.error("Error fetching user data:", error);
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

                            <div className="mb-4">
                                <label className="block text-gray-600 font-semibold">Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg"
                                />
                            </div>

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
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                </div>}
            </div>
        </div>

    );
};

export default ProfilePage;
