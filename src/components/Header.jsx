import React, { useState } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { FaSearchLocation } from "react-icons/fa";
import { BsSendPlusFill } from "react-icons/bs";
import logo from '../assets/fast.png';
import { FaTruckFast } from "react-icons/fa6";


export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Manage menu state

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
    };

    return (
        <>
            <nav className="bg-white border-blue-200 dark:bg-blue-900 shadow-lg">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* <img src={logo} className="h-10" alt="RouteShare Logo" /> */}
                        <FaTruckFast className='text-xl bg-blue-900' />
                        <span className="self-center text-xl text-blue-500 font-semibold whitespace-nowrap mt-2">
                            RouteShare
                        </span>
                    </a>
                    <button
                        onClick={toggleMenu} // Toggle menu visibility on button click
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-blue-500 rounded-lg md:hidden hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-blue-400 dark:hover:bg-blue-700 dark:focus:ring-blue-600"
                        aria-controls="navbar-default"
                        aria-expanded={isMenuOpen ? "true" : "false"}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div
                        className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto p-2`}
                        id="navbar-default"
                    >
                        <ul className="font-medium flex flex-col  w-full items-start  sm:item-center pb-8 pt-4 md:p-0 mb-4 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-blue-800 md:dark:bg-blue-900 dark:border-blue-700">
                            <li className=''>
                                <a href="https://flowbite.com/" className="flex items-start space-x-1 text-blue-900 rounded-sm hover:bg-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    <FaSearchLocation className="text-2xl dark:text-white" />
                                    <span className="">Find</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://flowbite.com/" className="flex items-center space-x-1 text-blue-900 rounded-sm hover:bg-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    <BsSendPlusFill className="text-2xl dark:text-white" />
                                    <span className="">Publish</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-blue-900 rounded-sm hover:bg-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    <FaRegUserCircle className="text-3xl dark:text-white" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};
