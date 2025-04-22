import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoStarSharp } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";
import FilterCard from "../components/SearchComp/FilterCard";
import axios from "axios";

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
                    ) : (
                        travels.map((travel) => (
                            <div
                                key={travel._id || travel.id} // Use a unique identifier from your data
                                className="flex flex-col shadow-lg hover:border-gray-300 rounded-lg md:mx-auto border border-gray-50"
                            >
                                <div className="hidden sm:flex justify-between items-center border-b border-gray-300 p-4 relative">
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex-col w-full">
                                            <p className="text-gray-500">{travel.departureTime}</p>
                                            <p className="font-bold text-gray-800">{travel.leaveFrom?.city || 'N/A'}</p>
                                        </div>
                                        <span className="w-full flex items-center m-2">
                                            <FaRegCircle className="text-xl" />
                                            <div className="line h-1 w-full bg-gray-600"></div>
                                        </span>
                                        <p>0h30</p>
                                        <span className="w-full flex items-center m-2">
                                            <div className="line h-1 w-full bg-gray-600"></div>
                                            <FaRegCircle className="text-xl" />
                                        </span>
                                        <div className="flex-col">
                                            <p className="text-gray-500">{travel.arrivalTime}</p>
                                            <p className="font-bold text-gray-800">{travel.goingTo?.city || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-xl font-bold text-gray-800">{travel.fareStart}</p>
                                    </div>
                                </div>

                                <div className="flex sm:hidden justify-between items-center border-b border-gray-300 p-4 relative">
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex-col mr-2">
                                            <p className="text-gray-800">{travel.departureTime}</p>
                                            <p className="text-gray-400 text-sm">{travel.arrivalTime || 'N/A'}</p>
                                        </div>
                                        <div className="line m-2">
                                            <FaRegCircle className="text-sm" />
                                            <FaGripLinesVertical className="text-sm" />
                                            <FaRegCircle className="text-sm" />
                                        </div>
                                        <div className="flex-col">
                                            <p className="font-bold text-gray-700">{travel.goingTo?.lat || 'N/A'}</p>
                                            <p className="font-bold text-gray-700">{travel.leaveFrom?.lat || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-xl font-bold text-gray-800">{travel.fareStart}</p>
                                    </div>
                                </div>

                                <div className="p-4 flex items-center space-x-4">
                                    <LiaCarSideSolid className="text-3xl" />
                                    <p className="text-gray-600">{travel.departureTime}</p>
                                    <BiUserCircle className="text-3xl" />
                                    <p className="text-gray-600">{travel.username?.substring(0, 10) || 'Anonymous'}</p>
                                    <p className="text-gray-600">Capacity: {travel.maxCapacity}</p>
                                    <p className="text-gray-600 flex items-center">
                                        <IoStarSharp className="mr-2" /> 4.4
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AllJourney;