"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Save,
  X,
  History,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Image from "next/image";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]+$/, "Must be a valid phone number"),
  gender: yup.string().required("Gender is required"),
});

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = Cookies.get("userId");
        if (!userId) {
          router.push("/login");
          return;
        }

        // Fetch user data
        const userRes = await fetch(`/api/users/${userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUser(userData);
        reset(userData);

        // Fetch appointments data
        const appointmentsRes = await fetch(
          `/api/appointments?patientId=${userId}`
        );
        if (!appointmentsRes.ok)
          throw new Error("Failed to fetch appointments");
        const appointmentsData = await appointmentsRes.json();

        // Separate past and upcoming appointments
        const now = new Date();
        const past = appointmentsData.filter(
          (appt) => new Date(appt.appointmentDate) < now
        );
        const upcoming = appointmentsData.filter(
          (appt) => new Date(appt.appointmentDate) >= now
        );

        setPastAppointments(past);
        setUpcomingAppointments(upcoming);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchUserData();
  }, [router, reset]);

  const onSubmit = async (data) => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) throw new Error("Failed to cancel appointment");

      // Update the local state
      setUpcomingAppointments(
        upcomingAppointments.filter((appt) => appt._id !== appointmentId)
      );

      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-blue-900">Patient Profile</h1>
          <p className="text-blue-600 mt-2">
            Manage your information and appointments
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex space-x-2 bg-white p-1.5 rounded-xl shadow-lg">
            {[
              { id: "info", icon: User, label: "Information" },
              { id: "upcoming", icon: Clock, label: "Upcoming" },
              { id: "history", icon: History, label: "History" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Information Section */}
          {activeTab === "info" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-200 hover:shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-blue-900">
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isEditing
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg bg-blue-50 border-blue-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 disabled:opacity-60 transition-all duration-200"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg bg-blue-50 border-blue-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 disabled:opacity-60 transition-all duration-200"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg bg-blue-50 border-blue-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 disabled:opacity-60 transition-all duration-200"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg bg-blue-50 border-blue-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 disabled:opacity-60 transition-all duration-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 transform transition-all duration-200 hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Upcoming Appointments Section */}
          {activeTab === "upcoming" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Upcoming Appointments
              </h2>

              {upcomingAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
                  <Calendar className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    No Upcoming Appointments
                  </h3>
                  <p className="text-blue-600">
                    You don't have any scheduled appointments.
                  </p>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-2xl p-6 shadow-xl transform transition-all duration-200 hover:shadow-2xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-blue-900">
                          Appointment with Dr.{" "}
                          {appointment.doctorId?.name || "Unknown"}
                        </h3>
                        <div className="flex items-center mt-2 text-blue-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="mt-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {appointment.status === "pending" && (
                          <button
                            onClick={() => cancelAppointment(appointment._id)}
                            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                        )}
                        <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Past Appointments Section */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Appointment History
              </h2>

              {pastAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
                  <History className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    No Past Appointments
                  </h3>
                  <p className="text-blue-600">
                    You don't have any previous appointments.
                  </p>
                </div>
              ) : (
                pastAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-2xl p-6 shadow-xl transform transition-all duration-200 hover:shadow-2xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-blue-900">
                          Appointment with Dr.{" "}
                          {appointment.doctorId?.name || "Unknown"}
                        </h3>
                        <div className="flex items-center mt-2 text-blue-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.payment.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.payment.status === "paid"
                              ? "Paid"
                              : "Unpaid"}
                          </span>
                        </div>
                      </div>
                      <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
