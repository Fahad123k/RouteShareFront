import React, { useState } from "react";
import { CiClock2 } from "react-icons/ci";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaPersonWalkingArrowLoopLeft } from "react-icons/fa6";
import { CgSandClock } from "react-icons/cg";
import { FaRegSquare, FaRegCheckSquare, FaRegCircle } from "react-icons/fa";

function FilterCard({ onFilterChange }) {
    // State for sort filters (radio button behavior - only one can be selected)
    const [sortBy, setSortBy] = useState(null);

    // State for departure time filters (checkbox behavior - multiple can be selected)
    const [departureFilters, setDepartureFilters] = useState({
        morning: false,
        afternoon: false,
        evening: false,
        night: false
    });

    // Sort options
    const sortOptions = [
        { id: 'earliest', label: 'Earliest Departure', icon: <CiClock2 className="text-xl" /> },
        { id: 'price', label: 'Lowest Price', icon: <FaCircleDollarToSlot className="text-xl" /> },
        { id: 'distance', label: 'Close to pick up point', icon: <FaPersonWalkingArrowLoopLeft className="text-xl" /> },
        { id: 'duration', label: 'Shortest Ride', icon: <CgSandClock className="text-xl" /> }
    ];

    // Departure time options
    const departureOptions = [
        { id: 'morning', label: 'Morning (6AM - 12PM)' },
        { id: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
        { id: 'evening', label: 'Evening (5PM - 9PM)' },
        { id: 'night', label: 'Night (9PM - 6AM)' }
    ];

    // Handle sort selection
    const handleSortSelect = (id) => {
        const newSort = sortBy === id ? null : id;
        setSortBy(newSort);
        if (onFilterChange) {
            onFilterChange({
                sort: newSort,
                departureTimes: departureFilters
            });
        }
    };

    // Handle departure time toggle
    const handleDepartureToggle = (id) => {
        const newFilters = {
            ...departureFilters,
            [id]: !departureFilters[id]
        };
        setDepartureFilters(newFilters);
        if (onFilterChange) {
            onFilterChange({
                sort: sortBy,
                departureTimes: newFilters
            });
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSortBy(null);
        setDepartureFilters({
            morning: false,
            afternoon: false,
            evening: false,
            night: false
        });
        if (onFilterChange) {
            onFilterChange({
                sort: null,
                departureTimes: {
                    morning: false,
                    afternoon: false,
                    evening: false,
                    night: false
                }
            });
        }
    };

    return (
        <div className="w-full max-w-3xl p-2 bg-white sticky top-26 sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            {/* Sort By Section */}
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Sort by</h5>
                <button
                    onClick={clearAllFilters}
                    className="text-sm font-medium text-gray-900 hover:underline dark:text-gray-300"
                >
                    Clear all
                </button>
            </div>

            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortOptions.map((option) => (
                    <li key={option.id} className="py-2 sm:py-2">
                        <button
                            onClick={() => handleSortSelect(option.id)}
                            className={`flex items-center w-full h-12 p-2 hover:bg-gray-100 hover:rounded-lg ${sortBy === option.id ? 'bg-blue-50 rounded-lg' : ''}`}
                        >
                            <div className="shrink-0">
                                {sortBy === option.id ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                ) : (
                                    <FaRegCircle className="text-xl text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 ms-4 text-left">
                                <p className="font-medium text-gray-900 truncate dark:text-white">
                                    {option.label}
                                </p>
                            </div>
                            <div className="flex items-center">
                                {option.icon}
                            </div>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Divider */}
            <div className="w-full bg-gray-200 h-1 rounded-lg my-4"></div>

            {/* Departure Time Section */}
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Departure time</h5>
            </div>

            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {departureOptions.map((option) => (
                    <li key={option.id} className="py-2 sm:py-2">
                        <button
                            onClick={() => handleDepartureToggle(option.id)}
                            className={`flex items-center w-full h-12 p-2 hover:bg-gray-100 hover:rounded-lg ${departureFilters[option.id] ? 'bg-blue-50 rounded-lg' : ''}`}
                        >
                            <div className="shrink-0">
                                {departureFilters[option.id] ? (
                                    <FaRegCheckSquare className="text-xl text-blue-500" />
                                ) : (
                                    <FaRegSquare className="text-xl text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 ms-4 text-left">
                                <p className="font-medium text-gray-900 truncate dark:text-white">
                                    {option.label}
                                </p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FilterCard;