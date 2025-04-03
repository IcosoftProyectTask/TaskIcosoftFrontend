// src/components/ui/tabs.jsx
import React, { useState } from 'react';

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

export const TabsList = ({ children, className }) => (
  <div className={`flex space-x-4 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, activeTab, setActiveTab, children, className }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 rounded-md ${
      activeTab === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
    } ${className}`}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children, className }) => (
  <div className={`${activeTab === value ? 'block' : 'hidden'} ${className}`}>
    {children}
  </div>
);