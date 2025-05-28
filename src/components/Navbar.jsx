import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { FaCircleUser, FaRoute, FaUserPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaCalendarAlt, FaChevronDown, FaShieldAlt, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { FaTruckFast } from 'react-icons/fa6';
import { useSnackbar } from 'notistack';
import useIsAdmin from './hooks/UseAdmin';


const UserDropdown = ({ isOpen, closeAllMenus, token, isAdmin, enqueueSnackbar, navigate, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto sm:absolute sm:right-0 sm:top-14 sm:inset-auto">
      {/* Overlay backdrop - only for mobile */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity sm:hidden"
        onClick={closeAllMenus}
      ></div>

      {/* Menu container */}
      <div className="flex items-center justify-center min-h-screen sm:items-start sm:justify-end sm:min-h-fit pt-16 px-4 pb-20 text-center sm:p-0 sm:pt-2 sm:px-2">
        <div className="inline-block w-full max-w-md align-bottom bg-white rounded-xl shadow-2xl transform transition-all sm:align-top sm:max-w-xs sm:w-64">
          <div className="p-4 sm:p-3">
            {/* User info header (only shown when logged in) */}
            {token && (
              <div className="flex items-center mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-shrink-0">
                  <FaCircleUser className="text-3xl text-gray-400" />
                </div>
                <div className="ml-3 overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || "Manage your account"}
                  </p>
                </div>
              </div>
            )}

            {/* Menu items grid */}
            <div className="space-y-1">
              {token ? (
                <>
                  <NavLink
                    to="/profile"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base"
                    onClick={closeAllMenus}
                  >
                    <FaCircleUser className="text-blue-600 mr-3 text-xl" />
                    <span className="text-gray-800">Profile</span>
                  </NavLink>

                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base"
                      onClick={closeAllMenus}
                    >
                      <FaShieldAlt className="text-blue-600 mr-3 text-xl" />
                      <span className="text-gray-800">Admin Panel</span>
                    </NavLink>
                  )}

                  <NavLink
                    to="/my-bookings"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base"
                    onClick={closeAllMenus}
                  >
                    <FaCalendarAlt className="text-blue-600 mr-3 text-xl" />
                    <span className="text-gray-800">Bookings</span>
                  </NavLink>

                  <NavLink
                    to="/all-journey"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base"
                    onClick={closeAllMenus}
                  >
                    <FaRoute className="text-blue-600 mr-3 text-xl" />
                    <span className="text-gray-800">My Journey</span>
                  </NavLink>

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      enqueueSnackbar("You have been logged out!", { variant: "warning" });
                      navigate('/');
                      closeAllMenus();
                    }}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200 text-base"
                  >
                    <FaSignOutAlt className="mr-3 text-xl" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/sign-up"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base"
                    onClick={closeAllMenus}
                  >
                    <FaUserPlus className="text-blue-600 mr-3 text-xl" />
                    <span className="text-gray-800">Sign Up</span>
                  </NavLink>

                  <NavLink
                    to="/login"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base"
                    onClick={closeAllMenus}
                  >
                    <FaSignInAlt className="text-blue-600 mr-3 text-xl" />
                    <span className="text-gray-800">Log In</span>
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Close button - only for mobile */}
          <div className="bg-gray-50 px-4 py-3 rounded-b-xl sm:hidden">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-gray-200 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={closeAllMenus}
            >
              Close Menu
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
  const user = JSON.parse(localStorage.getItem("user"));
  // const [userdata, setUserData] = useState();

  // useEffect(() => {
  //   setUserData(user);  // set the user from localStorage
  //   console.log(user);  // log the user (not userdata)
  // }, []);


  // // console.log("user ", user)



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
              user={user}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:block">
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