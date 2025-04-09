'use client';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const AppointmentForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    error,
    colors
}) => {
    return (
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
    );
};

export default AppointmentForm;