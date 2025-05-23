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

        const token = localStorage.getItem("token");
        const userdata = JSON.parse(localStorage.getItem("user"));
        console.log(userdata)
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
                const response = await axios.patch(`${BACKEND_API}/user/update/${userId}`, updates);
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
                await axios.delete(`${BACKEND_API}/user/delete/${userId}`);
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
                        'Content-Type': 'application/json'
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
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md mt-8">
            <h1 className="text-2xl font-bold mb-2 text-center">Admin - User Management</h1>
            <p className="mb-4 text-right text-sm text-gray-600">
                {isLoading && <span className="ml-2 text-blue-500">Processing...</span>}
            </p>

            <div className="overflow-x-auto rounded-lg border shadow-sm ">
                {selectedUserId && (
                    <div className="flex items-center justify-center  bg-white w-full">
                        <div className="bg-gray-50 border p-4 rounded shadow-md mt-4 ">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold">
                                    Journeys of User #{selectedUserId}
                                </h2>
                                <button
                                    onClick={() => setSelectedUserId(null)}
                                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Close
                                </button>
                            </div>

                            {filteredJourneys.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto border">
                                        <thead className="bg-gray-200 text-gray-700">
                                            <tr>
                                                <th className="p-2 border">Journey ID</th>
                                                <th className="p-2 border">From</th>
                                                <th className="p-2 border">To</th>
                                                <th className="p-2 border">Date</th>
                                                <th className="p-2 border">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredJourneys.map((journey) => (
                                                <tr key={journey._id} className="text-center">
                                                    <td className="p-2 border">{journey._id}</td>
                                                    <td className="p-2 border">{journey.from}</td>
                                                    <td className="p-2 border">{journey.to}</td>
                                                    <td className="p-2 border">{journey.date}</td>
                                                    <td className="p-2 border">
                                                        <button
                                                            className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                                            onClick={() => {
                                                                if (window.confirm("Delete this journey?")) {
                                                                    enqueueSnackbar("Journey deleted", { variant: "success" });
                                                                }
                                                            }}
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
                                <p className="text-sm text-gray-500">No journeys found for this user.</p>
                            )}
                        </div>
                    </div>
                )}
                <table className="min-w-full text-sm text-left table-auto">
                    <thead className="bg-gray-100 sticky top-2 text-gray-700 font-semibold">
                        <tr>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Email</th>
                            <th className="p-3 border-b">Phone</th>
                            <th className="p-3 border-b">Rating</th>
                            <th className="p-3 border-b">Role</th>
                            <th className="p-3 border-b">Verified</th>
                            <th className="p-3 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">

                        {users.map((user) => {
                            const isEditing = editingUserId === user._id;
                            return (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="p-3">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full border rounded px-2 py-1"
                                                defaultValue={user.name}
                                                onChange={(e) =>
                                                    setUsers(prev => prev.map(u =>
                                                        u._id === user._id ? { ...u, name: e.target.value } : u
                                                    ))
                                                }
                                                disabled={isLoading}
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full border rounded px-2 py-1"
                                                defaultValue={user.number}
                                                onChange={(e) =>
                                                    setUsers(prev => prev.map(u =>
                                                        u.id === user.id ? { ...u, number: e.target.value } : u
                                                    ))
                                                }
                                                disabled={isLoading}
                                            />
                                        ) : (
                                            user.number
                                        )}
                                    </td>
                                    <td className="p-3">{user.rating}</td>
                                    <td className="p-3">
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateRole(user._id, e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        // disabled={isLoading || user.isVerified} // Disable if verified
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => toggleVerification(user._id)}
                                            className={`px-3 py-1 rounded text-white ${user.isVerified ? "bg-green-600" : "bg-red-600"}`}
                                            disabled={isLoading || user.isVerified} // Disable if already verified
                                        >
                                            {user.isVerified ? "Verified" : "Verify"}
                                        </button>
                                    </td>
                                    <td className="p-3 text-center space-x-2 whitespace-nowrap">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(user._id)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingUserId(null)}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setEditingUserId(user._id)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setSelectedUserId(user._id)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    Journeys
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


        </div>
    );
};

export default Admin;