import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import socket from '../socket'; // Ensure proper socket import

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState('myBookings');
    const [bookings, setBookings] = useState({
        myBookings: [],
        requestsReceived: []
    });
    const [loading, setLoading] = useState({
        myBookings: true,
        requestsReceived: true
    });
    const [socketConnected, setSocketConnected] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    // Memoized fetch function with retry logic
    const fetchBookings = useCallback(async (type, retryCount = 0) => {
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
                timeout: 10000
            });

            setBookings(prev => ({
                ...prev,
                [type]: response.data.data || response.data
            }));
        } catch (err) {
            if (retryCount < 2) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return fetchBookings(type, retryCount + 1);
            }
            enqueueSnackbar(
                `Failed to load ${type === 'myBookings' ? 'your bookings' : 'received requests'}`,
                { variant: 'error' }
            );
            console.error(`Error fetching ${type}:`, err);
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    }, [BACKEND_API, enqueueSnackbar, navigate]);

    // Socket event handlers
    const setupSocketListeners = useCallback(() => {
        if (!socket) return;

        const onConnect = () => {
            setSocketConnected(true);
            console.log('Socket connected');
        };

        const onDisconnect = () => {
            setSocketConnected(false);
            console.log('Socket disconnected');
        };

        const onRequestReceived = (newRequest) => {
            enqueueSnackbar(`New booking request from ${newRequest.user?.name || 'traveler'}`, {
                variant: 'info',
                action: (key) => (
                    <button
                        onClick={() => {
                            setActiveTab('requestsReceived');
                            enqueueSnackbar.close(key);
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
        };

        const onBookingUpdate = (updatedBooking) => {
            const statusMessages = {
                accepted: { msg: 'Booking accepted!', variant: 'success' },
                rejected: { msg: 'Booking declined', variant: 'warning' },
                cancelled: { msg: 'Booking cancelled', variant: 'error' }
            };

            if (statusMessages[updatedBooking.status]) {
                const { msg, variant } = statusMessages[updatedBooking.status];
                enqueueSnackbar(msg, { variant });
            }

            setBookings(prev => ({
                myBookings: prev.myBookings.map(b =>
                    b._id === updatedBooking._id ? { ...b, ...updatedBooking } : b
                ),
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === updatedBooking._id ? { ...b, ...updatedBooking } : b
                )
            }));
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('booking-request', onRequestReceived);
        socket.on('booking-update', onBookingUpdate);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('booking-request', onRequestReceived);
            socket.off('booking-update', onBookingUpdate);
        };
    }, [enqueueSnackbar]);

    // Initial data fetch and socket setup
    useEffect(() => {
        fetchBookings('myBookings');
        fetchBookings('requestsReceived');

        const cleanupSocket = setupSocketListeners();
        socket.connect();

        return () => {
            cleanupSocket();
            socket.disconnect();
        };
    }, [fetchBookings, setupSocketListeners]);

    // Handle booking status changes
    const handleStatusChange = async (bookingId, status) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Optimistic update
            setBookings(prev => ({
                ...prev,
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === bookingId ? { ...b, status, isUpdating: true } : b
                )
            }));

            const response = await axios.patch(
                `${BACKEND_API}/booking/${bookingId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 8000
                }
            );

            // Update with server response
            setBookings(prev => ({
                ...prev,
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === bookingId ? { ...response.data, isUpdating: false } : b
                )
            }));

            enqueueSnackbar(`Booking ${status} successfully`, { variant: 'success' });

            // Notify the other user
            const booking = bookings.requestsReceived.find(b => b._id === bookingId);
            if (booking) {
                socket.emit('booking-status-update', {
                    bookingId,
                    status,
                    userId: booking.userId,
                    journeyId: booking.journeyId
                });
            }
        } catch (error) {
            // Revert optimistic update
            setBookings(prev => ({
                ...prev,
                requestsReceived: prev.requestsReceived.map(b =>
                    b._id === bookingId ? { ...b, isUpdating: false } : b
                )
            }));

            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to update booking status';

            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    // Refresh data function
    const refreshData = (tab) => {
        setLoading(prev => ({ ...prev, [tab]: true }));
        fetchBookings(tab);
    };

    // Loading state
    if (loading.myBookings && loading.requestsReceived) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Tab configuration
    const tabs = [
        { id: 'myBookings', label: 'My Requests' },
        { id: 'requestsReceived', label: 'Received Requests' },
        { id: 'chat', label: 'Messages' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold text-center mb-8">Your Bookings</h1>

            {/* Connection status badge */}
            <div className="flex justify-center mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${socketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {socketConnected ? 'Live updates connected' : 'Reconnecting...'}
                </span>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center mb-8 gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* My Bookings Tab */}
                {activeTab === 'myBookings' && (
                    <BookingList
                        key={bookings._id}
                        bookings={bookings.myBookings}
                        loading={loading.myBookings}
                        type="myBookings"
                        onRefresh={() => refreshData('myBookings')}
                        onStatusChange={handleStatusChange}
                        navigate={navigate}
                    />
                )}

                {/* Received Requests Tab */}
                {activeTab === 'requestsReceived' && (
                    <BookingList
                        bookings={bookings.requestsReceived}
                        loading={loading.requestsReceived}
                        type="requestsReceived"
                        onRefresh={() => refreshData('requestsReceived')}
                        onStatusChange={handleStatusChange}
                        navigate={navigate}
                    />
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
                                Select a booking request to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Subcomponent for booking lists
const BookingList = ({ bookings, loading, type, onRefresh, onStatusChange, navigate }) => {
    const isReceivedRequests = type === 'requestsReceived';

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {isReceivedRequests ? 'Received Requests' : 'My Booking Requests'}
                </h2>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm flex items-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Refreshing...
                        </>
                    ) : (
                        'Refresh'
                    )}
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">
                        {isReceivedRequests
                            ? 'No requests received yet'
                            : 'No booking requests found'}
                    </p>
                    {!isReceivedRequests && (
                        <button
                            onClick={() => navigate('/find-journey')}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Find a Journey
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {isReceivedRequests && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Passenger
                                    </th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Journey Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => (
                                <BookingRow
                                    key={booking._id}

                                    booking={booking}
                                    isReceivedRequests={isReceivedRequests}
                                    onStatusChange={onStatusChange}
                                    navigate={navigate}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Subcomponent for individual booking rows
const BookingRow = ({ booking, isReceivedRequests, onStatusChange, navigate }) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800'
    };

    return (
        <tr key={booking._id} className="hover:bg-gray-50">
            {/* Passenger Column (only for received requests) */}
            {isReceivedRequests && (
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {booking.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {booking.user?.name || 'User'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {booking.user?.email || ''}
                            </div>
                        </div>
                    </div>
                </td>
            )}

            {/* Journey Details Column */}
            <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                    {booking.journey?.name || 'Journey'}
                </div>
                <div className="text-sm text-gray-500">
                    {booking.journey?.leaveFrom?.address} → {booking.journey?.goingTo?.address}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    {new Date(booking.journey?.departureTime).toLocaleString()}
                </div>
            </td>

            {/* Status Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                    {booking.status}
                </span>
            </td>

            {/* Actions Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {isReceivedRequests && booking.status === 'pending' && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onStatusChange(booking._id, 'accepted')}
                            disabled={booking.isUpdating}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => onStatusChange(booking._id, 'rejected')}
                            disabled={booking.isUpdating}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Reject
                        </button>
                    </div>
                )}
                <button
                    onClick={() => navigate(`/chat/${isReceivedRequests ? booking.user?._id : booking.journey?.userId}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Chat
                </button>
                <button
                    onClick={() => navigate(`/schedule-details/${booking.journey?._id}`)}
                    className="px-3 py-1 text-gray-700 hover:text-gray-900"
                >
                    Details
                </button>
            </td>
        </tr>
    );
};

export default MyBookings;