import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { calculateArrivalTime } from '../utils/timeUtils';
import axios from 'axios';
import { IoMdStar } from 'react-icons/io';

// Subcomponent: Loading Indicator
const LoadingSpinner = () => (
    <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading journey details...</p>
    </div>
);

// Subcomponent: Error Display
const ErrorDisplay = ({ error, onRetry }) => (
    <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
            onClick={onRetry}
            className="text-blue-600 hover:underline"
        >
            Try again
        </button>
    </div>
);

// Subcomponent: No Data Found
const NoDataFound = ({ onNavigateHome }) => (
    <div className="text-center py-8">
        <p>No travel details found</p>
        <button
            onClick={onNavigateHome}
            className="text-blue-600 hover:underline mt-2"
        >
            Back to home
        </button>
    </div>
);

// Subcomponent: Detail Item
const DetailItem = ({ label, value }) => (
    <div>
        <h3 className="font-medium text-gray-700">{label}</h3>
        <p className="text-gray-900">{value || 'N/A'}</p>
    </div>
);

// Subcomponent: Journey Header
const JourneyHeader = ({ from, to, onBack, user }) => (
    <>
        <button
            onClick={onBack}
            className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
        >
            <span>←</span>
            <span>Back to results</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-gray-800">Journey Details</h1>
                <p className="text-gray-600 mt-1">
                    {from || 'N/A'} to {to || 'N/A'}
                </p>
            </div>
            <div className='flex items-start m-1  p-2 uppercase'>
                <p className='font-bold  text-gray-800'>{user}</p>
            </div>

        </div>
    </>
);

// Subcomponent: Booking Footer
const BookingFooter = ({ fare, onBook }) => (
    <div className="p-6 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
            <div className="flex justify-center items-center font-bold text-gray-900">
                Rating: <div className='flex p-1'>
                    < IoMdStar className='text-yellow-600' />
                    < IoMdStar className='text-yellow-600' />
                    < IoMdStar className='text-yellow-600' />
                    < IoMdStar className='text-yellow-600' />
                    < IoMdStar />
                </div>


            </div>
            <div>
                <h3 className="font-medium text-gray-700">Total Fare</h3>
                <p className="text-2xl font-bold text-gray-900">
                    {fare || '0.00'}
                </p>

            </div>
            <button
                onClick={onBook}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
                Book This Journey
            </button>
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
    console.log('token is', token)

    // const calculateArrivalTime = (departureTime, arrivalMinutes) => {
    //     if (!departureTime || !arrivalMinutes) return "N/A";

    //     const mins = parseInt(arrivalMinutes, 10);
    //     if (isNaN(mins)) return "N/A";

    //     const [hours, minutes] = departureTime.split(':').map(Number);
    //     if (isNaN(hours) || isNaN(minutes)) return "N/A";

    //     const totalMinutes = hours * 60 + minutes + mins;
    //     const arrivalHours = Math.floor(totalMinutes / 60) % 24;
    //     const arrivalMins = totalMinutes % 60;

    //     return `${arrivalHours % 12 || 12}:${arrivalMins.toString().padStart(2, '0')} ${arrivalHours >= 12 ? 'PM' : 'AM'}`;
    // };

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
                    `${BACKEND_API}/user/get-journeyby-id/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 10000 // 10 second timeout
                    }
                );

                console.log("heelo response", response.data)

                if (!response.data) throw new Error('Invalid response data');
                setTravelDetails(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to load journey details'
                );
                console.error('API Error:', {
                    error: err,
                    endpoint: `${BACKEND_API}/user/get-journeyby-id/${id}`,
                    status: err.response?.status
                });
            } finally {
                setLoading(false);
            }
        };

        if (id && token) fetchTravelDetails();
    }, [id, token, BACKEND_API]);

    // Loading state
    if (loading) return <LoadingSpinner />;

    // Error state
    if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;

    // No data state
    if (!travelDetails) return <NoDataFound onNavigateHome={() => navigate('/')} />;

    // Main render
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <JourneyHeader
                from={travelDetails.leaveFrom?.coordinates}
                to={travelDetails.goingTo?.coordinates}
                user={travelDetails.userId.name}
                onBack={() => navigate(-1)}
            />


            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">


                {/* <DetailItem label="User" value={travelDetails.userId.name} /> */}
                <DetailItem label="Departure Time" value={travelDetails.departureTime} />
                <DetailItem
                    label="Arrival Time"
                    value={calculateArrivalTime(travelDetails.departureTime, travelDetails.arrivalTime)}
                />
                <DetailItem label="Vehicle Type" value={travelDetails.vehicleType} />
                <DetailItem label="Available Seats" value={travelDetails.availableSeats} />
                <DetailItem
                    label="Departure Date"
                    value={new Date(travelDetails.date).toLocaleDateString()}
                />
                <DetailItem
                    label="Estimated Duration"
                    value={
                        (() => {
                            if (!travelDetails.arrivalTime) return "N/A";

                            // Extract just the number (remove "min" if present)
                            const minutes = parseInt(travelDetails.arrivalTime.toString().replace('min', '').trim(), 10);

                            if (isNaN(minutes)) return "N/A";

                            const hours = Math.floor(minutes / 60);
                            const remainingMinutes = minutes % 60;

                            return hours > 0
                                ? `${hours}h ${remainingMinutes}min`
                                : `${remainingMinutes}min`;
                        })()
                    } />
            </div>

            <BookingFooter
                fare={travelDetails.fareStart}
                onBook={() => navigate('/booking', { state: { travelDetails } })}
            />
        </div>
    );
};

export default ScheduleDetail;