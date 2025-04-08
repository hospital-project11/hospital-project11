'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';  // Importing the calendar component
import 'react-calendar/dist/Calendar.css';  // Importing the CSS for the calendar
import { useRouter } from 'next/navigation';

export default function AvailableAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const router = useRouter();  // Make sure to initialize the router

  // Fetch appointments when the selected date changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Send the selected date in 'yyyy-mm-dd' format to the API
        const selectedDateString = selectedDate.toISOString().split('T')[0];
        const res = await axios.get(`/api/appointments?date=${selectedDateString}`);
        
        // Assuming the server returns appointments for the selected date, update the state
        setAppointments(res.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  const handleBooking = (appointmentId, price) => {
    router.push(`/payment?appointmentId=${appointmentId}&price=${price}`);
  };

  // Handle date change in the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter appointments for the selected date (if necessary)
  const filterAppointmentsByDate = () => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const filtered = appointments.filter((appt) => {
      const appointmentDate = new Date(appt.appointmentDate).toISOString().split('T')[0];
      return appointmentDate === selectedDateString;
    });
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    filterAppointmentsByDate(); // Filter appointments when `appointments` or `selectedDate` changes
  }, [appointments, selectedDate]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Available Appointments</h1>

      {/* Calendar Component */}
      <div className="mb-6 text-center">
        <label className="block mb-2 font-semibold">Select a Date</label>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>

      {/* Display appointments for the selected date */}
      {filteredAppointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments available for the selected date.</p>
      ) : (
        filteredAppointments.map((appt) => (
          <div key={appt._id} className="border p-4 mb-4 rounded shadow-sm bg-white">
            <p><strong>Doctor:</strong> {appt.doctorId?.userId?.name}</p>
            <p><strong>Specialization:</strong> {appt.doctorId?.specialization}</p>
            <p><strong>Date & Time:</strong> {new Date(appt.appointmentDate).toLocaleString()}</p>
            <p><strong>Price:</strong> ${appt.doctorId?.price}</p>
            <button
              onClick={() => handleBooking(appt._id, appt.doctorId?.price)}
              className="bg-blue-600 text-white px-4 py-2 mt-3 rounded hover:bg-blue-700"
            >
              Book Now
            </button>
          </div>
        ))
      )}
    </div>
  );
}
