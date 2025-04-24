// src/components/admin/TierContentAdmin.js
import React, { useState, useEffect } from 'react';
import { PlusIcon, XIcon, Edit2Icon, EyeIcon, SaveIcon } from 'lucide-react';
import tierConfig from '../../config/tierConfig';

/**
 * TierContentAdmin - A component for administrators to manage tier-specific content
 * This would typically be used in an admin dashboard
 */
const TierContentAdmin = () => {
  // State for edited content
  const [editedConfig, setEditedConfig] = useState(tierConfig);
  const [activeCategory, setActiveCategory] = useState('workouts');
  const [activeTier, setActiveTier] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Features being edited currently
  const [editedFeatures, setEditedFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  
  // Reset editing state when changing category or tier
  useEffect(() => {
    if (editedConfig[activeCategory] && editedConfig[activeCategory][activeTier]) {
      setEditedFeatures(
        editedConfig[activeCategory][activeTier].features || []
      );
    } else {
      setEditedFeatures([]);
    }
    setIsEditing(false);
    setNewFeature('');
  }, [activeCategory, activeTier, editedConfig]);
  
  // Handle category selection
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Handle tier selection
  const handleTierChange = (tier) => {
    setActiveTier(tier);
  };
  
  // Enable editing mode
  const enableEditing = () => {
    setIsEditing(true);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    // Reset to original values
    if (editedConfig[activeCategory] && editedConfig[activeCategory][activeTier]) {
      setEditedFeatures(
        editedConfig[activeCategory][activeTier].features || []
      );
    }
    setIsEditing(false);
    setNewFeature('');
  };
  
  // Add a new feature
  const handleAddFeature = () => {
    if (newFeature.trim() === '') return;
    
    setEditedFeatures([...editedFeatures, newFeature]);
    setNewFeature('');
  };
  
  // Remove a feature
  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...editedFeatures];
    updatedFeatures.splice(index, 1);
    setEditedFeatures(updatedFeatures);
  };
  
  // Update a feature
  const handleUpdateFeature = (index, value) => {
    const updatedFeatures = [...editedFeatures];
    updatedFeatures[index] = value;
    setEditedFeatures(updatedFeatures);
  };
  
  // Save changes
  const saveChanges = () => {
    // Create a deep copy of the current config
    const updatedConfig = JSON.parse(JSON.stringify(editedConfig));
    
    // Update the features for the current category and tier
    if (updatedConfig[activeCategory] && updatedConfig[activeCategory][activeTier]) {
      updatedConfig[activeCategory][activeTier].features = [...editedFeatures];
    }
    
    // Update the state
    setEditedConfig(updatedConfig);
    setIsEditing(false);
    
    // Show save status (this would typically be an API call)
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
    
    // In a real application, you would save this to your backend
    console.log('Saving updated tier config:', updatedConfig);
    // API call would go here
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Tier Content Management</h2>
      
      {/* Save Status Message */}
      {saveStatus === 'success' && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded flex items-center">
          <SaveIcon size={18} className="mr-2" />
          Changes saved successfully
        </div>
      )}
      
      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.keys(tierConfig).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeCategory === category
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tier Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subscription Tier
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTierChange('basic')}
            className={`py-2 px-4 rounded-md text-sm font-medium ${
              activeTier === 'basic'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => handleTierChange('premium')}
            className={`py-2 px-4 rounded-md text-sm font-medium ${
              activeTier === 'premium'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Premium
          </button>
          <button
            onClick={() => handleTierChange('elite')}
            className={`py-2 px-4 rounded-md text-sm font-medium ${
              activeTier === 'elite'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Elite
          </button>
        </div>
      </div>
      
      {/* Content Editor */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} - {activeTier.charAt(0).toUpperCase() + activeTier.slice(1)}
          </h3>
          
          {!isEditing ? (
            <button
              onClick={enableEditing}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Edit2Icon size={16} className="mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={cancelEditing}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <XIcon size={16} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <SaveIcon size={16} className="mr-1" />
                Save
              </button>
            </div>
          )}
        </div>
        
        {/* Description */}
        {editedConfig[activeCategory] && editedConfig[activeCategory][activeTier] && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">Description</div>
            <div className="bg-white p-3 rounded border border-gray-200">
              {editedConfig[activeCategory][activeTier].description}
            </div>
          </div>
        )}
        
        {/* Features List */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Features</div>
          <ul className="bg-white rounded border border-gray-200 overflow-hidden">
            {editedFeatures.length === 0 ? (
              <li className="p-3 text-gray-500 italic">No features defined</li>
            ) : (
              editedFeatures.map((feature, index) => (
                <li 
                  key={index} 
                  className="p-3 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleUpdateFeature(index, e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  ) : (
                    <span>{feature}</span>
                  )}
                </li>
              ))
            )}
          </ul>
          
          {/* Add Feature Form */}
          {isEditing && (
            <div className="mt-3 flex">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a new feature..."
                className="flex-1 p-2 border border-gray-300 rounded-l"
              />
              <button
                onClick={handleAddFeature}
                className="px-3 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
              >
                <PlusIcon size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <EyeIcon size={18} className="text-gray-700 mr-2" />
          <h3 className="text-lg font-semibold">Preview</h3>
        </div>
        
        <div className="bg-white p-4 rounded border border-gray-200">
          <h4 className="font-medium mb-2">
            {activeTier.charAt(0).toUpperCase() + activeTier.slice(1)} Tier - {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
          </h4>
          
          {editedConfig[activeCategory] && editedConfig[activeCategory][activeTier] && (
            <p className="text-gray-700 mb-3">{editedConfig[activeCategory][activeTier].description}</p>
          )}
          
          <ul className="space-y-1">
            {editedFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TierContentAdmin;