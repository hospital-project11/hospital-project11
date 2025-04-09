"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const PaymentPage = () => {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("card");

    const patientName = "John Doe";
    const appointmentDate = new Date("2025-05-10T10:00:00Z");
    const price = "$75.00";

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/payment", {
                appointmentId: "dummyAppointmentId", // استخدم هنا المعرف الفعلي للموعد أو قيمة ثابتة
                paymentMethod: paymentMethod,
            });
            console.log(response.data);
            router.push("/success");
        } catch (error) {
            console.error("Error during payment submission:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#006A71] text-white p-6">
                    <h1 className="text-2xl font-semibold text-center">
                        Complete Your Payment
                    </h1>
                </div>

                <div className="p-8">
                    {/* Appointment Details Card */}
                    <div className="bg-[#F2EFE7] rounded-xl p-6 mb-8">
                        <h2 className="text-[#006A71] font-semibold text-lg mb-4">
                            Appointment Details
                        </h2>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Patient:</span>
                            <span className="font-medium">{patientName}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Date & Time:</span>
                            <span className="font-medium">
                                {appointmentDate.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#9ACBD0]">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-bold text-[#006A71]">{price}</span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-8">
                        <h2 className="text-[#006A71] font-semibold text-lg mb-4">
                            Select Payment Method
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            <label
                                className={`flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "card"
                                        ? "border-[#48A6A7] bg-[#9ACBD0]/20"
                                        : "border-gray-200 hover:border-[#9ACBD0]"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                    className="sr-only"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 mb-2"
                                    viewBox="0 0 20 20"
                                    fill={paymentMethod === "card" ? "#48A6A7" : "#9ACBD0"}
                                >
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span
                                    className={
                                        paymentMethod === "card"
                                            ? "font-medium text-[#006A71]"
                                            : "text-gray-600"
                                    }
                                >
                                    Card
                                </span>
                            </label>

                            <label
                                className={`flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "paypal"
                                        ? "border-[#48A6A7] bg-[#9ACBD0]/20"
                                        : "border-gray-200 hover:border-[#9ACBD0]"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={paymentMethod === "paypal"}
                                    onChange={() => setPaymentMethod("paypal")}
                                    className="sr-only"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 mb-2"
                                    viewBox="0 0 20 20"
                                    fill={paymentMethod === "paypal" ? "#48A6A7" : "#9ACBD0"}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span
                                    className={
                                        paymentMethod === "paypal"
                                            ? "font-medium text-[#006A71]"
                                            : "text-gray-600"
                                    }
                                >
                                    PayPal
                                </span>
                            </label>

                            <label
                                className={`flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "cash"
                                        ? "border-[#48A6A7] bg-[#9ACBD0]/20"
                                        : "border-gray-200 hover:border-[#9ACBD0]"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={() => setPaymentMethod("cash")}
                                    className="sr-only"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 mb-2"
                                    viewBox="0 0 20 20"
                                    fill={paymentMethod === "cash" ? "#48A6A7" : "#9ACBD0"}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span
                                    className={
                                        paymentMethod === "cash"
                                            ? "font-medium text-[#006A71]"
                                            : "text-gray-600"
                                    }
                                >
                                    Cash
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Display Price Prominently */}
                    <div className="text-center bg-[#9ACBD0]/20 p-4 rounded-xl mb-8">
                        <p className="text-gray-600 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-[#006A71]">{price}</p>
                    </div>

                    {/* Payment Form (Conditional based on payment method) */}
                    {paymentMethod === "card" && (
                        <div className="bg-[#F2EFE7]/50 p-6 rounded-xl mb-8">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-[#9ACBD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                                    placeholder="1234 5678 9012 3456"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-[#9ACBD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-[#9ACBD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                                        placeholder="123"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === "paypal" && (
                        <div className="text-center p-6 bg-[#F2EFE7]/50 rounded-xl mb-8">
                            <p className="mb-4 text-gray-600">
                                You'll be redirected to PayPal to complete your payment of{" "}
                                <span className="font-bold">{price}</span>.
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto text-[#48A6A7]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    )}

                    {paymentMethod === "cash" && (
                        <div className="text-center p-6 bg-[#F2EFE7]/50 rounded-xl mb-8">
                            <p className="mb-2 text-gray-600">
                                Please pay the amount at the clinic reception.
                            </p>
                            <p className="font-medium text-[#006A71]">
                                Please bring the exact amount of{" "}
                                <span className="font-bold">{price}</span>
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handlePaymentSubmit}
                        className="w-full py-3 px-4 bg-[#006A71] hover:bg-[#48A6A7] text-white font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center"
                    >
                        <span>Pay {price}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
