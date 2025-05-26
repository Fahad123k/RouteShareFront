import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

const BACKEND_API = import.meta.env.VITE_BACKEND_URL;

const Admin = () => {
    const [users, setUsers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");


    const navigate = useNavigate();
    const [journeys] = useState([
        { id: 101, userId: 1, from: "Delhi", to: "Mumbai", date: "2025-05-21" },
        { id: 102, userId: 1, from: "Mumbai", to: "Goa", date: "2025-05-22" },
    ]);

    const getUser = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${BACKEND_API}/user/users`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            enqueueSnackbar("Loading failed", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {


        const userdata = JSON.parse(localStorage.getItem("user"));
        console.log("user", userdata)
        // Check if userdata exists and has the correct role
        if (!userdata || userdata.role !== 'admin') {
            navigate('/');
            return;  // Exit early if not admin
        }
        // Only fetch users if we have a token and admin access
        if (token) {
            getUser();
        } else {
            navigate('/login');  // Redirect if no token
        }
    }, [navigate]);  // Add navigate to dependency array
    const api = {
        updateUser: async (userId, updates) => {
            setIsLoading(true);
            try {
                const response = await axios.patch(`${BACKEND_API}/user/update/${userId}`, updates, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return { success: true, data: response.data };
            } catch (error) {
                console.error("Update user error:", error);
                return { success: false, error: error.response?.data?.message || error.message };
            } finally {
                setIsLoading(false);
            }
        },

        deleteUser: async (userId) => {
            setIsLoading(true);
            try {
                await axios.delete(`${BACKEND_API}/user/delete/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return { success: true };
            } catch (error) {
                console.error("Delete user error:", error);
                return { success: false, error: error.response?.data?.message || error.message };
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = async (id) => {
        try {
            setIsLoading(true);

            // Get the current edited values from state
            const user = users.find(u => u._id === id);
            if (!user) return;

            const updates = {
                name: user.name,
                email: user.email,
                number: user.number,
                role: user.role
                // Add other fields as needed
            };

            const response = await axios.patch(
                `${BACKEND_API}/user/update/${id}`,
                updates,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }

                }
            );

            if (response.data.success) {
                enqueueSnackbar("User updated successfully", { variant: "success" });
                getUser(); // Refresh the user list
                setEditingUserId(null); // Exit edit mode
            }
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || "Update failed",
                { variant: "error" }
            );
        } finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const result = await api.deleteUser(id);
            if (result.success) {
                enqueueSnackbar("User deleted successfully", { variant: "success" });
                getUser(); // Refresh user data
            } else {
                throw new Error(result.error || "Deletion failed");
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    const toggleVerification = async (id) => {

        if (!window.confirm("Are you sure you want to verify this user?")) return;
        try {
            const user = users.find(u => u._id === id);
            if (!user) {
                enqueueSnackbar("User not found", { variant: "error" });
                return;
            }

            // Don't allow unverifying if already verified
            if (user.isVerified) {
                enqueueSnackbar("User is already verified", { variant: "info" });
                return;
            }

            const result = await api.updateUser(id, { isVerified: true });
            if (result.success) {
                enqueueSnackbar("User verified successfully", { variant: "success" });
                getUser(); // Refresh user data
            } else {
                throw new Error(result.error || "Verification failed");
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    const updateRole = async (id, role) => {
        try {
            const result = await api.updateUser(id, { role });
            if (result.success) {
                enqueueSnackbar("Role updated successfully", { variant: "success" });
                getUser(); // Refresh user data
            } else {
                throw new Error(result.error || "Role update failed");
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    const filteredJourneys = journeys.filter((j) => j.userId === selectedUserId);

    return (



        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                            <p className="text-sm text-gray-500 mt-1">Admin dashboard for managing users and their journeys</p>
                        </div>
                        {isLoading && (
                            <div className="flex items-center text-blue-600">
                                <BeatLoader size={8} color="#3b82f6" className="mr-2" />
                                <span className="text-sm">Processing...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Journeys Modal */}
                {selectedUserId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-auto">
                            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Journeys for User #{selectedUserId}
                                </h2>
                                <button
                                    onClick={() => setSelectedUserId(null)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-5">
                                {filteredJourneys.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journey ID</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredJourneys.map((journey) => (
                                                    <tr key={journey._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{journey._id}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{journey.from}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{journey.to}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{journey.date}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm("Delete this journey?")) {
                                                                        enqueueSnackbar("Journey deleted", { variant: "success" });
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No journeys found</h3>
                                        <p className="mt-1 text-sm text-gray-500">This user hasn't created any journeys yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Users Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => {
                                const isEditing = editingUserId === user._id;
                                return (
                                    <tr key={user._id} className={isEditing ? "bg-blue-50" : "hover:bg-gray-50"}>
                                        {/* Name */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={user.name}
                                                    onChange={(e) =>
                                                        setUsers(prev => prev.map(u =>
                                                            u._id === user._id ? { ...u, name: e.target.value } : u
                                                        ))
                                                    }
                                                    disabled={isLoading}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            )}
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={user.number}
                                                    maxLength={10}
                                                    minLength={10}
                                                    onChange={(e) =>
                                                        setUsers(prev => prev.map(u =>
                                                            u._id === user._id ? { ...u, number: e.target.value } : u
                                                        ))
                                                    }
                                                    disabled={isLoading}
                                                />
                                            ) : (
                                                <div className="text-sm text-gray-500">{user.number}</div>
                                            )}
                                        </td>

                                        {/* Rating */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400"
                                                        style={{ width: `${(user.rating / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="ml-2 text-sm text-gray-500">{user.rating?.toFixed(1) || 'N/A'}</span>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role}
                                                onChange={(e) => updateRole(user._id, e.target.value)}
                                                className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={isLoading}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>

                                        {/* Verification Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(user._id)}
                                                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            disabled={isLoading}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingUserId(null)}
                                                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingUserId(user._id)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                                            title="Edit user"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedUserId(user._id)}
                                                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                                                            title="View journeys"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => toggleVerification(user._id)}
                                                            disabled={isLoading || user.isVerified}
                                                            className={`${user.isVerified ? 'text-green-600' : 'text-gray-400'} hover:text-green-900 transition-colors`}
                                                            title={user.isVerified ? 'Already verified' : 'Verify user'}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                            title="Delete user"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {users.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">There are currently no users in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;