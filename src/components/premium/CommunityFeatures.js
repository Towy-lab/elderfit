import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const CommunityFeatures = () => {
  const { subscription } = useSubscription();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Community Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Virtual Workout Groups</h3>
          <p className="text-gray-600 mb-4">
            Join or create virtual workout groups with other members.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Find Groups
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Community Challenges</h3>
          <p className="text-gray-600 mb-4">
            Participate in community fitness challenges.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            View Challenges
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Friend Connections</h3>
          <p className="text-gray-600 mb-4">
            Connect with friends and share your progress.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Find Friends
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Support Networks</h3>
          <p className="text-gray-600 mb-4">
            Build and manage your support network.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Manage Network
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeatures;