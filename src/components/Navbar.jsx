import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { CiCirclePlus } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";

import { IoIosSearch } from "react-icons/io";

import { FaChevronDown } from "react-icons/fa";
import { FaTruckFast } from 'react-icons/fa6';
import { useSnackbar } from 'notistack';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  return (
    <nav className="bg-white border-gray-200 sticky top-0 z-99  mb-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pt-4">
        <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse m-2">
          <FaTruckFast className='text-4xl text-gray-800' />
          <span className="self-center items-center text-2xl text-gray-600 font-semibold whitespace-nowrap">
            RouteShare
          </span>
        </NavLink>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}
        >
          <ul className="flex justify-center p-4 font-medium  md:p-0  border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <NavLink
                to="/search"
                className="block flex items-center text-center justify-around py-2 px-3  space-x-2 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
              >

                <IoIosSearch className="text-3xl dark:text-white" />

                <p>Search</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/publish"
                className="block flex items-center text-center justify-around py-2 px-3  space-x-2 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
              >

                <CiCirclePlus className="text-3xl dark:text-white" />

                <p>Publish</p>
              </NavLink>
            </li>
            <li className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto"
              >
                <FaCircleUser className="text-4xl text-gray-700" />
                <FaChevronDown className="ms-2.5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-44 bg-white rounded-lg shadow-lg"
                  onClick={() => setIsDropdownOpen(false)}>
                  {token && (
                    <div>

                      <div className="py-1 border-b border-gray-200">
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </NavLink>
                      </div>
                      <div className="py-1 border-b border-gray-200">
                        <NavLink
                          to="/all-journey"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Journeys
                        </NavLink>
                      </div>
                    </div>

                  )}
                  {!token && (
                    <div>
                      <div className="py-1  border-b border-gray-200">
                        <NavLink
                          to="/sign-up"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Up
                        </NavLink>
                      </div>

                      <div className="py-1  border-b border-gray-200">
                        <NavLink
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Log In
                        </NavLink>
                      </div>
                    </div>
                  )}


                  {token && (

                    <div className="py-1  border-b border-gray-200 hover:bg-gray-100" >
                      <button

                        className="block px-4 py-2 text-sm text-gray-700 "
                        onClick={() => {
                          localStorage.removeItem('token')
                          enqueueSnackbar("You have been logged out!", { variant: "warning" });
                          navigate('/')
                        }}
                      >
                        Log Out
                      </button>
                    </div>


                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
