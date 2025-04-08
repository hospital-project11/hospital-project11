'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentModal from './AppointmentModal';

// Mapping statuses for UI
const statusUIToDB = {
  Booked: 'pending',
  Completed: 'confirmed',
  Cancelled: 'cancelled',
};

const statusDBToUI = {
  pending: 'Booked',
  confirmed: 'Completed',
  cancelled: 'Cancelled',
};

export default function DoctorDashboard() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]); // List of booked and unbooked slots
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctorId, setDoctorId] = useState(null); // Initially null to avoid SSR mismatch

  // Fetch the logged-in doctor's ID from the JWT token
  useEffect(() => {
    const getDoctorIdFromToken = () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
          setDoctorId(decoded.userId); // Set the doctorId from the token payload
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    getDoctorIdFromToken(); // Only runs client-side after mount
  }, []); // Empty dependency array to ensure it runs once after mount

  // Fetch appointments for the logged-in doctor
  const fetchAppointments = async () => {
    if (!doctorId) return; // Ensure doctorId is available before fetching

    try {
      const response = await axios.get('/api/doctors'); // No need to pass doctorId in URL
      if (response.data.success) {
        console.log('Fetched Appointments:', response.data.appointments); // Add a log for debugging
        const transformedAppointments = response.data.appointments.map((appt) => {
          const apptDate = new Date(appt.appointmentDate);
          return {
            id: appt._id,
            date: apptDate.toISOString().slice(0, 10), // yyyy-mm-dd format
            time: apptDate.toTimeString().slice(0, 5), // HH:MM format
            patientName: appt.patientId ? appt.patientId.name : '',
            status: statusDBToUI[appt.status],
            diagnosis: appt.diagnosis,
          };
        });
        setSlots(transformedAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Call fetchAppointments after doctorId is available
  useEffect(() => {
    if (doctorId) {
      fetchAppointments(); // Fetch appointments only after doctorId is set
    }
  }, [doctorId]); // Triggered when doctorId changes

  // Handle creating a new appointment slot
  const handleCreateSlot = async () => {
    if (!date || !time) return;

    try {
      const response = await axios.post('/api/doctors', { date, time });
      if (response.data.success) {
        // If the appointment was successfully created, re-fetch updated appointments
        alert('Appointment slot created successfully!');
        await fetchAppointments(); // Refresh appointments
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }

    setDate('');
    setTime('');
  };

  // Handle status change for an appointment
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch('/api/doctors', { _id: id, status: statusUIToDB[newStatus] });
      if (response.data.success) {
        await fetchAppointments(); // Refresh after updating status
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  // Handle saving diagnosis for an appointment
  const handleSaveDiagnosis = async (id, diagnosis) => {
    try {
      const response = await axios.patch('/api/doctors', { _id: id, diagnosis });
      if (response.data.success) {
        await fetchAppointments(); // Refresh after saving diagnosis
      }
    } catch (error) {
      console.error('Error saving diagnosis:', error);
    }
  };

  // Open the modal to view appointment details
  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  // Filter booked and available appointments
  const bookedAppointments = slots.filter((slot) => slot.patientName);
  const availableAppointments = slots.filter((slot) => !slot.patientName);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Doctor Dashboard</h1>

      {/* Create Appointment Slot Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Appointment Slot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleCreateSlot}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Slot
        </button>
      </div>

      {/* Booked Appointments */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Booked Appointments</h2>
        {bookedAppointments.length > 0 ? (
          <ul className="space-y-4">
            {bookedAppointments.map((appt) => (
              <li
                key={appt.id}
                className="border p-4 rounded-md cursor-pointer"
                onClick={() => openModal(appt)}
              >
                <p>
                  <strong>Date:</strong> {appt.date}
                </p>
                <p>
                  <strong>Time:</strong> {appt.time}
                </p>
                <p>
                  <strong>Patient:</strong> {appt.patientName}
                </p>
                <p>
                  <strong>Status:</strong> {appt.status}
                </p>
                {appt.diagnosis && <p><strong>Diagnosis:</strong> {appt.diagnosis}</p>}
                <div className="mt-2 flex gap-2">
                  <select
                    value={appt.status}
                    onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                    className="border border-gray-300 px-2 py-1 rounded"
                  >
                    <option>Booked</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No booked appointments yet.</p>
        )}
      </div>

      {/* Unbooked Appointments */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Unbooked Appointments</h2>
        {availableAppointments.length > 0 ? (
          <ul className="space-y-4">
            {availableAppointments.map((slot) => (
              <li key={slot.id} className="border p-4 rounded-md">
                <p><strong>Date:</strong> {slot.date}</p>
                <p><strong>Time:</strong> {slot.time}</p>
                <p><strong>Status:</strong> {slot.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No available slots.</p>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        appointment={selectedAppointment}
        onSaveDiagnosis={handleSaveDiagnosis}
      />
    </div>
  );
}
