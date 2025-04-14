import React from 'react';
import { PhoneCall, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, User, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="py-16 px-6 sm:px-8 lg:px-12 xl:px-20 text-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo and Description */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="inline-block">
              <div className="relative w-56 h-16">
                <Image 
                  src="/logo.png" 
                  alt="Lumera Eye Care Logo" 
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed max-w-md">
              Advanced eye care clinics in Jordan & the Middle East providing world-class 
              ophthalmology services with cutting-edge technology.
            </p>
            
            {/* Quick Access */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/login" 
                className="flex items-center px-4 py-2 bg-[#48A6A7] text-white rounded-lg hover:bg-[#3a8a8b] transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
              <Link 
                href="/register" 
                className="flex items-center px-4 py-2 border border-[#48A6A7] text-[#48A6A7] rounded-lg hover:bg-[#f0f9f9] transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Register
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 relative inline-block text-[#2a7e7f] border-b-2 border-[#48A6A7]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/available-appointments" className="flex items-center text-gray-600 hover:text-[#48A6A7] transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-[#48A6A7] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center text-gray-600 hover:text-[#48A6A7] transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-[#48A6A7] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Our Clinic
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="flex items-center text-gray-600 hover:text-[#48A6A7] transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-[#48A6A7] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Our Specialists
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center text-gray-600 hover:text-[#48A6A7] transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-[#48A6A7] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 relative inline-block text-[#2a7e7f] border-b-2 border-[#48A6A7]">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-[#e6f4f4] p-2 rounded-lg mr-3 flex-shrink-0">
                  <PhoneCall className="text-[#2a7e7f] w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call Us</p>
                  <a href="tel:+96261234567" className="text-gray-700 hover:text-[#48A6A7] transition-colors">
                    +962 6 1234 567
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#e6f4f4] p-2 rounded-lg mr-3 flex-shrink-0">
                  <Mail className="text-[#2a7e7f] w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Us</p>
                  <a href="mailto:info@lumeraeye.com" className="text-gray-700 hover:text-[#48A6A7] transition-colors">
                    info@lumeraeye.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#e6f4f4] p-2 rounded-lg mr-3 flex-shrink-0">
                  <MapPin className="text-[#2a7e7f] w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <span className="text-gray-700">Medical City, Amman, Jordan</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 relative inline-block text-[#2a7e7f] border-b-2 border-[#48A6A7]">
              Follow Us
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="flex items-center p-3 bg-white rounded-lg shadow-xs hover:bg-[#f0f9f9] transition-colors">
                <Facebook className="w-5 h-5 text-[#3b5998] mr-2" />
                <span className="text-sm">Facebook</span>
              </a>
              <a href="#" className="flex items-center p-3 bg-white rounded-lg shadow-xs hover:bg-[#f0f9f9] transition-colors">
                <Twitter className="w-5 h-5 text-[#1da1f2] mr-2" />
                <span className="text-sm">Twitter</span>
              </a>
              <a href="#" className="flex items-center p-3 bg-white rounded-lg shadow-xs hover:bg-[#f0f9f9] transition-colors">
                <Instagram className="w-5 h-5 text-[#e1306c] mr-2" />
                <span className="text-sm">Instagram</span>
              </a>
              <a href="#" className="flex items-center p-3 bg-white rounded-lg shadow-xs hover:bg-[#f0f9f9] transition-colors">
                <Youtube className="w-5 h-5 text-[#ff0000] mr-2" />
                <span className="text-sm">YouTube</span>
              </a>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2 text-gray-700">Subscribe to our newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#48A6A7] w-full"
                />
                <button className="bg-[#48A6A7] text-white px-3 py-2 rounded-r-lg hover:bg-[#3a8a8b] transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-[#2a7e7f] py-5 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-center md:text-left mb-2 md:mb-0">
              © {new Date().getFullYear()} Lumera Eye Care Clinic. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-sm hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="text-sm hover:underline">Terms of Service</Link>
              <Link href="/sitemap" className="text-sm hover:underline">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;