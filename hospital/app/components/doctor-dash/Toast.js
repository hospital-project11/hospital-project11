'use client';
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onDismiss, duration = 5000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onDismiss();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onDismiss]);

    const bgColor = {
        success: 'bg-green-50',
        error: 'bg-red-50',
        warning: 'bg-yellow-50',
        info: 'bg-blue-50'
    }[type];

    const borderColor = {
        success: 'border-green-500',
        error: 'border-red-500',
        warning: 'border-yellow-500',
        info: 'border-blue-500'
    }[type];

    const textColor = {
        success: 'text-green-700',
        error: 'text-red-700',
        warning: 'text-yellow-700',
        info: 'text-blue-700'
    }[type];

    const icon = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        info: <AlertCircle className="h-5 w-5 text-blue-500" />
    }[type];

    return (
        <div className={`fixed top-4 right-4 z-50 border-l-4 ${borderColor} ${bgColor} p-4 rounded-md shadow-lg max-w-md w-full animate-fade-in`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColor}`}>
                        {type === 'success' ? 'Success!' : 
                         type === 'error' ? 'Error!' : 
                         type === 'warning' ? 'Warning!' : 'Info!'}
                    </p>
                    <p className={`mt-1 text-sm ${textColor}`}>{message}</p>
                </div>
                <button 
                    onClick={onDismiss}
                    className="ml-4 flex-shrink-0"
                >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
            </div>
        </div>
    );
};

export default Toast;