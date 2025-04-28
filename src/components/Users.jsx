import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "./helper/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Key, Trash2, UserCircle, X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import img from '../assets/noitems.png'

const Users = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatepwdloading, setUpdatepwdloading] = useState(false);
  const [deleteuserloading, setDeleteuserloading] = useState(false);

  const navigate = useNavigate();
  // Fetch Users API Call
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
        setLoading(false)
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);


  // Open Password Modal
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  // Update Password API Call
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
        email: selectedUser.email,
        newPassword: newPassword
      });

      toast.success("Password updated successfully!");
      setErrorMessage("");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    } finally {
      setUpdatepwdloading(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Delete User API Call
  const handleDeleteUser = async () => {
    setDeleteuserloading(true);
    try {
      await api.post("/admin/remove-user", { email: selectedUser.email });

      setUsers(users.filter(user => user.email !== selectedUser.email));
      toast.success("User deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setDeleteuserloading(false);
    }
  };

  const handleAddUser = async () => {
    navigate("/createuser")
  }

  return (
    <div className="">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={isSidebarOpen ? "main-content sidebar-open" : "px-4 py-4"}>
        <Header />
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="p-6  rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
            <span>Users List</span>
            <button
              onClick={handleAddUser} // Call the function when clicked
              className="bg-blue-600 text-sm text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Add User

            </button>
          </h2>


          {loading ? (
            <div className="flex justify-center items-center h-[700px]">
              <ClipLoader className="" size={50} color={"#AAFF00"} />
            </div>
          ) : (
            <>

              {Array.isArray(users) && users?.length === 0 ? (
                <div className="flex items-center justify-center w-full h-[700px]">
                  <img src={img} alt="No users found" className="max-w-xs" />
                </div>

              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users?.map(user => (
                    <div key={user.email} className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
                      {/* User Icon */}
                      <div className="flex-shrink-0">
                        <UserCircle size={40} className="text-gray-600" />
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-3">
                        <Key
                          size={24}
                          className="text-blue-600 cursor-pointer hover:text-blue-800"
                          onClick={() => openPasswordModal(user)}
                        />
                        <Trash2
                          size={24}
                          className="text-red-600 cursor-pointer hover:text-red-800"
                          onClick={() => openDeleteModal(user)}
                        />
                      </div>
                    </div>
                  ))}</div>

              )}

            </>
          )}

        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Update Password</h2>
              <X className="cursor-pointer" onClick={() => setShowPasswordModal(false)} />
            </div>
            <p className="text-gray-600 mb-4">Updating password for <strong>{selectedUser.email}</strong></p>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-red-600">Confirm Deletion</h2>
              <X className="cursor-pointer" onClick={() => setShowDeleteModal(false)} />
            </div>
            <p className="text-gray-600 mb-4">Are you sure want to delete <strong>{selectedUser.email}</strong>?</p>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleDeleteUser}
                disabled={deleteuserloading}
              >
                {deleteuserloading ? <ClipLoader size={20} color={'#ffffff'}></ClipLoader> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
