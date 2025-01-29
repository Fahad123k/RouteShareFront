import React, { useState } from 'react'
import { use } from 'react';
import { FaRegCircleDot } from "react-icons/fa6";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { RiWeightLine } from "react-icons/ri";
import { NavLink ,useNavigate} from "react-router";

const SearchBar = () => {

  const [leaveFrom,setLeaveFrom]=useState('')
  const [goingTo,setGoinTo]=useState('')
  const [date,setDate]=useState('')
  const [size,setSize]=useState('M')


  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log("leve from:",leaveFrom,","," goingTo",goingTo," Date :","date"," Size :",size)
    // navigate(`/search?leaveFrom=${leaveFrom}&goingTo=${goingTo}&date=${date}&size=${size}`);

  }
  return (
    <div className=" w-full max-w-7xl  flex justify-center items-center m-auto "
    onSubmit={handleSubmit}
    >
      <form className="flex flex-col lg:flex-row p-2 rounded-md shadow-md items-center justify-center gap-4 w-full  bg-white border border-gray-200">
        <div className="flex items-center border-b border-gray-200  w-full sm:w-1/2">
          <span className="inline-flex items-center px-3  text-sm text-gray-900  rounded-l-md ">
            <FaRegCircleDot className="text-xl" />
          </span>
          <input
            type="text"
            className="rounded-r-md  text-gray-900 block w-full text-sm p-2.5   "
            placeholder="Leave from"
            value={leaveFrom}
            onChange={(e)=>setLeaveFrom(e.target.value)}
          />
        </div>

        {/* Going To */}
        <div className="flex items-center border-b border-gray-200 w-full sm:w-1/2">
          <span className="inline-flex items-center px-3  text-sm text-gray-900  rounded-l-md  ">
            <FaRegCircleDot className="text-xl" />
          </span>
          <input
            type="text"
            className="rounded-r-md  text-gray-900 block w-full text-sm p-2.5   "
            placeholder="Going to"
            value={goingTo}
            onChange={(e)=>setGoinTo(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="flex items-center border-b border-gray-200 w-full sm:w-1/2 ">
          <span className="inline-flex items-center px-3  text-sm text-gray-900  rounded-l-md ">
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
            className="rounded-r-md text-gray-900 block w-full text-sm p-2.5 bg-white  focus:ring-blue-500 focus:border-blue-500"
            value={size}
            onChange={(e)=>setSize(e.target.value)}
          >
            <option value="XM">Extra Small</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>

        <div className="float-end w-full sm:w-1/2">
          {/* <NavLink to='/search'> */}

            <input
              type="submit"
              className="rounded-b-lg  md:rounded-r-lg block w-full text-white text-sm p-2.5 bg-black  "

              value="Search"
            />
          {/* </NavLink> */}
        </div>
      </form>
    </div>
  )
}

export default SearchBar