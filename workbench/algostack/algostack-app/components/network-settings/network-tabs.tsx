import { useState } from 'react';

// Tabs component
export const Tabs = ({ tabs, defaultIndex}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  console.log('activeIndex', activeIndex)

  return (
    <div className="flex flex-col">
      <div className="flex border-b border-gray-300">
        {/* Navigation icons can be added here if needed */}
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer px-4 py-2 ${
              index === activeIndex ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className="mt-4">
        {/* Render only the active tab's content */}
        <div>
          {tabs[activeIndex].content}
        </div>
      </div>
    </div>
  );
};
