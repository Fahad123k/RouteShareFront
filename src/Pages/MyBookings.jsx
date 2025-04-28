



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${BACKEND_API}/booking/my-bookings`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
                    },
                });
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center py-10">Loading...</div>;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-10 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-semibold text-center mb-6">My Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-center text-lg text-gray-600">No bookings found.</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-3 px-4 border-b text-sm text-gray-700">Journey</th>
                                <th className="py-3 px-4 border-b text-sm text-gray-700">Status</th>
                                <th className="py-3 px-4 border-b text-sm text-gray-700">Created At</th>
                                <th className="py-3 px-4 border-b text-sm text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                        {booking.journeyId ? booking.journeyId.name : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                        <span
                                            className={`inline-block py-1 px-3 rounded-full text-sm ${booking.status === 'pending'
                                                ? 'bg-yellow-200 text-yellow-700'
                                                : booking.status === 'accepted'
                                                    ? 'bg-green-200 text-green-700'
                                                    : 'bg-red-200 text-red-700'
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                        {new Date(booking.createdAt).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => navigate(`/schedule-details/${booking.journeyId._id}`)}
                                        >
                                            View Journey
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookings;