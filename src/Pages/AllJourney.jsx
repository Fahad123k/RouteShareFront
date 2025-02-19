import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoStarSharp } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";
import FilterCard from "../components/SearchComp/FilterCard";
import { useNavigate } from "react-router";
import axios from "axios";



const AllJourney = () => {

    // const navigate = useNavigate()
    const [travels, setTravels] = useState([])

    const BACKEND_API = import.meta.env.VITE_BACKEND_URL;
    console.log("backend", BACKEND_API)

    const AllTravel = async () => {

        try {
            const response = await axios.get(`${BACKEND_API}/user/all-journey`);
            setTravels(response.data)

            // console.log(travels)


        } catch (error) {
            console.error(`some error occuured ${error}`)
        }

    }

    useEffect(() => {
        AllTravel()
    }, [])






    return <>

        <div className=" font-bold flex justify-center  bg-gray-100 p-3 m-2 rounded-lg " >All Journeys</div>
        <div className='flex p-4  m-auto '>


            <div className="hidden sm:block  mx-auto">

                <FilterCard />
            </div>
            <div className="mx-auto w-full max-w-4xl rounded-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Travel Details</h2>
                {travels.map((travel, index) => (
                    <div
                        key={index}
                        className="flex flex-col shadow-lg hover:border-gray-300 rounded-lg md:mx-auto  border border-gray-50"
                    >

                        {/* Upper Section: Departure, Arrival, Price, and Connecting Line */}


                        {/* larger screen */}
                        <div className="hidden sm:flex justify-between items-center border-b border-gray-300 p-4 relative ">

                            <div className="flex-1 flex items-center justify-between ">
                                <div className="flex-col w-full">

                                    <p className="text-gray-500">{travel.departureTime}</p>
                                    <p className="font-bold text-gray-800">Delhi</p>
                                    {/* <p className="font-bold text-gray-800">{travel.leaveFrom.lat}</p> */}
                                </div>
                                <span className="w-full flex items-center m-2 ">
                                    <FaRegCircle className="text-xl" />

                                    <div className="line h-1 w-full bg-gray-600 "></div>
                                </span>
                                <p>0h30</p>
                                <span className="w-full flex items-center m-2 ">

                                    <div className="line h-1 w-full bg-gray-600 "></div>
                                    <FaRegCircle className="text-xl" />
                                </span>
                                <div className="flex-col">

                                    <p className="text-gray-500">{travel.arrivalTime}</p>
                                    <p className="font-bold text-gray-800">Gurgaoun</p>
                                    {/* <p className="font-bold text-gray-800">{travel.goingTo.lat}</p> */}
                                </div>

                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-xl font-bold text-gray-800">{travel.fareStart}</p>
                            </div>
                        </div>


                        {/* smaller screen */}
                        <div className="flex sm:hidden justify-between items-center border-b border-gray-300 p-4 relative ">

                            <div className="flex-1 flex items-center justify-between ">
                                <div className="flex-col mr-2">


                                    <p className="text-gray-800">{travel.departureTime}</p>
                                    <p className="text-gray-400 text-sm">0h30</p>
                                    <p className="text-gray-800">{travel.arrivalTime}</p>
                                </div>
                                <div className="line m-2">
                                    <FaRegCircle className="text-sm" />
                                    <FaGripLinesVertical className="text-sm" />

                                    <FaRegCircle className="text-sm" />
                                </div>

                                <div className="flex-col">

                                    <p className="font-bold text-gray-700">{travel.goingTo.lat}</p>
                                    <p className="font-bold text-gray-700">{travel.leaveFrom.lat}</p>
                                </div>

                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-xl font-bold text-gray-800">{travel.fareStart}</p>
                            </div>
                        </div>



                        {/* Lower Section: Duration and Driver */}
                        <div className="p-4 flex items-center space-x-4 ">
                            <LiaCarSideSolid className="text-3xl" />
                            <p className="text-gray-600"> {travel.departureTime}</p>
                            <BiUserCircle className="text-3xl" />
                            <p className="text-gray-600">{travel.userId}</p>
                            <p className="text-gray-600">Capacity:{travel.maxCapacity}</p>
                            <p className="text-gray-600 flex items-center">
                                <IoStarSharp className="mr-2" /> 4.4
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>

        );
    </>
};

export default AllJourney;
