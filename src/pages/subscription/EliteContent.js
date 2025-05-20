// src/pages/subscription/EliteContent.js (updated with proper images)
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import FeatureGate from '../../components/subscription/FeatureGate';
import { Users, Video, Shield, Activity, Smartphone, BookOpen, Calendar, Heart, Zap } from 'lucide-react';

const EliteContent = () => {
  const { formatTierName } = useSubscription();
  
  // Workout level color mapping
  const levelColors = [
    { level: 'Beginner', color: 'bg-green-600', text: 'text-green-600' },
    { level: 'Intermediate', color: 'bg-blue-600', text: 'text-blue-600' },
    { level: 'Advanced', color: 'bg-red-600', text: 'text-red-600' },
    { level: 'All Levels', color: 'bg-purple-600', text: 'text-purple-600' }
  ];
  
  // Feature card data with images
  const featureCards = [
    {
      id: 'ai-training',
      title: 'AI-Powered Training',
      icon: <Zap className="mr-2" size={20} />,
      description: 'Experience personalized workouts powered by advanced AI technology.',
      features: [
        'Smart workout recommendations',
        'Adaptive fitness plans',
        'Progress-based adjustments'
      ],
      linkText: 'Start Training',
      linkTo: '/elite/ai-training',
      image: 'https://images.unsplash.com/photo-1580086319619-3ed498161c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'health-hub',
      title: 'Health Integration Hub',
      icon: <Heart className="mr-2" size={20} />,
      description: 'Connect your health devices and get comprehensive insights.',
      features: [
        'Wearable device synchronization',
        'Advanced health metrics dashboard',
        'Sleep and recovery optimization'
      ],
      linkText: 'Connect Devices',
      linkTo: '/elite/health-hub',
      image: 'https://images.unsplash.com/photo-1539189661080-2b97409244fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'specialized-programs',
      title: 'Specialized Programs',
      icon: <BookOpen className="mr-2" size={20} />,
      description: 'Access condition-specific workout programs designed by experts.',
      features: [
        'Condition-specific programs',
        'Rehabilitation workouts',
        'Post-surgery recovery plans'
      ],
      linkText: 'Browse Programs',
      linkTo: '/elite/specialized-programs',
      image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'exclusive-content',
      title: 'Exclusive Content Library',
      icon: <Video className="mr-2" size={20} />,
      description: 'Premium workout series and pre-release content access.',
      features: [
        'Expert trainer series',
        'Early access to new workouts',
        'Premium workout collections'
      ],
      linkText: 'Explore Library',
      linkTo: '/elite/premium-content',
      image: 'https://images.unsplash.com/photo-1621976360623-004223992716?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'family-plan',
      title: 'Multi-User Family Plan',
      icon: <Users className="mr-2" size={20} />,
      description: 'Share your Elite subscription with family members.',
      features: [
        'Up to 5 family profiles',
        'Family challenges & activities',
        'Shared progress tracking'
      ],
      linkText: 'Manage Family',
      linkTo: '/elite/family-plan',
      image: 'https://images.unsplash.com/photo-1522898467493-49726bf28798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      icon: <Activity className="mr-2" size={20} />,
      description: 'Comprehensive performance tracking and insights.',
      features: [
        'Detailed fitness metrics',
        'Visual progress charts',
        'Exportable health reports'
      ],
      linkText: 'View Analytics',
      linkTo: '/elite/analytics',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];
  
  // Resource card data with images
  const resourceCards = [
    {
      id: 'fitness-guide',
      title: 'Comprehensive Fitness Guide',
      description: 'Complete guide to senior fitness with detailed exercise instructions.',
      linkText: 'Download PDF',
      linkTo: '/resources/fitness-guide',
      image: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'nutrition-planner',
      title: 'Nutrition & Diet Planner',
      description: 'Customizable meal plans and nutrition guidance for active seniors.',
      linkText: 'Download PDF',
      linkTo: '/resources/nutrition-planner',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'workout-cards',
      title: 'Printable Workout Cards',
      description: 'Convenient exercise cards you can print and use at home.',
      linkText: 'Download PDF',
      linkTo: '/resources/workout-cards',
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];
  
  // Event card data with images
  const eventCards = [
    {
      id: 'webinar',
      title: 'Wellness Webinar Series',
      date: 'May 15',
      description: 'Join our expert panel for a discussion on maintaining joint health.',
      linkText: 'Register Now',
      linkTo: '/events/webinar-joint-health',
      image: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'cooking',
      title: 'Virtual Cooking Workshop',
      date: 'May 22',
      description: 'Learn to prepare nutritious meals that support your fitness goals.',
      linkText: 'Register Now',
      linkTo: '/events/cooking-workshop',
      image: 'https://images.unsplash.com/photo-1469571486292-b5916dcf7ced?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'qa',
      title: 'Live Q&A Session',
      date: 'June 5',
      description: 'Ask our fitness experts questions about your personal journey.',
      linkText: 'Register Now',
      linkTo: '/events/live-qa',
      image: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];
  
  return (
    <FeatureGate requiredTier="elite">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Elite Content</h1>
          <p className="text-purple-700">
            Welcome to your {formatTierName('elite')} tier! Enjoy our most comprehensive fitness resources with premium features.
          </p>
        </div>
        
        {/* Difficulty Level Color Key */}
        <div className="bg-white p-4 rounded-md mb-6 shadow-sm border border-gray-200">
          <h3 className="font-medium mb-2">Difficulty Level Key:</h3>
          <div className="flex flex-wrap gap-4">
            {levelColors.map(({ level, color, text }) => (
              <div key={level} className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${color} mr-2`}></div>
                <span className={`text-sm ${text} font-medium`}>{level}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* First row of feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featureCards.slice(0, 3).map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
              <div className="h-48 relative">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    {card.icon}
                    {card.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex-grow">
                <p className="text-gray-700 mb-4">{card.description}</p>
                <ul className="space-y-2 mb-4">
                  {card.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
                <Link to={card.linkTo} className="w-full block text-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  {card.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second row of feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featureCards.slice(3).map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
              <div className="h-48 relative">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    {card.icon}
                    {card.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex-grow">
                <p className="text-gray-700 mb-4">{card.description}</p>
                <ul className="space-y-2 mb-4">
                  {card.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
                <Link to={card.linkTo} className="w-full block text-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  {card.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Elite Resources Section */}
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 mb-8">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Elite Digital Resources</h2>
          <p className="text-purple-700 mb-6">
            Access our premium collection of downloadable guides and resources to enhance your fitness journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourceCards.map(resource => (
              <div key={resource.id} className="bg-white p-4 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors flex flex-col h-full">
                <div className="mb-3 h-32 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={resource.image} 
                    alt={resource.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-purple-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex-grow">{resource.description}</p>
                <Link to={resource.linkTo} className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  {resource.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        {/* Elite Events Calendar */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <Calendar size={24} className="text-purple-600 mr-2" />
            <h2 className="text-2xl font-semibold">Upcoming Elite Events</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventCards.map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-100 relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-purple-600 text-white px-3 py-1">
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {event.description}
                  </p>
                  <Link 
                    to={event.linkTo}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    {event.linkText} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};

export default EliteContent;