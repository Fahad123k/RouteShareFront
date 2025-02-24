import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoStarSharp } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";

import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from 'notistack';





const TravelDetails = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const leaveFrom = queryParams.get("leaveFrom");
  const goingTo = queryParams.get("goingTo");
  // const date = queryParams.get("date");
  // const size = queryParams.get("size");

  const [serchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true)
  const BACKEND_API = import.meta.env.VITE_BACKEND_URL
  const { enqueueSnackbar } = useSnackbar();

  const fetchSearchResults = async () => {
    try {
      const res = await axios.get(`${BACKEND_API}/user/search`, {
        params: {
          leaveFromLat: queryParams.get("leaveFromLat"),
          leaveFromLng: queryParams.get("leaveFromLng"),
          goingToLat: queryParams.get("goingToLat"),
          goingToLng: queryParams.get("goingToLng")
        }
      });

      if (res.data.length == 0) {
        enqueueSnackbar("Empty Search", { variant: "error" });

      }
      setSearchResult(res.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);

      if (error.response) {
        // Handle specific error codes
        if (error.response.status === 400) {
          enqueueSnackbar("Missing required parameters!", { variant: "error" });
        } else if (error.response.status === 404) {
          enqueueSnackbar("No matching results found.", { variant: "warning" });
        } else {
          enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Network error. Check your connection!", { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSearchResults();



  }, [leaveFrom, goingTo])


  useEffect(() => {
    console.log(serchResult)
  })

  const travelList = [
    {
      departure: { time: "06:30", station: "Delhi" },
      arrival: { time: "06:50", station: "Gurugram" },
      duration: "20 minutes",
      price: "₹40.00",
      driver: { name: "Kuldeep" },
    },
    {
      departure: { time: "07:30", station: "Mumbai" },
      arrival: { time: "07:50", station: "Pune" },
      duration: "20 minutes",
      price: "₹50.00",
      driver: { name: "Amit" },
    },
    {
      departure: { time: "08:30", station: "Bangalore" },
      arrival: { time: "08:55", station: "Mysore" },
      duration: "25 minutes",
      price: "₹60.00",
      driver: { name: "Ravi" },
    },
    {
      departure: { time: "09:00", station: "Chennai" },
      arrival: { time: "09:30", station: "Coimbatore" },
      duration: "30 minutes",
      price: "₹70.00",
      driver: { name: "Vijay" },
    },
    {
      departure: { time: "07:30", station: "Mumbai" },
      arrival: { time: "07:50", station: "Pune" },
      duration: "20 minutes",
      price: "₹50.00",
      driver: { name: "Amit" },
    },
    {
      departure: { time: "10:00", station: "Hyderabad" },
      arrival: { time: "10:30", station: "Secunderabad" },
      duration: "30 minutes",
      price: "₹80.00",
      driver: { name: "Suresh" },
    },
    {
      departure: { time: "07:30", station: "Mumbai" },
      arrival: { time: "07:50", station: "Pune" },
      duration: "20 minutes",
      price: "₹50.00",
      driver: { name: "Amit" },
    },
    {
      departure: { time: "09:00", station: "Chennai" },
      arrival: { time: "09:30", station: "Coimbatore" },
      duration: "30 minutes",
      price: "₹70.00",
      driver: { name: "Vijay" },
    },
    {
      departure: { time: "07:30", station: "Mumbai" },
      arrival: { time: "07:50", station: "Pune" },
      duration: "20 minutes",
      price: "₹50.00",
      driver: { name: "Amit" },
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Travel Details</h2>

      {loading ? "loading" : (
        serchResult.map((travel, index) => (

          <div id={index}>
            <p>{travel.userId}</p>
            <p>{travel.costPerKg}</p>
            <p>{travel.fareStart}</p>
            <p>{travel.maxCapacity}</p>
          </div>
        ))
      )}

      {

        // travelList.map((travel, index) => (
        //   <div
        //     key={index}
        //     className="flex flex-col shadow-lg hover:border-gray-300 rounded-lg md:mx-auto  border border-gray-50"
        //   >
        //     {/* Upper Section: Departure, Arrival, Price, and Connecting Line */}


        //     {/* larger screen */}
        //     <div className="hidden sm:flex justify-between items-center border-b border-gray-300 p-4 relative ">

        //       <div className="flex-1 flex items-center justify-between ">
        //         <div className="flex-col">

        //           <p className="text-gray-500">{travel.departure.time}</p>
        //           <p className="font-bold text-gray-800">{travel.departure.station}</p>
        //         </div>
        //         <span className="w-full flex items-center m-2 ">
        //           <FaRegCircle className="text-xl" />

        //           <div className="line h-1 w-full bg-gray-600 "></div>
        //         </span>
        //         <p>0h30</p>
        //         <span className="w-full flex items-center m-2 ">

        //           <div className="line h-1 w-full bg-gray-600 "></div>
        //           <FaRegCircle className="text-xl" />
        //         </span>
        //         <div className="flex-col">

        //           <p className="text-gray-500">{travel.arrival.time}</p>
        //           <p className="font-bold text-gray-800">{travel.arrival.station}</p>
        //         </div>

        //       </div>
        //       <div className="flex-1 text-right">
        //         <p className="text-xl font-bold text-gray-800">{travel.price}</p>
        //       </div>
        //     </div>


        //     {/* smaller screen */}
        //     <div className="flex sm:hidden justify-between items-center border-b border-gray-300 p-4 relative ">

        //       <div className="flex-1 flex items-center justify-between ">
        //         <div className="flex-col mr-2">


        //           <p className="text-gray-800">{travel.departure.time}</p>
        //           <p className="text-gray-400 text-sm">0h30</p>
        //           <p className="text-gray-800">{travel.arrival.time}</p>
        //         </div>
        //         <div className="line m-2">
        //           <FaRegCircle className="text-sm" />
        //           <FaGripLinesVertical className="text-sm" />

        //           <FaRegCircle className="text-sm" />
        //         </div>

        //         <div className="flex-col">

        //           <p className="font-bold text-gray-700">{travel.departure.station}</p>
        //           <p className="font-bold text-gray-700">{travel.arrival.station}</p>
        //         </div>

        //       </div>
        //       <div className="flex-1 text-right">
        //         <p className="text-xl font-bold text-gray-800">{travel.price}</p>
        //       </div>
        //     </div>



        //     {/* Lower Section: Duration and Driver */}
        //     <div className="p-4 flex items-center space-x-4 ">
        //       <LiaCarSideSolid className="text-3xl" />
        //       <p className="text-gray-600"> {travel.duration}</p>
        //       <BiUserCircle className="text-3xl" />
        //       <p className="text-gray-600">{travel.driver.name}</p>
        //       <p className="text-gray-600">Instant booking</p>
        //       <p className="text-gray-600 flex items-center">
        //         <IoStarSharp className="mr-2" /> 4.4
        //       </p>
        //     </div>
        //   </div>
        // ))
      }
    </div>
  );
};

export default TravelDetails;
