import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { FaCircleUser, FaRoute, FaUserPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaCalendarAlt, FaChevronDown, FaShieldAlt, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { FaTruckFast } from 'react-icons/fa6';
import { useSnackbar } from 'notistack';
import useIsAdmin from './hooks/UseAdmin';


const UserDropdown = ({ isOpen, closeAllMenus, token, isAdmin, enqueueSnackbar, navigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed sm:relative  sm:right-0 top-10 sm:top-68 inset-0 z-50 overflow-y-auto ">
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0  bg-opacity-50 transition-opacity"
        onClick={closeAllMenus}
      ></div>

      {/* Menu container */}
      <div className=" bg-white sm:bg-transparent flex items-center justify-center min-h-screen sm:min-h-8 pt-4 px-4 pb-20 text-center sm:block sm:p-0 w-full ">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-0 sm:shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {/* User info header (optional) */}
                {token && (
                  <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <FaCircleUser className="text-3xl text-gray-500 mr-4" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">User Menu</h3>
                      <p className="text-sm text-gray-500">Manage your account</p>
                    </div>
                  </div>
                )}

                {/* Menu items grid */}
                <div className="grid grid-cols-1 gap-4">
                  {token ? (
                    <>
                      <NavLink
                        to="/profile"
                        className="flex items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        <FaCircleUser className="text-blue-500 mr-3 text-xl" />
                        <span className="text-gray-900">Profile</span>
                      </NavLink>

                      {isAdmin && (
                        <NavLink
                          to="/admin"
                          className="flex items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          onClick={closeAllMenus}
                        >
                          <FaShieldAlt className="text-blue-500 mr-3 text-xl" />
                          <span className="text-gray-900">Admin Panel</span>
                        </NavLink>
                      )}

                      <NavLink
                        to="/my-bookings"
                        className="flex items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        <FaCalendarAlt className="text-blue-500 mr-3 text-xl" />
                        <span className="text-gray-900">Bookings</span>
                      </NavLink>

                      <NavLink
                        to="/all-journey"
                        className="flex items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        <FaRoute className="text-blue-500 mr-3 text-xl" />
                        <span className="text-gray-900">My Journey</span>
                      </NavLink>

                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          enqueueSnackbar("You have been logged out!", { variant: "warning" });
                          navigate('/');
                          closeAllMenus();
                        }}
                        className="flex items-center p-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200 w-full text-left"
                      >
                        <FaSignOutAlt className="mr-3 text-xl" />
                        <span>Log Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/sign-up"
                        className="flex items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        <FaUserPlus className="text-blue-500 mr-3 text-xl" />
                        <span className="text-gray-900">Sign Up</span>
                      </NavLink>

                      <NavLink
                        to="/login"
                        className="flex items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        <FaSignInAlt className="text-blue-500 mr-3 text-xl" />
                        <span className="text-gray-900">Log In</span>
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={closeAllMenus}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 bg-white shadow }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink
              to="/"
              className="flex items-center space-x-2"
              onClick={closeAllMenus}
            >
              <FaTruckFast
                className={`text-3xl  text-gray-600`}
              />
              <span className={`text-xl font-bold 
              text-gray-600 hidden sm:block
                `}>
                RouteShare
              </span>


            </NavLink>
          </div>

          <div className="sm:hidden block">
            <NavLink
              to="/search"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
              activeClassName={`text-gray-600`}
            >
              <IoIosSearch className={`mr-1 text-2xl text-gray-700 `} />
            </NavLink>

          </div>
          <div className="sm:hidden block">
            <NavLink
              to="/publish"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
              activeClassName={`text-gray-600`}
            >
              <CiCirclePlus className={`mr-1 text-2xl text-gray-700`} />
            </NavLink>

          </div>
          {/* User Dropdown */}
          <div className="relative ml-3 sm:hidden block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center justify-center p-1 rounded-full 
                    text-gray-700 hover:bg-blue-50
                    }`}
            >
              <FaCircleUser className={`text-2xl text-gray-700`} />
              <FaChevronDown className={`ml-1 text-xs text-gray-700`} />
            </button>

            <UserDropdown
              isOpen={isDropdownOpen}
              // scrolled={scrolled}
              closeAllMenus={closeAllMenus}
              token={token}
              isAdmin={isAdmin}
              enqueueSnackbar={enqueueSnackbar}
              navigate={navigate}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink
                to="/search"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
                activeClassName={`text-gray-600`}
              >
                <IoIosSearch className={`mr-1 text-lg text-gray-700 `} />
                <span className="text-gray-700 hover:bg-blue-50 hover:text-blue-600">Search</span>
              </NavLink>

              <NavLink
                to="/publish"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
              // activeClassName={`${scrolled ? "text-blue-600 bg-blue-50" : "text-white bg-white bg-opacity-30"}`}
              >
                <CiCirclePlus className={`mr-1 text-lg text-gray-700`} />
                <span className="text-gray-700 ">Publish</span>
              </NavLink>

              {/* User Dropdown */}
              <div className="relative ml-3 ">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center justify-center p-1 rounded-full 
                    text-gray-700 hover:bg-blue-50
                    }`}
                >
                  <FaCircleUser className={`text-2xl text-gray-700`} />
                  <FaChevronDown className={`ml-1 text-xs text-gray-700`} />
                </button>

                <UserDropdown
                  isOpen={isDropdownOpen}
                  // scrolled={scrolled}
                  closeAllMenus={closeAllMenus}
                  token={token}
                  isAdmin={isAdmin}
                  enqueueSnackbar={enqueueSnackbar}
                  navigate={navigate}
                />
              </div>
            </div>
          </div>


        </div>
      </div>


    </nav >
  );
};

export default Navbar;