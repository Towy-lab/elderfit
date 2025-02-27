import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // In a real app, this would come from your auth context or API
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || {
      name: 'Test User',
      email: 'test@example.com'
    };
  });

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile update submitted with:', formData);
    
    // Update local storage for demo purposes
    localStorage.setItem('user', JSON.stringify({
      ...user,
      name: formData.name,
      email: formData.email
    }));
    
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Management</h2>
        <p className="mb-4">Manage your ElderFit Secrets subscription.</p>
        
        <Link
          to="/profile/subscription"
          className="inline-block bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Manage Subscription
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;