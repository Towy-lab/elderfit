import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import WorkoutCard from './WorkoutCard';
import { Search, Filter, X, Circle } from 'lucide-react';

const WorkoutList = () => {
  const { 
    workouts, 
    loading, 
    filters,
    updateFilters,
    clearFilters,
    searchQuery,
    setSearchQuery
  } = useContent();
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Focus areas from all workouts
  const focusAreas = [...new Set(workouts.map(w => w.focusArea))];
  
  // Levels from all workouts
  const levels = [...new Set(workouts.map(w => w.level))];
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading workouts...</div>;
  }
  
  // Workout level color mapping
  const levelColors = [
    { level: 'Beginner', color: 'bg-green-600', text: 'text-green-600' },
    { level: 'Intermediate', color: 'bg-blue-600', text: 'text-blue-600' },
    { level: 'Advanced', color: 'bg-red-600', text: 'text-red-600' },
    { level: 'All Levels', color: 'bg-purple-600', text: 'text-purple-600' }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Workout Library</h1>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Difficulty Level Color Key */}
      <div className="bg-white p-4 rounded-md mb-4 shadow-sm border border-gray-200">
        <h2 className="font-medium mb-2">Difficulty Level Key:</h2>
        <div className="flex flex-wrap gap-4">
          {levelColors.map(({ level, color, text }) => (
            <div key={level} className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${color} mr-2`}></div>
              <span className={`text-sm ${text} font-medium`}>{level}</span>
            </div>
          ))}
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium">Filter Workouts</h2>
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Max Duration</label>
              <select 
                value={filters.maxDuration || ''}
                onChange={(e) => updateFilters({ maxDuration: e.target.value ? Number(e.target.value) : null })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any Duration</option>
                <option value="10">10 minutes or less</option>
                <option value="20">20 minutes or less</option>
                <option value="30">30 minutes or less</option>
              </select>
            </div>
            
            {/* Level filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty Level</label>
              <select 
                value={filters.level || ''}
                onChange={(e) => updateFilters({ level: e.target.value || null })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any Level</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            {/* Focus Area filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Focus Area</label>
              <select 
                value={filters.focusArea || ''}
                onChange={(e) => updateFilters({ focusArea: e.target.value || null })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any Focus Area</option>
                {focusAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Active filters display */}
      {(Object.keys(filters).length > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              Search: {searchQuery}
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {filters.maxDuration && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              Max Duration: {filters.maxDuration} min
              <button 
                onClick={() => updateFilters({ maxDuration: null })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {filters.level && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              Level: {filters.level}
              <button 
                onClick={() => updateFilters({ level: null })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {filters.focusArea && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              Focus: {filters.focusArea}
              <button 
                onClick={() => updateFilters({ focusArea: null })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
      
      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No workouts match your search or filters.</p>
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
