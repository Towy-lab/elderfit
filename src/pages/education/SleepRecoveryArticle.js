import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';

// Import local images
import heroImage from '../../assets/images/sleep-recovery.jpg';

const SleepRecoveryArticle = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/education" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Educational Resources
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image Section */}
          <div className="relative h-[400px] w-full">
            <img 
              src={heroImage}
              alt="Sleep and Recovery" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder.jpg';
              }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium">WELLNESS</span>
                <div className="flex items-center text-sm">
                  <Clock size={16} className="mr-1" />
                  <span>12 min read</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-1" />
                  <span>Updated: March 2024</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Importance of Sleep & Recovery</h1>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="flex justify-end mb-6">
                <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                  <Share2 size={20} className="mr-2" />
                  Share Article
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Sleep Matters for Active Seniors</h2>
              <p className="text-gray-700 leading-relaxed">
                Quality sleep is essential for everyone, but it becomes even more crucial as we age. 
                During sleep, our bodies repair tissues, consolidate memories, and restore energy levels. 
                For active seniors, proper sleep is vital for recovery and maintaining optimal performance.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Benefits of Quality Sleep</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Physical Recovery</h3>
                  <p className="text-gray-700">Muscle repair and growth occur during deep sleep phases.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Mental Clarity</h3>
                  <p className="text-gray-700">Sleep helps maintain cognitive function and memory.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Immune Function</h3>
                  <p className="text-gray-700">Proper sleep strengthens the immune system.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Mood Regulation</h3>
                  <p className="text-gray-700">Sleep helps maintain emotional balance and reduces stress.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sleep Recommendations for Active Seniors</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Maintain a Consistent Schedule</h3>
                    <p className="text-gray-700">Go to bed and wake up at the same time every day, even on weekends.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Create a Restful Environment</h3>
                    <p className="text-gray-700">Keep your bedroom cool, dark, and quiet.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Limit Screen Time</h3>
                    <p className="text-gray-700">Avoid electronic devices at least an hour before bedtime.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Watch Your Diet</h3>
                    <p className="text-gray-700">Avoid large meals, caffeine, and alcohol close to bedtime.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recovery Strategies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                  <h3 className="font-bold text-green-900 mb-4">Active Recovery</h3>
                  <ul className="space-y-2">
                    {[
                      'Light walking',
                      'Gentle stretching',
                      'Yoga or tai chi',
                      'Swimming'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-4">Rest Days</h3>
                  <ul className="space-y-2">
                    {[
                      'Schedule regular rest days',
                      'Listen to your body',
                      'Stay hydrated',
                      'Practice relaxation techniques'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Sleep Challenges</h2>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
                <ul className="space-y-2">
                  {[
                    'Difficulty falling asleep',
                    'Frequent waking during the night',
                    'Early morning awakening',
                    'Daytime sleepiness'
                  ].map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-yellow-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Seek Help</h2>
              <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Consult with a healthcare provider if you experience:
                </p>
                <ul className="space-y-2">
                  {[
                    'Persistent sleep problems',
                    'Excessive daytime sleepiness',
                    'Loud snoring or breathing pauses during sleep',
                    'Unusual sleep behaviors'
                  ].map((symptom, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Remember</h3>
                <p className="text-indigo-700 leading-relaxed">
                  Quality sleep is just as important as exercise for maintaining health and fitness. 
                  Make sleep a priority in your wellness routine, and don't hesitate to seek professional 
                  help if you're experiencing persistent sleep issues.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SleepRecoveryArticle; 