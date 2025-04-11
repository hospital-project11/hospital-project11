'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import PaymentModal from './PaymentModal';

const categories = [
  'Vision Correction', 
  'Retina Care', 
  'Cataract Treatment', 
  'Pediatric Eye Care', 
  'Glaucoma Management', 
  'Routine Eye Exams',
  "Children's eyes"
];

export default function AvailableAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorName, setDoctorName] = useState('');  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState({ appointmentId: null, price: null });
  
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const selectedDateString = selectedDate.toISOString().split('T')[0];
        const res = await axios.get(`/api/appointments?date=${selectedDateString}&doctorName=${doctorName}&category=${selectedCategory}`);
        setAppointments(res.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
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

  const handleDateChange = (date) => setSelectedDate(date);
  const handleDoctorNameChange = (e) => setDoctorName(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  return (
    <div className="min-h-screen bg-white pt-22">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#48A6A7]">Available Appointments</h1>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar Component */}
            <div className="md:col-span-1">
              <label className="block mb-2 font-semibold text-[#48A6A7]">Select a Date</label>
              <div className="calendar-wrapper">
                <style jsx>{`
                  .calendar-wrapper :global(.react-calendar) {
                    width: 100%;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                  }
                  .calendar-wrapper :global(.react-calendar__tile--active) {
                    background-color: #48A6A7;
                    color: white;
                  }
                  .calendar-wrapper :global(.react-calendar__tile--now) {
                    background-color: rgba(72, 166, 167, 0.1);
                  }
                  .calendar-wrapper :global(.react-calendar__tile:hover) {
                    background-color: rgba(72, 166, 167, 0.2);
                  }
                  .calendar-wrapper :global(.react-calendar__navigation button:hover) {
                    background-color: rgba(72, 166, 167, 0.1);
                  }
                `}</style>
                <Calendar onChange={handleDateChange} value={selectedDate} />
              </div>
            </div>

            {/* Filters */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Name Filter */}
                <div>
                  <label className="block mb-2 font-semibold text-[#48A6A7]">Filter by Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={handleDoctorNameChange}
                    placeholder="Search by doctor's name"
                    className="border border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#48A6A7] focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block mb-2 font-semibold text-[#48A6A7]">Filter by Category</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="border border-gray-200 p-3 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-[#48A6A7] focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display filtered appointments */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#48A6A7]">
            Appointments for {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          {filteredAppointments.length === 0 ? (
            <div className="flex items-center justify-center p-12 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-500 text-lg">No appointments available for the selected criteria.</p>
                <p className="text-gray-400 mt-2">Try changing your filters or selecting another date.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((appt) => (
                <div key={appt._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <div className="bg-[#48A6A7] p-4 text-white">
                    <h3 className="font-semibold text-lg">
                      Dr. {appt.doctorId?.userId?.name}
                    </h3>
                    <span className="inline-block bg-white bg-opacity-20 text-[#48A6A7] px-3 py-1 rounded-full text-xs font-medium mt-1">
                      {appt.doctorId?.specialization}
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-[#48A6A7] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-gray-700">
                        {new Date(appt.appointmentDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-[#48A6A7] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700">
                        {new Date(appt.appointmentDate).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-5">
                      <svg className="w-5 h-5 text-[#48A6A7] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="font-bold text-[#48A6A7] text-lg">{appt.doctorId?.price} JD</span>
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => handleBooking(appt._id, appt.doctorId?.price)}
                      className="w-full bg-[#48A6A7] hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                      </svg>
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          appointmentId={selectedPaymentData.appointmentId}
          price={selectedPaymentData.price}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
