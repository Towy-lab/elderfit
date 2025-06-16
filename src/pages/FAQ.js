import React from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I get started with ElderFit?",
          a: "After signing up, complete your profile with your fitness goals and any health conditions. You'll then receive personalized workout recommendations on your dashboard."
        },
        {
          q: "What equipment do I need?",
          a: "Most basic workouts require minimal equipment. You'll need comfortable clothes, supportive shoes, and a clear space. Some exercises may use light dumbbells or resistance bands, but alternatives are always provided."
        }
      ]
    },
    {
      category: "Workouts & Safety",
      questions: [
        {
          q: "How often should I exercise?",
          a: "We recommend starting with 2-3 sessions per week, allowing rest days between workouts. As you build strength and endurance, you can gradually increase frequency based on how you feel."
        },
        {
          q: "What if I experience pain during exercise?",
          a: "Stop the exercise immediately if you experience sharp pain. Mild muscle soreness is normal, but pain in joints or sharp pains should be evaluated by a healthcare provider."
        }
      ]
    },
    {
      category: "Subscription & Plans",
      questions: [
        {
          q: "Can I switch plans later?",
          a: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades will apply at the end of your current billing period."
        },
        {
          q: "Is there a free trial for Premium or Elite?",
          a: "Yes, we offer a 7-day free trial for both our Premium and Elite plans. You can cancel anytime during the trial period."
        },
        {
          q: "How does the AI-powered training work?",
          a: "Our AI system analyzes your profile, goals, and workout history to provide personalized recommendations. It adapts based on your feedback and progress, ensuring your workouts remain challenging yet safe."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "How do I update my profile information?",
          a: "Go to your Account Settings in the dashboard menu. Here you can update your personal information, health conditions, and fitness goals."
        },
        {
          q: "What if I forget my password?",
          a: "Click the 'Forgot Password' link on the login page. We'll send you an email with instructions to reset your password."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        
        {faqs.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{category.category}</h2>
            <div className="space-y-6">
              {category.questions.map((faq, faqIndex) => (
                <div key={faqIndex} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Still have questions?</h3>
          <p className="text-blue-700 mb-4">Our support team is here to help!</p>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
