import React, { useState } from 'react';

export const Tabs = ({ children, defaultTab = 0, className = '', ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const tabs = React.Children.toArray(children).filter(child => child.type === Tab);
  
  return (
    <div className={className} {...props}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.props.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs[activeTab]}
      </div>
    </div>
  );
};

export const Tab = ({ children, label, ...props }) => {
  return <div {...props}>{children}</div>;
}; 