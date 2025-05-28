import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { calculateArrivalTime } from '../utils/timeUtils';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';





const updateUserRating = async (userId, newRating, token) => {
    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    try {
        const response = await axios.patch(
            `${BACKEND_API}/user/updaterating/${userId}`,
            { rating: newRating },
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            }
        );
        return response.data;
    } catch (err) {
        throw err.response?.data?.message || err.message || 'Failed to update rating';
    }
};

// Subcomponent: Loading Indicator
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading journey details...</p>
    </div>
);

// Subcomponent: Error Display
const ErrorDisplay = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
            {error}
        </div>
        <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
            Try Again
        </button>
    </div>
);

// Subcomponent: No Data Found
const NoDataFound = ({ onNavigateHome }) => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="bg-gray-100 border border-gray-300 px-4 py-3 rounded mb-4 max-w-md">
            No travel details found
        </div>
        <button
            onClick={onNavigateHome}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
            Back to Home
        </button>
    </div>
);

// Subcomponent: Detail Item
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-2 bg-gray-50 rounded-full text-gray-500">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
            <p className="text-lg font-semibold text-gray-800 mt-1">
                {value || 'N/A'}
            </p>
        </div>
    </div>
);

// Subcomponent: JourneyHeader
const JourneyHeader = ({ from, to, onBack, user, rating, onRatingChange }) => {
    const handleRatingClick = (newRating) => {
        if (onRatingChange) {
            onRatingChange(newRating);
        }
    };

    return (
        <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-t-xl p-6 text-white">
            <button
                onClick={onBack}
                className="flex items-center gap-2 mb-6 text-white hover:text-blue-100 transition-colors"
            >
                <ArrowBackIcon />
                <span>Back to results</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Journey Details</h1>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRatingClick(index + 1)}
                                    className="focus:outline-none"
                                >
                                    {index < Math.round(rating) ? (
                                        <StarIcon className="text-yellow-300 text-sm hover:text-yellow-200" />
                                    ) : (
                                        <StarBorderIcon className="text-yellow-300 text-sm hover:text-yellow-200" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-blue-100">Driver: {user}</span>
                    </div>
                </div>

                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="text-sm text-blue-100">Route</div>
                        <div className="text-lg font-semibold text-center">
                            <div className="text-white">{from || 'N/A'}</div>
                            <div className="text-blue-200 my-1">↓</div>
                            <div className="text-white">{to || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Subcomponent: Booking Footer
const BookingFooter = ({ fare, onBook }) => (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-gray-800">Total Fare:</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {fare || '0.00'}
                    </div>
                </div>
                <button
                    onClick={onBook}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg shadow-md hover:shadow-lg"
                >
                    Book This Journey
                </button>
            </div>
        </div>
    </div>
);

// Main Component
const ScheduleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [travelDetails, setTravelDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    // Authentication check
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    // Data fetching
    useEffect(() => {
        const fetchTravelDetails = async () => {
            try {
                if (!id) throw new Error('Missing journey ID');

                const response = await axios.get(
                    `${BACKEND_API}/user/journey/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 10000
                    }
                );

                if (!response.data) throw new Error('Invalid response data');
                setTravelDetails(response.data);
                console.log(response.data)
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to load journey details'
                );
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id && token) fetchTravelDetails();
    }, [id, token, BACKEND_API]);

    const handleRatingUpdate = async (newRating) => {
        try {
            if (!travelDetails?.userId?._id) {
                throw new Error('Driver information not available');
            }

            // Optimistic UI update
            setTravelDetails(prev => ({
                ...prev,
                userId: {
                    ...prev.userId,
                    rating: newRating
                }
            }));

            // Call API to update rating
            await updateUserRating(travelDetails.userId._id, newRating, token);

            // Optional: Show success message
            console.log('Rating updated successfully');
        } catch (err) {
            // Revert on error
            setTravelDetails(prev => ({
                ...prev,
                userId: {
                    ...prev.userId,
                    rating: prev.userId.rating // revert to previous rating
                }
            }));

            setError(
                err.response?.data?.message ||
                err.message ||
                'Failed to update rating'
            );
            console.error('Rating update error:', err);
        }
    };
    // Loading state
    if (loading) return <LoadingSpinner />;

    // Error state
    if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;

    // No data state
    if (!travelDetails) return <NoDataFound onNavigateHome={() => navigate('/')} />;

    // Format duration
    const formatDuration = (minutes) => {
        if (!minutes) return "N/A";
        const mins = parseInt(minutes.toString().replace('min', '').trim(), 10);
        if (isNaN(mins)) return "N/A";
        const hours = Math.floor(mins / 60);
        const remainingMinutes = mins % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}min` : `${remainingMinutes}min`;
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20"> {/* Extra padding for footer */}
            <div className="container mx-auto max-w-4xl">
                <JourneyHeader
                    from={travelDetails.leaveFrom?.label}
                    to={travelDetails.goingTo?.label}
                    user={travelDetails.userId?.name}
                    rating={travelDetails.userId?.rating || 0}
                    onBack={() => navigate(-1)}
                    onRatingChange={handleRatingUpdate}
                />

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                        icon={<AccessTimeIcon />}
                        label="Departure Time"
                        value={travelDetails.departureTime}
                    />
                    <DetailItem
                        icon={<AccessTimeIcon />}
                        label="Arrival Time"
                        value={calculateArrivalTime(travelDetails.departureTime, travelDetails.arrivalTime)}
                    />
                    <DetailItem
                        icon={<DirectionsCarIcon />}
                        label="Vehicle Type"
                        value={travelDetails.vehicleType}
                    />
                    <DetailItem
                        icon={<PersonIcon />}
                        label="Available Seats"
                        value={travelDetails.availableSeats}
                    />
                    <DetailItem
                        icon={<EventIcon />}
                        label="Departure Date"
                        value={new Date(travelDetails.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    />
                    <DetailItem
                        icon={<AccessTimeIcon />}
                        label="Estimated Duration"
                        value={formatDuration(travelDetails.arrivalTime)}
                    />
                </div>

                {travelDetails.additionalInfo && (
                    <div className="p-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
                            <p className="text-gray-800">{travelDetails.additionalInfo}</p>
                        </div>
                    </div>
                )}
            </div>

            <BookingFooter
                fare={travelDetails.fareStart}
                onBook={() => navigate('/booking', { state: { travelDetails } })}
            />
        </div>
    );
};

export default ScheduleDetail;