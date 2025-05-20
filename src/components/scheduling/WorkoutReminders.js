import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  Calendar,
  Trash2,
  Plus,
  Settings
} from 'lucide-react';
import { useScheduling } from '../../contexts/SchedulingContext';

const WorkoutReminders = () => {
  const { reminders, addReminder, removeReminder } = useScheduling();
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [newReminder, setNewReminder] = useState({
    message: '',
    time: '',
    days: [],
    enabled: true
  });

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addReminder({
      ...newReminder,
      id: Date.now()
    });
    setNewReminder({
      message: '',
      time: '',
      days: [],
      enabled: true
    });
    setShowAddReminder(false);
  };

  const toggleDay = (day) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="text-blue-500" />
            Workout Reminders
          </h2>
          <p className="text-gray-600 mt-1">
            Set up reminders for your workouts
          </p>
        </div>
        
        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Settings size={16} />
            Enable Notifications
          </button>
        )}
      </div>

      {/* Existing Reminders */}
      <div className="space-y-4 mb-6">
        {reminders.map(reminder => (
          <div 
            key={reminder.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                <span className="font-medium">{reminder.time}</span>
              </div>
              <div>
                <p className="font-medium">{reminder.message}</p>
                <p className="text-sm text-gray-600">
                  {reminder.days.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => removeReminder(reminder.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Button/Form */}
      {!showAddReminder ? (
        <button
          onClick={() => setShowAddReminder(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg w-full justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500"
        >
          <Plus size={20} />
          Add New Reminder
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Message
            </label>
            <input
              type="text"
              value={newReminder.message}
              onChange={(e) => setNewReminder(prev => ({
                ...prev,
                message: e.target.value
              }))}
              className="w-full p-2 border rounded-md"
              placeholder="Time for your workout!"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Time
            </label>
            <input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder(prev => ({
                ...prev,
                time: e.target.value
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat On
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    newReminder.days.includes(day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddReminder(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WorkoutReminders;