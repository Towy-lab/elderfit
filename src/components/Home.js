import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Calendar, 
  Activity,
  Heart, 
  AlertCircle,
  Clock
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "Workouts",
      description: "Access tailored exercise routines",
      link: "/workouts"
    },
    {
      icon: Calendar,
      title: "Calendar",
      description: "Schedule and track your activities",
      link: "/calendar"
    },
    {
      icon: Activity,
      title: "Routines",
      description: "Follow daily exercise patterns",
      link: "/routines"
    },
    {
      icon: Clock,
      title: "Rest Planner",
      description: "Plan your rest and recovery",
      link: "/rest-planner"
    },
    {
      icon: Heart,
      title: "Pain Tracker",
      description: "Monitor and manage discomfort",
      link: "/pain-tracker"
    },
    {
      icon: AlertCircle,
      title: "Emergency Contacts",
      description: "Quick access to important contacts",
      link: "/emergency-contacts"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ElderFit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personalized platform for maintaining health and fitness with safe, 
            guided exercises designed specifically for seniors.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <feature.icon className="h-8 w-8 text-blue-600" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Getting Started Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-gray-600 mb-8">
            Choose any feature above to begin, or follow our guided introduction.
          </p>
          <Link 
            to="/workouts" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;