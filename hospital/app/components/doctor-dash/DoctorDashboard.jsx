'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import AppointmentsView from './AppointmentsView';
import AppointmentModal from './AppointmentModal';
import Pagination from './Pagination';
import DashboardStats from './DashboardStats';
import DoctorHeader from './DoctorHeader';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [view, setView] = useState('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Color palette
  const colors = {
    primary: '#006A71',
    secondary: '#48A6A7',
    accent: '#9ACBD0',
    background: '#f7fffd',
    white: '#FFFFFF',
    success: '#4CAF50',
    warning: '#618300',
    danger: '#F44336',
    confirmed:'#007f83',
    done: '#0027ff',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      light: '#6B7280'
    }
  };

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      // Add filter parameters if they're set
      if (filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      
      if (filters.dateRange !== 'all') {
        queryParams.append('dateRange', filters.dateRange);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const { data } = await axios.get(`/api/doctors?${queryParams.toString()}`, {
        withCredentials: true
      });

      if (data.success) {
        setAppointments(data.appointments);
        setFilteredAppointments(data.appointments);
        setPagination(data.pagination);
        setDoctor(data.doctor);
      } else {
        throw new Error(data.error || 'Failed to load data');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      addToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [pagination.page, filters]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (name, value) => {
    if (name !== 'page') {
      setPagination(prev => ({
        ...prev,
        page: 1
      }));
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      setError('Please select both date and time');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await axios.post(
        '/api/doctors',
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        // Refresh appointments after creating a new one
        fetchAppointments();
        setFormData({ date: '', time: '' });
        addToast('Appointment slot created successfully');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create appointment';
      setError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSlotCreated = (count) => {
    addToast(`Successfully created ${count} appointment slots`);
    fetchAppointments(); // Refresh the appointments list
  };

  const handleAppointmentClick = (appointment) => {
    if (appointment.patientId) {
      setSelectedAppointment(appointment);
    }
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
    fetchAppointments();
    addToast('Appointment updated successfully');
  };

  const formatDateTime = (isoString, type) => {
    const date = new Date(isoString);
    return type === 'date'
      ? date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: colors.confirmed,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <CheckCircle className="h-4 w-4 mr-1" />
        };
      case 'cancelled':
        return {
          color: colors.danger,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <XCircle className="h-4 w-4 mr-1" />
        };
      case 'done':
        return {
          color: colors.done,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <Clock className="h-4 w-4 mr-1" />
        };
      default:
        return {
          color: colors.warning,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <AlertCircle className="h-4 w-4 mr-1" />
        };
    }
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const endDate = new Date(lastDay);
    const daysToAdd = 6 - endDate.getDay();
    endDate.setDate(endDate.getDate() + daysToAdd);
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    return filteredAppointments.filter(appt => {
      const apptDate = new Date(appt.appointmentDate);
      return apptDate.getDate() === date.getDate() &&
             apptDate.getMonth() === date.getMonth() &&
             apptDate.getFullYear() === date.getFullYear();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  if (loading && !appointments.length) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15" style={{ backgroundColor: colors.background }}>
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`border-l-4 p-4 rounded-md flex items-start shadow-lg ${
              toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
              toast.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' :
              toast.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
              'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" /> :
             toast.type === 'error' ? <XCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" /> :
             <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              <p className="font-medium">
                {toast.type === 'success' ? 'Success!' : 
                 toast.type === 'error' ? 'Error!' : 'Notice!'}
              </p>
              <p className="mt-1 text-sm">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-500"
              aria-label="Dismiss notification"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <DoctorHeader doctor={doctor} colors={colors} />
        <DashboardStats filteredAppointments={filteredAppointments} colors={colors} />
        
        <AppointmentForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
          colors={colors}
          onSlotCreated={handleBulkSlotCreated}
        />
        
        <AppointmentsView
          view={view}
          setView={setView}
          currentMonth={currentMonth}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          filteredAppointments={filteredAppointments}
          handleAppointmentClick={handleAppointmentClick}
          selectedAppointment={selectedAppointment}
          filters={filters}
          handleFilterChange={handleFilterChange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          generateCalendarDays={generateCalendarDays}
          getAppointmentsForDate={getAppointmentsForDate}
          isToday={isToday}
          isCurrentMonth={isCurrentMonth}
          formatDateTime={formatDateTime}
          getStatusDetails={getStatusDetails}
          colors={colors}
          loading={loading}
        />

        {/* Pagination Component */}
        {view === 'list' && pagination.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              colors={colors}
            />
          </div>
        )}

        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdate={handleUpdateAppointment}
            colors={colors}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;