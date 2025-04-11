"use client";
import { useState } from "react";
import axios from "axios";

export default function AddDoctor() {
  // Color scheme
  const colors = {
    primary: '#006A71',
    secondary: '#48A6A7',
    accent: '#9ACBD0',
    background: '#f7fffd',
    white: '#FFFFFF',
    success: '#4CAF50',
    warning: '#618300',
    danger: '#F44336',
    confirmed: '#007f83',
    done: '#0027ff',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      light: '#6B7280'
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    price: "",
    experience: "",
    bio: "",
    category: "",
    availableSlots: ""
  });

  const [loading, setLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormSuccess(false);
    setFormError(null);

    // Prepare available slots as an array of date strings
    const slots = formData.availableSlots 
      ? formData.availableSlots.split(",").map(slot => new Date(slot.trim()).toISOString())
      : [];

    const newDoctor = {
      ...formData,
      role: "doctor",
      availableSlots: slots,
    };

    try {
      const response = await axios.post("/api/admin", newDoctor);
      setFormSuccess(true);
      
      // Reset the form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        price: "",
        experience: "",
        bio: "",
        category: "",
        availableSlots: ""
      });
    } catch (error) {
      console.error("Failed to add doctor", error);
      setFormError(error.response?.data?.message || "Failed to add doctor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="py-4 px-6" style={{ backgroundColor: colors.primary }}>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Add New Doctor
          </h2>
        </div>

        {/* Form */}
        <div className="p-6">
          {formSuccess && (
            <div className="mb-6 p-4 rounded-md flex items-center" style={{ backgroundColor: `${colors.success}20` }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={colors.success}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span style={{ color: colors.success }}>Doctor added successfully!</span>
            </div>
          )}

          {formError && (
            <div className="mb-6 p-4 rounded-md flex items-center" style={{ backgroundColor: `${colors.danger}20` }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={colors.danger}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: colors.danger }}>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-2 mb-2">
                <h3 className="text-lg font-medium" style={{ color: colors.primary }}>Personal Information</h3>
                <div className="h-1 w-20 mt-1" style={{ backgroundColor: colors.accent }}></div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  required
                />
              </div>

              {/* Professional Information */}
              <div className="md:col-span-2 mt-4 mb-2">
                <h3 className="text-lg font-medium" style={{ color: colors.primary }}>Professional Information</h3>
                <div className="h-1 w-20 mt-1" style={{ backgroundColor: colors.accent }}></div>
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Category</label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Consultation Fee</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span style={{ color: colors.text.light }}>JD </span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="p-3 block w-full pl-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: colors.accent, focusRing: colors.primary }}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Years of Experience</label>
                <input
                  type="number"
                  id="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Biography</label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  rows="4"
                  placeholder="Doctor's professional background, education, and specialties..."
                />
              </div>

              {/* Availability */}
              <div className="md:col-span-2 mt-4 mb-2">
                <h3 className="text-lg font-medium" style={{ color: colors.primary }}>Availability</h3>
                <div className="h-1 w-20 mt-1" style={{ backgroundColor: colors.accent }}></div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="availableSlots" className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                  Available Time Slots (separate with commas)
                </label>
                <input
                  type="text"
                  id="availableSlots"
                  value={formData.availableSlots}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: colors.accent, focusRing: colors.primary }}
                  placeholder="Example: 2023-12-01T10:00:00, 2023-12-01T11:00:00"
                />
                <p className="mt-1 text-sm" style={{ color: colors.text.light }}>
                  Enter dates and times in ISO format (YYYY-MM-DDTHH:MM:SS)
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="mr-4 px-6 py-2 border rounded-md"
                style={{ 
                  borderColor: colors.primary,
                  color: colors.primary
                }}
                onClick={() => {
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    specialization: "",
                    price: "",
                    experience: "",
                    bio: "",
                    category: "",
                    availableSlots: ""
                  });
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-md flex items-center"
                style={{ backgroundColor: colors.primary }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Doctor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}