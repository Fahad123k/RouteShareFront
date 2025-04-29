import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar, closeSnackbar } from 'notistack';
import socket from '../socket';

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState('myBookings');
    const [currentlyUpdatingId, setCurrentlyUpdatingId] = useState(null);
    const [bookings, setBookings] = useState({
        myBookings: [],
        requestsReceived: []
    });
    const [loading, setLoading] = useState({
        myBookings: true,
        requestsReceived: true
    });
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    // Memoized fetch function
    const fetchBookings = useCallback(async (type) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const endpoint = type === 'myBookings'
                ? `${BACKEND_API}/booking/my-bookings`
                : `${BACKEND_API}/booking/requests-received`;

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Fetched bookings for', type, response.data);

            setBookings(prev => ({
                ...prev,
                [type]: response.data
            }));
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            setError(`Failed to fetch ${type}`);
            enqueueSnackbar(`Failed to load ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`, {
                variant: 'error'
            });
        } finally {
            setLoading(prev => ({
                ...prev,
                [type]: false
            }));
        }
    }, [BACKEND_API, enqueueSnackbar, navigate]);

    // Initial data fetch
    useEffect(() => {
        fetchBookings('myBookings');
        fetchBookings('requestsReceived');

        // Socket setup
        const setupSocketListeners = () => {
            socket.connect();

            socket.on('request-received', (newRequest) => {
                enqueueSnackbar(`New booking request from ${newRequest.userId?.name || 'user'}`, {
                    variant: 'info',
                    autoHideDuration: 3000,
                    action: (key) => (
                        <button
                            onClick={() => {
                                setActiveTab('requestsReceived');
                                closeSnackbar(key);
                            }}
                            className="text-white hover:underline"
                        >
                            View
                        </button>
                    )
                });
                setBookings(prev => ({
                    ...prev,
                    requestsReceived: [newRequest, ...prev.requestsReceived]
                }));
            });

            socket.on('request-accepted', (updatedBooking) => {
                enqueueSnackbar('Your booking request was accepted!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    action: (key) => (
                        <button
                            onClick={() => {
                                navigate(`/schedule-details/${updatedBooking.journeyId._id}`);
                                closeSnackbar(key);
                            }}
                            className="text-white hover:underline"
                        >
                            View Journey
                        </button>
                    )
                });
                updateBookingStatus(updatedBooking);
            });

            socket.on('request-rejected', (updatedBooking) => {
                enqueueSnackbar('Your booking request was declined', {
                    variant: 'warning',
                    autoHideDuration: 3000
                });
                updateBookingStatus(updatedBooking);
            });

            socket.on('booking-updated', (updatedBooking) => {
                enqueueSnackbar('Booking status updated', {
                    variant: 'info',
                    autoHideDuration: 2000
                });
                updateBookingStatus(updatedBooking);
            });
        };

        const updateBookingStatus = (updatedBooking) => {
            setBookings(prev => ({
                myBookings: prev.myBookings.map(b =>
                    b._id === updatedBooking._id ? { ...b, status: updatedBooking.status } : b
                ),
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === updatedBooking._id ? { ...b, status: updatedBooking.status } : b
                )
            }));
        };

        setupSocketListeners();

        return () => {
            socket.off('request-received');
            socket.off('request-accepted');
            socket.off('request-rejected');
            socket.off('booking-updated');
            socket.disconnect();
        };
    }, [fetchBookings, enqueueSnackbar, navigate]);


    const handleStatusChange = async (bookingId, status) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                enqueueSnackbar('Please login to perform this action', {
                    variant: 'error',
                    autoHideDuration: 3000
                });
                navigate('/login');
                return;
            }

            // Optimistic UI update
            setBookings(prev => ({
                ...prev,
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === bookingId ? { ...b, status, updating: true } : b
                )
            }));

            const response = await axios.put(
                `${BACKEND_API}/booking/update-status/${bookingId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            // Update with server response
            setBookings(prev => ({
                ...prev,
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === bookingId ? { ...b, ...response.data.booking, updating: false } : b
                )
            }));

            enqueueSnackbar(response.data.message || `Booking ${status} successfully`, {
                variant: 'success',
                autoHideDuration: 2000
            });

            // Emit socket event
            const updatedBooking = bookings.requestsReceived.find(b => b._id === bookingId);
            if (updatedBooking) {
                socket.emit('booking-status-changed', {
                    bookingId,
                    status,
                    userId: updatedBooking.requestedBy?._id || updatedBooking.userId,
                    journeyId: updatedBooking.journeyId?._id
                });
            }

        } catch (error) {
            // Revert optimistic update
            setBookings(prev => ({
                ...prev,
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === bookingId ? { ...b, updating: false } : b
                )
            }));

            let errorMessage = 'Failed to update booking status';

            if (error.response) {
                // Handle backend validation errors
                errorMessage = error.response.data?.message || errorMessage;

                if (error.response.status === 401) {
                    errorMessage = 'Session expired. Please login again.';
                    localStorage.removeItem('token');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please try again.';
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }

            console.error('Booking status update failed:', {
                error: error.message,
                bookingId,
                status
            });

            enqueueSnackbar(errorMessage, {
                variant: 'error',
                autoHideDuration: 4000,
                persist: error.response?.status === 401
            });
        }
    };

    const refreshData = (tab) => {
        setLoading(prev => ({ ...prev, [tab]: true }));
        fetchBookings(tab);
    };

    if (loading.myBookings && loading.requestsReceived) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-red-500 space-y-4">
                <p>{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        refreshData('myBookings');
                        refreshData('requestsReceived');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <h1 className="text-3xl font-bold text-center mb-8">Booking Management</h1>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center mb-8 gap-2">
                {['myBookings', 'requestsReceived', 'chat'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'myBookings' && 'My Requests'}
                        {tab === 'requestsReceived' && 'Received Requests'}
                        {tab === 'chat' && 'Messages'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* My Bookings Tab */}
                {activeTab === 'myBookings' && (
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">My Booking Requests</h2>
                            <button
                                onClick={() => refreshData('myBookings')}
                                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                                disabled={loading.myBookings}
                            >
                                {loading.myBookings ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>

                        {bookings.myBookings.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No booking requests found</p>
                                <button
                                    onClick={() => navigate('/find-journey')}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Find a Journey
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journey</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bookings.myBookings.map((booking) => (
                                            <tr key={booking._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {booking.journeyId?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {booking.journeyId?.leaveFrom?.address} → {booking.journeyId?.goingTo?.address}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/schedule-details/${booking.journeyId?._id}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/chat/${booking.journeyId?.userId}`)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Message
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Requests Received Tab */}
                {activeTab === 'requestsReceived' && (
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Received Requests</h2>
                            <button
                                onClick={() => refreshData('requestsReceived')}
                                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                                disabled={loading.requestsReceived}
                            >
                                {loading.requestsReceived ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>

                        {bookings.requestsReceived.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No requests received yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journey</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bookings.requestsReceived.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                            {request.userId?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.userId?.name || 'User'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {request.userId?.email || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{request.journeyId?.name || 'Journey'}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(request.journeyId?.departureTime).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {request.status === 'pending' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={async () => {
                                                                    if (window.confirm('Are you sure you want to accept this booking?')) {
                                                                        await handleStatusChange(request._id, 'accepted');
                                                                    }
                                                                }}
                                                                disabled={request.updating}
                                                                className={`px-3 py-1 rounded text-white transition-colors ${request.updating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                                                                    }`}
                                                            >
                                                                {request.updating && request._id === currentlyUpdatingId ? (
                                                                    <span className="flex items-center">
                                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Processing...
                                                                    </span>
                                                                ) : (
                                                                    'Accept'
                                                                )}
                                                            </button>

                                                            <button
                                                                onClick={async () => {
                                                                    if (window.confirm('Are you sure you want to reject this booking?')) {
                                                                        await handleStatusChange(request._id, 'rejected');
                                                                    }
                                                                }}
                                                                disabled={request.updating}
                                                                className={`px-3 py-1 rounded text-white transition-colors ${request.updating ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                                                    }`}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => navigate(`/chat/${request.userId?._id}`)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        Chat
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/schedule-details/${request.journeyId?._id}`)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Chat Tab */}
                {activeTab === 'chat' && (
                    <div className="p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No conversation selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Select a booking request to start chatting with the {activeTab === 'myBookings' ? 'driver' : 'passenger'}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setActiveTab(bookings.myBookings.length > 0 ? 'myBookings' : 'requestsReceived')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    View Requests
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;