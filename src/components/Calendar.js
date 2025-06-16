// src/components/Calendar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const Calendar = () => {
  const { user } = useAuth();

  // Example schedule data - replace with your actual data later
  const scheduleItems = [
    { id: 1, time: '9:00 AM', activity: 'Morning Stretches' },
    { id: 2, time: '2:00 PM', activity: 'Walking Exercise' },
    { id: 3, time: '4:00 PM', activity: 'Chair Yoga' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <span className="text-gray-600">Welcome, {user?.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {scheduleItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.time}</p>
                    <p className="text-gray-600">{item.activity}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Calendar;  // Changed to default export