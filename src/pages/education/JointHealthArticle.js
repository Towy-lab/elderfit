import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';

const JointHealthArticle = () => {
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '/images/placeholder.jpg';
  };

  // Add image preloading
  React.useEffect(() => {
    const img = new Image();
    img.src = '/images/joint-health-hero.jpg';
    img.onload = () => console.log('Loaded hero image: /images/joint-health-hero.jpg');
    img.onerror = () => console.error('Failed to load hero image: /images/joint-health-hero.jpg');
  }, []);

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
              src="/images/joint-health-hero.jpg"
              alt="Joint Health" 
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium">HEALTH</span>
                <div className="flex items-center text-sm">
                  <Clock size={16} className="mr-1" />
                  <span>8 min read</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-1" />
                  <span>Updated: March 2024</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Understanding Joint Health & Mobility</h1>
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

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Joint Health Matters</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As we age, maintaining healthy joints becomes increasingly important for overall mobility and quality of life. 
                Our joints are the connections between bones that allow movement, and keeping them healthy is essential for 
                maintaining independence and staying active.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Joints are complex structures that include bones, cartilage, ligaments, tendons, and synovial fluid. Each component 
                plays a vital role in joint function and mobility. Understanding how these parts work together can help you better 
                care for your joints and prevent common issues.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Regular movement and exercise are crucial for joint health because they help maintain the production of synovial fluid, 
                which lubricates the joints and reduces friction. Additionally, exercise strengthens the muscles around the joints, 
                providing better support and stability.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Joint Issues in Seniors</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-600 rounded-full mr-3"></span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Osteoarthritis</h3>
                      <p className="text-gray-700">The most common form of arthritis, characterized by the breakdown of joint cartilage and underlying bone. It typically affects weight-bearing joints like knees, hips, and spine.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-600 rounded-full mr-3"></span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Rheumatoid Arthritis</h3>
                      <p className="text-gray-700">An autoimmune condition that causes inflammation in the joint lining, leading to pain, swelling, and potential joint damage. It often affects multiple joints simultaneously.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-600 rounded-full mr-3"></span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Joint Stiffness</h3>
                      <p className="text-gray-700">A common issue that can result from reduced synovial fluid production, muscle weakness, or inflammation. Morning stiffness is particularly common in arthritis conditions.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-600 rounded-full mr-3"></span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Joint Pain and Inflammation</h3>
                      <p className="text-gray-700">Can be caused by various factors including overuse, injury, or underlying conditions. Inflammation is the body's natural response to injury or disease.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tips for Maintaining Joint Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Stay Active</h3>
                  <p className="text-gray-700">Regular, low-impact exercise helps maintain joint flexibility and strength. Activities like walking, swimming, and cycling are excellent choices for joint health.</p>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Aim for 30 minutes of activity most days</li>
                    <li>• Include both cardio and strength training</li>
                    <li>• Start slowly and gradually increase intensity</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Maintain a Healthy Weight</h3>
                  <p className="text-gray-700">Extra weight puts additional stress on weight-bearing joints. Each pound of excess weight adds about 4 pounds of pressure on your knees.</p>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Follow a balanced diet</li>
                    <li>• Stay within a healthy BMI range</li>
                    <li>• Consult a nutritionist if needed</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Practice Good Posture</h3>
                  <p className="text-gray-700">Proper alignment reduces stress on joints and prevents pain. Good posture helps distribute weight evenly across your joints.</p>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Keep your back straight when sitting</li>
                    <li>• Use ergonomic furniture</li>
                    <li>• Take regular breaks from sitting</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Stay Hydrated</h3>
                  <p className="text-gray-700">Water helps maintain joint lubrication and reduces stiffness. Proper hydration is essential for joint health and overall wellbeing.</p>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Drink 8 glasses of water daily</li>
                    <li>• Increase intake during exercise</li>
                    <li>• Limit caffeine and alcohol</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recommended Exercises</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <p className="text-gray-700 mb-4">
                  Here are some joint-friendly exercises that can help maintain mobility and strength:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Low-Impact Cardio</h3>
                    <ul className="space-y-2">
                      {[
                        'Walking (20-30 minutes daily)',
                        'Swimming (2-3 times per week)',
                        'Water aerobics (2-3 times per week)',
                        'Stationary cycling (15-20 minutes)'
                      ].map((exercise, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-700">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                          <span>{exercise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Strength & Flexibility</h3>
                    <ul className="space-y-2">
                      {[
                        'Tai Chi (2-3 times per week)',
                        'Gentle yoga (2-3 times per week)',
                        'Light resistance training',
                        'Stretching exercises'
                      ].map((exercise, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-700">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                          <span>{exercise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Seek Professional Help</h2>
              <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-8">
                <p className="text-gray-700 mb-4">
                  Consult with a healthcare professional if you experience any of the following symptoms:
                </p>
                <ul className="space-y-3">
                  {[
                    'Persistent joint pain that lasts more than a few days',
                    'Swelling or redness around joints',
                    'Difficulty performing daily activities',
                    'Joint stiffness that lasts more than 30 minutes',
                    'Joint pain that worsens with activity',
                    'Unexplained joint pain or swelling',
                    'Limited range of motion in joints',
                    'Joint pain that interferes with sleep'
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
                <p className="text-indigo-700 leading-relaxed mb-4">
                  Taking care of your joints is an investment in your long-term mobility and independence. 
                  Start with small changes and gradually build up your activity level. Always consult with 
                  your healthcare provider before starting any new exercise program.
                </p>
                <p className="text-indigo-700 leading-relaxed">
                  Regular check-ups and early intervention can help prevent joint problems from becoming more serious. 
                  Stay proactive about your joint health, and don't hesitate to seek professional advice when needed.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default JointHealthArticle; 