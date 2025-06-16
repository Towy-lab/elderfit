import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Dumbbell
} from 'lucide-react';
import { useScheduling } from '../../contexts/SchedulingContext';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WorkoutCalendar = () => {
  const { 
    scheduledWorkouts, 
    scheduleWorkout,
    removeScheduledWorkout,
    isRestDay,
    setRestDay,
    removeRestDay
  } = useScheduling();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    datetime: '',
    duration: 30,
    type: 'strength'
  });

  // Calendar Helper Functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    let currentDay = new Date(firstDay);

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(firstDay);
      prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i));
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add days of current month
    while (currentDay <= lastDay) {
      days.push({ date: new Date(currentDay), isCurrentMonth: true });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 0; i < remainingDays; i++) {
      const nextDate = new Date(lastDay);
      nextDate.setDate(nextDate.getDate() + i + 1);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const getWorkoutsForDate = (date) => {
    return scheduledWorkouts.filter(workout => {
      const workoutDate = new Date(workout.datetime);
      return (
        workoutDate.getDate() === date.getDate() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Event Handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAddWorkout(false);
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    const workoutDateTime = new Date(selectedDate);
    const [hours, minutes] = newWorkout.datetime.split(':');
    workoutDateTime.setHours(parseInt(hours), parseInt(minutes));

    scheduleWorkout({
      ...newWorkout,
      id: Date.now(),
      datetime: workoutDateTime.toISOString()
    });

    setShowAddWorkout(false);
    setNewWorkout({
      title: '',
      datetime: '',
      duration: 30,
      type: 'strength'
    });
  };

  const handleRestDayToggle = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (isRestDay(dateString)) {
      removeRestDay(dateString);
    } else {
      setRestDay(dateString);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="text-blue-500" />
          Workout Calendar
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft />
          </button>
          <span className="text-lg font-medium">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {daysOfWeek.map(day => (
          <div 
            key={day}
            className="text-center font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {getDaysInMonth(currentDate).map(({ date, isCurrentMonth }, index) => {
          const workouts = getWorkoutsForDate(date);
          const isRest = isRestDay(date.toISOString().split('T')[0]);
          const isSelected = selectedDate && 
            date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              className={`
                min-h-24 p-2 border rounded-lg transition-colors
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isSelected ? 'border-blue-500' : 'border-gray-200'}
                hover:border-blue-300 cursor-pointer
              `}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  font-medium
                  ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                `}>
                  {date.getDate()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestDayToggle(date);
                  }}
                  className={`
                    text-xs px-2 py-1 rounded
                    ${isRest 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'}
                  `}
                >
                  Rest
                </button>
              </div>

              {/* Workouts for the day */}
              <div className="mt-1 space-y-1">
                {workouts.map((workout, i) => (
                  <div 
                    key={i}
                    className="text-xs p-1 rounded bg-blue-50 text-blue-700"
                  >
                    {workout.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            {!showAddWorkout && (
              <button
                onClick={() => setShowAddWorkout(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus size={16} />
                Add Workout
              </button>
            )}
          </div>

          {/* Add Workout Form */}
          {showAddWorkout && (
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Title
                </label>
                <input
                  type="text"
                  value={newWorkout.title}
                  onChange={(e) => setNewWorkout(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newWorkout.datetime}
                    onChange={(e) => setNewWorkout(prev => ({
                      ...prev,
                      datetime: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout(prev => ({
                      ...prev,
                      duration: parseInt(e.target.value)
                    }))}
                    min="5"
                    max="120"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Type
                </label>
                <select
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="strength">Strength Training</option>
                  <option value="mobility">Mobility</option>
                  <option value="stretching">Stretching</option>
                  <option value="balance">Balance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkout(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Schedule Workout
                </button>
              </div>
            </form>
          )}

          {/* Scheduled Workouts for Selected Date */}
          {getWorkoutsForDate(selectedDate).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Scheduled Workouts</h4>
              <div className="space-y-2">
                {getWorkoutsForDate(selectedDate).map((workout) => (
                  <div 
                    key={workout.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Dumbbell className="text-blue-500" size={20} />
                      <div>
                        <p className="font-medium">{workout.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>
                            {new Date(workout.datetime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span>({workout.duration} min)</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeScheduledWorkout(workout.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutCalendar;