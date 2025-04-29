import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import io from 'socket.io-client';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [socket, setSocket] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const { travelDetails } = location.state || {};

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://localhost:8000', {
            withCredentials: true,
            autoConnect: false
        });

        // Only connect if user is authenticated
        if (localStorage.getItem('token')) {
            newSocket.connect();
            setSocket(newSocket);
        }

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    // Handle incoming notifications
    useEffect(() => {
        if (!socket) return;

        socket.on('booking-notification', (data) => {
            enqueueSnackbar(`Booking status: ${data.status}`, {
                variant: data.status === 'accepted' ? 'success' : 'warning'
            });
        });

        socket.on('booking-error', (error) => {
            enqueueSnackbar(error.message, { variant: 'error' });
        });

        return () => {
            socket.off('booking-notification');
            socket.off('booking-error');
        };
    }, [socket, enqueueSnackbar]);

    if (!travelDetails) {
        return (
            <div className="p-4 text-center">
                <h2 className="text-xl font-bold mb-4">No Journey Selected</h2>
                <p className="mb-4">Please select a journey from the search results first.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Search
                </button>
            </div>
        );
    }

    const handleBooking = async () => {
        setIsBooking(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.post(
                'http://localhost:8000/booking/book',
                {
                    journeyId: travelDetails._id,
                    receiverUserId: travelDetails.userId,
                    socketId: socket?.id  // Send current socket ID
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                }
            );

            enqueueSnackbar('Booking request sent!', { variant: 'success' });

            // Wait for notification or timeout
            await new Promise((resolve) => {
                const timer = setTimeout(() => {
                    navigate('/my-bookings');
                    resolve();
                }, 3000);

                socket?.once('booking-update', () => {
                    clearTimeout(timer);
                    navigate('/my-bookings');
                    resolve();
                });
            });

        } catch (error) {
            let errorMessage = 'Booking failed. Please try again.';
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
                if (error.response.status === 401) {
                    navigate('/login');
                }
            } else if (error.request) {
                errorMessage = 'No response from server. Check your connection.';
            }

            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Confirm Your Booking</h2>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 gap-4">
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Journey Details</h3>
                        <p><span className="font-medium">From:</span> {travelDetails.leaveFrom.coordinates || 'N/A'}</p>
                        <p><span className="font-medium">To:</span> {travelDetails.goingTo.coordinates || 'N/A'}</p>
                    </div>

                    <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Travel Information</h3>
                        <p><span className="font-medium">Departure:</span> {new Date(travelDetails.date).toLocaleString()}</p>
                        <p><span className="font-medium">Vehicle:</span> {travelDetails.vehicleType || 'N/A'}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                        <p className="text-xl font-bold">
                            {travelDetails.fareStart || '0.00'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 transition"
                >
                    Back
                </button>
                <button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className={`flex-1 px-4 py-3 rounded-lg text-white transition ${isBooking ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isBooking ? 'Processing...' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
};

export default Booking;