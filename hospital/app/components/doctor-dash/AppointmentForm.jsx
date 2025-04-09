'use client';
import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  X, 
  ChevronDown, 
  CheckCircle,
  XCircle ,
  Plus,
  Trash2  
} from 'lucide-react';
import axios from 'axios';

const AppointmentForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  error,
  colors = {
    primary: '#4F46E5',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563'
    },
    background: {
      light: '#F9FAFB'
    }
  },
  onSlotCreated // New prop for parent component to handle slot creation
}) => {
  const [focused, setFocused] = useState({
    date: false,
    startTime: false,
    endTime: false,
    duration: false
  });
  
  const [validation, setValidation] = useState({
    date: null,
    startTime: null,
    endTime: null
  });
  
  const [formattedDate, setFormattedDate] = useState('');
  const [bulkMode, setBulkMode] = useState(true);
  const [bulkSettings, setBulkSettings] = useState({
    date: formData.date || '',
    startTime: '09:00',
    endTime: '17:00',
    duration: '30',
    breakTime: '0'
  });
  
  const [timeSlots, setTimeSlots] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [e, setError] = useState('');
  const [s, setIsSubmitting ] = useState(false);
  const durations = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' }
  ];
  
  const breakTimes = [
    { value: '0', label: 'No break between slots' },
    { value: '5', label: '5 minutes break' },
    { value: '10', label: '10 minutes break' },
    { value: '15', label: '15 minutes break' }
  ];
  
  useEffect(() => {
    if (bulkSettings.date) {
      const date = new Date(bulkSettings.date);
      setFormattedDate(date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      }));
      
      setValidation(prev => ({ ...prev, date: 'valid' }));
    } else {
      setFormattedDate('');
      setValidation(prev => ({ ...prev, date: null }));
    }
  }, [bulkSettings.date]);
  
  useEffect(() => {
    if (bulkSettings.startTime) {
      setValidation(prev => ({ ...prev, startTime: 'valid' }));
    } else {
      setValidation(prev => ({ ...prev, startTime: null }));
    }
    
    if (bulkSettings.endTime) {
      setValidation(prev => ({ ...prev, endTime: 'valid' }));
    } else {
      setValidation(prev => ({ ...prev, endTime: null }));
    }
  }, [bulkSettings.startTime, bulkSettings.endTime]);
  
  const handleBulkSettingChange = (e) => {
    const { name, value } = e.target;
    setBulkSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const generateTimeSlots = () => {
    if (!bulkSettings.date || !bulkSettings.startTime || !bulkSettings.endTime) {
      return;
    }
    
    setIsGenerating(true);
    
    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      const slots = [];
      const durationMinutes = parseInt(bulkSettings.duration);
      const breakMinutes = parseInt(bulkSettings.breakTime);
      
      // Convert start and end times to minutes since midnight
      const startTimeParts = bulkSettings.startTime.split(':');
      const endTimeParts = bulkSettings.endTime.split(':');
      
      const startMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
      const endMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);
      
      // Validate time range
      if (startMinutes >= endMinutes) {
        setError('End time must be after start time');
        setIsGenerating(false);
        return;
      }
      
      // Generate slots
      let currentMinutes = startMinutes;
      
      while (currentMinutes + durationMinutes <= endMinutes) {
        const hour = Math.floor(currentMinutes / 60);
        const minute = currentMinutes % 60;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        slots.push({
          date: bulkSettings.date,
          time: timeString,
          duration: bulkSettings.duration
        });
        
        // Move to next slot (including break time)
        currentMinutes += durationMinutes + breakMinutes;
      }
      
      setTimeSlots(slots);
      setError('');
      setIsGenerating(false);
      
      // Clear any previous success message when generating new slots
      setShowSuccess(false);
    }, 100);
  };
  
  const removeTimeSlot = (index) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };
  
  const getStatusIcon = (field) => {
    if (validation[field] === 'valid') {
      return <Check className="h-5 w-5 text-green-500" />;
    }
    return null;
  };
  
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    
    if (timeSlots.length === 0) {
      setError('Please generate time slots first');
      return;
    }
    
    setIsSubmitting(true);
    setShowSuccess(false);
    setError('');
    
    try {
      // Prepare the payload
      const payload = {
        timeSlots: timeSlots,
        date: bulkSettings.date,
        startTime: bulkSettings.startTime,
        endTime: bulkSettings.endTime,
        duration: bulkSettings.duration,
        breakTime: bulkSettings.breakTime,
      };
      
      // POST request to /api/create-doctors (adjusted URL for Next.js)
      const response = await axios.post('/api/doctors', payload, { withCredentials: true });
  
      if (response.data.success) {
        // Set success message
        setSuccessMessage(`Successfully created ${timeSlots.length} appointment slots for ${formattedDate}`);
        setShowSuccess(true);
  
        // Clear form after successful submission
        setBulkSettings({
          date: '',
          startTime: '09:00',
          endTime: '17:00',
          duration: '30',
          breakTime: '0'
        });
        setTimeSlots([]);
  
        // Notify parent component if callback provided
        if (onSlotCreated) {
          onSlotCreated(timeSlots.length);
        }
      } else {
        setError('Failed to create appointment slots. Please try again.');
      }
    } catch (error) {
      console.error('Error creating appointment slots:', error);
      setError('Failed to create appointment slots. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const clearForm = () => {
    setBulkSettings({
      date: '',
      startTime: '09:00',
      endTime: '17:00',
      duration: '30',
      breakTime: '0'
    });
    setTimeSlots([]);
    setShowSuccess(false);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: colors.primary }}></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
            Bulk Create Appointment Slots
          </h2>
          <p className="text-gray-500 mt-1">Easily create multiple appointment slots in one go</p>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
          Bulk Creator
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md flex items-start animate-fade-in">
          <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Success!</p>
            <p className="mt-1">{successMessage}</p>
          </div>
          <button 
            onClick={() => setShowSuccess(false)}
            className="ml-4 text-green-600 hover:text-green-800"
            aria-label="Dismiss success message"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-start">
          <XCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleBulkSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg mb-2">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Create Multiple Appointment Slots</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Field */}
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="block text-sm font-medium text-gray-700">Appointment Date</span>
                {bulkSettings.date && (
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5" style={{ color: focused.date ? colors.primary : colors.secondary }} />
                </div>
                <input
                  type="date"
                  name="date"
                  value={bulkSettings.date}
                  onChange={handleBulkSettingChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 p-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    focused.date ? 'ring-2 ring-opacity-50' : ''
                  } ${validation.date === 'valid' ? 'border-green-500' : 'border-gray-200'}`}
                  style={{
                    borderColor: focused.date ? colors.primary : validation.date === 'valid' ? colors.success : '#E5E7EB',
                    color: colors.text.primary,
                    backgroundColor: focused.date ? 'white' : colors.background.light,
                    ringColor: colors.primary
                  }}
                  required
                  disabled={isSubmitting}
                  onFocus={() => setFocused({ ...focused, date: true })}
                  onBlur={() => setFocused({ ...focused, date: false })}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {getStatusIcon('date')}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Select a date for all appointment slots</p>
            </div>
            
            {/* Duration Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Duration
              </label>
              <div className="relative">
                <select
                  name="duration"
                  value={bulkSettings.duration}
                  onChange={handleBulkSettingChange}
                  className={`w-full p-3 pr-10 border-2 rounded-lg appearance-none bg-white transition-all duration-200 ${
                    focused.duration ? 'ring-2 ring-opacity-50 border-blue-500' : 'border-gray-200'
                  }`}
                  style={{ ringColor: colors.primary }}
                  onFocus={() => setFocused({ ...focused, duration: true })}
                  onBlur={() => setFocused({ ...focused, duration: false })}
                  disabled={isSubmitting}
                >
                  {durations.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Length of each appointment slot</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Start Time Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5" style={{ color: focused.startTime ? colors.primary : colors.secondary }} />
                </div>
                <input
                  type="time"
                  name="startTime"
                  value={bulkSettings.startTime}
                  onChange={handleBulkSettingChange}
                  className={`w-full pl-10 p-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    focused.startTime ? 'ring-2 ring-opacity-50' : ''
                  } ${validation.startTime === 'valid' ? 'border-green-500' : 'border-gray-200'}`}
                  style={{
                    borderColor: focused.startTime ? colors.primary : validation.startTime === 'valid' ? colors.success : '#E5E7EB',
                    color: colors.text.primary,
                    backgroundColor: focused.startTime ? 'white' : colors.background.light,
                    ringColor: colors.primary
                  }}
                  required
                  disabled={isSubmitting}
                  onFocus={() => setFocused({ ...focused, startTime: true })}
                  onBlur={() => setFocused({ ...focused, startTime: false })}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {getStatusIcon('startTime')}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">First appointment starts at</p>
            </div>
            
            {/* End Time Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5" style={{ color: focused.endTime ? colors.primary : colors.secondary }} />
                </div>
                <input
                  type="time"
                  name="endTime"
                  value={bulkSettings.endTime}
                  onChange={handleBulkSettingChange}
                  className={`w-full pl-10 p-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    focused.endTime ? 'ring-2 ring-opacity-50' : ''
                  } ${validation.endTime === 'valid' ? 'border-green-500' : 'border-gray-200'}`}
                  style={{
                    borderColor: focused.endTime ? colors.primary : validation.endTime === 'valid' ? colors.success : '#E5E7EB',
                    color: colors.text.primary,
                    backgroundColor: focused.endTime ? 'white' : colors.background.light,
                    ringColor: colors.primary
                  }}
                  required
                  disabled={isSubmitting}
                  onFocus={() => setFocused({ ...focused, endTime: true })}
                  onBlur={() => setFocused({ ...focused, endTime: false })}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {getStatusIcon('endTime')}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">No appointments after this time</p>
            </div>
            
            {/* Break Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Break Between Slots
              </label>
              <div className="relative">
                <select
                  name="breakTime"
                  value={bulkSettings.breakTime}
                  onChange={handleBulkSettingChange}
                  className="w-full p-3 pr-10 border-2 rounded-lg appearance-none bg-white transition-all duration-200 border-gray-200"
                  style={{ ringColor: colors.primary }}
                  disabled={isSubmitting}
                >
                  {breakTimes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Gap between consecutive appointments</p>
            </div>
          </div>
          
          {/* Generate Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={generateTimeSlots}
              disabled={!bulkSettings.date || !bulkSettings.startTime || !bulkSettings.endTime || isSubmitting}
              className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: !bulkSettings.date || !bulkSettings.startTime || !bulkSettings.endTime || isSubmitting ? '#9CA3AF' : colors.secondary,
                cursor: !bulkSettings.date || !bulkSettings.startTime || !bulkSettings.endTime || isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Time Slots
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Time Slots Preview */}
        {timeSlots.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Preview: {timeSlots.length} Appointment Slots
              </h3>
              <span className="text-sm text-gray-500">
                {formattedDate}
              </span>
            </div>
            
            <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots.map((slot, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {slot.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {slot.duration} minutes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={isSubmitting}
                          aria-label={`Remove time slot at ${slot.time}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={clearForm}
            className="mr-4 px-6 py-3 rounded-lg text-gray-600 font-medium transition-all duration-200 border border-gray-300 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Clear All
          </button>
          <button
            type="submit"
            disabled={isSubmitting || timeSlots.length === 0}
            className="px-8 py-3 rounded-lg text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg flex items-center justify-center"
            style={{
              backgroundColor: isSubmitting || timeSlots.length === 0 ? '#9CA3AF' : colors.primary,
              cursor: isSubmitting || timeSlots.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Slots...
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                Create {timeSlots.length} Appointment Slots
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
