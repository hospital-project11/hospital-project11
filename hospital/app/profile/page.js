"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Calendar,
  Clock,
  CreditCard,
  Edit2,
  User,
  X,
  ChevronRight,
  Camera,
  CheckCircle,
  Clock3,
  AlertCircle,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";
import Link from "next/link";





  // New Feedback Modal
  const FeedbackModal = ({
    show,
    onClose,
    feedbackText,
    setFeedbackText,
    rating,
    setRating,
    isSubmittingFeedback,
    handleSubmitFeedback,
    brandColor,
    brandColorLight,
  }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: brandColor }}>
              Your Feedback
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Rate your experience
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-gray-700 font-medium mb-2">
              Your comments
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your experience with this appointment..."
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRing: brandColorLight }}
            ></textarea>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback}
              style={{ backgroundColor: brandColor }}
              className="px-5 py-2 rounded-lg text-white font-medium hover:bg-opacity-90 flex items-center"
            >
              {isSubmittingFeedback ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };








export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [userId, setUserId] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  // New state for feedback functionality
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Brand color: rgb(72, 166, 167)
  const brandColor = "rgb(72, 166, 167)";
  const brandColorLight = "rgba(72, 166, 167, 0.1)";
  const brandColorMedium = "rgba(72, 166, 167, 0.3)";

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Invalid token", err);
        setError("Authentication error. Please log in again.");
        setLoading(false);
      }
    } else {
      setError("Not authenticated. Please log in.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    // Fetch user data
    axios
      .get(`/api/user/${userId}`)
      .then((res) => {
        setUser(res.data);
        setForm(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile");
      });

    // Fetch appointment data
    fetchAppointments(userId);
  }, [userId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", userId);

    try {
      setIsUploading(true);
      setError(null);

      const response = await axios.post(
        "/api/user/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": userId,
          },
        }
      );

      setUser(response.data.user);
      setForm(response.data.user);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.response?.data?.error || "Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchAppointments = async (patientId) => {
    try {
      const res = await axios.get(
        `/api/user/appointments?patientId=${patientId}`
      );
      const now = new Date();
      const past = [];
      const upcoming = [];

      res.data.forEach((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        if (appointmentDate < now) {
          past.push(appointment);
        } else {
          upcoming.push(appointment);
        }
      });

      setPastAppointments(past);
      setUpcomingAppointments(upcoming);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(`/api/user/${userId}`, form)
      .then((res) => {
        setUser(res.data);
        setEditMode(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={14} className="mr-1" />;
      case "cancelled":
        return <X size={14} className="mr-1" />;
      default:
        return <Clock3 size={14} className="mr-1" />;
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleViewDiagnosis = (diagnosis) => {
    setSelectedDiagnosis(diagnosis || "No diagnosis information available.");
    setShowDiagnosisModal(true);
  };

  // New functions for feedback
  const handleOpenFeedbackModal = (appointmentId, existingFeedback = "") => {
    setSelectedAppointmentId(appointmentId);
    setFeedbackText(existingFeedback);
    setShowFeedbackModal(true);
  };

 const handleSubmitFeedback = async () => {
    if (!selectedAppointmentId) return;

    try {
      setIsSubmittingFeedback(true);
      setError(null);
      
      // Fixed: using selectedAppointmentId instead of appointmentId
      const response = await axios.post("/api/user/feedback", {
        appointmentId: selectedAppointmentId,
        feedback: feedbackText,
        rating: rating,
      });
      
      // Update the appointment in the local state
      setPastAppointments((prevAppointments) =>
        prevAppointments.map((appointment) => {
          if (appointment._id === selectedAppointmentId) {
            return { ...appointment, feedback: feedbackText };
          }
          return appointment;
        })
      );

      setShowFeedbackModal(false);
      setFeedbackText("");
      setRating(0);
      setSelectedAppointmentId("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };


  const DiagnosisModal = () => {
    if (!showDiagnosisModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: brandColor }}>
              Diagnosis Details
            </h3>
            <button
              onClick={() => setShowDiagnosisModal(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700 whitespace-pre-line">
              {selectedDiagnosis}
            </p>
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={() => setShowDiagnosisModal(false)}
              style={{ backgroundColor: brandColor }}
              className="px-5 py-2 rounded-lg text-white font-medium hover:bg-opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };



  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-24 mb-24 p-8 rounded-lg shadow-lg bg-white">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-red-600 mr-2" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
        <button
          onClick={() => (window.location.href = "/login")}
          style={{ backgroundColor: brandColor }}
          className="hover:bg-opacity-90 text-white px-6 py-2 rounded-lg transition-all font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading && !userId) {
    return (
      <div className="max-w-4xl mx-auto mt-24 mb-24 p-8 rounded-lg shadow-lg bg-white text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
          style={{ borderColor: brandColor }}
        ></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 bg-gray-50">
      <DiagnosisModal />
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        rating={rating}
        setRating={setRating}
        isSubmittingFeedback={isSubmittingFeedback}
        handleSubmitFeedback={handleSubmitFeedback}
        brandColor={brandColor}
        brandColorLight={brandColorLight}
      />
      <div className="max-w-5xl mx-auto p-8 rounded-xl shadow-lg bg-white">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end">
            <div className="relative mb-4 md:mb-0">
              {/* Profile Picture */}
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-4"
                style={{ borderColor: brandColorLight }}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: brandColorLight,
                      color: brandColor,
                    }}
                  >
                    <User size={64} />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label
                className="absolute bottom-0 right-0 p-3 rounded-full cursor-pointer transition-all drop-shadow-md"
                style={{ backgroundColor: brandColor }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                {isUploading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <Camera size={20} className="text-white" />
                )}
              </label>
            </div>

            <div className="md:ml-6 text-center md:text-left">
              <h1
                className="text-3xl font-bold mb-1"
                style={{ color: brandColor }}
              >
                {user?.name || "Your Profile"}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-8 overflow-x-auto">
          {["profile", "upcoming", "past"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{
                borderColor: activeTab === tab ? brandColor : "transparent",
                color: activeTab === tab ? brandColor : undefined,
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "profile" && "Profile"}
              {tab === "upcoming" && "Upcoming Appointments"}
              {tab === "past" && "Past Appointments"}
            </button>
          ))}
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-semibold"
                style={{ color: brandColor }}
              >
                Personal Information
              </h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  style={{ color: brandColor }}
                  className="flex items-center hover:opacity-80 font-medium transition-all"
                >
                  <Edit2 size={16} className="mr-1" />
                  Edit
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
                  style={{ borderColor: brandColor }}
                ></div>
                <p className="mt-2 text-gray-600">Loading profile...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {["name", "email", "phone"].map((field) => (
                  <div key={field} className="mb-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
                      {field}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name={field}
                        value={form[field] || ""}
                        onChange={handleChange}
                        className="border border-gray-300 focus:ring-2 p-3 w-full rounded-lg outline-none transition-all"
                        style={{
                          focusRing: brandColorLight,
                          focusBorderColor: brandColor,
                        }}
                        disabled={field === "email"}
                      />
                    ) : (
                      <p
                        className="p-4 rounded-lg text-gray-800 border"
                        style={{
                          backgroundColor: brandColorLight,
                          borderColor: "transparent",
                        }}
                      >
                        {user?.[field]}
                      </p>
                    )}
                  </div>
                ))}
                {/* Gender field - not editable */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Gender
                  </label>
                  <p
                    className="p-4 rounded-lg text-gray-800 border"
                    style={{
                      backgroundColor: brandColorLight,
                      borderColor: "transparent",
                    }}
                  >
                    {user?.gender}
                  </p>
                </div>
              </div>
            )}

            {editMode && (
              <div className="mt-8 flex space-x-3">
                <button
                  onClick={handleSave}
                  style={{ backgroundColor: brandColor }}
                  className="hover:bg-opacity-90 text-white px-8 py-3 rounded-lg transition-all font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Appointments Tab Content */}
        {activeTab === "upcoming" && (
          <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-semibold"
                style={{ color: brandColor }}
              >
                Upcoming Appointments
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
                  style={{ borderColor: brandColor }}
                ></div>
                <p className="mt-2 text-gray-600">Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl"
                style={{ backgroundColor: brandColorLight }}
              >
                <Calendar
                  size={64}
                  className="mx-auto mb-4"
                  style={{ color: brandColor }}
                />
                <p className="font-medium text-lg text-gray-700">
                  You have no upcoming appointments
                </p>
                <p className="text-gray-500 mt-2">
                  Book an appointment with one of our specialists
                </p>
                <Link href="/available-appointments">
                  <button
                    className="mt-6 px-6 py-3 rounded-lg text-white font-medium transition-all"
                    style={{ backgroundColor: brandColor }}
                  >
                    Book Now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-white relative overflow-hidden"
                    style={{ borderColor: brandColorLight }}
                  >
                    {/* Status indicator stripe */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{
                        backgroundColor:
                          appointment.status === "confirmed"
                            ? "rgb(34, 197, 94)"
                            : appointment.status === "cancelled"
                            ? "rgb(239, 68, 68)"
                            : "rgb(234, 179, 8)",
                      }}
                    ></div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pl-2">
                      <div className="flex-1">
                        <h3
                          className="font-semibold text-xl text-gray-800"
                          style={{ color: brandColor }}
                        >
                          Dr. {appointment.doctorId?.name || "Unknown"}
                        </h3>

                        <div className="flex items-center mt-3 text-gray-600">
                          <Calendar size={18} className="mr-2" />
                          <p>{formatDate(appointment.appointmentDate)}</p>
                        </div>

                        {appointment.doctorId?.specialization && (
                          <p
                            className="inline-block mt-3 px-3 py-1 rounded-full text-sm"
                            style={{
                              backgroundColor: brandColorLight,
                              color: brandColor,
                            }}
                          >
                            {appointment.doctorId.specialization}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium flex items-center"
                          style={{
                            backgroundColor: getStatusClass(appointment.status),
                          }}
                        >
                          {getStatusIcon(appointment.status)}
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div
                      className="mt-6 p-5 rounded-xl"
                      style={{ backgroundColor: brandColorLight }}
                    >
                      <div className="flex items-center mb-4">
                        <CreditCard
                          size={18}
                          style={{ color: brandColor }}
                          className="mr-2"
                        />
                        <h4
                          className="font-medium"
                          style={{ color: brandColor }}
                        >
                          Payment Details
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <p className="text-sm text-gray-600">Amount:</p>
                        <p className="text-sm font-medium">
                          ${appointment.payment?.amount || "0"}
                        </p>

                        <p className="text-sm text-gray-600">Method:</p>
                        <p className="text-sm font-medium capitalize">
                          {appointment.payment?.method || "unknown"}
                        </p>

                        <p className="text-sm text-gray-600">Status:</p>
                        <p className="text-sm">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: getPaymentStatusClass(
                                appointment.payment?.status
                              ),
                            }}
                          >
                            {appointment.payment?.status
                              ? appointment.payment.status
                                  .charAt(0)
                                  .toUpperCase() +
                                appointment.payment.status.slice(1)
                              : "Pending"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Removed the Cancel Appointment and Complete Payment buttons that were here */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Past Appointments Tab Content */}
        {activeTab === "past" && (
          <div className="bg-white rounded-lg">
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: brandColor }}
            >
              Past Appointments
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
                  style={{ borderColor: brandColor }}
                ></div>
                <p className="mt-2 text-gray-600">Loading appointments...</p>
              </div>
            ) : pastAppointments.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl"
                style={{ backgroundColor: brandColorLight }}
              >
                <Clock
                  size={64}
                  className="mx-auto mb-4"
                  style={{ color: brandColor }}
                />
                <p className="font-medium text-lg text-gray-700">
                  You have no past appointments
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-white relative overflow-hidden bg-opacity-60"
                    style={{ borderColor: brandColorLight }}
                  >
                    {/* Status indicator stripe */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{
                        backgroundColor:
                          appointment.status === "confirmed"
                            ? "rgb(34, 197, 94)"
                            : appointment.status === "cancelled"
                            ? "rgb(239, 68, 68)"
                            : "rgb(234, 179, 8)",
                      }}
                    ></div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pl-2">
                      <div className="flex-1">
                        <h3
                          className="font-semibold text-xl text-gray-800"
                          style={{ color: brandColor }}
                        >
                          Dr. {appointment.doctorId?.name || "Unknown"}
                        </h3>
                        <div className="flex items-center mt-3 text-gray-600">
                          <Calendar size={18} className="mr-2" />
                          <p>{formatDate(appointment.appointmentDate)}</p>
                        </div>

                        {appointment.doctorId?.specialization && (
                          <p
                            className="inline-block mt-3 px-3 py-1 rounded-full text-sm"
                            style={{
                              backgroundColor: brandColorLight,
                              color: brandColor,
                            }}
                          >
                            {appointment.doctorId.specialization}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium flex items-center"
                          style={{
                            backgroundColor: getStatusClass(appointment.status),
                          }}
                        >
                          {getStatusIcon(appointment.status)}
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div
                      className="mt-6 p-5 rounded-xl"
                      style={{ backgroundColor: brandColorLight }}
                    >
                      <div className="flex items-center mb-4">
                        <CreditCard
                          size={18}
                          style={{ color: brandColor }}
                          className="mr-2"
                        />
                        <h4
                          className="font-medium"
                          style={{ color: brandColor }}
                        >
                          Payment Details
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <p className="text-sm text-gray-600">Amount:</p>
                        <p className="text-sm font-medium">
                          ${appointment.payment?.amount || "0"}
                        </p>

                        <p className="text-sm text-gray-600">Method:</p>
                        <p className="text-sm font-medium capitalize">
                          {appointment.payment?.method || "unknown"}
                        </p>

                        <p className="text-sm text-gray-600">Status:</p>
                        <p className="text-sm">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: getPaymentStatusClass(
                                appointment.payment?.status
                              ),
                            }}
                          >
                            {appointment.payment?.status
                              ? appointment.payment.status
                                  .charAt(0)
                                  .toUpperCase() +
                                appointment.payment.status.slice(1)
                              : "Pending"}
                          </span>
                        </p>

                        {appointment.payment?.paidAt && (
                          <>
                            <p className="text-sm text-gray-600">Paid On:</p>
                            <p className="text-sm font-medium">
                              {formatDate(appointment.payment.paidAt)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Display Feedback if exists */}
                    {appointment.feedback && (
                      <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                        <div className="flex items-center mb-2">
                          <MessageSquare
                            size={16}
                            className="text-yellow-600 mr-2"
                          />
                          <h4 className="font-medium text-yellow-800">
                            Your Feedback
                          </h4>
                        </div>
                        <p className="text-gray-700">{appointment.feedback}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                      {appointment.status === "done" && (
                        <>
                          <button
                            onClick={() =>
                              handleViewDiagnosis(appointment.diagnosis)
                            }
                            style={{ backgroundColor: brandColor }}
                            className="inline-flex items-center text-white px-4 py-2 rounded-lg transition-all text-sm font-medium hover:bg-opacity-90"
                          >
                            <FileText size={16} className="mr-2" />
                            View Diagnosis
                          </button>

                          {/* Add Feedback button - only show if appointment is done and no feedback exists */}
                          <button
                            onClick={() =>
                              handleOpenFeedbackModal(
                                appointment._id,
                                appointment.feedback
                              )
                            }
                            className={`inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium hover:bg-opacity-90 ${
                              appointment.feedback
                                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                : "text-white"
                            }`}
                            style={{
                              backgroundColor: appointment.feedback
                                ? undefined
                                : brandColor,
                            }}
                          >
                            <MessageSquare size={16} className="mr-2" />
                            {appointment.feedback
                              ? "Edit Feedback"
                              : "Add Feedback"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}