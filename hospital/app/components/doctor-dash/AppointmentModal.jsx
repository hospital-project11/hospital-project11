import { useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { User } from 'lucide-react'; // Add your desired icon library

const AppointmentModal = ({ appointment, onClose, onUpdate, colors }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        status: appointment.status,
        diagnosis: appointment.diagnosis || '',
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError('');

        try {
            const { data } = await axios.put(
                `/api/doctors/${appointment._id}`,
                formData,
                { withCredentials: true }
            );

            if (data.success) {
                onUpdate(data.appointment);
                onClose();
            } else {
                throw new Error(data.error || 'Failed to update appointment');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'confirmed':
                return {
                    color: colors.success,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    icon: <CheckCircle className="h-5 w-5" />,
                };
            case 'cancelled':
                return {
                    color: colors.danger,
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    icon: <XCircle className="h-5 w-5" />,
                };
            default:
                return {
                    color: colors.warning,
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    icon: <AlertCircle className="h-5 w-5" />,
                };
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/40 backdrop-blur-md bg-opacity-50 p-4">
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal header */}
                <div className="p-6 border-b" style={{ borderColor: colors.accent + '50' }}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>
                            Appointment Details
                        </h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                            <XCircle className="h-6 w-6" style={{ color: colors.text.secondary }} />
                        </button>
                    </div>
                </div>

                {/* Modal body */}
                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2" style={{ color: colors.text.light }}>
                            PATIENT INFORMATION
                        </h4>
                        <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                            <div className="flex items-center mb-4">
                                <div className="p-2 rounded-full mr-3" style={{ backgroundColor: colors.accent + '30' }}>
                                    <User className="h-6 w-6" style={{ color: colors.primary }} />
                                </div>
                                <div>
                                    <p className="font-medium" style={{ color: colors.text.primary }}>
                                        {appointment.patientId?.name}
                                    </p>
                                    <p className="text-sm" style={{ color: colors.text.secondary }}>
                                        {appointment.patientId?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap -mx-2">
                                <div className="px-2 w-full sm:w-1/2 mb-4">
                                    <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>
                                        Phone
                                    </p>
                                    <p style={{ color: colors.text.primary }}>
                                        {appointment.patientId?.phone || 'Not provided'}
                                    </p>
                                </div>
                                <div className="px-2 w-full sm:w-1/2 mb-4">
                                    <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>
                                        Date & Time
                                    </p>
                                    <p style={{ color: colors.text.primary }}>
                                        {formatDateTime(appointment.appointmentDate)}
                                    </p>
                                </div>
                                <div className="px-2 w-full mb-2">
                                    <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>
                                        Current Status
                                    </p>
                                    <div className="flex items-center">
                                        {getStatusDetails(appointment.status).icon}
                                        <span
                                            className="ml-2 font-medium"
                                            style={{ color: getStatusDetails(appointment.status).color }}
                                        >
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                                Update Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    borderColor: '#E5E7EB',
                                    color: colors.text.primary,
                                    focusRingColor: colors.primary,
                                }}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                                Diagnosis / Notes
                            </label>
                            <textarea
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    borderColor: '#E5E7EB',
                                    color: colors.text.primary,
                                    focusRingColor: colors.primary,
                                }}
                                placeholder="Enter diagnosis or any notes about this appointment..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg font-medium"
                                style={{
                                    borderColor: '#E5E7EB',
                                    color: colors.text.primary,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-all hover:shadow-md"
                                style={{ backgroundColor: colors.primary }}
                            >
                                {isUpdating ? 'Updating...' : 'Update Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
