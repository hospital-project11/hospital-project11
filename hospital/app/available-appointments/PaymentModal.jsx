'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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

export default function PaymentModal({ appointmentId, price, onClose }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paypalReady, setPaypalReady] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      setError('Appointment ID is required.');
      return;
    }
  
    async function fetchAppointment() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/appointments/${appointmentId}`);
        if (res.data.success && res.data.appointment) {
          setAppointment(res.data.appointment);
        } else {
          setError('Failed to load appointment data');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch appointment');
      } finally {
        setLoading(false);
      }
    }
  
    fetchAppointment();
  }, [appointmentId]);

  const handlePayPalSuccess = async (details) => {
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/payment',
        { 
          appointmentId, 
          price,
          paymentId: details.id,
          paymentStatus: details.status,
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setConfirmedAppointment(response.data.appointment);
      } else {
        setError('Payment succeeded but failed to update appointment.');
      }
    } catch (err) {
      setError('Payment verification failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPayment = async () => {
    if (!appointmentId || !price) {
      setError('Missing required payment information');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/payment/direct',
        { 
          appointmentId, 
          price,
          paymentMethod: 'direct' 
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setConfirmedAppointment(response.data.appointment);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError('Payment error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (appointment) => {
    if (!appointment) return 'N/A';
    return appointment.patientId?.name || 'N/A';
  };

  const getDoctorName = (appointment) => {
    if (!appointment) return 'N/A';
    return appointment.doctorId?.userId?.name || 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (confirmedAppointment) {
    const { appointmentDate } = confirmedAppointment;
    const formattedDate = formatDate(appointmentDate);
    const patientName = getPatientName(confirmedAppointment);
    const doctorName = getDoctorName(confirmedAppointment);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4 backdrop-blur-sm">
        <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full overflow-hidden transition-all duration-300 transform scale-100 animate-fadeIn">
          <div
            className="py-6 px-6 mb-4 text-center relative"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/checkmark-pattern.png')]"></div>
            <div className="mb-3 mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke={colors.primary} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: colors.white }}>
              Payment Confirmed!
            </h2>
            <p className="text-white/80 mt-1">Your appointment has been successfully booked</p>
          </div>
          
          <div className="px-8 pb-8">
            <div className="border border-gray-200 p-5 rounded-xl bg-gray-50/50 shadow-sm grid grid-cols-2 gap-4">
              <h3 className="text-lg font-semibold col-span-2 mb-2" style={{ color: colors.primary }}>
                Appointment Details
              </h3>
              
              <div className="space-y-1">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Patient</span>
                  <span className="font-medium" style={{ color: colors.text.primary }}>
                    {patientName}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Doctor</span>
                  <span className="font-medium" style={{ color: colors.text.primary }}>
                    {doctorName}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="font-medium" style={{ color: colors.text.primary }}>
                    {formattedDate}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Payment Amount</span>
                  <span className="font-bold" style={{ color: colors.secondary }}>
                    {price} JD
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  onClose();
                  router.push('/profile');
                }}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                style={{ backgroundColor: colors.secondary }}
              >
                <span>View My Appointments</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-medium text-gray-600 transition-all duration-300 hover:bg-gray-100 flex items-center justify-center"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4 backdrop-blur-sm">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full overflow-hidden relative transition-all duration-300 transform scale-100 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all duration-300"
          disabled={loading}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div
          className="py-6 px-6 mb-4 text-center relative"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
        >
          <h2 className="text-2xl font-bold" style={{ color: colors.white }}>
            Complete Your Payment
          </h2>
          <p className="text-white/80 mt-1">
            Secure your appointment with a quick payment
          </p>
        </div>

        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              {appointment && (
                <div className="border border-gray-200 p-4 rounded-xl bg-gray-50/50 shadow-sm h-full">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: colors.primary }}>
                    Appointment Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Doctor</span>
                      <span className="font-medium" style={{ color: colors.text.primary }}>
                        {getDoctorName(appointment)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Date & Time</span>
                      <span className="font-medium" style={{ color: colors.text.primary }}>
                        {formatDate(appointment.appointmentDate)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col pt-2 border-t border-gray-200 mt-2">
                      <span className="text-sm text-gray-500">Amount Due</span>
                      <span className="font-bold text-lg" style={{ color: colors.secondary }}>
                        {price} JD
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <div className="p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-xs text-gray-600">Secure payment</span>
                    </div>
                    
                    <div className="p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-600">Instant confirmation</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <div className="mb-3 text-center">
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs">Your appointment will be confirmed after payment</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4" style={{ borderColor: colors.primary }}></div>
                  <p className="mt-3 text-sm text-gray-600">Processing your payment...</p>
                </div>
              ) : (
                <div>
                  <h4 className="text-center font-medium mb-3 text-sm" style={{ color: colors.text.secondary }}>
                    Choose a payment method:
                  </h4>
                  
                  <div className="flex justify-center mb-3">
                    <div className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Secure payment options</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg bg-white p-3">
                    <PayPalScriptProvider
                      options={{
                        'client-id': 'AWgGhJmGIrAsfdp_yq25DQ9qE3Le5Q2BkjpXA2p7ANzG8ROvwXrVUo3NZsxpCdgXqabaLks7n5owpxMi',
                        currency: 'USD',
                        components: 'buttons',
                        'disable-funding': 'credit,card',
                        'enable-funding': 'paypal',
                        intent: 'capture'
                      }}
                      onInit={() => setPaypalReady(true)}
                      onError={(err) => {
                        console.error('PayPal Script Error:', err);
                        setError('Failed to load payment system. Please try again.');
                      }}
                    >
                      <PayPalButtons
                        style={{ 
                          layout: 'horizontal',
                          color: 'blue',
                          shape: 'pill',
                          height: 40
                        }}
                        disabled={loading}
                        forceReRender={[price, appointmentId]}
                        fundingSource="paypal"
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              description: `Medical appointment with ${getDoctorName(appointment)}`,
                              amount: { 
                                value: price,
                                currency_code: 'USD'
                              },
                            }],
                            application_context: {
                              shipping_preference: 'NO_SHIPPING'
                            }
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            handlePayPalSuccess(details);
                          });
                        }}
                        onError={(err) => {
                          console.error('PayPal Checkout Error:', err);
                          setError('PayPal payment failed. Please try again.');
                        }}
                        onCancel={() => {
                          console.log('Payment cancelled');
                        }}
                      />
                    </PayPalScriptProvider>
                    
                    {!paypalReady && (
                      <div className="h-16 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-3 border-b-3" style={{ borderColor: colors.primary }}></div>
                        <p className="mt-2 text-xs text-gray-500">Loading payment options...</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-center">
                      <div className="w-full h-px bg-gray-200"></div>
                      <span className="px-4 text-xs text-gray-500">OR</span>
                      <div className="w-full h-px bg-gray-200"></div>
                    </div>
                    
                    <button
                      onClick={handleDirectPayment}
                      disabled={loading}
                      className="mt-4 w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Pay with Credit Card</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}