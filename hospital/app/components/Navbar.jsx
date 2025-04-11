'use client'

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { User,Gauge, ChevronDown, Download, Save, Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserole] = useState(null);
  const router = useRouter();
  const [isOpenUser, setIsOpenUser] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpenUser(!isOpenUser);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenUser(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        setIsLoggedIn(res.data.loggedIn);
        console.log(res.data.role);
        setUserole(res.data.role);
      } catch (err) {
        console.error("errrorrrrrrrr :", err);
        setIsLoggedIn(false);
      }
    };
  
    checkLogin();
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        alert("Successful logout ✅");
        setIsLoggedIn(false);
        router.push("/login");
      } else {
        alert("Logout failed ❌");
      }
    } catch (error) {
      alert("An error occurred while logging out");
      console.error(error);
    }
  };

      const commonClasses = "text-gray-700 hover:text-teal-600 transition-colors duration-200";
  
      return (
        <header className="bg-white shadow-sm fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <div className="h-40 w-40 mr-2">
                    <Image 
                      src="/logo.png" 
                      alt="Lumera Logo" 
                      width={200} 
                      height={200}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-teal-600 text-2xl font-semibold"></span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className={`${commonClasses} `}>Home</Link>
                <Link href="/available-appointments" className={commonClasses}>Appointments</Link>
                <Link href="/contact" className={commonClasses}>Contact Us</Link>
                <Link href="/about" className={commonClasses}>AboutUs</Link>
                
                
              </nav>
              

            <>
            {!isLoggedIn ? (
             
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/register" className="bg-[#49A6A7] hover:bg-teal-600 text-white px-4 py-2 rounded-full transition-colors duration-200">
                  Sign Up
                </Link>
                {/* Additional login button that's not shown in the image but included in your code */}
                <Link href="/login" className="hidden lg:inline-block text-[#49A6A7] hover:text-teal-700">
                  Login
                </Link>
              </div>
               ):( 
              <div className="relative" ref={dropdownRef}>
      {/* User icon with dropdown toggle */}
      <button 
        className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        onClick={toggleDropdown}
      >
        <User className="h-6 w-6 text-gray-600" />
        <ChevronDown className={`h-4 w-4 ml-1 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpenUser && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <button className="flex items-center w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-50">
              <User className="h-5 w-5 mr-3 text-gray-600" />
              <Link href="/profile">Profile</Link>
            </button>
            {userRole === "doctor"  && (
            <button className="flex items-center w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-50">
              <Gauge className="h-5 w-5 mr-3 text-gray-600" />
              <Link href="/doctor-dashboard">Doctor DashBorad</Link>
            </button>
            )}
            {userRole === "admin"  && (
            <button className="flex items-center w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-50">
              <Gauge className="h-5 w-5 mr-3 text-gray-600" />
              <Link href="/admin-dashboard">Admin DashBorad</Link>
            </button>
            )}
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-gray-50">
              <LogOut className="h-5 w-5 mr-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
              </div>
               )}
              </>
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 focus:outline-none"
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden bg-white shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-teal-700 bg-teal-100">Home</Link>
                <Link href="/available-appointments" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Appointments</Link>
                <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Contact Us</Link>
                <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">AboutUs</Link>
              </div>
              {!isLoggedIn ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-3">
                  <Link href="/register" className="mt-2 block w-full px-4 py-2 text-center font-medium text-white bg-teal-500 rounded-full hover:bg-teal-600">
                    Sign Up
                  </Link>
                </div>
              </div>
              ):( 
                <div></div>
              )};
            </div>
          )}
        </header>
      );
    };

export default Navbar;
