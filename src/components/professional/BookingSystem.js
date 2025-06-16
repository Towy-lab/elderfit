import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const BookingSystem = () => {
  const { subscription } = useSubscription();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Book a Professional</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Virtual Trainer</h3>
          <p className="text-gray-600 mb-4">
            One-on-one virtual training sessions with certified trainers.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Book Trainer
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Group Classes</h3>
          <p className="text-gray-600 mb-4">
            Join virtual group exercise classes led by experienced instructors.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            View Classes
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Physical Therapist</h3>
          <p className="text-gray-600 mb-4">
            Schedule consultations with licensed physical therapists.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;