// src/components/subscription/TierPageTemplate.js
import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const TierPageTemplate = ({ 
  tier,
  headerColor = "green",
  children 
}) => {
  const { formatTierName } = useSubscription();
  
  const colorMap = {
    basic: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800"
    },
    premium: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-800"
    },
    elite: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800"
    }
  };
  
  const colors = colorMap[tier] || colorMap.basic;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${colors.bg} rounded-lg p-6 ${colors.border} mb-8`}>
        <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>
          {formatTierName(tier)} Tier Content
        </h1>
        <p className={colors.text.replace('800', '700')}>
          Welcome to the {formatTierName(tier)} tier! Here you'll find all the content available to you.
        </p>
      </div>
      
      {children}
    </div>
  );
};

export default TierPageTemplate;