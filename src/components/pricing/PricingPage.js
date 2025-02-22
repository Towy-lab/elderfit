import React from 'react';
import { Check } from 'lucide-react';

const PlanFeature = ({ children }) => (
  <div className="flex items-center space-x-2 py-2">
    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
    <span className="text-gray-600 text-lg">{children}</span>
  </div>
);

const PricingCard = ({ title, price, features, isPopular }) => (
  <div 
    className={`
      p-6 rounded-lg bg-white transition-shadow duration-300
      ${isPopular ? 'shadow-xl ring-2 ring-blue-500' : 'shadow-lg hover:shadow-xl'}
    `}
  >
    <div className="text-center">
      {isPopular && (
        <span className="inline-block px-4 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-baseline justify-center mb-6">
        <span className="text-5xl font-extrabold text-gray-900">${price}</span>
        <span className="ml-2 text-xl text-gray-500">/month</span>
      </div>
    </div>

    <div className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <PlanFeature key={index}>{feature}</PlanFeature>
      ))}
    </div>

    <button 
      className={`
        w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors duration-200
        ${isPopular 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
      `}
    >
      Choose {title}
    </button>
  </div>
);

const PricingPage = () => {
  const plans = [
    {
      title: "Basic",
      price: 9.99,
      features: [
        "Basic exercise library",
        "Simple workout tracking",
        "Progress monitoring",
        "Standard safety features",
        "Email support"
      ]
    },
    {
      title: "Premium",
      price: 19.99,
      isPopular: true,
      features: [
        "Extended exercise library",
        "Advanced workout tracking",
        "Detailed progress analytics",
        "Enhanced safety monitoring",
        "Professional trainer access",
        "Community features",
        "Priority support"
      ]
    },
    {
      title: "Family",
      price: 29.99,
      features: [
        "All Premium features",
        "Up to 5 family members",
        "Family dashboard",
        "Emergency contacts",
        "Care provider access",
        "24/7 support",
        "Family activity tracking"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect membership to support your fitness journey. 
            All plans include our core safety features and exercise tracking.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              isPopular={plan.isPopular}
            />
          ))}
        </div>

        {/* Additional Information */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-gray-600 text-lg">
            Need help choosing? Contact our support team for guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;