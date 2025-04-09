'use client';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const DashboardStats = ({ filteredAppointments, colors }) => {
    return (
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
    );
};

export default DashboardStats;