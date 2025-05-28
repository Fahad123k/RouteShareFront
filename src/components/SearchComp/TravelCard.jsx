// import React from 'react'
import { BiUserCircle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoStarSharp } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";

const TravelCard = ({ travel }) => {


    const formatMinutesToHours = (minutes) => {
        if (minutes === undefined || minutes === null || minutes === "") return 'N/A';

        // Convert string to number and handle potential NaN cases
        const mins = parseInt(minutes, 10);
        if (isNaN(mins)) return 'N/A';

        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}h ${remainingMins}m`;
    };

    const calculateArrivalTime = (departureTime, arrivalMinutes) => {
        // Validate inputs
        if (!departureTime || !arrivalMinutes) return "N/A";

        // Convert minutes to number
        const mins = parseInt(arrivalMinutes, 10);
        if (isNaN(mins)) return "N/A";

        // Verify time format (HH:MM)
        const timeParts = departureTime.split(':');
        if (timeParts.length !== 2) return "N/A";

        const depHours = parseInt(timeParts[0], 10);
        const depMinutes = parseInt(timeParts[1], 10);

        if (isNaN(depHours) || isNaN(depMinutes)) return "N/A";

        // Calculate arrival time
        const totalMinutes = depHours * 60 + depMinutes + mins;
        let hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;

        // Format to 12-hour with AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12

        return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    return (
        <div
            key={travel._id || travel.id}
            className="flex flex-col shadow-lg hover:border-gray-300 rounded-lg md:mx-auto border border-gray-50"
        >
            <div className="hidden sm:flex justify-between items-center border-b border-gray-300 p-4 relative">
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex-col w-full">
                        <p className=" text-gray-800">{travel.departureTime || 'N/A'}</p>
                        <p className="font-bold text-gray-800">{travel.leaveFrom?.city || 'N/A'}</p>
                    </div>
                    <span className="w-full flex items-center m-2">
                        <FaRegCircle className="text-xl" />
                        <div className="line h-1 w-full bg-gray-600"></div>
                    </span>
                    <p className="row w-full bg-blue-100 rounded-l-2xl text-center text-sm">{formatMinutesToHours(travel.arrivalTime) || 'N/A'}</p>
                    <span className="w-full flex items-center m-2">
                        <div className="line h-1 w-full bg-gray-600"></div>
                        <FaRegCircle className="text-xl" />
                    </span>
                    <div className="flex-col w-full ">
                        <p className=" text-gray-800">{calculateArrivalTime(travel.departureTime, travel.arrivalTime)}</p>
                        <p className="font-bold text-gray-800  ">{travel.goingTo?.city || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex-1 text-right">
                    <p className="text-xl font-bold text-gray-800">{travel.fareStart}</p>
                </div>
            </div>

            {/* this is for mobile scrfeen code */}
            <div className="flex sm:hidden justify-between items-center border-b border-gray-300 p-4 relative">
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex-col mr-2"></div>

                    <div className="flex-col  min-w-[105px] ">
                        <p className=" text-gray-800  font-bold text-sm">{travel.departureTime || 'N/A'}</p>
                        <p className="text-[12px] ">{formatMinutesToHours(travel.arrivalTime) || 'N/A'}</p>
                        <p className=" text-gray-800 font-bold text-sm">{calculateArrivalTime(travel.departureTime, travel.arrivalTime)}</p>
                    </div>
                    <div className="line m-2">
                        <FaRegCircle className="text-sm" />
                        <FaGripLinesVertical className="text-sm" />
                        <FaRegCircle className="text-sm" />
                    </div>
                    <div className="flex-col min-w-[105px] ">
                        <p className="font-bold text-gray-700 text-sm">{travel.leaveFrom?.city || 'N/A'}</p>
                        <p className="font-bold text-gray-700 text-sm">{travel.goingTo?.city || 'N/A'}</p>
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
    )
}

export default TravelCard