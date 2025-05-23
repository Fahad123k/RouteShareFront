import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const Profile = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const navigate = useNavigate();
    const BACKEND_API = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        const fetchUser = () => {
            const token = localStorage.getItem("token");
            const userdata = JSON.parse(localStorage.getItem("user"));
            console.log("user data", userdata)
            if (!token) {
                enqueueSnackbar("Please Login!", { variant: "warning" });
                navigate("/login");
                return;
            }

            if (userdata) {
                setUser(userdata);
                setUpdatedData(userdata);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setUpdatedData({
            ...updatedData,
            [e.target.name]: e.target.value,
        });
    };


    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                enqueueSnackbar("You must be logged in!", { variant: "error" });
                return;
            }

            const response = await axios.put(
                `${BACKEND_API}/user/update`,  // Make sure this matches your backend route
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Assuming response.data.user contains updated user info
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            enqueueSnackbar("Profile updated!", { variant: "success" });
            setEditMode(false);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(
                error.response?.data?.message || "Failed to update profile",
                { variant: "error" }
            );
        }
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        enqueueSnackbar("You have been logged out!", {
            variant: "warning",
            action: (key) => (
                <IconButton onClick={() => closeSnackbar(key)} size="small" style={{ color: "white" }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            ),
        });
        navigate("/login");
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Profile</h1>
                {!editMode && (
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => setEditMode(true)}
                    >
                        Update
                    </button>
                )}
            </div>

            {user ? (
                <div className="space-y-3">
                    <div>
                        <label className="font-semibold">Name:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="name"
                                value={updatedData.name}
                                onChange={handleChange}
                                className="w-full mt-1 border p-2 rounded"
                            />
                        ) : (
                            <p className="text-gray-700">{user.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Email:</label>
                        {editMode ? (
                            <input
                                type="email"
                                name="email"
                                value={updatedData.email}
                                onChange={handleChange}
                                className="w-full mt-1 border p-2 rounded"
                            />
                        ) : (
                            <p className="text-gray-700">{user.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Number:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="number"
                                value={updatedData.number}
                                onChange={handleChange}
                                className="w-full mt-1 border p-2 rounded"
                            />
                        ) : (
                            <p className="text-gray-700">{user.number}</p>
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Rating:</label>
                        <p className="text-gray-700">
                            {user.rating > 0 ? user.rating : "No rating"}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold">Verified:</label>
                        <p className={`text-sm font-medium ${user.isVerified ? "text-green-600" : "text-red-600"}`}>
                            {user.isVerified ? "Verified" : "Not verified"}
                        </p>
                    </div>

                    {editMode && (
                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded mt-4"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>
                    )}

                    <button
                        className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default Profile;
