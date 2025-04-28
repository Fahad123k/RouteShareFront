import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const [tab, setTab] = useState('myBookings'); // 'myBookings' | 'requestsReceived' | 'chat'
    const [myBookings, setMyBookings] = useState([]);
    const [requestsReceived, setRequestsReceived] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                const [myBookingsRes, requestsReceivedRes] = await Promise.all([
                    axios.get(`${BACKEND_API}/booking/my-bookings`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${BACKEND_API}/booking/requests-received`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setMyBookings(myBookingsRes.data);
                setRequestsReceived(requestsReceivedRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = async (bookingId, status) => {
        try {
            await axios.put(`${BACKEND_API}/booking/update-status/${bookingId}`,
                { status },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            // Refresh data after status change
            const updatedRequests = requestsReceived.map(b =>
                b._id === bookingId ? { ...b, status } : b
            );
            setRequestsReceived(updatedRequests);
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

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
            <h2 className="text-3xl font-semibold text-center mb-6">Bookings Dashboard</h2>

            {/* Tabs */}
            <div className="flex justify-center mb-6 space-x-4">
                <button
                    className={`px-4 py-2 rounded ${tab === 'myBookings' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTab('myBookings')}
                >
                    My Requests
                </button>
                <button
                    className={`px-4 py-2 rounded ${tab === 'requestsReceived' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTab('requestsReceived')}
                >
                    Requests Received
                </button>
                <button
                    className={`px-4 py-2 rounded ${tab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTab('chat')}
                >
                    Chat
                </button>
            </div>

            {/* Tab Content */}
            {tab === 'myBookings' && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    {myBookings.length === 0 ? (
                        <p className="text-center text-lg text-gray-600">No bookings found.</p>
                    ) : (
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
                                {myBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b">{booking.journeyId?.name || 'N/A'}</td>
                                        <td className="py-3 px-4 border-b">{booking.status}</td>
                                        <td className="py-3 px-4 border-b">{new Date(booking.createdAt).toLocaleString()}</td>
                                        <td className="py-3 px-4 border-b">
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
                    )}
                </div>
            )}

            {tab === 'requestsReceived' && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    {requestsReceived.length === 0 ? (
                        <p className="text-center text-lg text-gray-600">No requests received.</p>
                    ) : (
                        <table className="min-w-full bg-white table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-3 px-4 border-b text-sm text-gray-700">User</th>
                                    <th className="py-3 px-4 border-b text-sm text-gray-700">Journey</th>
                                    <th className="py-3 px-4 border-b text-sm text-gray-700">Status</th>
                                    <th className="py-3 px-4 border-b text-sm text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requestsReceived.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b">{request.userId?.name || 'User'}</td>
                                        <td className="py-3 px-4 border-b">{request.journeyId?.name || 'Journey'}</td>
                                        <td className="py-3 px-4 border-b">{request.status}</td>
                                        <td className="py-3 px-4 border-b space-x-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                                        onClick={() => handleStatusChange(request._id, 'accepted')}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                                        onClick={() => handleStatusChange(request._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => navigate(`/chat/${request.userId._id}`)}
                                            >
                                                Chat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {tab === 'chat' && (
                <div className="text-center py-10">
                    <p className="text-gray-600">Open your chats from the <strong>Requests Received</strong> tab.</p>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
