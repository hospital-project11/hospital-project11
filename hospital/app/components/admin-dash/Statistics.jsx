"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/statistics');
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError('Failed to fetch statistics');
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Error fetching statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <span className="mt-4 text-gray-600 text-xl">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        <span className="text-xl">{error}</span>
      </div>
    );
  }

  // Chart data
  const doctorAppointmentsData = {
    labels: ["Most Appointments", "Least Appointments"],
    datasets: [{
      label: 'Doctors with Appointments',
      data: [stats.mostAppointmentsDoctor?.count, stats.leastAppointmentsDoctor?.count],
      backgroundColor: ['#48A6A7', '#9ACBD0'],
    }],
  };

  const patientAppointmentsData = {
    labels: ["Most Appointments", "Least Appointments"],
    datasets: [{
      label: 'Patients with Appointments',
      data: [stats.mostAppointmentsPatient?.count, stats.leastAppointmentsPatient?.count],
      backgroundColor: ['#006A71', '#F44336'],
    }],
  };

  const statusData = {
    labels: ['Pending', 'Confirmed', 'Cancelled', 'Done'],
    datasets: [{
      label: 'Appointment Statuses',
      data: [
        stats.appointmentStatus.find(status => status._id === 'pending')?.count || 0,
        stats.appointmentStatus.find(status => status._id === 'confirmed')?.count || 0,
        stats.appointmentStatus.find(status => status._id === 'cancelled')?.count || 0,
        stats.appointmentStatus.find(status => status._id === 'done')?.count || 0,
      ],
      backgroundColor: ['#F44336', '#48A6A7', '#9ACBD0', '#006A71'],
    }],
  };

  return (
    <div className="min-h-screen bg-[#f7fffd] py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-[#006A71] mb-6">Website Statistics</h2>

        {/* Display Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#006A71] text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-4xl font-bold mt-3">{stats.totalUsers}</p>
          </div>
          <div className="bg-[#48A6A7] text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Appointments</h3>
            <p className="text-4xl font-bold mt-3">{stats.totalAppointments}</p>
          </div>
          <div className="bg-[#9ACBD0] text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Contacts</h3>
            <p className="text-4xl font-bold mt-3">{stats.totalContacts}</p>
          </div>
          <div className="bg-[#006A71] text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Doctors</h3>
            <p className="text-4xl font-bold mt-3">{stats.totalDoctors}</p>
          </div>
        </div>

        {/* Appointment Statistics Chart */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-[#006A71] mb-4">Appointments Data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Bar data={doctorAppointmentsData} />
            </div>
            <div>
              <Bar data={patientAppointmentsData} />
            </div>
          </div>
        </div>

        {/* Appointment Status Chart */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-[#006A71] mb-4">Appointment Statuses</h3>
          <div className="w-full">
            <Bar data={statusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
