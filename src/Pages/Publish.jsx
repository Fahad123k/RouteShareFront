import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Publish = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) {

            navigate('/login')
        }
    }, [])

    const BACKEND_API = import.meta.env.VITE_BACKEND_URL

    const [formData, setFormData] = useState({
        userId: "",
        leaveFrom: "",
        goingTo: "",
        date: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
        maxCapacity: "",
        fareStart: "",
        costPerKg: "",
    });

    const [suggestions, setSuggestions] = useState({
        leaveFrom: [],
        goingTo: [],
    });

    const [focused, setFocused] = useState({
        leaveFrom: false,
        goingTo: false,
    });

    const fetchSuggestions = async (query, field) => {
        if (query.length > 2) {
            try {
                const response = await axios.get("https://geocode.search.hereapi.com/v1/geocode", {
                    params: { q: query, apiKey: import.meta.env.VITE_HERE_API_KEY },
                });
                setSuggestions((prev) => ({ ...prev, [field]: response.data.items || [] }));
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                enqueueSnackbar("Error fetching suggestions:", error, { variant: "error" });
                setSuggestions((prev) => ({ ...prev, [field]: [] }));
            }
        } else {
            setSuggestions((prev) => ({ ...prev, [field]: [] }));
        }
    };

    const handleSuggestionClick = (suggestion, field) => {
        setFormData((prev) => ({ ...prev, [field]: suggestion.title }));
        setSuggestions((prev) => ({ ...prev, [field]: [] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));

            // console.log("Stored Data:", storedUser?.id);
            // console.log("Form Data:", formData);

            if (!storedUser || !storedUser.id) {
                console.error("User ID is missing!");
                enqueueSnackbar("User ID is missing!", { variant: "error" });
                return;
            }

            // Attach userId to formData before sending
            const journeyData = { ...formData, userId: storedUser.id };

            const response = await axios.post(`${BACKEND_API}/user/createjourney`, journeyData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in headers
                    "Content-Type": "application/json",
                },
            });

            // Ensure response is valid
            if (!response || !response.status) {
                enqueueSnackbar("No response from server!", { variant: "error" });
                return;
            }

            // Handle different response statuses
            if (response.status === 201) {
                enqueueSnackbar("Journey Published Successfully!", { variant: "success" });
                navigate("/search"); // Redirect after success
            } else if (response.status === 400) {
                enqueueSnackbar("Empty Fields. Please fill all required fields!", { variant: "error" });
            } else {
                enqueueSnackbar("Unexpected error occurred!", { variant: "error" });
            }

        } catch (error) {
            console.error("Error publishing journey:", error);

            if (error.response) {
                // Handle server-side error response
                enqueueSnackbar(error.response.data.message || "Server Error", { variant: "error" });
            } else if (error.request) {
                // Handle no response from server
                enqueueSnackbar("No response from server!", { variant: "error" });
            } else {
                // Handle any other errors
                enqueueSnackbar("Something went wrong!", { variant: "error" });
            }
        }
    };



    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData((prev) => ({ ...prev, userId: user.id })); // Assuming user object has `_id`
        }
    }, []);

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const suffix = i < 12 ? "AM" : "PM";
        return [`${hour}:00 ${suffix}`, `${hour}:30 ${suffix}`];
    }).flat();

    const weightList = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 10} Kg`);
    const fareList = ["₹30", "₹35", "₹40", "₹45", "₹50", "₹55", "₹60"];

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-400px)]">
            <form className="w-full max-w-lg bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
                <h3 className="mb-4 uppercase m-auto tracking-wide font-bold">Publish Your Journey</h3>

                {/* Leave From & Going To */}
                {["leaveFrom", "goingTo"].map((field, index) => (
                    <div key={field} className="w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {field === "leaveFrom" ? "Leave From" : "Going To"}
                        </label>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-gray-100"
                            value={formData[field]}
                            placeholder={field === "leaveFrom" ? "Leave from" : "Going to"}
                            name={field}
                            onChange={(e) => {
                                handleChange(e);
                                fetchSuggestions(e.target.value, field);
                            }}
                            onFocus={() => setFocused((prev) => ({ ...prev, [field]: true }))}
                            onBlur={() => setTimeout(() => setFocused((prev) => ({ ...prev, [field]: false })), 200)}
                        />
                        {focused[field] && suggestions[field].length > 0 && (
                            <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
                                {suggestions[field].map((suggestion, index) => (
                                    <span
                                        key={index}
                                        className="block p-2 cursor-pointer hover:bg-white"
                                        onClick={() => handleSuggestionClick(suggestion, field)}
                                    >
                                        <strong>{suggestion.title}</strong>
                                        <br />
                                        <small className="text-gray-500">{suggestion.address.label}</small>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Date Pickers */}
                {["date", "arrivalDate"].map((field) => (
                    <div key={field} className="w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {field === "date" ? "Leaving Date" : "Arrival Date"}
                        </label>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-gray-100"
                            type="date"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                ))}

                {/* Time Selectors */}
                {["departureTime", "arrivalTime"].map((field) => (
                    <div key={field} className="w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {field === "departureTime" ? "Time of Departure" : "Time of Arrival"}
                        </label>
                        <select
                            className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-gray-100"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                        >
                            {timeSlots.map((time, index) => (
                                <option key={index} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                ))}

                {/* Capacity, Fare & Cost Per KG */}
                {[
                    { name: "maxCapacity", label: "Max Capacity", options: weightList },
                    { name: "fareStart", label: "Fare Start", options: fareList },
                    { name: "costPerKg", label: "Cost Per KG", options: fareList },
                ].map(({ name, label, options }) => (
                    <div key={name} className="w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {label}
                        </label>
                        <select
                            className="block appearance-none w-full bg-white border text-gray-700 py-3 px-4 pr-8 rounded leading-tight outline-none focus:bg-gray-100"
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                        >
                            {options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}

                <button type="submit" className="mt-4 bg-gray-700 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Continue
                </button>
            </form>
        </div>
    );
};

export default Publish;
