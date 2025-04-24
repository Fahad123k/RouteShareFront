import React, { useEffect, useState } from "react";

import FilterCard from "../components/SearchComp/FilterCard";
import axios from "axios";
import TravelCard from "../components/SearchComp/TravelCard";

const SkeletonLoader = ({ rows = 5, height = "150px", width = "100%" }) => {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col shadow-lg hover:border-gray-300 rounded-lg md:mx-auto border border-gray-50 animate-[pulse_1.5s_infinite]"
                >
                    <div className="hidden sm:flex justify-between items-center border-b border-gray-300 p-4 relative h-32">
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex-col w-full"></div>
                            <span className="w-full flex items-center m-2">
                                <div className="line h-1 w-full bg-gray-200"></div>
                            </span>
                            <span className="w-full flex items-center m-2">
                                <div className="line h-1 w-full bg-gray-200"></div>
                            </span>
                            <div className="flex-col"></div>
                        </div>
                        <div className="flex-1 text-right"></div>
                    </div>

                    <div className="flex sm:hidden justify-between items-center border-b border-gray-300 p-4 relative">
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex-col mr-2"></div>
                            <div className="line m-2"></div>
                            <div className="flex-col"></div>
                        </div>
                        <div className="flex-1 text-right"></div>
                    </div>

                    <div className="p-4 flex items-center space-x-4"></div>
                </div>
            ))}
        </div>
    );
};

// const formatMinutesToHours = (minutes) => {
//     if (minutes === undefined || minutes === null || minutes === "") return 'N/A';

//     // Convert string to number and handle potential NaN cases
//     const mins = parseInt(minutes, 10);
//     if (isNaN(mins)) return 'N/A';

//     const hours = Math.floor(mins / 60);
//     const remainingMins = mins % 60;
//     return `${hours}h ${remainingMins}m`;
// };

// const calculateArrivalTime = (departureTime, arrivalMinutes) => {
//     // Validate inputs
//     if (!departureTime || !arrivalMinutes) return "N/A";

//     // Convert minutes to number
//     const mins = parseInt(arrivalMinutes, 10);
//     if (isNaN(mins)) return "N/A";

//     // Verify time format (HH:MM)
//     const timeParts = departureTime.split(':');
//     if (timeParts.length !== 2) return "N/A";

//     const depHours = parseInt(timeParts[0], 10);
//     const depMinutes = parseInt(timeParts[1], 10);

//     if (isNaN(depHours) || isNaN(depMinutes)) return "N/A";

//     // Calculate arrival time
//     const totalMinutes = depHours * 60 + depMinutes + mins;
//     let hours = Math.floor(totalMinutes / 60) % 24;
//     const minutes = totalMinutes % 60;

//     // Format to 12-hour with AM/PM
//     const period = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12; // Convert 0 to 12

//     return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
// };
const AllJourney = () => {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BACKEND_API = import.meta.env.VITE_BACKEND_URL;

    const AllTravel = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${BACKEND_API}/user/all-journey`);
            setTravels(response.data);
        } catch (error) {
            setError("Failed to load journeys. Please try again later.");
            console.error(`Error occurred: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AllTravel();
    }, []);

    return (
        <>
            <div className="font-bold flex justify-center bg-gray-100 p-3 m-2 rounded-lg">All Journeys</div>
            <div className="flex p-4 m-auto">
                <div className="hidden sm:block mx-auto">
                    <FilterCard />
                </div>
                <div className="mx-auto w-full max-w-4xl rounded-xl">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Travel Details</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {loading ? (
                        <SkeletonLoader />
                    ) : travels.length === 0 ? (
                        <p className="text-center py-4">No journeys posted yet</p>
                    ) : (
                        travels.map((travel) => (
                            <TravelCard travel={travel} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AllJourney;