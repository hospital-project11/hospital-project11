'use client';
import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    Clock,
    Calendar as CalendarIcon,
    User,
    CheckSquare,
    RefreshCw,
    LayoutList,
    CalendarDays,
    Bookmark,
    ListFilter,
    MoreVertical,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentsView = ({
    view,
    setView,
    currentMonth,
    prevMonth,
    nextMonth,
    filteredAppointments,
    handleAppointmentClick,
    selectedAppointment,
    filters,
    handleFilterChange,
    showFilters,
    setShowFilters,
    generateCalendarDays,
    getAppointmentsForDate,
    isToday,
    isCurrentMonth,
    formatDateTime,
    getStatusDetails,
    colors
}) => {
    const [expandedAppointment, setExpandedAppointment] = useState(null);

    const toggleAppointmentExpand = (id) => {
        setExpandedAppointment(expandedAppointment === id ? null : id);
    };

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const slideIn = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
            {/* Header with View Toggle and Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                {/* View Toggle Buttons - Card Style */}
                <div className="flex p-1 rounded-xl shadow-sm bg-opacity-30" 
                     style={{ 
                         backgroundColor: `${colors.accent}20`,
                         border: `1px solid ${colors.primary}20`
                     }}>
                    <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: `${colors.primary}20` }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setView('list')}
                        className={`px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center ${
                            view === 'list' ? 'text-white shadow-lg' : 'hover:bg-opacity-20'
                        }`}
                        style={{
                            backgroundColor: view === 'list' ? colors.primary : 'transparent',
                            color: view === 'list' ? colors.white : colors.primary
                        }}
                    >
                        <LayoutList className="h-4 w-4 mr-2" />
                        List View
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: `${colors.primary}20` }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setView('calendar')}
                        className={`px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center ${
                            view === 'calendar' ? 'text-white shadow-lg' : 'hover:bg-opacity-20'
                        }`}
                        style={{
                            backgroundColor: view === 'calendar' ? colors.primary : 'transparent',
                            color: view === 'calendar' ? colors.white : colors.primary
                        }}
                    >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Calendar View
                    </motion.button>
                </div>

                {/* Search and Filter - Card Style */}
                <div className="flex items-center w-full lg:w-auto gap-3">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        className="relative flex-grow min-w-[250px]"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5" style={{ color: `${colors.primary}80` }} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                            style={{
                                borderColor: `${colors.primary}30`,
                                backgroundColor: `${colors.background}80`,
                                focusRingColor: colors.primary
                            }}
                        />
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: `${colors.primary}10` }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3.5 border rounded-xl transition-all flex items-center justify-center ${
                            showFilters ? 'bg-gray-50' : ''
                        }`}
                        style={{ 
                            borderColor: showFilters ? `${colors.primary}50` : `${colors.primary}30`,
                            color: showFilters ? colors.primary : colors.secondary,
                            backgroundColor: `${colors.background}50`
                        }}
                    >
                        <ListFilter className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>

            {/* Expanded Filters - Card Style */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={fadeIn}
                        className="mt-4 p-6 rounded-xl mb-6 border shadow-sm" 
                        style={{ 
                            backgroundColor: `${colors.background}90`,
                            borderColor: `${colors.primary}20`,
                            borderLeft: `4px solid ${colors.primary}`,
                            boxShadow: `0 4px 20px ${colors.primary}10`
                        }}
                    >
                        <h3 className="font-medium mb-5 flex items-center text-lg" style={{ color: colors.primary }}>
                            <Filter className="h-5 w-5 mr-2" />
                            Filter Appointments
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block mb-3 font-medium text-sm flex items-center" 
                                       style={{ color: colors.text.primary }}>
                                    <Bookmark className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                                    Status
                                </label>
                                <div className="relative">
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full p-3.5 pl-4 pr-10 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none"
                                        style={{
                                            borderColor: `${colors.accent}50`,
                                            backgroundColor: `${colors.background}70`,
                                            focusRingColor: colors.primary
                                        }}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="pending">Pending</option>
                                        <option value="done">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown className="h-4 w-4" style={{ color: colors.text.secondary }} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-3 font-medium text-sm flex items-center" 
                                       style={{ color: colors.text.primary }}>
                                    <CalendarIcon className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                                    Date Range
                                </label>
                                <div className="relative">
                                    <select
                                        value={filters.dateRange}
                                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                        className="w-full p-3.5 pl-4 pr-10 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none"
                                        style={{
                                            borderColor: `${colors.accent}50`,
                                            backgroundColor: `${colors.background}70`,
                                            focusRingColor: colors.primary
                                        }}
                                    >
                                        <option value="all">All Dates</option>
                                        <option value="today">Today</option>
                                        <option value="week">Next 7 Days</option>
                                        <option value="month">Next 30 Days</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown className="h-4 w-4" style={{ color: colors.text.secondary }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.03, backgroundColor: `${colors.primary}10` }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    handleFilterChange('status', 'all');
                                    handleFilterChange('search', '');
                                    handleFilterChange('dateRange', 'all');
                                }}
                                className="px-5 py-2.5 font-medium rounded-xl transition-all flex items-center border"
                                style={{ 
                                    color: colors.primary,
                                    borderColor: `${colors.primary}30`,
                                    backgroundColor: `${colors.background}70`
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset Filters
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <motion.h2 
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        className="text-xl font-semibold flex items-center" 
                        style={{ color: colors.primary }}
                    >
                        {view === 'list' ? (
                            <LayoutList className="h-5 w-5 mr-2" />
                        ) : (
                            <CalendarDays className="h-5 w-5 mr-2" />
                        )}
                        Your Appointments
                    </motion.h2>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="px-4 py-1.5 rounded-full text-sm font-medium shadow-sm" 
                        style={{ 
                            backgroundColor: `${colors.accent}20`,
                            color: colors.primary,
                            border: `1px solid ${colors.accent}30`
                        }}
                    >
                        {filteredAppointments.length} total
                    </motion.div>
                </div>

                {filteredAppointments.length === 0 ? (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-center py-12 border-2 border-dashed rounded-xl" 
                        style={{ 
                            borderColor: `${colors.accent}30`,
                            backgroundColor: `${colors.background}30`
                        }}
                    >
                        <div 
                            className="inline-flex items-center justify-center p-5 rounded-full mb-5 shadow-inner"
                            style={{ 
                                backgroundColor: `${colors.accent}15`,
                                border: `1px solid ${colors.accent}20`
                            }}
                        >
                            <CalendarIcon size={48} style={{ color: colors.primary }} />
                        </div>
                        <h3 style={{ color: colors.text.primary }} className="text-xl font-medium mb-2">
                            No appointments found
                        </h3>
                        <p style={{ color: colors.text.light }} className="max-w-md mx-auto">
                            Try adjusting your filters to see more results
                        </p>
                    </motion.div>
                ) : view === 'list' ? (
                    /* LIST VIEW - Card Layout */
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        {filteredAppointments.map((appt, index) => {
                            const statusDetails = getStatusDetails(appt.status);
                            const isSelected = selectedAppointment?._id === appt._id;
                            const isExpanded = expandedAppointment === appt._id;

                            return (
                                <motion.div
                                    key={appt._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className={`rounded-2xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
                                        appt.patientId ? 'cursor-pointer' : ''
                                    } ${
                                        isSelected ? 
                                        'ring-2 ring-offset-2 shadow-lg' : 
                                        'hover:shadow-md'
                                    }`}
                                    style={{
                                        ringColor: colors.primary,
                                        backgroundColor: isSelected ? `${colors.primary}05` : colors.white,
                                        border: `1px solid ${isSelected ? colors.primary : '#E5E7EB'}`
                                    }}
                                    onClick={() => handleAppointmentClick(appt)}
                                >
                                    {/* Status indicator header */}
                                    <div 
                                        className="h-2.5 w-full"
                                        style={{ 
                                            backgroundColor: statusDetails.color,
                                            boxShadow: `0 2px 10px ${statusDetails.color}30`
                                        }}
                                    />

                                    <div className="p-5">
                                        <div className="flex flex-col gap-4">
                                            {/* Date/Time */}
                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="flex items-center">
                                                    <CalendarIcon className="h-5 w-5 mr-2" 
                                                                 style={{ color: colors.secondary }} />
                                                    <p className="font-medium" 
                                                       style={{ color: colors.text.primary }}>
                                                        {formatDateTime(appt.appointmentDate, 'date')}
                                                    </p>
                                                </div>

                                                <div className="flex items-center">
                                                    <Clock className="h-5 w-5 mr-2" 
                                                           style={{ color: colors.secondary }} />
                                                    <p style={{ color: colors.text.secondary }}>
                                                        {formatDateTime(appt.appointmentDate, 'time')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <motion.div 
                                                whileHover={{ scale: 1.03 }}
                                                className={`flex items-center px-4 py-2 rounded-xl gap-2 self-start ${
                                                    isSelected ? 'ring-1 ring-offset-1' : ''
                                                }`}
                                                style={{ 
                                                    backgroundColor: statusDetails.bgColor,
                                                    ringColor: colors.primary,
                                                    color: statusDetails.textColor
                                                }}
                                            >
                                                {statusDetails.icon}
                                                <span className="text-sm font-medium">
                                                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                </span>
                                            </motion.div>

                                            {/* Patient Info */}
                                            {appt.patientId && (
                                                <div className="flex items-center p-3 rounded-xl border"
                                                    style={{ 
                                                        backgroundColor: `${colors.background}30`,
                                                        borderColor: `${colors.accent}20`
                                                    }}
                                                >
                                                    <div 
                                                        className="flex items-center justify-center h-10 w-10 rounded-full mr-3 shadow-inner"
                                                        style={{ 
                                                            backgroundColor: `${colors.primary}10`,
                                                            color: colors.primary
                                                        }}
                                                    >
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium" 
                                                           style={{ color: colors.text.secondary }}>
                                                            Patient
                                                        </p>
                                                        <p className="font-semibold"
                                                           style={{ color: colors.primary }}>
                                                            {appt.patientId.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Expandable Notes Section */}
                                            {appt.diagnosis && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleAppointmentExpand(appt._id);
                                                        }}
                                                        className="p-2 rounded-full flex items-center justify-center self-start"
                                                        style={{ 
                                                            backgroundColor: `${colors.background}30`,
                                                            color: colors.text.secondary
                                                        }}
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                        <span className="ml-1 text-xs">
                                                            {isExpanded ? 'Hide Notes' : 'Show Notes'}
                                                        </span>
                                                    </motion.button>

                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="p-3 rounded-xl border overflow-hidden"
                                                                style={{ 
                                                                    backgroundColor: `${colors.background}20`,
                                                                    borderColor: `${colors.accent}15`,
                                                                    borderLeft: `3px solid ${colors.secondary}`
                                                                }}
                                                            >
                                                                <h4 className="font-medium mb-2 flex items-center"
                                                                   style={{ color: colors.text.primary }}>
                                                                    <Bookmark className="h-4 w-4 mr-2" 
                                                                             style={{ color: colors.secondary }} />
                                                                    Appointment Notes
                                                                </h4>
                                                                <p className="text-sm" 
                                                                   style={{ color: colors.text.secondary }}>
                                                                    {appt.diagnosis}
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* CALENDAR VIEW - Card Layout */
                    <div className="mt-4">
                        {/* Calendar Header - Month navigation */}
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={slideIn}
                            className="flex justify-between items-center mb-8 p-4 rounded-xl shadow-sm"
                            style={{ 
                                backgroundColor: `${colors.accent}10`,
                                border: `1px solid ${colors.primary}20`
                            }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: `${colors.primary}20` }}
                                whileTap={{ scale: 0.9 }}
                                onClick={prevMonth}
                                className="p-2.5 rounded-xl hover:bg-white transition-all flex items-center"
                                style={{ color: colors.primary }}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </motion.button>

                            <h3 
                                className="text-xl font-semibold flex items-center"
                                style={{ color: colors.primary }}
                            >
                                <CalendarIcon className="h-6 w-6 mr-3" />
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>

                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: `${colors.primary}20` }}
                                whileTap={{ scale: 0.9 }}
                                onClick={nextMonth}
                                className="p-2.5 rounded-xl hover:bg-white transition-all flex items-center"
                                style={{ color: colors.primary }}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </motion.button>
                        </motion.div>

                        {/* Calendar Week Headers */}
                        <div className="grid grid-cols-7 mb-4 gap-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div 
                                    key={day} 
                                    className="text-center py-3 font-medium text-sm rounded-lg"
                                    style={{ 
                                        color: colors.secondary,
                                        backgroundColor: `${colors.background}30`
                                    }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {generateCalendarDays().map((day, index) => {
                                const dayAppointments = getAppointmentsForDate(day);
                                const hasAppointments = dayAppointments.length > 0;
                                const isDayToday = isToday(day);
                                const isDayCurrentMonth = isCurrentMonth(day);

                                return (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.03 }}
                                        className={`rounded-xl min-h-[120px] p-3 transition-all duration-300 border ${
                                            isDayToday ? 'shadow-md' : ''
                                        }`}
                                        style={{
                                            backgroundColor: isDayToday ? `${colors.primary}10` :
                                                !isDayCurrentMonth ? `${colors.background}20` : colors.white,
                                            borderColor: isDayToday ? colors.primary : `${colors.primary}20`,
                                            opacity: !isDayCurrentMonth ? 0.7 : 1
                                        }}
                                    >
                                        {/* Day Number */}
                                        <div className="flex justify-between items-start mb-2">
                                            <span
                                                className={`inline-flex items-center justify-center rounded-lg w-8 h-8 text-sm font-medium ${
                                                    isDayToday ? 'shadow-sm' : ''
                                                }`}
                                                style={{
                                                    backgroundColor: isDayToday ? colors.primary : 'transparent',
                                                    color: isDayToday ? colors.white :
                                                        !isDayCurrentMonth ? colors.text.light : colors.text.primary
                                                }}
                                            >
                                                {day.getDate()}
                                            </span>
                                            {hasAppointments && (
                                                <span className="text-xs px-2 py-1 rounded-full"
                                                      style={{ 
                                                          backgroundColor: `${colors.accent}20`,
                                                          color: colors.primary
                                                      }}>
                                                    {dayAppointments.length}
                                                </span>
                                            )}
                                        </div>

                                        {/* Appointments List */}
                                        <div className="space-y-2">
                                            {hasAppointments ? (
                                                <>
                                                    {dayAppointments.slice(0, 2).map(appt => {
                                                        const statusDetails = getStatusDetails(appt.status);
                                                        return (
                                                            <motion.div
                                                                key={appt._id}
                                                                whileHover={{ scale: 1.02 }}
                                                                onClick={() => handleAppointmentClick(appt)}
                                                                className="px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-all flex items-start"
                                                                style={{
                                                                    backgroundColor: `${statusDetails.bgColor}30`,
                                                                    borderLeft: `3px solid ${statusDetails.color}`
                                                                }}
                                                            >
                                                                <div className="flex-1 truncate">
                                                                    <span style={{ color: colors.text.primary }}>
                                                                        {formatDateTime(appt.appointmentDate, 'time')}
                                                                    </span>
                                                                    {appt.patientId && (
                                                                        <span 
                                                                            style={{ color: colors.primary }}
                                                                            className="ml-1 font-medium truncate block"
                                                                        >
                                                                            {appt.patientId.name.split(' ')[0]}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}

                                                    {dayAppointments.length > 2 && (
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            className="text-xs text-center py-1.5 rounded-lg font-medium"
                                                            style={{ 
                                                                backgroundColor: `${colors.accent}20`, 
                                                                color: colors.primary
                                                            }}
                                                        >
                                                            +{dayAppointments.length - 2} more
                                                        </motion.div>
                                                    )}
                                                </>
                                            ) : isDayCurrentMonth ? (
                                                <div 
                                                    className="text-xs text-center mt-2 py-2 opacity-60 rounded-lg"
                                                    style={{ 
                                                        color: colors.text.light,
                                                        backgroundColor: `${colors.background}20`
                                                    }}
                                                >
                                                    No appointments
                                                </div>
                                            ) : null}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Calendar Legend */}
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="mt-8 p-5 rounded-xl border"
                            style={{ 
                                backgroundColor: `${colors.background}30`,
                                borderColor: `${colors.primary}20`
                            }}
                        >
                            <h4 className="text-sm font-medium mb-3 flex items-center"
                               style={{ color: colors.text.primary }}>
                                <Filter className="h-4 w-4 mr-2" />
                                Status Legend
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['pending', 'confirmed', 'done', 'cancelled'].map(status => {
                                    const statusDetails = getStatusDetails(status);
                                    return (
                                        <motion.div 
                                            key={status}
                                            whileHover={{ scale: 1.03 }}
                                            className="flex items-center p-2.5 rounded-lg"
                                            style={{ 
                                                backgroundColor: `${statusDetails.bgColor}20`,
                                                border: `1px solid ${statusDetails.color}30`
                                            }}
                                        >
                                            <div className="w-3 h-3 rounded-full mr-2" 
                                                 style={{ backgroundColor: statusDetails.color }} />
                                            <span className="text-xs font-medium" 
                                                  style={{ color: colors.text.secondary }}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsView;