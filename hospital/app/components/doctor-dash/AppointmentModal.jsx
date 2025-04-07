'use client';

import { useState } from 'react';

export default function AppointmentModal({ isOpen, onClose, appointment, onSaveDiagnosis }) {
    const [diagnosis, setDiagnosis] = useState(appointment?.diagnosis || '');

    if (!isOpen || !appointment) return null;

    const handleSave = () => {
        onSaveDiagnosis(appointment.id, diagnosis);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Appointment Details</h2>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Patient:</strong> {appointment.patientName}</p>
                <p><strong>Status:</strong> {appointment.status}</p>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Diagnosis</label>
                    <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Enter diagnosis here..."
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Diagnosis
                    </button>
                </div>
            </div>
        </div>
    );
}