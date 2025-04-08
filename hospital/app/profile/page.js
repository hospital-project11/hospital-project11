"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("📦 Token from cookie:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUserId(decoded.userId); // This will trigger the useEffect below
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
    if (!userId) return; // Don't proceed if userId is empty

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

    // Fetch appointment data from the new API
    fetchAppointments(userId);
  }, [userId]);

  const fetchAppointments = async (patientId) => {
    try {
      const res = await axios.get(`/api/user/appointments?patientId=${patientId}`);
      const now = new Date();
      const past = [];
      const upcoming = [];
console.log(res);
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

  const handleCancelAppointment = (appointmentId) => {
    axios
      .patch(`/api/user/appointments/${appointmentId}`, { status: "cancelled" })
      .then(() => {
        // Refresh appointments after cancellation
        fetchAppointments(userId);
      })
      .catch((err) => {
        console.error("Error cancelling appointment:", err);
        setError("Failed to cancel appointment");
      });
  };

  const handleCompletePayment = (appointmentId) => {
    // This would typically redirect to a payment page or open a payment modal
    console.log("Complete payment for:", appointmentId);
    // Placeholder for payment functionality
    alert("Payment functionality would be implemented here");
  };

  const handleBookSimilar = (appointment) => {
    // This would typically redirect to booking page with pre-filled information
    console.log("Book similar to:", appointment);
    // Placeholder for booking functionality
    alert(
      `You would be redirected to book a new appointment with Dr. ${appointment.doctorId.name}`
    );
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 border rounded-lg shadow">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading && !userId) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 border rounded-lg shadow text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 border rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Appointments
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "past"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Appointments
        </button>
      </div>

      {/* Profile Tab Content */}
      {activeTab === "profile" && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          {loading ? (
            <div className="text-center py-8">Loading profile...</div>
          ) : (
            <div className="space-y-4">
              {["name", "email", "phone", "gender", "role"].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize">
                    {field}
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name={field}
                      value={form[field] || ""}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{user?.[field]}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            {editMode ? (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Edit Profile
              </button>
            )}
          </div>
        </>
      )}

      {/* Upcoming Appointments Tab Content */}
      {activeTab === "upcoming" && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading appointments...</p>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You have no upcoming appointments.
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        Appointment with Dr.{" "}
                        {appointment.doctorId.name || "Unknown"}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      {appointment.doctorId.specialization && (
                        <p className="text-gray-500 text-sm">
                          Specialization: {appointment.doctorId.specialization}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Payment Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm text-gray-600">Amount:</p>
                      <p className="text-sm">${appointment.payment.amount}</p>

                      <p className="text-sm text-gray-600">Method:</p>
                      <p className="text-sm capitalize">
                        {appointment.payment.method}
                      </p>

                      <p className="text-sm text-gray-600">Status:</p>
                      <p className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(
                            appointment.payment.status
                          )}`}
                        >
                          {appointment.payment.status.charAt(0).toUpperCase() +
                            appointment.payment.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {appointment.status === "pending" && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel Appointment
                      </button>
                      {appointment.payment.status === "pending" && (
                        <button
                          onClick={() => handleCompletePayment(appointment._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Complete Payment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Past Appointments Tab Content */}
      {activeTab === "past" && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading appointments...</p>
            </div>
          ) : pastAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You have no past appointments.
            </div>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        Appointment with Dr.{" "}
                        {appointment.doctorId.name || "Unknown"}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      {appointment.doctorId.specialization && (
                        <p className="text-gray-500 text-sm">
                          Specialization: {appointment.doctorId.specialization}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Payment Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm text-gray-600">Amount:</p>
                      <p className="text-sm">${appointment.payment.amount}</p>

                      <p className="text-sm text-gray-600">Method:</p>
                      <p className="text-sm capitalize">
                        {appointment.payment.method}
                      </p>

                      <p className="text-sm text-gray-600">Status:</p>
                      <p className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(
                            appointment.payment.status
                          )}`}
                        >
                          {appointment.payment.status.charAt(0).toUpperCase() +
                            appointment.payment.status.slice(1)}
                        </span>
                      </p>

                      {appointment.payment.paidAt && (
                        <>
                          <p className="text-sm text-gray-600">Paid On:</p>
                          <p className="text-sm">
                            {formatDate(appointment.payment.paidAt)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {appointment.status === "confirmed" && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleBookSimilar(appointment)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Book Similar Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
