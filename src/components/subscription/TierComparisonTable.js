// src/components/subscription/TierComparisonTable.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { CheckIcon, XIcon, ChevronDown, ChevronUp } from 'lucide-react';
import tierConfig from '../../config/tierConfig';

const TierComparisonTable = ({ onSelectPlan = null }) => {
  const { subscription, formatTierName } = useSubscription();
  const navigate = useNavigate();
  const currentTier = subscription?.tier || 'basic';
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    workouts: true,
    progressTracking: false,
    features: false,
    support: false,
    community: false,
    education: false
  });
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Handle plan selection
  const handleSelectPlan = (tier) => {
    if (onSelectPlan) {
      onSelectPlan(tier);
    } else {
      navigate('/subscription/plans');
    }
  };
  
  // Check mark component
  const CheckMark = ({ included }) => (
    included ? 
      <CheckIcon size={20} className="text-green-500" /> : 
      <XIcon size={20} className="text-gray-300" />
  );
  
  // Pricing configuration
  const pricing = {
    basic: {
      monthly: 0,
      yearly: 0
    },
    premium: {
      monthly: 9.99,
      yearly: 99.99
    },
    elite: {
      monthly: 19.99,
      yearly: 199.99
    }
  };
  
  // Default billing cycle
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  return (
    <div className="w-full overflow-x-auto">
      {/* Billing toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center border border-gray-200 rounded-lg p-1 bg-white">
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === 'monthly' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === 'yearly' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <span className="ml-1 text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded">
              Save 17%
            </span>
          </button>
        </div>
      </div>
      
      {/* Header */}
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-4 px-6 text-left w-1/4"></th>
            <th className="py-4 px-6 text-center w-1/4">
              <div className="font-bold text-lg">Basic</div>
              <div className="text-xl font-bold mt-1">Free</div>
              <div className="text-sm text-gray-500">Forever</div>
              <button
                onClick={() => handleSelectPlan('basic')}
                disabled={currentTier === 'basic'}
                className={`mt-3 w-full py-2 px-4 rounded text-sm font-medium 
                  ${currentTier === 'basic' 
                    ? 'bg-gray-100 text-gray-500 cursor-default' 
                    : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                {currentTier === 'basic' ? 'Current Plan' : 'Start Free'}
              </button>
            </th>
            <th className="py-4 px-6 text-center w-1/4 bg-indigo-50 border-t-4 border-indigo-500">
              <div className="font-bold text-lg text-indigo-800">Premium</div>
              <div className="text-xl font-bold mt-1 text-indigo-900">
                ${billingCycle === 'monthly' ? pricing.premium.monthly : (pricing.premium.yearly / 12).toFixed(2)}
                <span className="text-sm font-normal text-indigo-700">/mo</span>
              </div>
              <div className="text-sm text-indigo-700">
                {billingCycle === 'yearly' && 'Billed annually'}
              </div>
              <button
                onClick={() => handleSelectPlan('premium')}
                disabled={currentTier === 'premium'}
                className={`mt-3 w-full py-2 px-4 rounded text-sm font-medium text-white 
                  ${currentTier === 'premium' 
                    ? 'bg-indigo-400 cursor-default' 
                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {currentTier === 'premium' 
                  ? 'Current Plan' 
                  : currentTier === 'elite'
                    ? 'Downgrade' 
                    : 'Upgrade'}
              </button>
            </th>
            <th className="py-4 px-6 text-center w-1/4 bg-purple-50 border-t-4 border-purple-500">
              <div className="font-bold text-lg text-purple-800">Elite</div>
              <div className="text-xl font-bold mt-1 text-purple-900">
                ${billingCycle === 'monthly' ? pricing.elite.monthly : (pricing.elite.yearly / 12).toFixed(2)}
                <span className="text-sm font-normal text-purple-700">/mo</span>
              </div>
              <div className="text-sm text-purple-700">
                {billingCycle === 'yearly' && 'Billed annually'}
              </div>
              <button
                onClick={() => handleSelectPlan('elite')}
                disabled={currentTier === 'elite'}
                className={`mt-3 w-full py-2 px-4 rounded text-sm font-medium text-white 
                  ${currentTier === 'elite' 
                    ? 'bg-purple-400 cursor-default' 
                    : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {currentTier === 'elite' ? 'Current Plan' : 'Upgrade'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Workouts Section */}
          <tr className="border-t border-gray-200 bg-gray-50">
            <td colSpan="4" className="py-3 px-6">
              <button 
                className="flex items-center font-semibold text-lg focus:outline-none w-full text-left"
                onClick={() => toggleSection('workouts')}
              >
                <span>Workout Library</span>
                <span className="ml-2">
                  {expandedSections.workouts ? 
                    <ChevronUp size={20} /> : 
                    <ChevronDown size={20} />
                  }
                </span>
              </button>
            </td>
          </tr>
          
          {expandedSections.workouts && (
            <>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Number of Workouts</td>
                <td className="py-3 px-6 text-center">{tierConfig.workouts.basic.count}</td>
                <td className="py-3 px-6 text-center bg-indigo-50">{tierConfig.workouts.premium.count}+</td>
                <td className="py-3 px-6 text-center bg-purple-50">{tierConfig.workouts.elite.count}+</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">HD Video Quality</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Personalized Recommendations</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Custom Routines</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Professional Guidance</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
            </>
          )}
          
          {/* Progress Tracking Section */}
          <tr className="border-t border-gray-200 bg-gray-50">
            <td colSpan="4" className="py-3 px-6">
              <button 
                className="flex items-center font-semibold text-lg focus:outline-none w-full text-left"
                onClick={() => toggleSection('progressTracking')}
              >
                <span>Progress Tracking</span>
                <span className="ml-2">
                  {expandedSections.progressTracking ? 
                    <ChevronUp size={20} /> : 
                    <ChevronDown size={20} />
                  }
                </span>
              </button>
            </td>
          </tr>
          
          {expandedSections.progressTracking && (
            <>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Basic Stats (Workouts, Streaks)</td>
                <td className="py-3 px-6 text-center"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Progress Visualizations</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Custom Goals</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Professional Insights</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Exportable Reports</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
            </>
          )}
          
          {/* Support Section */}
          <tr className="border-t border-gray-200 bg-gray-50">
            <td colSpan="4" className="py-3 px-6">
              <button 
                className="flex items-center font-semibold text-lg focus:outline-none w-full text-left"
                onClick={() => toggleSection('support')}
              >
                <span>Support</span>
                <span className="ml-2">
                  {expandedSections.support ? 
                    <ChevronUp size={20} /> : 
                    <ChevronDown size={20} />
                  }
                </span>
              </button>
            </td>
          </tr>
          
          {expandedSections.support && (
            <>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Help Center Access</td>
                <td className="py-3 px-6 text-center"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Email Support</td>
                <td className="py-3 px-6 text-center">48 hours</td>
                <td className="py-3 px-6 text-center bg-indigo-50">24 hours</td>
                <td className="py-3 px-6 text-center bg-purple-50">12 hours</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Community Support</td>
                <td className="py-3 px-6 text-center">Read-only</td>
                <td className="py-3 px-6 text-center bg-indigo-50">Full access</td>
                <td className="py-3 px-6 text-center bg-purple-50">VIP access</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">One-on-One Consultations</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
            </>
          )}
          
          {/* Community Section */}
          <tr className="border-t border-gray-200 bg-gray-50">
            <td colSpan="4" className="py-3 px-6">
              <button 
                className="flex items-center font-semibold text-lg focus:outline-none w-full text-left"
                onClick={() => toggleSection('community')}
              >
                <span>Community</span>
                <span className="ml-2">
                  {expandedSections.community ? 
                    <ChevronUp size={20} /> : 
                    <ChevronDown size={20} />
                  }
                </span>
              </button>
            </td>
          </tr>
          
          {expandedSections.community && (
            <>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Community Access</td>
                <td className="py-3 px-6 text-center">Read-only</td>
                <td className="py-3 px-6 text-center bg-indigo-50">Full access</td>
                <td className="py-3 px-6 text-center bg-purple-50">VIP access</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Group Challenges</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Expert-Led Groups</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Direct Messaging</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
            </>
          )}
          
          {/* Education Section */}
          <tr className="border-t border-gray-200 bg-gray-50">
            <td colSpan="4" className="py-3 px-6">
              <button 
                className="flex items-center font-semibold text-lg focus:outline-none w-full text-left"
                onClick={() => toggleSection('education')}
              >
                <span>Educational Content</span>
                <span className="ml-2">
                  {expandedSections.education ? 
                    <ChevronUp size={20} /> : 
                    <ChevronDown size={20} />
                  }
                </span>
              </button>
            </td>
          </tr>
          
          {expandedSections.education && (
            <>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Safety Guidelines</td>
                <td className="py-3 px-6 text-center"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={true} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">In-Depth Articles</td>
                <td className="py-3 px-6 text-center">Limited</td>
                <td className="py-3 px-6 text-center bg-indigo-50">Full access</td>
                <td className="py-3 px-6 text-center bg-purple-50">Full access</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">Webinars & Workshops</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50">Monthly</td>
                <td className="py-3 px-6 text-center bg-purple-50">Weekly</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm">One-on-One Educational Sessions</td>
                <td className="py-3 px-6 text-center"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-indigo-50"><CheckMark included={false} /></td>
                <td className="py-3 px-6 text-center bg-purple-50"><CheckMark included={true} /></td>
              </tr>
            </>
          )}
          
          {/* Call-to-action row */}
          <tr className="border-t border-gray-200">
            <td className="py-6 px-6"></td>
            <td className="py-6 px-6 text-center">
              <button
                onClick={() => handleSelectPlan('basic')}
                disabled={currentTier === 'basic'}
                className={`w-full py-2 px-4 rounded text-sm font-medium 
                  ${currentTier === 'basic' 
                    ? 'bg-gray-100 text-gray-500 cursor-default' 
                    : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                {currentTier === 'basic' ? 'Current Plan' : 'Start Free'}
              </button>
            </td>
            <td className="py-6 px-6 text-center bg-indigo-50">
              <button
                onClick={() => handleSelectPlan('premium')}
                disabled={currentTier === 'premium'}
                className={`w-full py-2 px-4 rounded text-sm font-medium text-white 
                  ${currentTier === 'premium' 
                    ? 'bg-indigo-400 cursor-default' 
                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {currentTier === 'premium' 
                  ? 'Current Plan' 
                  : currentTier === 'elite'
                    ? 'Downgrade' 
                    : 'Upgrade'}
              </button>
            </td>
            <td className="py-6 px-6 text-center bg-purple-50">
              <button
                onClick={() => handleSelectPlan('elite')}
                disabled={currentTier === 'elite'}
                className={`w-full py-2 px-4 rounded text-sm font-medium text-white 
                  ${currentTier === 'elite' 
                    ? 'bg-purple-400 cursor-default' 
                    : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {currentTier === 'elite' ? 'Current Plan' : 'Upgrade'}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TierComparisonTable;