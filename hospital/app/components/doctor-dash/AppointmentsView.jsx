'use client';
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    Clock,
    Calendar as CalendarIcon,
    User
} from 'lucide-react';

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
    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex p-1 rounded-lg mb-4 sm:mb-0" style={{ backgroundColor: colors.accent + '30' }}>
                    <button
                        onClick={() => setView('list')}
                        className={`px-6 py-2 rounded-md transition-all duration-200 ${view === 'list'
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
                        className={`px-6 py-2 rounded-md transition-all duration-200 ${view === 'calendar'
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
                                handleFilterChange('status', 'all');
                                handleFilterChange('search', '');
                                handleFilterChange('dateRange', 'all');
                            }}
                            className="px-4 py-2 font-medium hover:underline transition-all"
                            style={{ color: colors.primary }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            )}

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
                            <CalendarIcon size={36} style={{ color: colors.primary }} />
                        </div>
                        <p style={{ color: colors.text.secondary }} className="text-lg">No appointments found</p>
                    </div>
                ) : view === 'list' ? (
                    <div className="space-y-4">
                        {filteredAppointments.map(appt => {
                            const statusDetails = getStatusDetails(appt.status);
                            return (
                                <div
                                    key={appt._id}
                                    className={`rounded-xl transition-all duration-200 ${appt.patientId
                                            ? 'cursor-pointer hover:shadow-md'
                                            : ''
                                        } ${selectedAppointment?._id === appt._id
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
                                                className={`inline-flex items-center justify-center rounded-full w-7 h-7 text-sm ${isToday(day) ? 'font-bold' : ''
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
        </div>
    );
};

export default AppointmentsView;