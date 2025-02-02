import React, { useState } from "react";

const Publish = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        city: "",
        state: "New Mexico",
        zip: "",
    });

    

    const [error, setError] = useState({
        firstName: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName) {
            setError((prev) => ({ ...prev, firstName: "Please fill out this field." }));
        } else {
            setError({ firstName: "" });
            console.log("Form Submitted", formData);
        }
    };

    const timeSlots = [
        "08:00 AM", "08:30 AM",
        "09:00 AM", "09:30 AM",
        "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM",
        "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM",
        "05:00 PM", "05:30 PM",
        "06:00 PM", "06:30 PM",
        "07:00 PM", "07:30 PM",
        "08:00 PM", "08:30 PM",
        "09:00 PM", "09:30 PM",
        "10:00 PM", "10:30 PM",
        "11:00 PM", "11:30 PM"
    ];


    const weightList = [
        "1 Kg", "2 Kg", "3 Kg", "4 Kg", "5 Kg", "6 Kg", "7 Kg", "8 Kg", "9 Kg", "10 Kg",
        "20 Kg", "30 Kg", "40 Kg", "50 Kg", "60 Kg", "70 Kg", "80 Kg", "90 Kg", "100 Kg",
        "200 Kg", "300 Kg", "400 Kg", "500 Kg", "600 Kg", "700 Kg", "800 Kg", "900 Kg", "1000 Kg",
        "2000 Kg", "3000 Kg", "4000 Kg", "5000 Kg", "6000 Kg", "7000 Kg", "8000 Kg", "9000 Kg", "10000 Kg"
    ];
    
    const fareList = [
        "₹30", "₹35", "₹40", "₹45", "₹50", "₹55", "₹60",
     
    ];
    

    const weightOptions = {
        Kg: Array.from({ length: 100 }, (_, i) => i + 1), // 1 to 100 Kg
        Quintal: Array.from({ length: 20 }, (_, i) => i + 1), // 1 to 20 Quintals
        Ton: Array.from({ length: 10 }, (_, i) => i + 1), // 1 to 10 Tons
      }

    return (
        <div className="flex items-center justify-center  min-h-[calc(100vh-400px)]  ">
            <form className="w-full max-w-lg bg-white  rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
                {/* address row */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
                            Leave From
                        </label>
                        <input
                            className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.firstName ? "border-red-500" : "border-gray-200"
                                } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                            id="firstName"
                            type="text"
                            placeholder="Jane"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {error.firstName && <p className="text-red-500 text-xs italic">{error.firstName}</p>}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lastName">
                            Going To
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                    {/* Date row */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
                            Leaving Date
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="city"
                            type="date"
                            placeholder="Albuquerque"
                            value={formData.city}
                            onChange={handleChange}
                        />
                        {error.firstName && <p className="text-red-500 text-xs italic">{error.firstName}</p>}
                        <p className="text-gray-600 text-xs italic">Departure time may vary slightly</p>

                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lastName">
                            Arrival Date
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="city"
                            type="date"
                            placeholder="Albuquerque"
                            value={formData.city}
                            onChange={handleChange}
                        />
                        <p className="text-gray-600 text-xs italic">Arrival time may vary slightly</p>

                    </div>
                </div>

                {/* time row */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
                            Time of Departure
                        </label>
                        <select
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            {
                                timeSlots.map((time, key) => (
                                    <option key={key}>{time}</option>
                                ))
                            }
                        </select>
                        {error.firstName && <p className="text-red-500 text-xs italic">{error.firstName}</p>}
                        <p className="text-gray-600 text-xs italic">Departure time may vary slightly</p>

                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lastName">
                            Time of Arrival
                        </label>
                     
                           <select
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            {
                                timeSlots.map((time, key) => (
                                    <option key={key}>{time}</option>
                                ))
                            }
                        </select>
                        <p className="text-gray-600 text-xs italic">Arrival time may vary slightly</p>

                    </div>
                </div>

            {/* Cost size and duration row */}
                <div className="flex flex-wrap -mx-3 mb-2">

                    {/* max wight */}
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
                            Max Capacity
                        </label>
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
                            id="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            {
                                weightList.map((weight, key) => (
                                    <option key={key}>{weight}</option>
                                ))
                            }
                        </select>
                    </div>
                            {/* fare list */}
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="zip">
                            Fare Start
                        </label>
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
                            id="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            {
                                fareList.map((fare, key) => (
                                    <option key={key}>{fare}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
                            Cost Per KG
                        </label>
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
                            id="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            {
                                fareList.map((fare, key) => (
                                    <option key={key}>{fare}</option>
                                ))
                            }
                        </select>
                    </div>
                   

                </div>

            

                <button type="submit" className="mt-4 bg-gray-700 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Continue
                </button>
            </form>
        </div>

    );
};

export default Publish;
