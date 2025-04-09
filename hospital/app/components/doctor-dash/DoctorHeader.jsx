'use client';
import { User } from 'lucide-react';

const DoctorHeader = ({ doctor, colors }) => {
    return (
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
    );
};

export default DoctorHeader;