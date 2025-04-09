'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  Phone,
  Clock,
  FileText,
  RefreshCw,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentModal = ({ appointment, onClose, onUpdate, colors }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        status: appointment.status,
        diagnosis: appointment.diagnosis || '',
    });
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const [history, setHistory] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        totalCount: 0,
        totalPages: 0,
    });

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
            case 'done':
                return {
                    color: colors.primary,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    icon: <CheckSquare className="h-5 w-5" />,
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

    const statusDetails = getStatusDetails(appointment.status);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/doctors/history', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    patientId: appointment.patientId._id,
                },
                withCredentials: true,
            });
            setHistory(data.appointments);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching appointment history:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, pagination.page]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ border: `1px solid ${colors.primary}30` }}
            >
                {/* Modal header with gradient background */}
                <div className="p-6 rounded-t-1xl" style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    color: 'white'
                }}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            {activeTab === 'details' ? 'Appointment Details' : 'Appointment History'}
                        </h3>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose} 
                            className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="h-6 w-6 text-white" />
                        </motion.button>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="flex justify-start p-4 border-b" style={{ borderColor: colors.primary + '20' }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('details')}
                        className={`px-5 py-2 mr-2 rounded-lg font-medium transition-all ${
                            activeTab === 'details' ? 'bg-gray-100 shadow-inner' : 'bg-transparent hover:bg-gray-50'
                        }`}
                        style={{ color: colors.text.primary }}
                    >
                        Details
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('history')}
                        className={`px-5 py-2 rounded-lg font-medium transition-all ${
                            activeTab === 'history' ? 'bg-gray-100 shadow-inner' : 'bg-transparent hover:bg-gray-50'
                        }`}
                        style={{ color: colors.text.primary }}
                    >
                        History
                    </motion.button>
                </div>

                {/* Modal body */}
                <div className="p-4">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center"
                            >
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            {/* Patient Information Card */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-5 rounded-xl shadow-sm border" 
                                style={{ 
                                    backgroundColor: colors.background,
                                    borderColor: colors.primary + '20',
                                    borderLeft: `4px solid ${colors.primary}`
                                }}
                            >
                                <h4 className="text-sm font-medium mb-4 uppercase tracking-wider flex items-center" style={{ color: colors.text.light }}>
                                    <User className="h-4 w-4 mr-2" style={{ color: colors.primary }} />
                                    Patient Information
                                </h4>
                                
                                <div className="flex items-center mb-5">
                                    <div className="p-3 rounded-full mr-4 flex items-center justify-center shadow-sm" style={{ 
                                        backgroundColor: colors.accent + '20',
                                        border: `1px solid ${colors.primary}20`
                                    }}>
                                        <User className="h-6 w-6" style={{ color: colors.primary }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg" style={{ color: colors.text.primary }}>
                                            {appointment.patientId?.name}
                                        </p>
                                        <p className="text-sm" style={{ color: colors.text.secondary }}>
                                            {appointment.patientId?.email}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: colors.accent + '20' }}>
                                            <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>Phone</p>
                                            <p className="font-medium" style={{ color: colors.text.primary }}>
                                                {appointment.patientId?.phone || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: colors.accent + '20' }}>
                                            <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>Appointment Time</p>
                                            <p className="font-medium" style={{ color: colors.text.primary }}>
                                                {formatDateTime(appointment.appointmentDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.accent + '20' }}>
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium mb-2" style={{ color: colors.text.light }}>
                                                Current Status
                                            </p>
                                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${statusDetails.bgColor}`}>
                                                {statusDetails.icon}
                                                <span className={`ml-2 font-medium ${statusDetails.textColor}`}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="text-sm font-medium" style={{ color: colors.text.light }}>Appointment ID</p>
                                            <p className="text-xs font-mono" style={{ color: colors.text.secondary }}>
                                                {appointment._id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Update Form Card */}
                            <motion.form 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onSubmit={handleSubmit} 
                                className="space-y-6"
                            >
                                <div className="p-5 rounded-xl shadow-sm border" style={{ 
                                    backgroundColor: colors.background,
                                    borderColor: colors.primary + '20'
                                }}>
                                    <h4 className="text-sm font-medium mb-4 uppercase tracking-wider flex items-center" style={{ color: colors.text.light }}>
                                        <RefreshCw className="h-4 w-4 mr-2" style={{ color: colors.primary }} />
                                        Update Appointment
                                    </h4>
                                    
                                    <div className="mb-5">
                                        <label className="flex items-center text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                                            Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full p-3 pl-4 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none"
                                                style={{
                                                    borderColor: colors.primary + '30',
                                                    backgroundColor: 'white',
                                                    color: colors.text.primary,
                                                    focusRingColor: colors.primary
                                                }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="done">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <ChevronDown className="h-4 w-4" style={{ color: colors.text.secondary }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                                            Diagnosis / Notes
                                        </label>
                                        <textarea
                                            name="diagnosis"
                                            value={formData.diagnosis}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                borderColor: colors.primary + '30',
                                                backgroundColor: 'white',
                                                color: colors.text.primary,
                                                focusRingColor: colors.primary
                                            }}
                                            placeholder="Enter diagnosis or notes..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 border rounded-xl font-medium transition-all flex items-center"
                                        style={{
                                            borderColor: colors.primary + '30',
                                            color: colors.text.primary,
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.03, boxShadow: `0 4px 12px ${colors.primary}30` }}
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        disabled={isUpdating}
                                        className="px-5 py-2.5 rounded-xl text-white font-medium transition-all flex items-center justify-center"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                            boxShadow: `0 4px 6px ${colors.primary}20`
                                        }}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Update Appointment
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.form>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* History Header Card */}
                            <div className="p-5 rounded-xl shadow-sm border" style={{ 
                                backgroundColor: colors.background,
                                borderColor: colors.primary + '20',
                                borderLeft: `4px solid ${colors.primary}`
                            }}>
                                <h4 className="text-sm font-medium mb-2 uppercase tracking-wider" style={{ color: colors.text.light }}>
                                    Appointment History for {appointment.patientId?.name}
                                </h4>
                                <p className="text-sm" style={{ color: colors.text.secondary }}>
                                    Showing {history.length} of {pagination.totalCount} appointments
                                </p>
                            </div>

                            {/* History List */}
                            {history.length === 0 ? (
                                <div className="p-8 text-center rounded-xl border-2 border-dashed" style={{ 
                                    borderColor: colors.primary + '30',
                                    backgroundColor: colors.background
                                }}>
                                    <p style={{ color: colors.text.secondary }}>No past appointments found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((appt) => {
                                        const statusDetails = getStatusDetails(appt.status);
                                        return (
                                            <motion.div 
                                                key={appt._id}
                                                whileHover={{ y: -2 }}
                                                className="p-5 rounded-xl shadow-sm border" 
                                                style={{ 
                                                    backgroundColor: 'white',
                                                    borderColor: colors.primary + '20'
                                                }}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-medium" style={{ color: colors.text.primary }}>
                                                            {formatDateTime(appt.appointmentDate)}
                                                        </p>
                                                        {appt.diagnosis && (
                                                            <p className="text-sm mt-1 line-clamp-2" style={{ color: colors.text.secondary }}>
                                                                {appt.diagnosis}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className={`flex items-center px-3 py-1.5 rounded-full ${statusDetails.bgColor} self-start sm:self-center`}>
                                                        {statusDetails.icon}
                                                        <span className={`ml-2 text-sm font-medium ${statusDetails.textColor}`}>
                                                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-4 mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} 
                                        disabled={pagination.page === 1}
                                        className="p-2 rounded-lg disabled:opacity-50"
                                        style={{ 
                                            backgroundColor: colors.primary + '10',
                                            color: colors.primary
                                        }}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </motion.button>
                                    
                                    <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} 
                                        disabled={pagination.page === pagination.totalPages}
                                        className="p-2 rounded-lg disabled:opacity-50"
                                        style={{ 
                                            backgroundColor: colors.primary + '10',
                                            color: colors.primary
                                        }}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AppointmentModal;