"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState(null);

  // Color scheme
  const colors = {
    primary: '#006A71',
    secondary: '#48A6A7',
    accent: '#9ACBD0',
    background: '#f7fffd',
    white: '#FFFFFF',
    success: '#4CAF50',
    warning: '#618300',
    danger: '#F44336',
    confirmed: '#007f83',
    done: '#0027ff',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      light: '#6B7280'
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter out deleted users and only show active ones
  const activeUsers = users.filter(user => !user.isDeleted);
  
  // Filter users based on selected role
  const filteredUsers = filter === "all" 
    ? activeUsers 
    : activeUsers.filter(user => user.role === filter);

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`/api/admin/${userId}`);
      fetchUsers(); // Update list after deletion
    } catch (error) {
      console.error("Failed to delete patient", error);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    fetchAppointments(user._id); // Fetch appointments when a user is selected
  };

  const fetchAppointments = async (patientId) => {
    setLoadingAppointments(true);
    setError(null);
    try {
      const res = await axios.get(`/api/admin/appointments/${patientId}`);
      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        setAppointments([]);
        setError(res.data.message || 'No appointments found');
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.response?.data?.message || 'Failed to fetch patient appointments');
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color based on appointment status
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return colors.done;
      case 'confirmed':
        return colors.confirmed;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.accent;
    }
  };

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>Admin Dashboard</h1>
          <p style={{ color: colors.text.secondary }} className="mt-2">Manage users and appointments</p>
        </header>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === "all"
                ? "text-white shadow-md"
                : "bg-white border hover:bg-opacity-90"
            }`}
            style={{ 
              backgroundColor: filter === "all" ? colors.primary : colors.white,
              borderColor: colors.primary,
              color: filter === "all" ? colors.white : colors.primary
            }}
          >
            All Users
          </button>
          <button
            onClick={() => setFilter("doctor")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === "doctor"
                ? "text-white shadow-md"
                : "bg-white border hover:bg-opacity-90"
            }`}
            style={{ 
              backgroundColor: filter === "doctor" ? colors.secondary : colors.white,
              borderColor: colors.secondary,
              color: filter === "doctor" ? colors.white : colors.secondary
            }}
          >
            Doctors
          </button>
          <button
            onClick={() => setFilter("patient")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === "patient"
                ? "text-white shadow-md"
                : "bg-white border hover:bg-opacity-90"
            }`}
            style={{ 
              backgroundColor: filter === "patient" ? colors.accent : colors.white,
              borderColor: colors.accent,
              color: filter === "patient" ? colors.white : colors.text.primary
            }}
          >
            Patients
          </button>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: colors.primary }} className="text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text.primary }}>{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text.secondary }}>{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text.secondary }}>{user.phone || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                          backgroundColor: user.role === "doctor" ? `${colors.secondary}20` : `${colors.accent}40`,
                          color: user.role === "doctor" ? colors.secondary : colors.primary
                        }}>
                          {user.role === "doctor" ? "Doctor" : "Patient"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {user.role === "patient" && (
                          <div className="flex justify-end gap-2">
                            <button
                              className="text-white px-3 py-1 rounded-md text-sm transition-colors"
                              style={{ backgroundColor: colors.primary }}
                              onClick={() => handleViewDetails(user)}
                            >
                              View Appointments
                            </button>
                            <button
                              className="text-white px-3 py-1 rounded-md text-sm transition-colors"
                              style={{ backgroundColor: colors.danger }}
                              onClick={() => handleDeleteClick(user._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center" style={{ color: colors.text.light }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Patient Appointment Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b" style={{ backgroundColor: colors.primary }}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Patient Appointments
                  </h2>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="text-white hover:text-gray-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Patient Info */}
              <div className="px-6 py-3" style={{ backgroundColor: colors.accent + '20' }}>
                <div className="flex items-center">
                  <div className="rounded-full bg-white p-2 mr-3" style={{ color: colors.primary }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: colors.primary }}>{selectedUser.name}</h3>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-sm" style={{ color: colors.text.secondary }}>{selectedUser.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Appointments Content */}
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                {loadingAppointments ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto" style={{ borderColor: colors.primary }}></div>
                    <p className="mt-2" style={{ color: colors.text.secondary }}>Loading appointments...</p>
                  </div>
                ) : error ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: colors.danger }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: colors.danger }}>{error}</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: colors.accent + '30' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: colors.text.secondary }}>No appointments found for this patient.</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium" style={{ color: colors.primary }}>
                        Patient History
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.accent + '30', color: colors.primary }}>
                        {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <ul className="space-y-4">
                      {appointments.map((appointment) => (
                        <li key={appointment._id} className="rounded-lg shadow-sm overflow-hidden border" style={{ borderColor: getStatusColor(appointment.status) + '30' }}>
                          {/* Appointment Header */}
                          <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: getStatusColor(appointment.status) + '10' }}>
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: getStatusColor(appointment.status) }}></div>
                              <span className="font-medium text-sm" style={{ color: getStatusColor(appointment.status) }}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </div>
                            <span className="text-sm" style={{ color: colors.text.secondary }}>
                              {formatDate(appointment.appointmentDate)}
                            </span>
                          </div>
                          
                          {/* Appointment Details */}
                          <div className="px-4 py-3 bg-white">
                            <div className="mb-2">
                              <h4 className="text-sm font-medium" style={{ color: colors.primary }}>Diagnosis</h4>
                              <p className="text-sm" style={{ color: colors.text.secondary }}>
                                {appointment.diagnosis || "No diagnosis provided"}
                              </p>
                            </div>
                            
                            {appointment.notes && (
                              <div>
                                <h4 className="text-sm font-medium" style={{ color: colors.primary }}>Notes</h4>
                                <p className="text-sm" style={{ color: colors.text.secondary }}>
                                  {appointment.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t px-6 py-4 flex justify-end">
                <button
                  className="px-4 py-2 rounded-md transition-colors text-white"
                  style={{ backgroundColor: colors.accent }}
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}