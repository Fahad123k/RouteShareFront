import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { FaTruckFast } from 'react-icons/fa6';
import { useSnackbar } from 'notistack';
import useIsAdmin from './hooks/UseAdmin';

const MobileMenu = ({ isOpen, scrolled, closeAllMenus, token, isAdmin, enqueueSnackbar, navigate }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white mt-3 transition-all duration-300">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {/* Search */}
        <NavLink
          to="/search"
          onClick={closeAllMenus}
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50"
          activeClassName="!bg-blue-700 !text-white"
        >
          <IoIosSearch className="mr-2 text-lg text-gray-700" />
          <span>Search</span>
        </NavLink>

        {/* Publish */}
        <NavLink
          to="/publish"
          onClick={closeAllMenus}
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50"
          activeClassName={scrolled ? "!bg-blue-50 !text-blue-600" : "!bg-blue-700 !text-white"}
        >
          <CiCirclePlus className="mr-2 text-lg text-gray-700" />
          <span>Publish</span>
        </NavLink>

        <div className="border-t border-gray-200 pt-2">
          {token ? (
            <>
              {/* Profile */}
              <NavLink
                to="/profile"
                onClick={closeAllMenus}
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 md:${scrolled ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-blue-700"}`}
              >
                Profile
              </NavLink>

              {/* Admin Panel */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeAllMenus}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 md:${scrolled ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-blue-700"}`}
                >
                  Admin Panel
                </NavLink>
              )}

              {/* Bookings */}
              <NavLink
                to="/my-bookings"
                onClick={closeAllMenus}
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 md:${scrolled ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-blue-700"}`}
              >
                Bookings
              </NavLink>

              {/* My Journey */}
              <NavLink
                to="/all-journey"
                onClick={closeAllMenus}
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 md:${scrolled ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-blue-700"}`}
              >
                My Journey
              </NavLink>

              {/* Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  enqueueSnackbar("You have been logged out!", { variant: "warning" });
                  navigate("/");
                  closeAllMenus();
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 md:${scrolled ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-blue-700"}`}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              {/* Sign Up */}
              <NavLink
                to="/sign-up"
                onClick={closeAllMenus}
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 md:${scrolled ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-blue-700"}`}
              >
                Sign Up
              </NavLink>

              {/* Login */}
              <NavLink
                to="/login"
                onClick={closeAllMenus}
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 md:${scrolled ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-blue-700"}`}
              >
                Log In
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const UserDropdown = ({ isOpen, scrolled, closeAllMenus, token, isAdmin, enqueueSnackbar, navigate }) => {
  if (!isOpen) return null;

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">
        {token ? (
          <>
            <NavLink
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={closeAllMenus}
            >
              Profile
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={closeAllMenus}
              >
                Admin Panel
              </NavLink>
            )}

            <NavLink
              to="/my-bookings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={closeAllMenus}
            >
              Bookings
            </NavLink>

            <NavLink
              to="/all-journey"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={closeAllMenus}
            >
              My Journey
            </NavLink>

            <button
              onClick={() => {
                localStorage.removeItem('token');
                enqueueSnackbar("You have been logged out!", { variant: "warning" });
                navigate('/');
                closeAllMenus();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/sign-up"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={closeAllMenus}
            >
              Sign Up
            </NavLink>

            <NavLink
              to="/login"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={closeAllMenus}
            >
              Log In
            </NavLink>
          </>
        )}
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              text-gray-600
                `}>
                RouteShare
              </span>
            </NavLink>
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
              <div className="relative ml-3">
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
                  scrolled={scrolled}
                  closeAllMenus={closeAllMenus}
                  token={token}
                  isAdmin={isAdmin}
                  enqueueSnackbar={enqueueSnackbar}
                  navigate={navigate}
                />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md
              ${isMenuOpen
                  ? 'text-gray-600'
                  : scrolled
                    ? 'text-gray-600'
                    : 'text-white'
                }
                  hover:bg-white hover:bg-opacity-20`}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        scrolled={scrolled}
        closeAllMenus={closeAllMenus}
        token={token}
        isAdmin={isAdmin}
        enqueueSnackbar={enqueueSnackbar}
        navigate={navigate}
      />
    </nav >
  );
};

export default Navbar;