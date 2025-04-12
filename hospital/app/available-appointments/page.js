'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import PaymentModal from './PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  'Vision Correction', 
  'Retina Care', 
  'Cataract Treatment', 
  'Pediatric Eye Care', 
  'Glaucoma Management', 
  'Routine Eye Exams',
  "Children's eyes"
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function AvailableAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorName, setDoctorName] = useState('');  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState({ appointmentId: null, price: null });
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const selectedDateString = selectedDate.toISOString().split('T')[0];
        const res = await axios.get(`/api/appointments?date=${selectedDateString}&doctorName=${doctorName}&category=${selectedCategory}`);
        setAppointments(res.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [selectedDate, doctorName, selectedCategory]);

  const filterAppointmentsByDateDoctorAndCategory = () => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const filtered = appointments.filter((appt) => {
      const appointmentDate = new Date(appt.appointmentDate).toISOString().split('T')[0];
      const doctorMatch = appt.doctorId?.userId?.name.toLowerCase().includes(doctorName.toLowerCase());
      const categoryMatch = appt.doctorId?.specialization.toLowerCase().includes(selectedCategory.toLowerCase());
      return appointmentDate === selectedDateString && doctorMatch && categoryMatch;
    });
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    filterAppointmentsByDateDoctorAndCategory();
  }, [appointments, selectedDate, doctorName, selectedCategory]);

  const handleBooking = (appointmentId, price) => {
    setSelectedPaymentData({ appointmentId, price });
    setShowPaymentModal(true);
  };

  const sendEmail = async (doctorId) => {
    console.log(doctorId);
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: doctorId
      }),
    });
  }

  const handleDateChange = (date) => setSelectedDate(date);
  const handleDoctorNameChange = (e) => setDoctorName(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9f9] to-white pt-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3 text-[#2a7e7f]">Book Your Eye Care Appointment</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find available time slots with our specialist ophthalmologists and book your appointment in just a few clicks.
          </p>
        </motion.div>

        <div className="bg-white shadow-xl rounded-2xl p-8 mb-12 transform transition-all hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Component */}
            <div className="lg:col-span-1">
              <label className="block mb-4 font-semibold text-[#2a7e7f] text-lg">Select a Date</label>
              <div className="calendar-wrapper bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <style jsx>{`
                  .calendar-wrapper :global(.react-calendar) {
                    width: 100%;
                    border: none;
                    box-shadow: none;
                    font-family: inherit;
                  }
                  .calendar-wrapper :global(.react-calendar__navigation) {
                    margin-bottom: 1em;
                  }
                  .calendar-wrapper :global(.react-calendar__navigation button) {
                    min-width: 44px;
                    background: none;
                    color: #2a7e7f;
                    font-weight: 600;
                  }
                  .calendar-wrapper :global(.react-calendar__month-view__weekdays) {
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: 600;
                    font-size: 0.75em;
                    color: #2a7e7f;
                  }
                  .calendar-wrapper :global(.react-calendar__tile) {
                    max-width: 100%;
                    padding: 10px 6.6667px;
                    background: none;
                    text-align: center;
                    line-height: 16px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                  }
                  .calendar-wrapper :global(.react-calendar__tile--active) {
                    background: #2a7e7f;
                    color: white;
                  }
                  .calendar-wrapper :global(.react-calendar__tile--now) {
                    background: rgba(42, 126, 127, 0.1);
                    color: #2a7e7f;
                    font-weight: 600;
                  }
                  .calendar-wrapper :global(.react-calendar__tile:hover) {
                    background: rgba(42, 126, 127, 0.2);
                  }
                  .calendar-wrapper :global(.react-calendar__tile--active:hover) {
                    background: #1d6b6c;
                  }
                `}</style>
                <Calendar 
                  onChange={handleDateChange} 
                  value={selectedDate}
                  minDate={new Date()}
                  className="text-gray-700"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Name Filter */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block mb-3 font-semibold text-[#2a7e7f] text-lg">Find Your Doctor</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-[#2a7e7f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={handleDoctorNameChange}
                      placeholder="Search by doctor's name"
                      className="pl-10 border-2 border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2a7e7f] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block mb-3 font-semibold text-[#2a7e7f] text-lg">Specialization</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="appearance-none border-2 border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2a7e7f] focus:border-transparent transition-all duration-200 pl-3 pr-10"
                    >
                      <option value="">All Specializations</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#2a7e7f]">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Selected Date Display */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.3 }}
                className="mt-8 bg-[#f0f9f9] p-4 rounded-xl border border-[#d1eeee]"
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-[#2a7e7f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[#2a7e7f]">Selected Date</h3>
                    <p className="text-gray-700">
                      {selectedDate.toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Display filtered appointments */}
        <div className="mt-8">
          <motion.h2 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-3xl font-semibold mb-8 text-[#2a7e7f]"
          >
            Available Time Slots
            <span className="block mt-2 text-lg font-normal text-gray-600">
              for {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </motion.h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2a7e7f]"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col items-center justify-center p-12 rounded-xl bg-[#f0f9f9] border border-[#d1eeee]"
            >
              <svg className="w-20 h-20 mx-auto text-[#2a7e7f] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No appointments available</h3>
              <p className="text-gray-500 text-center max-w-md">
                We couldn't find any available appointments matching your criteria. 
                Try adjusting your filters or selecting a different date.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredAppointments.map((appt) => (
                  <motion.div
                    key={appt._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-r from-[#2a7e7f] to-[#48A6A7] p-5 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl">
                            Dr. {appt.doctorId?.userId?.name}
                          </h3>
                          <span className="inline-block bg-white bg-opacity-20 text-gray-600 px-3 py-1 rounded-full text-xs font-medium mt-2">
                            {appt.doctorId?.specialization}
                          </span>
                        </div>
                        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="bg-[#e6f4f4] p-2 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-[#2a7e7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-gray-700">
                              {new Date(appt.appointmentDate).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="bg-[#e6f4f4] p-2 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-[#2a7e7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium text-gray-700">
                              {new Date(appt.appointmentDate).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="bg-[#e6f4f4] p-2 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-[#2a7e7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Consultation Fee</p>
                            <p className="font-bold text-[#2a7e7f] text-xl">{appt.doctorId?.price} JD</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {handleBooking(appt._id, appt.doctorId?.price), sendEmail(appt.doctorId.userId._id)}}
                        className="w-full bg-gradient-to-r from-[#2a7e7f] to-[#48A6A7] hover:from-[#1d6b6c] hover:to-[#2a7e7f] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                        </svg>
                        Book Appointment
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModal
            appointmentId={selectedPaymentData.appointmentId}
            price={selectedPaymentData.price}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}