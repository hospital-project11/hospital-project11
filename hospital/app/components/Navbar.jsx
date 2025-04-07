'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        setIsLoggedIn(res.data.loggedIn);
      } catch (err) {
        console.error("errrorrrrrrrr :", err);
        setIsLoggedIn(false);
      }
    };
  
    checkLogin();
  }, []);
  

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

  const renderLinks = (isMobile = false) => {
    const commonClasses = isMobile
      ? "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
      : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";

    return (
      <>
        <Link href="/" className={commonClasses}>Home</Link>
        <Link href="/about" className={commonClasses}>About</Link>
        <Link href="/contact" className={commonClasses}>Contact</Link>
        <Link href="/doctor-dashboard" className={commonClasses}>Doctor Dashboard</Link>
        <Link href="/admin-dashboard" className={commonClasses}>Admin Dashboard</Link>
        <Link href="/profile" className={commonClasses}>Profile</Link>
        <Link href="/available-appointments" className={commonClasses}>Appointments</Link>
        <Link href="/payment" className={commonClasses}>Payment</Link>

        {!isLoggedIn ? (
          <>
            <Link href="/register" className={commonClasses}>Register</Link>
            <Link href="/login" className={commonClasses}>Login</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className={`${commonClasses} text-red-400 hover:text-red-200`}
          >
            Logout
          </button>
        )}
      </>
    );
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {renderLinks(false)}
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderLinks(true)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
