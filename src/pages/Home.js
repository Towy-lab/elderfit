import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Dumbbell, Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Stretches",
      description: "Improve flexibility and reduce stiffness",
      icon: Heart,
      path: "stretches"
    },
    {
      title: "Mobility",
      description: "Enhance range of motion",
      icon: Activity,
      path: "mobility"
    },
    {
      title: "Strength",
      description: "Build muscle and bone strength",
      icon: Dumbbell,
      path: "strength"
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Welcome to ElderFit
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.path}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/exercises/${category.path}`)}
          >
            <category.icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl font-bold mb-2 text-center">{category.title}</h2>
            <p className="text-gray-600 text-center">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;