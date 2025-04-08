'use client';
import { useState } from 'react';
import axios from 'axios';

const AppointmentModal = ({ appointment, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: appointment.status,
    diagnosis: appointment.diagnosis || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');

    try {
      const { data } = await axios.put(
        `/api/doctors/${appointment._id}`,
        {
          status: formData.status,
          diagnosis: formData.diagnosis
        },
        { withCredentials: true }
      );

      if (data.success) {
        onUpdate(data.appointment);
        onClose();
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'Failed to update appointment');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Appointment Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isUpdating}
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              {error}
            </div>
          )}

          {/* Patient Information Section */}
          {appointment.patientId && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Patient Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-600">Name</p>
                    <p>{appointment.patientId.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Email</p>
                    <p>{appointment.patientId.email}</p>
                  </div>
                  {appointment.patientId.phone && (
                    <div className="col-span-2">
                      <p className="font-medium text-gray-600">Phone</p>
                      <p>{appointment.patientId.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appointment Information Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Appointment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600">Date</p>
                <p>{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Time</p>
                <p>
                  {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Current Status</p>
                <p className="capitalize">{appointment.status}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Payment Status</p>
                <p className="capitalize">{appointment.payment?.status || 'pending'}</p>
              </div>
            </div>
          </div>

          {/* Update Form Section */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="status" className="block font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isUpdating}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="diagnosis" className="block font-medium text-gray-700 mb-2">
                Diagnosis Notes
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter diagnosis notes..."
                disabled={isUpdating}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="inline-block animate-spin mr-2">↻</span>
                    Updating...
                  </>
                ) : 'Update Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;