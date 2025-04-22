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

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_API = import.meta.env.VITE_BACKEND_URL;
  const { enqueueSnackbar } = useSnackbar();

  const fetchSearchResults = async () => {
    try {
      const res = await axios.get(`${BACKEND_API}/user/search`, {
        params: {
          leaveFromLat: queryParams.get("leaveFromLat"),
          leaveFromLng: queryParams.get("leaveFromLng"),
          goingToLat: queryParams.get("goingToLat"),
          goingToLng: queryParams.get("goingToLng"),
          date: queryParams.get("date"),
          size: queryParams.get("size")
        }
      });

      if (res.data.length === 0) {
        enqueueSnackbar("No results found for your search", { variant: "info" });
      }
      setSearchResult(res.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      if (error.response) {
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
  }, [location.search]); // Changed to watch location.search instead of individual params

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl rounded-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Travel Details</h2>
        <div className="text-center py-8">Loading travel options...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Travel Details</h2>

      {searchResult.length === 0 ? (
        <div className="text-center py-8">
          <p>No travel options found for your search criteria.</p>
          <p>Please try different locations or dates.</p>
        </div>
      ) : (
        searchResult.map((travel, index) => (
          <div
            key={`${travel._id || index}`} // Use database ID if available
            className="flex flex-col shadow-lg hover:border-gray-300 rounded-lg md:mx-auto border border-gray-50 mb-4"
          >
            {/* Larger screen layout */}
            <div className="hidden sm:flex justify-between items-center border-b border-gray-300 p-4 relative">
              <div className="flex-1 flex items-center justify-between">
                <div className="flex-col">
                  <p className="text-gray-500">{travel.date}</p>
                  <p className="font-bold text-gray-800">{travel.leaveFrom?.city || 'N/A'}</p>
                </div>
                <span className="w-full flex items-center m-2">
                  <FaRegCircle className="text-xl" />
                  <div className="line h-1 w-full bg-gray-600"></div>
                </span>
                <p>{travel.arrivalTime || '0h30'}</p>
                <span className="w-full flex items-center m-2">
                  <div className="line h-1 w-full bg-gray-600"></div>
                  <FaRegCircle className="text-xl" />
                </span>
                <div className="flex-col">
                  <p className="text-gray-500">{travel.arrivalDate || travel.date}</p>
                  <p className="font-bold text-gray-800">{travel.goingTo?.city || 'N/A'}</p>
                </div>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xl font-bold text-gray-800">{travel.fareStart || '₹0.00'}</p>
              </div>
            </div>

            {/* Smaller screen layout */}
            <div className="flex sm:hidden justify-between items-center border-b border-gray-300 p-4 relative">
              <div className="flex-1 flex items-center justify-between">
                <div className="flex-col mr-2">
                  <p className="text-gray-800">{travel.date}</p>
                  <p className="text-gray-400 text-sm">{travel.duration || '0h30'}</p>
                </div>
                <div className="line m-2">
                  <FaRegCircle className="text-sm" />
                  <FaGripLinesVertical className="text-sm" />
                  <FaRegCircle className="text-sm" />
                </div>
                <div className="flex-col">
                  <p className="font-bold text-gray-700">{travel.leaveFrom?.city || 'N/A'}</p>
                  <p className="font-bold text-gray-700">{travel.goingTo?.city || 'N/A'}</p>
                </div>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xl font-bold text-gray-800">{travel.fareStart || '₹0.00'}</p>
              </div>
            </div>

            {/* Driver and vehicle info */}
            <div className="p-4 flex items-center space-x-4">
              <LiaCarSideSolid className="text-3xl" />
              <BiUserCircle className="text-3xl" />
              <p className="text-gray-600">Instant booking</p>
              <p className="text-gray-600 flex items-center">
                <IoStarSharp className="mr-2" /> {travel.rating || '4.4'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TravelDetails;