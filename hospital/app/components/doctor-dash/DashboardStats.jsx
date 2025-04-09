'use client';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const DashboardStats = ({ filteredAppointments, colors }) => {
    // Memoize filtered counts for better performance
    const stats = {
        today: filteredAppointments.filter(appt => {
            const today = new Date();
            const apptDate = new Date(appt.appointmentDate);
            return apptDate.getDate() === today.getDate() &&
                apptDate.getMonth() === today.getMonth() &&
                apptDate.getFullYear() === today.getFullYear();
        }).length,
        confirmed: filteredAppointments.filter(appt => appt.status === 'confirmed').length,
        pending: filteredAppointments.filter(appt => appt.status === 'pending').length
    };

    const statCards = [
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Today",
            value: stats.today,
            description: "Appointments",
            color: colors.primary,
            borderColor: colors.primary
        },
        {
            icon: <CheckCircle className="h-6 w-6" />,
            title: "Confirmed",
            value: stats.confirmed,
            description: "Appointments",
            color: colors.secondary,
            borderColor: colors.secondary,
            trend: stats.confirmed > 0 ? 'up' : 'down'
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Pending",
            value: stats.pending,
            description: "Appointments",
            color: colors.accent,
            borderColor: colors.accent,
            trend: stats.pending > 0 ? 'up' : 'down'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-[6px] relative overflow-hidden"
                    style={{ borderColor: card.borderColor }}
                >
                    {/* Animated background accent */}
                    <div 
                        className="absolute top-0 left-0 w-full h-1 bg-opacity-20"
                        style={{ backgroundColor: card.color }}
                    />
                    
                    <div className="flex justify-between items-start">
                        <div className="flex items-center mb-4">
                            <div 
                                className="p-2 rounded-lg mr-3 flex items-center justify-center"
                                style={{ backgroundColor: `${card.color}20` }}
                            >
                                {card.icon}
                            </div>
                            <h3 
                                className="text-lg font-semibold"
                                style={{ color: colors.text.primary }}
                            >
                                {card.title}
                            </h3>
                        </div>
                        
                        {card.trend && (
                            <span 
                                className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                                    card.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {card.trend === 'up' ? '↑' : '↓'} 
                                {card.trend === 'up' ? 'Increasing' : 'Decreasing'}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-end justify-between">
                        <div>
                            <p 
                                className="text-3xl font-bold mb-1"
                                style={{ color: card.color }}
                            >
                                <CountUp 
                                    end={card.value}
                                    duration={1.5}
                                    separator=","
                                />
                            </p>
                            <p 
                                className="text-sm"
                                style={{ color: colors.text.secondary }}
                            >
                                {card.description}
                            </p>
                        </div>
                        
                        <div 
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{ 
                                backgroundColor: `${card.color}10`,
                                color: card.color
                            }}
                        >
                            {index === 0 ? 'Today' : index === 1 ? 'Confirmed' : 'Pending'}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardStats;