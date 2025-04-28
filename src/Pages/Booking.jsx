import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // for making API request

import { useSnackbar } from 'notistack';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    const { travelDetails } = location.state || {}; // 👈 Get travel details safely

    if (!travelDetails) {
        return <div>No travel details found. Please select a journey first.</div>;
    }

    const handleBooking = async () => {
        try {
            // Make API call to backend to create booking
            const token = localStorage.getItem("token"); // assuming token stored here after login

            const response = await axios.post(
                'http://localhost:8000/booking/book',
                { journeyId: travelDetails._id }, // 👈 Sending journey ID
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(response.data);
            enqueueSnackbar("Booking successful!", { variant: "success" }); // ✅ Success Notification

            navigate("/my-bookings"); // redirect after booking if you want

        } catch (error) {
            console.error("Booking failed:", error);

            enqueueSnackbar(error.response?.data?.message || "Booking failed. Try again.", { variant: "error" }); // ✅ Success Notification
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
            <div className="bg-white shadow p-4 rounded mb-4">
                <p><strong>From:</strong> {travelDetails.leaveFrom?.coordinates}</p>
                <p><strong>To:</strong> {travelDetails.goingTo?.coordinates}</p>
                <p><strong>Fare:</strong> {travelDetails.fareStart}</p>
            </div>

            <button
                onClick={handleBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Confirm Booking
            </button>
        </div>
    );
};

export default Booking;
