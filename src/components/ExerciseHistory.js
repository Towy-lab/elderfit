import React, { useState } from 'react';
import { 
  Calendar, 
  BarChart2, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Activity,
  Filter
} from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

const ExerciseHistory = ({ exerciseId }) => {
  const { 
    getExerciseHistory, 
    getRecommendedModifications, 
    getDifficultyLevel 
  } = useProgress();
  
  const [filterPeriod, setFilterPeriod] = useState('week');
  const history = getExerciseHistory(exerciseId);
  const modifications = getRecommendedModifications(exerciseId);
  const difficultyLevel = getDifficultyLevel(exerciseId);

  const getFilteredHistory = () => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 365
    };
    
    const cutoff = new Date(now.setDate(now.getDate() - periods[filterPeriod]));
    return history.filter(entry => new Date(entry.timestamp) > cutoff);
  };

  const filteredHistory = getFilteredHistory();
  
  const calculateStats = () => {
    if (filteredHistory.length === 0) return null;
    
    return {
      totalSessions: filteredHistory.length,
      averageDuration: Math.round(
        filteredHistory.reduce((sum, entry) => sum + entry.duration, 0) / 
        filteredHistory.length
      ),
      completionRate: Math.round(
        (filteredHistory.filter(entry => entry.completed).length / 
        filteredHistory.length) * 100
      ),
      commonModifications: Object.entries(modifications)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([mod, count]) => ({ mod, count }))
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Exercise History</h2>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Calendar size={20} />
              <h3 className="font-medium">Total Sessions</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalSessions}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Clock size={20} />
              <h3 className="font-medium">Avg. Duration</h3>
            </div>
            <p className="text-2xl font-bold">{stats.averageDuration} min</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <BarChart2 size={20} />
              <h3 className="font-medium">Completion Rate</h3>
            </div>
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Activity size={20} />
              <h3 className="font-medium">Current Level</h3>
            </div>
            <p className="text-2xl font-bold capitalize">{difficultyLevel.level}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No exercise history available for the selected period.
        </p>
      )}

      {/* Common Modifications */}
      {stats?.commonModifications.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Common Modifications</h3>
          <div className="space-y-2">
            {stats.commonModifications.map(({ mod, count }) => (
              <div key={mod} className="flex items-center justify-between">
                <span className="text-gray-600">{mod}</span>
                <span className="text-sm text-gray-500">
                  Used {count} times
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Timeline */}
      <div className="space-y-4">
        <h3 className="font-medium">Recent Sessions</h3>
        {filteredHistory.map((entry) => (
          <div 
            key={entry.id} 
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">
                  {new Date(entry.timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {entry.completed ? (
                <ThumbsUp className="text-green-500" size={20} />
              ) : (
                <ThumbsDown className="text-red-500" size={20} />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{entry.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={16} />
                <span className="capitalize">{entry.difficulty}</span>
              </div>
            </div>

            {entry.modifications.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Modifications:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {entry.modifications.map((mod, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.notes && (
              <p className="mt-2 text-sm text-gray-600">
                Notes: {entry.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseHistory;