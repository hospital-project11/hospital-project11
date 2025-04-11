'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

const colors = {
  primary: '#006A71',
  secondary: '#48A6A7',
  accent: '#9ACBD0',
  background: '#F2EFE7',
  white: '#FFFFFF',
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    light: '#6B7280',
  },
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Retrieve appointmentId and price from the URL
  const appointmentId = searchParams.get('appointmentId');
  const price = searchParams.get('price');

  const paypalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  useEffect(() => {
    // Only load PayPal if the appointment has not yet been confirmed
    if (!confirmedAppointment) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AWgGhJmGIrAsfdp_yq25DQ9qE3Le5Q2BkjpXA2p7ANzG8ROvwXrVUo3NZsxpCdgXqabaLks7n5owpxMi&currency=USD`;
      script.async = true;
      script.onload = () => {
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: { value: price },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              setLoading(true);
              try {
                // Capture the order from PayPal
                await actions.order.capture();
                // Call the backend API to update the appointment payment details
                const response = await axios.post(
                  '/api/payment',
                  { appointmentId, price },
                  { withCredentials: true }
                );
                if (response.data.success) {
                  setConfirmedAppointment(response.data.appointment);
                } else {
                  setError('Payment succeeded but failed to update appointment.');
                }
              } catch (err) {
                setError('Payment failed: ' + (err.response?.data?.error || err.message));
              }
              setLoading(false);
            },
            onError: (err) => {
              setError('Payment error: ' + err);
            },
          }).render(paypalRef.current);
        }
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [appointmentId, price, confirmedAppointment]);

  // If confirmedAppointment exists, show confirmation details
  if (confirmedAppointment) {
    const { appointmentDate, patientId, doctorId } = confirmedAppointment;
    const formattedDate = new Date(appointmentDate).toLocaleString();
    const patientName = patientId?.name || 'N/A';
    // For doctor, we populated `userId`; we assume doctor's name is under doctorId.userId.name
    const doctorName = doctorId?.userId?.name || 'N/A';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
          <div
            className="rounded-t-xl p-6 mb-4"
            style={{
              background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            }}
          >
            <h2 className="text-2xl font-bold text-center" style={{ color: colors.white }}>
              Payment Confirmed!
            </h2>
          </div>
          <div className="px-4">
            <p className="text-center mb-4 text-lg" style={{ color: colors.text.primary }}>
              Your appointment is now confirmed.
            </p>
            <div className="border p-4 rounded-lg">
              <p>
                <span className="font-semibold" style={{ color: colors.primary }}>
                  Patient Name:
                </span>{' '}
                {patientName}
              </p>
              <p>
                <span className="font-semibold" style={{ color: colors.primary }}>
                  Doctor Name:
                </span>{' '}
                {doctorName}
              </p>
              <p>
                <span className="font-semibold" style={{ color: colors.primary }}>
                  Appointment Date:
                </span>{' '}
                {formattedDate}
              </p>
              <p>
                <span className="font-semibold" style={{ color: colors.primary }}>
                  Paid Amount:
                </span>{' '}
                {price} JD
              </p>
            </div>
            <button
              onClick={() => router.push('/appointments')}
              className="mt-6 w-full bg-[#48A6A7] hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
            >
              View Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment view before payment confirmation
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <div
          className="rounded-t-xl p-6 mb-4"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
          }}
        >
          <h2 className="text-2xl font-bold text-center" style={{ color: colors.white }}>
            Complete Payment
          </h2>
        </div>
        <div className="px-4">
          <p className="text-center mb-4 text-lg" style={{ color: colors.text.primary }}>
            Please pay <span className="font-semibold">{price} JD</span> to confirm your appointment.
          </p>
          {error && <p className="text-center mb-4 text-red-500">{error}</p>}
          <div ref={paypalRef} className="mb-4" />
          {loading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
