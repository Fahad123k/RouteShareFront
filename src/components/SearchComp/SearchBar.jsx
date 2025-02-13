import axios from "axios";
import React, { useState } from "react";
import { FaRegCircleDot } from "react-icons/fa6";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { RiWeightLine } from "react-icons/ri";
import { LiaExchangeAltSolid } from "react-icons/lia";

import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [leaveFrom, setLeaveFrom] = useState("");
  const [goingTo, setGoingTo] = useState("");
  const [date, setDate] = useState("");
  const [size, setSize] = useState("M");

  const [leaveFromSuggestions, setLeaveFromSuggestions] = useState([]);
  const [goingToSuggestions, setGoingToSuggestions] = useState([]);
  const [isLeaveFromFocused, setIsLeaveFromFocused] = useState(false);
  const [isGoingToFocused, setIsGoingToFocused] = useState(false);

  const navigate = useNavigate();

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(
          "https://geocode.search.hereapi.com/v1/geocode",
          {
            params: {
              q: query,
              apiKey: import.meta.env.VITE_HERE_API_KEY,
            },
          }
        );
        setSuggestions(response.data.items || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion, setInput, setSuggestions) => {
    setInput(suggestion.title);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/search?leaveFrom=${leaveFrom}&goingTo=${goingTo}&date=${date}&size=${size}`
    );
  };

  return (
    <div className="w-full max-w-7xl justify-center items-center m-auto">
      <form
        className="flex flex-col md:flex-row p-2 rounded-md shadow-md items-center justify-center gap-4 w-full bg-white border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/* Leave From */}
        <div className={`relative w-full sm:w-1/2 border-b border-gray-200 ${isLeaveFromFocused ? "bg-gray-200" : "bg-white"}`}>
          <div className="inline-flex items-center ">
            <span className="inline-flex items-center px-3 text-sm text-gray-900">
              <FaRegCircleDot className="text-xl" />
            </span>
            <input
              type="text"
              className="rounded-r-md text-gray-900 block w-full text-sm p-2.5 focus:outline-none focus:ring-0 focus:border-none"
              placeholder="Leave from"
              value={leaveFrom}
              onChange={(e) => {
                setLeaveFrom(e.target.value);
                fetchSuggestions(e.target.value, setLeaveFromSuggestions);
              }}
              onFocus={() => setIsLeaveFromFocused(true)}
              onBlur={() => setTimeout(() => setIsLeaveFromFocused(false), 200)}
            />
          </div>

          {isLeaveFromFocused && leaveFromSuggestions.length > 0 && (
            <div className="absolute left-[-10px] w-full top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto p-1 m-2">
              {leaveFromSuggestions.map((suggestion, index) => (
                <span
                  key={index}
                  className="block p-2 mx-1 bg-white rounded-lg cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    handleSuggestionClick(
                      suggestion,
                      setLeaveFrom,
                      setLeaveFromSuggestions
                    )
                  }
                >
                  <strong>{suggestion.title}</strong>
                  <br />
                  <small className="text-gray-500">{suggestion.address.label}</small>
                </span>
              ))}
            </div>
          )}
        </div>

        <LiaExchangeAltSolid className="hidden sm:block text-[40px]" />

        {/* Going To */}
        <div className={`relative flex items-center border-b border-gray-200 w-full sm:w-1/2 ${isGoingToFocused ? "bg-gray-200" : "bg-white"}`}>
          <span className="inline-flex items-center px-3 text-sm text-gray-900">
            <FaRegCircleDot className="text-xl" />
          </span>
          <input
            type="text"
            className="rounded-r-md text-gray-900 block w-full text-sm p-2.5 focus:outline-none focus:ring-0 focus:border-none"
            placeholder="Going to"
            value={goingTo}
            onChange={(e) => {
              setGoingTo(e.target.value);
              fetchSuggestions(e.target.value, setGoingToSuggestions);
            }}
            onFocus={() => setIsGoingToFocused(true)}
            onBlur={() => setTimeout(() => setIsGoingToFocused(false), 200)}
          />
          {isGoingToFocused && goingToSuggestions.length > 0 && (
            <div className="absolute left-10 top-12 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
              {goingToSuggestions.map((suggestion, index) => (
                <span
                  key={index}
                  className="block p-2 mx-1 bg-white rounded cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    handleSuggestionClick(
                      suggestion,
                      setGoingTo,
                      setGoingToSuggestions
                    )
                  }
                >
                  <strong>{suggestion.title}</strong>
                  <br />
                  <small className="text-gray-500">{suggestion.address.label}</small>
                </span>
              ))}
            </div>

          )}




        </div>
        {/* Date */}
        <div className="flex items-center border-b border-gray-200 w-full sm:w-1/2">
          <span className="inline-flex items-center px-3 text-sm text-gray-900">
            <HiOutlineCalendarDateRange className="text-xl" />
          </span>
          <input
            type="date"
            className="rounded-r-md text-gray-900 block w-full text-sm p-2.5"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Size */}
        <div className="flex items-center border-b border-gray-200 w-full sm:w-1/3">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 rounded-l-md">
            <RiWeightLine className="text-xl" />
          </span>
          <select
            className="rounded-r-md text-gray-900 block w-full text-sm p-2.5 bg-white focus:ring-blue-500 focus:border-blue-500"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="XM">Extra Small</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {/* Submit Button */}
        <div className="w-full sm:w-1/2">
          <input
            type="submit"
            className="rounded-b-lg md:rounded-r-lg block w-full text-white text-sm p-2.5 bg-black cursor-pointer"
            value="Search"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
