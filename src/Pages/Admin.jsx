import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";


import BeatLoader from "react-spinners/BeatLoader";

const BACKEND_API = import.meta.env.VITE_BACKEND_URL;

const Admin = () => {
    // Sample data
    const [users, setUsers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState("");
    // const [loading, setLoading] = useState(false)
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getUser = async () => {
        try {
            setIsLoading(true);
            console.log("Fetching users...");

            const response = await axios.get(`${BACKEND_API}/user/users`);
            console.log("Response:", typeof (response.data));

            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            enqueueSnackbar("Loading failed", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        getUser()
        console.log(users)
    }, []);

    const [journeys] = useState([
        { id: 101, userId: 1, from: "Delhi", to: "Mumbai", date: "2025-05-21" },
        { id: 102, userId: 1, from: "Mumbai", to: "Goa", date: "2025-05-22" },
        // ... other journeys
    ]);



    // API call placeholders
    const api = {
        updateUser: async (userId, updates) => {
            setIsLoading(true);
            try {
                // Replace with actual API call
                // const response = await fetch(`/api/users/${userId}`, {
                //   method: 'PATCH',
                //   body: JSON.stringify(updates)
                // });
                // return await response.json();

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true };
            } catch (error) {
                throw error;
            } finally {
                setIsLoading(false);
            }
        },

        deleteUser: async (userId) => {
            setIsLoading(true);
            try {
                // Replace with actual API call
                // const response = await fetch(`/api/users/${userId}`, {
                //   method: 'DELETE'
                // });
                // return await response.json();

                await new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true };
            } catch (error) {
                throw error;
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = async (id, key, value) => {
        try {
            const updates = { [key]: value };
            const result = await api.updateUser(id, updates);

            if (result.success) {
                setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
                toast.success("User updated successfully");
            }
        } catch (error) {
            toast.error("Failed to update user");
            console.error("Update error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const result = await api.deleteUser(id);

            if (result.success) {
                setUsers(prev => prev.filter(user => user.id !== id));
                toast.success("User deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete user");
            console.error("Delete error:", error);
        }
    };

    const toggleVerification = async (id) => {
        try {
            const user = users.find(u => u.id === id);
            const newStatus = !user.isVerified;
            const result = await api.updateUser(id, { isVerified: newStatus });

            if (result.success) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: newStatus } : u));
                toast.success(`User ${newStatus ? "verified" : "unverified"}`);
            }
        } catch (error) {
            toast.error("Failed to update verification status");
            console.error("Verification error:", error);
        }
    };

    const updateRole = async (id, role) => {
        try {
            const result = await api.updateUser(id, { role });

            if (result.success) {
                setUsers(prev => prev.map(user => user.id === id ? { ...user, role } : user));
                toast.success("Role updated successfully");
            }
        } catch (error) {
            toast.error("Failed to update role");
            console.error("Role update error:", error);
        }
    };

    const filteredJourneys = journeys.filter((j) => j.userId === selectedUserId);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md mt-8">
            <h1 className="text-2xl font-bold mb-2 text-center">Admin - User Management</h1>

            <p className="mb-4 text-right text-sm text-gray-600">
                {/* 🧾 Total Users: {users.length} */}
                {isLoading && <span className="ml-2 text-blue-500">Processing...</span>}
            </p>

            <div className="overflow-x-auto rounded-lg border shadow-sm">
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


                        {users.map((user, index) => {
                            const isEditing = editingUserId === user.id;
                            return (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full border rounded px-2 py-1"
                                                value={user.name}
                                                onChange={(e) => handleEdit(user.id, "name", e.target.value)}
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
                                                value={user.number}
                                                onChange={(e) => handleEdit(user.id, "number", e.target.value)}
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
                                            onChange={(e) => updateRole(user.id, e.target.value)}
                                            className="border px-2 py-1 rounded"
                                            disabled={isLoading}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="moderator">Moderator</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => toggleVerification(user.id)}
                                            className={`px-3 py-1 rounded text-white ${user.isVerified ? "bg-green-600" : "bg-red-600"
                                                }`}
                                            disabled={isLoading}
                                        >
                                            {user.isVerified ? "Yes" : "No"}
                                        </button>
                                    </td>
                                    <td className="p-3 text-center space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() =>
                                                setEditingUserId(editingUserId === user.id ? null : user.id)
                                            }
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                            disabled={isLoading}
                                        >
                                            {isEditing ? "Save" : "Edit"}
                                        </button>
                                        <button
                                            onClick={() => setSelectedUserId(user.id)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                                            disabled={isLoading}
                                        >
                                            Journeys
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                            disabled={isLoading}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedUserId && (
                <div className="bg-gray-50 border p-4 rounded shadow-md mt-4">
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
                                        <tr key={journey.id} className="text-center">
                                            <td className="p-2 border">{journey.id}</td>
                                            <td className="p-2 border">{journey.from}</td>
                                            <td className="p-2 border">{journey.to}</td>
                                            <td className="p-2 border">{journey.date}</td>
                                            <td className="p-2 border">
                                                <button
                                                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                                    onClick={() => {
                                                        if (window.confirm("Delete this journey?")) {
                                                            // Add journey deletion logic here
                                                            toast.success("Journey deleted");
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
            )}
        </div>
    );
};

export default Admin;