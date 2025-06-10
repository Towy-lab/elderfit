import React from 'react';
import { HelpCircle, AlertTriangle, Shield, Heart } from 'lucide-react';

const SafetyFAQ = () => {
  const faqs = [
    {
      category: "General Safety",
      icon: <Shield className="text-blue-500" size={24} />,
      questions: [
        {
          q: "What should I do before starting a new exercise?",
          a: "Always consult with your healthcare provider before starting a new exercise routine. Make sure you have proper footwear, a clear exercise space, and any necessary assistive devices. Start with a proper warm-up and begin with lower intensity exercises."
        },
        {
          q: "How do I know if an exercise is too intense?",
          a: "You should be able to maintain a conversation while exercising. If you're breathing too heavily to speak, experiencing pain, or feeling dizzy, the exercise is too intense. Stop immediately and rest."
        }
      ]
    },
    {
      category: "Warning Signs",
      icon: <AlertTriangle className="text-yellow-500" size={24} />,
      questions: [
        {
          q: "What are the warning signs to stop exercising?",
          a: "Stop exercising immediately if you experience: chest pain or pressure, severe shortness of breath, dizziness or lightheadedness, pain in joints or muscles, or any unusual symptoms. When in doubt, stop and consult your healthcare provider."
        },
        {
          q: "How do I know if I'm pushing myself too hard?",
          a: "Signs you're pushing too hard include: inability to maintain proper form, extreme fatigue, unusual pain, rapid heart rate that doesn't slow down with rest, or feeling lightheaded. Always listen to your body and stop if something doesn't feel right."
        }
      ]
    },
    {
      category: "Health Monitoring",
      icon: <Heart className="text-red-500" size={24} />,
      questions: [
        {
          q: "Should I monitor my heart rate during exercise?",
          a: "Yes, monitoring your heart rate is important. Your target heart rate should be 50-70% of your maximum heart rate (220 minus your age). If you have a heart condition, consult your doctor for specific guidelines."
        },
        {
          q: "How do I track my progress safely?",
          a: "Keep a workout journal noting: exercise duration, intensity level, any discomfort or pain, and how you feel afterward. This helps identify patterns and adjust your routine accordingly. Don't increase intensity or duration by more than 10% per week."
        }
      ]
    },
    {
      category: "Equipment & Environment",
      icon: <HelpCircle className="text-green-500" size={24} />,
      questions: [
        {
          q: "What safety equipment do I need?",
          a: "Essential safety equipment includes: proper footwear with good support, comfortable exercise clothes, a water bottle, and any prescribed assistive devices. For certain exercises, you might need: resistance bands, light weights, or a stability ball."
        },
        {
          q: "How should I prepare my exercise space?",
          a: "Ensure your exercise space is: well-lit, free of obstacles, has a non-slip surface, and is properly ventilated. Keep emergency contacts and a phone nearby. If exercising outdoors, check weather conditions and choose safe routes."
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Safety FAQ</h1>
      
      <div className="space-y-8">
        {faqs.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              {category.icon}
              <h2 className="text-xl font-semibold">{category.category}</h2>
            </div>
            
            <div className="space-y-6">
              {category.questions.map((faq, faqIndex) => (
                <div key={faqIndex} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <h3 className="font-medium text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Need More Help?</h2>
        <div className="space-y-3">
          <p className="text-blue-700">• Contact our support team for personalized guidance</p>
          <p className="text-blue-700">• Schedule a consultation with a fitness professional</p>
          <p className="text-blue-700">• Join our community forums to connect with other members</p>
          <p className="text-blue-700">• Check our video library for proper form demonstrations</p>
        </div>
      </div>
    </div>
  );
};

export default SafetyFAQ; 