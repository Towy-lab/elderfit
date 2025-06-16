import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const EducationalContent = () => {
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '/images/placeholder.jpg';
  };

  const articles = [
    {
      id: 'joint-health',
      title: 'Understanding Joint Health & Mobility',
      category: 'HEALTH',
      description: 'Learn about how to maintain healthy joints and improve mobility as you age.',
      image: '/images/joint-health.jpg',
      path: '/education/joint-health'
    },
    {
      id: 'senior-nutrition',
      title: 'Nutrition Guidelines for Active Seniors',
      category: 'NUTRITION',
      description: 'Dietary recommendations to support your fitness journey and overall health.',
      image: '/images/senior-nutrition.jpg',
      path: '/education/senior-nutrition'
    },
    {
      id: 'sleep-recovery',
      title: 'Importance of Sleep & Recovery',
      category: 'WELLNESS',
      description: 'Why quality sleep is crucial for fitness results and overall wellbeing.',
      image: '/images/sleep-recovery.jpg',
      path: '/education/sleep-recovery'
    }
  ];

  // Add image preloading
  React.useEffect(() => {
    articles.forEach(article => {
      const img = new Image();
      img.src = article.image;
      img.onload = () => console.log(`Loaded image: ${article.image}`);
      img.onerror = () => console.error(`Failed to load image: ${article.image}`);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Educational Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={article.path}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full mb-2">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h2>
                <p className="text-gray-600">{article.description}</p>
                <div className="mt-4 flex items-center text-indigo-600">
                  <BookOpen size={20} className="mr-2" />
                  <span>Read Article</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationalContent; 