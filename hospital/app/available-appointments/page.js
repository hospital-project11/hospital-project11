'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AvailableAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`/api/appointments${selectedDate ? `?date=${selectedDate}` : ''}`);
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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Available Appointments</h1>

      {/* Date Filter */}
      <div className="mb-6 text-center">
        <label className="block mb-2 font-semibold">Filter by Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        />
      </div>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments available for the selected date.</p>
      ) : (
        appointments.map((appt) => (
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
