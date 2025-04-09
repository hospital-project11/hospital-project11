'use client';
import { User } from 'lucide-react';

const DoctorHeader = ({ doctor, colors }) => {
    return (
        <div className="rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl" 
             style={{ 
                 backgroundColor: colors.primary,
                 backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05))'
             }}>
            <div className="flex items-center">
                <div className="p-3 rounded-full mr-4 flex-shrink-0 transition-transform hover:scale-105" 
                     style={{ 
                         backgroundColor: 'rgba(255, 255, 255, 0.2)',
                         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                     }}>
                    <User size={32} color={colors.white} />
                </div>
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight" 
                            style={{ color: colors.white }}>
                            Welcome Doctor!
                        </h1>
                        <span className="text-sm font-semibold px-3 py-1 rounded-full" 
                              style={{ 
                                  backgroundColor: colors.accent,
                                  color: colors.primary 
                              }}>
                            Available Now
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="font-medium px-3 py-1 rounded-md" 
                              style={{ 
                                  color: colors.accent,
                                  backgroundColor: 'rgba(255, 255, 255, 0.15)'
                              }}>
                            {doctor?.specialization}
                        </span>
                        
                        <div className="hidden sm:block w-px h-6" 
                             style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}></div>
                        
                        <div className="flex items-center gap-2">
                            <span className="font-medium" 
                                  style={{ color: colors.accent }}>
                                ${doctor?.price || 0} 
                                <span className="text-sm opacity-80 ml-1">consultation</span>
                            </span>
                        </div>
                        
                        <div className="hidden sm:block w-px h-6" 
                             style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}></div>
                        
                        <div className="flex items-center gap-1">
                            <span className="text-sm" 
                                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {doctor?.experience || 5}+ years experience
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorHeader;