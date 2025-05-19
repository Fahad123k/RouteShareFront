import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
const Profile = () => {
    // enqueueSnackbar("You have been logged out!", { variant: "warning" });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
            const token = localStorage.getItem("token");
            const userdata = JSON.parse(localStorage.getItem("user"));
            console.log("User data:", userdata);



            if (!token) {
                // alert("Please login First")
                enqueueSnackbar("Please Login!", { variant: "warning" });
                navigate("/login");
                return;
            }

            try {

                if (userdata) {
                    setUser(userdata); // Convert string back to object
                }



            } catch (error) {
                console.error("Error decoding token:", error);
                enqueueSnackbar("Error decoding token", { variant: "error" });

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
                    <p><strong>Number:</strong> {user.number}</p>
                    <button
                        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
                        onClick={() => {
                            localStorage.removeItem("token");
                            enqueueSnackbar("You have been logged out!", {
                                variant: "warning"
                                ,
                                action: (key) => (
                                    <IconButton onClick={() => closeSnackbar(key)} size="small" style={{ color: "white" }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                ),
                            });

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
