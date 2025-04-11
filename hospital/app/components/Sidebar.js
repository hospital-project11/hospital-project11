"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHome, FaUser, FaUsers, FaChartBar, FaEnvelope, FaCog, FaBars, FaAngleRight, FaAngleLeft } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeLink, setActiveLink] = useState("/");
  
  // Check current path on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveLink(window.location.pathname);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const menuItems = [
    { title: "Home", icon: <FaHome size={18} />, path: "/" },
    { title: "Users", icon: <FaUsers size={18} />, path: "/admin-dashboard" },
    { title: "Add Doctor", icon: <FaUser size={18} />, path: "/admin-dashboard/create-doctor" },
    { title: "Messages", icon: <FaEnvelope size={18} />, path: "/admin-dashboard/contact" },
    { title: "Statistics", icon: <FaChartBar size={18} />, path: "/admin-dashboard/statistics" },
    { title: "Account Settings", icon: <FaCog size={18} />, path: "/profile" },
  ];

  return (
    <div className={`bg-gradient-to-b from-[#005a60] to-[#007a81] text-white ${isOpen ? 'w-64' : 'w-20'} h-full transition-all duration-300 shadow-lg relative`}>
      {/* Toggle Button - Desktop */}
      <button 
        onClick={toggleSidebar} 
        className="hidden sm:flex absolute -right-3 top-12 bg-[#48A6A7] rounded-full p-1 shadow-md hover:bg-[#3d8a8b] transition-colors z-10"
      >
        {isOpen ? <FaAngleLeft size={16} /> : <FaAngleRight size={16} />}
      </button>
      
      {/* Mobile Toggle Button */}
      <div className="sm:hidden flex justify-end p-4">
        <button onClick={toggleSidebar} className="text-white hover:text-gray-200 transition-colors">
          <FaBars size={20} />
        </button>
      </div>

      {/* Logo and Title */}
      <div className="px-6 pt-6 pb-8">
        <div className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <div className="bg-white text-[#006A71] rounded-lg p-2 flex items-center justify-center w-10 h-10">
            <span className="font-bold text-lg">D</span>
          </div>
          {isOpen && <h2 className="ml-3 text-xl font-bold">Dashboard</h2>}
        </div>
      </div>
      
      {/* Divider */}
      <div className="mx-4 mb-6 border-b border-[#48A6A7] opacity-30"></div>
      
      {/* Navigation Menu */}
      <nav>
        <ul className="px-3">
          {menuItems.map((item) => (
            <li key={item.path} className="mb-3">
              <Link 
                href={item.path} 
                className={`flex items-center w-full p-3 rounded-md transition-all ${
                  activeLink === item.path 
                    ? 'bg-[#48A6A7] bg-opacity-60 font-semibold shadow-sm' 
                    : 'hover:bg-[#48A6A7] hover:bg-opacity-40'
                } ${isOpen ? 'pl-4' : 'justify-center'}`}
                onClick={() => setActiveLink(item.path)}
              >
                <span className={`${isOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
                {isOpen && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Profile Section at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className={`flex ${isOpen ? 'items-center' : 'justify-center'} p-3 hover:bg-[#48A6A7] hover:bg-opacity-40 rounded-md cursor-pointer transition-all`}>
          <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
            <FaUser size={14} className="text-[#006A71]" />
          </div>
          {isOpen && (
            <div className="ml-3 truncate">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-300">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}