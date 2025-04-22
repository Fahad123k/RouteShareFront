import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Publish = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const BACKEND_API = import.meta.env.VITE_BACKEND_URL;

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        userId: "",
        leaveFrom: { lat: "", lng: "" },
        goingTo: { lat: "", lng: "" },
        date: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
        maxCapacity: "",
        fareStart: "",
        costPerKg: "",
    });

    const [cityname, setCityName] = useState({
        leaveFrom: "",
        goingTo: ""
    });

    const [suggestions, setSuggestions] = useState({
        leaveFrom: [],
        goingTo: [],
    });

    const [focused, setFocused] = useState({
        leaveFrom: false,
        goingTo: false,
    });

    const [isLoading, setIsLoading] = useState(false);

    // Fetch location suggestions
    const fetchSuggestions = async (query, field) => {
        if (query.length > 2) {
            try {
                const response = await axios.get("https://geocode.search.hereapi.com/v1/geocode", {
                    params: { q: query, apiKey: import.meta.env.VITE_HERE_API_KEY },
                });
                setSuggestions(prev => ({ ...prev, [field]: response.data.items || [] }));
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                enqueueSnackbar("Error fetching location suggestions", { variant: "error" });
                setSuggestions(prev => ({ ...prev, [field]: [] }));
            }
        } else {
            setSuggestions(prev => ({ ...prev, [field]: [] }));
        }
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: suggestion.position
        }));
        setCityName(prev => ({
            ...prev,
            [field]: suggestion.title
        }));
        setSuggestions(prev => ({ ...prev, [field]: [] }));
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate travel time between locations
    const fetchTravelTime = async (leaveFromGeo, goingToGeo) => {
        if (!leaveFromGeo?.lat || !goingToGeo?.lat) return;

        try {
            setIsLoading(true);
            const response = await axios.get(
                "https://router.hereapi.com/v8/routes",
                {
                    params: {
                        transportMode: "car",
                        origin: `${leaveFromGeo.lat},${leaveFromGeo.lng}`,
                        destination: `${goingToGeo.lat},${goingToGeo.lng}`,
                        return: "summary",
                        apiKey: import.meta.env.VITE_HERE_API_KEY,
                    },
                }
            );

            if (response.data.routes.length > 0) {
                const route = response.data.routes[0];
                const duration = route.sections[0].summary.duration / 60; // Convert to minutes
                const durationMin = `${Math.round(duration)} mins`;

                setFormData(prev => ({
                    ...prev,
                    arrivalTime: durationMin,
                }));
            }
        } catch (error) {
            console.error("Error fetching travel time:", error);
            enqueueSnackbar("Could not calculate travel time", { variant: "warning" });
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate travel time when locations change
    useEffect(() => {
        if (formData.leaveFrom.lat && formData.goingTo.lat) {
            fetchTravelTime(formData.leaveFrom, formData.goingTo);
        }
    }, [formData.leaveFrom, formData.goingTo]);

    // Set user ID from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData(prev => ({ ...prev, userId: user.id }));
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate required fields
        if (!formData.leaveFrom.lat || !formData.goingTo.lat) {
            enqueueSnackbar("Please select valid departure and destination locations", { variant: "error" });
            setIsLoading(false);
            return;
        }

        if (!formData.date || !formData.departureTime) {
            enqueueSnackbar("Please select date and time", { variant: "error" });
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!storedUser?.id) {
                enqueueSnackbar("User information missing. Please login again.", { variant: "error" });
                setIsLoading(false);
                return;
            }

            const journeyData = {
                ...formData,
                userId: storedUser.id
            };

            const response = await axios.post(
                `${BACKEND_API}/user/createjourney`,
                journeyData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                enqueueSnackbar("Journey Published Successfully!", { variant: "success" });
                navigate("/search");
            } else {
                enqueueSnackbar(response.data.message || "Unexpected error occurred", { variant: "error" });
            }
        } catch (error) {
            console.error("Error publishing journey:", error);
            const message = error.response?.data?.message ||
                error.message ||
                "Something went wrong!";
            enqueueSnackbar(message, { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // Time slots for selection
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const suffix = i < 12 ? "AM" : "PM";
        return [`${hour}:00 ${suffix}`, `${hour}:30 ${suffix}`];
    }).flat();

    const weightList = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 10} Kg`);
    const fareList = ["₹30", "₹35", "₹40", "₹45", "₹50", "₹55", "₹60"];

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-400px)] p-4">
            <form
                className="w-full max-w-lg bg-white rounded-lg shadow-md p-6"
                onSubmit={handleSubmit}
            >
                <h3 className="mb-6 text-center uppercase tracking-wide font-bold text-xl">
                    Publish Your Journey
                </h3>

                {/* Location Inputs */}
                {["leaveFrom", "goingTo"].map((field) => (
                    <div key={field} className="w-full px-3 mb-6 relative">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {field === "leaveFrom" ? "Departure Location" : "Destination Location"}
                        </label>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-gray-100"
                            value={cityname[field] || ""}
                            placeholder={field === "leaveFrom" ? "Enter departure location" : "Enter destination location"}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCityName(prev => ({ ...prev, [field]: value }));
                                fetchSuggestions(value, field);
                            }}
                            onFocus={() => setFocused(prev => ({ ...prev, [field]: true }))}
                            onBlur={() => setTimeout(() => setFocused(prev => ({ ...prev, [field]: false })), 200)}
                            autoComplete="off"
                        />
                        {focused[field] && suggestions[field].length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {suggestions[field].map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSuggestionClick(suggestion, field)}
                                    >
                                        <strong>{suggestion.title}</strong>
                                        <p className="text-xs text-gray-500">{suggestion.address.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Date Inputs */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Departure Date
                        </label>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-gray-100"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Arrival Date
                        </label>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-gray-100"
                            type="date"
                            name="arrivalDate"
                            value={formData.arrivalDate}
                            onChange={handleChange}
                            min={formData.date || new Date().toISOString().split("T")[0]}
                        />
                    </div>
                </div>

                {/* Time Inputs */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Departure Time
                        </label>
                        <select
                            className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-gray-100"
                            name="departureTime"
                            value={formData.departureTime}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select time</option>
                            {timeSlots.map((time, index) => (
                                <option key={index} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Estimated Travel Time
                        </label>
                        <div className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight">
                            {formData.arrivalTime || "Will calculate after locations are selected"}
                        </div>
                    </div>
                </div>

                {/* Capacity and Pricing */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Max Capacity
                        </label>
                        <select
                            className="block appearance-none w-full bg-white border text-gray-700 py-3 px-4 pr-8 rounded leading-tight outline-none focus:bg-gray-100"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select capacity</option>
                            {weightList.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Base Fare
                        </label>
                        <select
                            className="block appearance-none w-full bg-white border text-gray-700 py-3 px-4 pr-8 rounded leading-tight outline-none focus:bg-gray-100"
                            name="fareStart"
                            value={formData.fareStart}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select fare</option>
                            {fareList.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Cost Per KG
                        </label>
                        <select
                            className="block appearance-none w-full bg-white border text-gray-700 py-3 px-4 pr-8 rounded leading-tight outline-none focus:bg-gray-100"
                            name="costPerKg"
                            value={formData.costPerKg}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select cost</option>
                            {fareList.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Publishing..." : "Publish Journey"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Publish;