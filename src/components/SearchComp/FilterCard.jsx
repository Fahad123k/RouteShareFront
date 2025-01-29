import React from "react";
import { FaRegCircle } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";

import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaPersonWalkingArrowLoopLeft } from "react-icons/fa6";
import { CgSandClock } from "react-icons/cg";
import { FaRegSquare } from "react-icons/fa";





function FilterCard() {
    return (

        <div className="w-full max-w-3xl p-2 bg-white  sticky top-26 sm:p-8 dark:bg-gray-800 dark:border-gray-700  ">
            <div className="flex items-center justify-between ">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Sort by</h5>
                <a href="#" className="text-sm font-medium text-gray-900  hover:underline ">
                    Clear all
                </a>
            </div>
            <div className="flow-root">
                <ul  className=" divide-gray-200 dark:divide-gray-700">

                    <li classNameName=" ">
                        <div className="flex items-center hover:bg-gray-100 h-12 hover:rounded-lg p-2">
                            <div className="shrik-0 ">

                                {/* <FaRegCircle className="text-xl" /> */}
                                <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>


                            </div>
                            <div className="flex-2 min-w-0  ms-4">
                                <p className=" font-medium text-gray-900 truncate dark:text-white">
                                    Earliest Departure
                                </p>

                            </div>
                            <div className="flex-1 flex items-center justify-end text-base  font-semibold text-gray-900 dark:text-white">
                                <CiClock2 className="text-xl" />
                            </div>

                        </div>
                    </li>
                    <li className="py-3 sm:py-3 ">
                        <div className="flex items-center hover:bg-gray-100 p-2  h-12 hover:rounded-lg">
                            <div className="shrik-0 ">

                                <FaRegCircle className="text-xl" />

                            </div>
                            <div className="flex-2 min-w-0  ms-4">
                                <p className=" font-medium text-gray-900 truncate dark:text-white">
                                    Lowest Price
                                </p>

                            </div>
                            <div className="flex-1  flex justify-end  items-center text-base font-semibold text-gray-900 dark:text-white">
                                <FaCircleDollarToSlot className="text-xl" />
                            </div>
                        </div>
                    </li>
                    <li className="py-3 sm:py-3 ">
                        <div className="flex items-center hover:bg-gray-100 p-2  h-12 hover:rounded-lg">
                            <div class="shrink-0 ">

                                <FaRegCircle className="text-xl" />

                            </div>
                            <div class="flex-2 min-w-0 ms-4">
                                <p class="font-medium text-gray-900 truncate dark:text-white">
                                    Close to the pick up point
                                </p>

                            </div>
                            <div class="flex-1 flex justify-end  items-center text-base font-semibold text-gray-900 dark:text-white">
                                <FaPersonWalkingArrowLoopLeft className="text-xl" />
                            </div>
                        </div>
                    </li>
                    <li className="py-3 sm:py-3 ">
                        <div className="flex items-center hover:bg-gray-100 p-2  h-12 hover:rounded-lg">
                            <div class="shrink-0 ">

                                <FaRegCircle className="text-xl" />

                            </div>
                            <div class="flex-2 min-w-0 ms-4">
                                <p class=" font-medium text-gray-900 truncate dark:text-white">
                                    Shortest Ride
                                </p>

                            </div>
                            <div class="flex-1 flex justify-end items-center text-base font-semibold text-gray-900 dark:text-white">
                                <CgSandClock className="text-xl" />
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
            <div  className="w-ful bg-gray-200  h-1 rounded-lg mt-4 mb-4"></div>
            {/* divider ######################## */}


            <div class="flex items-center justify-between ">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Departure time</h5>
             
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">

                    <li className=" ">
                        <div class="flex items-center hover:bg-gray-100 h-12 hover:rounded-lg p-2">
                            <div class="shrik-0 ">

                                <FaRegSquare className="text-xl" />

                            </div>
                            <div class="flex-2 min-w-0  ms-4">
                                <p class=" font-medium text-gray-900 truncate dark:text-white">
                                    Earliest Departure
                                </p>

                            </div>
                            <div class="flex-1 flex items-center justify-end text-base  font-semibold text-gray-900 dark:text-white">
                                <CiClock2 className="text-xl" />
                            </div>

                        </div>
                    </li>
                    <li className="py-3 sm:py-3 ">
                        <div className="flex items-center hover:bg-gray-100 p-2  h-12 hover:rounded-lg">
                            <div class="shrik-0 ">

                                <FaRegSquare className="text-xl" />

                            </div>
                            <div class="flex-2 min-w-0  ms-4">
                                <p class=" font-medium text-gray-900 truncate dark:text-white">
                                    Lowest Price
                                </p>

                            </div>
                            <div class="flex-1  flex justify-end  items-center text-base font-semibold text-gray-900 dark:text-white">
                                <FaCircleDollarToSlot className="text-xl" />
                            </div>
                        </div>
                    </li>
                    <li className="py-3 sm:py-3 ">
                        <div className="flex items-center hover:bg-gray-100 p-2  h-12 hover:rounded-lg">
                            <div class="shrink-0 ">

                                <FaRegSquare className="text-xl" />

                            </div>
                            <div class="flex-2 min-w-0 ms-4">
                                <p class="font-medium text-gray-900 truncate dark:text-white">
                                    Close to the pick up point
                                </p>

                            </div>
                            <div class="flex-1 flex justify-end  items-center text-base font-semibold text-gray-900 dark:text-white">
                                <FaPersonWalkingArrowLoopLeft className="text-xl" />
                            </div>
                        </div>
                    </li>
                    <li className="py-3 sm:py-3 ">
                        <div className="flex items-center hover:bg-gray-100 p-2  h-12 hover:rounded-lg">
                            <div class="shrink-0 ">

                                <FaRegSquare className="text-xl" />

                            </div>
                            <div class="flex-2 min-w-0 ms-4">
                                <p class=" font-medium text-gray-900 truncate dark:text-white">
                                    Shortest Ride
                                </p>

                            </div>
                            <div class="flex-1 flex justify-end items-center text-base font-semibold text-gray-900 dark:text-white">
                                <CgSandClock className="text-xl" />
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>






    );
}

export default FilterCard;
