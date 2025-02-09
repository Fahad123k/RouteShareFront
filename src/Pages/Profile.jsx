import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
            const token = localStorage.getItem("token");
            const userdata = localStorage.getItem("user");
            console.log("user data val", userdata);
            if (!token) {
                navigate("/login");
                return;
            }

            try {

                if (userdata) {
                    setUser(JSON.parse(userdata)); // Convert string back to object
                }



            } catch (error) {
                console.error("Error decoding token:", error);
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">

            <h1 className="text-2xl font-bold text-center">Profile</h1>
            {user ? (
                <div className="mt-4">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button
                        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}
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
