'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ChevronLeft, ChevronRight, Filter, Search, User, Clock, Calendar as CalendarIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/doctors', {
          withCredentials: true
        });

        if (data.success) {
          setAppointments(data.appointments);
          setFilteredAppointments(data.appointments);
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

    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, appointments]);

  const applyFilters = () => {
    let filtered = [...appointments];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(appt => appt.status === filters.status);
    }

    // Filter by search term (patient name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(appt => 
        appt.patientId?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filters.dateRange === 'today') {
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.appointmentDate);
        apptDate.setHours(0, 0, 0, 0);
        return apptDate.getTime() === today.getTime();
      });
    } else if (filters.dateRange === 'week') {
      const weekLater = new Date(today);
      weekLater.setDate(today.getDate() + 7);
      
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.appointmentDate);
        return apptDate >= today && apptDate <= weekLater;
      });
    } else if (filters.dateRange === 'month') {
      const monthLater = new Date(today);
      monthLater.setMonth(today.getMonth() + 1);
      
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.appointmentDate);
        return apptDate >= today && apptDate <= monthLater;
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
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
        setAppointments(prev => [...prev, data.appointment]);
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
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first day of the week that contains the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End on the last day of the week that contains the last day of the month
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Doctor Header */}
        <div className="rounded-xl shadow-md p-6 mb-8" style={{ backgroundColor: colors.primary }}>
          <div className="flex items-center">
            <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <User size={32} color={colors.white} />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: colors.white }}>Welcome Doctor! </h1>
              <div className="flex items-center">
                <span className="font-medium mr-2" style={{ color: colors.accent }}>
                  {doctor?.specialization}
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>•</span>
                <span className="ml-2 font-medium" style={{ color: colors.accent }}>
                  ${doctor?.price || 0} consultation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: colors.primary }}>
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 mr-2" style={{ color: colors.primary }} />
              <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Today</h3>
            </div>
            <p className="text-3xl font-bold" style={{ color: colors.primary }}>
              {filteredAppointments.filter(appt => {
                const today = new Date();
                const apptDate = new Date(appt.appointmentDate);
                return apptDate.getDate() === today.getDate() &&
                       apptDate.getMonth() === today.getMonth() &&
                       apptDate.getFullYear() === today.getFullYear();
              }).length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>Appointments</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: colors.secondary }}>
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 mr-2" style={{ color: colors.secondary }} />
              <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Confirmed</h3>
            </div>
            <p className="text-3xl font-bold" style={{ color: colors.secondary }}>
              {filteredAppointments.filter(appt => appt.status === 'confirmed').length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>Appointments</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: colors.accent }}>
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 mr-2" style={{ color: colors.accent }} />
              <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Pending</h3>
            </div>
            <p className="text-3xl font-bold" style={{ color: colors.accent }}>
              {filteredAppointments.filter(appt => appt.status === 'pending').length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>Appointments</p>
          </div>
        </div>

        {/* Create Appointment Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
            Create New Appointment Slot
          </h2>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2" style={{ color: colors.text.primary }}>Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5" style={{ color: colors.secondary }} />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#E5E7EB', 
                      color: colors.text.primary,
                      focusRingColor: colors.primary
                    }}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2" style={{ color: colors.text.primary }}>Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5" style={{ color: colors.secondary }} />
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#E5E7EB', 
                      color: colors.text.primary,
                      focusRingColor: colors.primary
                    }}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !formData.date || !formData.time}
              className="px-6 py-3 rounded-lg text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: isSubmitting || !formData.date || !formData.time ? '#9CA3AF' : colors.primary,
                cursor: isSubmitting || !formData.date || !formData.time ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Appointment Slot'}
            </button>
          </form>
        </div>

        {/* Appointments View Toggle and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex p-1 rounded-lg mb-4 sm:mb-0" style={{ backgroundColor: colors.accent + '30' }}>
              <button
                onClick={() => setView('list')}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  view === 'list'
                    ? 'text-white shadow-md'
                    : `text-${colors.primary} hover:bg-${colors.accent}30`
                }`}
                style={{ 
                  backgroundColor: view === 'list' ? colors.primary : 'transparent',
                  color: view === 'list' ? colors.white : colors.primary
                }}
              >
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  view === 'calendar'
                    ? 'text-white shadow-md'
                    : `text-${colors.primary} hover:bg-${colors.accent}30`
                }`}
                style={{ 
                  backgroundColor: view === 'calendar' ? colors.primary : 'transparent',
                  color: view === 'calendar' ? colors.white : colors.primary
                }}
              >
                Calendar View
              </button>
            </div>
            
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#E5E7EB', 
                    focusRingColor: colors.primary
                  }}
                />
                <Search className="absolute left-3 top-3 h-5 w-5" style={{ color: colors.text.light }} />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-2 p-3 border rounded-lg hover:bg-gray-50 transition-all"
                style={{ borderColor: '#E5E7EB' }}
              >
                <Filter className="h-5 w-5" style={{ color: colors.secondary }} />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 rounded-lg animate-fadeIn" style={{ backgroundColor: colors.background }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      borderColor: '#E5E7EB',
                      focusRingColor: colors.primary
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      borderColor: '#E5E7EB',
                      focusRingColor: colors.primary
                    }}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">Next 7 Days</option>
                    <option value="month">Next 30 Days</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({
                      status: 'all',
                      search: '',
                      dateRange: 'all'
                    });
                  }}
                  className="px-4 py-2 font-medium hover:underline transition-all"
                  style={{ color: colors.primary }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Appointments List/Calendar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>
              Your Appointments
            </h2>
            <div className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.accent + '30' }}>
              <span style={{ color: colors.primary }}>
                {filteredAppointments.length} total
              </span>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 inline-block p-4 rounded-full mb-4">
                <Calendar size={36} style={{ color: colors.primary }} />
              </div>
              <p style={{ color: colors.text.secondary }} className="text-lg">No appointments found</p>
              {appointments.length > 0 && (
                <p style={{ color: colors.text.light }} className="mt-2">
                  Try adjusting your filters
                </p>
              )}
            </div>
          ) : view === 'list' ? (
            <div className="space-y-4">
              {filteredAppointments.map(appt => {
                const statusDetails = getStatusDetails(appt.status);
                return (
                  <div 
                    key={appt._id} 
                    className={`rounded-xl transition-all duration-200 ${
                      appt.patientId 
                        ? 'cursor-pointer hover:shadow-md'
                        : ''
                    } ${
                      selectedAppointment?._id === appt._id
                        ? 'border-2 shadow-md'
                        : 'border'
                    }`}
                    style={{ 
                      borderColor: selectedAppointment?._id === appt._id ? colors.primary : '#E5E7EB',
                      backgroundColor: appt.patientId ? colors.white : colors.background + '50'
                    }}
                    onClick={() => handleAppointmentClick(appt)}
                  >
                    {/* Status indicator at top */}
                    <div className="h-2 rounded-t-xl" style={{ backgroundColor: statusDetails.color }}></div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2" style={{ color: colors.secondary }} />
                            <p className="font-medium" style={{ color: colors.text.primary }}>
                              {formatDateTime(appt.appointmentDate, 'date')}
                            </p>
                          </div>
                          
                          <div className="flex items-center mt-1">
                            <Clock className="h-5 w-5 mr-2" style={{ color: colors.secondary }} />
                            <p style={{ color: colors.text.secondary }}>
                              {formatDateTime(appt.appointmentDate, 'time')}
                            </p>
                          </div>
                          
                          {appt.patientId && (
                            <div className="flex items-center mt-3 p-2 rounded-lg" style={{ backgroundColor: colors.background + '50' }}>
                              <User className="h-5 w-5 mr-2" style={{ color: colors.primary }} />
                              <p>
                                <span className="font-medium" style={{ color: colors.text.secondary }}>Patient:</span>{' '}
                                <span style={{ color: colors.primary }}>
                                  {appt.patientId.name}
                                </span>
                              </p>
                            </div>
                          )}
                          
                          {appt.diagnosis && (
                            <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: colors.background + '50' }}>
                              <p className="text-sm" style={{ color: colors.text.secondary }}>
                                <span className="font-medium">Notes:</span>{' '}
                                {appt.diagnosis}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center px-3 py-1 rounded-full" style={{ backgroundColor: statusDetails.bgColor }}>
                          {statusDetails.icon}
                          <span className={`text-xs font-medium ${statusDetails.textColor}`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Calendar View
            <div className="mt-4">
              {/* Calendar Header - Month navigation */}
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={prevMonth}
                  className="p-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" style={{ color: colors.primary }} />
                </button>
                
                <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                
                <button 
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <ChevronRight className="h-5 w-5" style={{ color: colors.primary }} />
                </button>
              </div>
              
              {/* Calendar Week Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center py-2 font-medium" style={{ color: colors.secondary }}>
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((day, index) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  const hasAppointments = dayAppointments.length > 0;
                  
                  return (
                    <div 
                      key={index}
                      className="rounded-lg min-h-24 p-2 transition-all duration-200 border"
                      style={{ 
                        backgroundColor: isToday(day) ? colors.accent + '30' : 
                                       !isCurrentMonth(day) ? colors.background : colors.white,
                        borderColor: isToday(day) ? colors.primary : '#E5E7EB'
                      }}
                    >
                      <div className="text-right mb-2">
                        <span 
                          className={`inline-flex items-center justify-center rounded-full w-7 h-7 text-sm ${
                            isToday(day) ? 'font-bold' : ''
                          }`}
                          style={{ 
                            backgroundColor: isToday(day) ? colors.primary : 'transparent',
                            color: isToday(day) ? colors.white : 
                                   !isCurrentMonth(day) ? colors.text.light : colors.text.primary
                          }}
                        >
                          {day.getDate()}
                        </span>
                      </div>
                      
                      {hasAppointments ? (
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map(appt => {
                            const statusDetails = getStatusDetails(appt.status);
                            return (
                              <div 
                                key={appt._id}
                                onClick={() => handleAppointmentClick(appt)}
                                className="px-2 py-1 rounded-md text-xs truncate cursor-pointer transition-all hover:shadow-sm flex items-center"
                                style={{ 
                                  backgroundColor: appt.patientId ? colors.accent + '20' : colors.background,
                                  borderLeft: `3px solid ${statusDetails.color}`
                                }}
                              >
                                <span style={{ color: colors.text.primary }}>
                                  {formatDateTime(appt.appointmentDate, 'time')}
                                </span>
                                {appt.patientId && (
                                  <span style={{ color: colors.primary }} className="ml-1">
                                    - {appt.patientId.name}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                          
                          {dayAppointments.length > 3 && (
                            <div 
                              className="text-xs text-center py-1 rounded-md"
                              style={{ backgroundColor: colors.accent + '10', color: colors.primary }}
                            >
                              +{dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      ) : isCurrentMonth(day) ? (
                        <div className="text-xs text-center mt-4" style={{ color: colors.text.light }}>
                          No appointments
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Appointment Modal */}
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

// Let's also create a matching AppointmentModal component with the new color scheme
const AppointmentModal = ({ appointment, onClose, onUpdate, colors }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: appointment.status,
    diagnosis: appointment.diagnosis || ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          icon: <CheckCircle className="h-5 w-5" />
        };
      case 'cancelled':
        return {
          color: colors.danger,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <XCircle className="h-5 w-5" />
        };
      default:
        return {
          color: colors.warning,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <AlertCircle className="h-5 w-5" />
        };
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" 
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="p-6 border-b" style={{ borderColor: colors.accent + '50' }}>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>
              Appointment Details
            </h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
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
            <h4 className="text-sm font-medium mb-2" style={{ color: colors.text.light }}>PATIENT INFORMATION</h4>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full mr-3" style={{ backgroundColor: colors.accent + '30' }}>
                  <User className="h-6 w-6" style={{ color: colors.primary }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: colors.text.primary }}>{appointment.patientId?.name}</p>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>{appointment.patientId?.email}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap -mx-2">
                <div className="px-2 w-full sm:w-1/2 mb-4">
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>Phone</p>
                  <p style={{ color: colors.text.primary }}>{appointment.patientId?.phone || 'Not provided'}</p>
                </div>
                <div className="px-2 w-full sm:w-1/2 mb-4">
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>Date & Time</p>
                  <p style={{ color: colors.text.primary }}>{formatDateTime(appointment.appointmentDate)}</p>
                </div>
                <div className="px-2 w-full mb-2">
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text.light }}>Current Status</p>
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
                  focusRingColor: colors.primary
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
                  focusRingColor: colors.primary
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
                  color: colors.text.primary
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

export default DoctorDashboard;