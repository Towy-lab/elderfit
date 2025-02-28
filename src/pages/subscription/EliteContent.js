import React, { useContext } from 'react';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';
import { Link } from 'react-router-dom';
import WorkoutCard from '../../components/WorkoutCard';

const EliteContent = () => {
  const { userSubscription } = useContext(SubscriptionContext);
  
  // Check if user has access to this content
  if (userSubscription !== 'elite') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Elite Content</h1>
        <div className="bg-purple-50 p-8 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-purple-800 mb-3">
            This content requires an Elite subscription
          </h2>
          <p className="text-purple-600 mb-6">
            Upgrade to Elite to access professional support, custom routines, 
            and our complete library of specialized programs.
          </p>
          <Link 
            to="/subscription/elite" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-block"
          >
            Upgrade to Elite
          </Link>
        </div>
      </div>
    );
  }
  
  // Elite workouts and features
  const eliteWorkouts = [
    { id: 201, title: 'Elite Recovery Program', duration: '30 min', level: 'Advanced' },
    { id: 202, title: 'Professional Strength Circuit', duration: '35 min', level: 'Advanced' },
    { id: 203, title: 'Advanced Balance Master', duration: '25 min', level: 'Advanced' },
    { id: 204, title: 'Customized Joint Care', duration: '20 min', level: 'Advanced' },
    { id: 205, title: 'Elite Cardio Program', duration: '30 min', level: 'Advanced' },
    { id: 206, title: 'Specialized Mobility Circuit', duration: '25 min', level: 'Advanced' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Elite Exclusive Programs</h1>
      
      {/* Professional support section */}
      <section className="mb-10 bg-purple-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Professional Support</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-2">Book a Consultation</h3>
            <p className="text-gray-600 mb-4">
              Schedule one-on-one time with our certified fitness professionals 
              specializing in senior fitness.
            </p>
            <Link
              to="/professional/booking"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Book Now
            </Link>
          </div>
          
          <div className="flex-1 bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-2">Custom Routine Builder</h3>
            <p className="text-gray-600 mb-4">
              Work with our professionals to create a completely personalized 
              routine tailored to your specific needs.
            </p>
            <Link
              to="/routine-builder"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Start Building
            </Link>
          </div>
        </div>
      </section>
      
      {/* Family management section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Family Profile Management</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-700 mb-4">
            Manage fitness routines for your spouse or family members. Monitor their 
            progress and ensure they're exercising safely.
          </p>
          <Link
            to="/family"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Manage Family Profiles
          </Link>
        </div>
      </section>
      
      {/* Elite workouts grid */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Elite Workout Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eliteWorkouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EliteContent;