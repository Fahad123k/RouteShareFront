import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoStarSharp } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from 'notistack';
import TravelCard from "./TravelCard";

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

      console.log("result for search data", res.data)
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
          <TravelCard travel={travel} key={index} />
        ))
      )}
    </div>
  );
};

export default TravelDetails;