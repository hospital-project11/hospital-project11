'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DoctorHeader from './DoctorHeader';
import DashboardStats from './DashboardStats';
import AppointmentForm from './AppointmentForm';
import AppointmentsView from './AppointmentsView';
import AppointmentModal from './AppointmentModal';
import Pagination from './Pagination'; // You'll need to create this component

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
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Color palette
  const colors = {
    primary: '#006A71',
    secondary: '#48A6A7',
    accent: '#9ACBD0',
    background: '#F2EFE7',
    white: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      light: '#6B7280'
    }
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [pagination.page, filters]); // Refetch when page or filters change

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (name, value) => {
    // Reset to page 1 when filters change
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
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create appointment');
    } finally {
      setIsSubmitting(false);
    }
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
    // May want to refresh the data to ensure consistency
    fetchAppointments();
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
          color: colors.success,
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