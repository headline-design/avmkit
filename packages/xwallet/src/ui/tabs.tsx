import { useState } from 'react';

// Tabs component
export const Tabs = ({ tabs, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="xwallet-tabs xwallet-tabs-container">
      <div className="xwallet-tabs-pane-list xwallet-tabs-row xwallet-tabs-pane-list-xl xwallet-tabs-pane-list-grey xwallet-tabs-pane-list-underline xwallet-tabs-pane-list-underline-no-line">
        <div className="xwallet-tabs-pane-list-wrapper">
          <div className="xwallet-tabs-pane-list-nav">
            {/* Navigation icons can be added here if needed */}
          </div>
          <div className="xwallet-tabs-pane-list-container">
            <div
              className="xwallet-tabs-pane-list-flex-shrink"
              style={{ '--xwallet-tabs-spacing': '24px' } as React.CSSProperties}
            >
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`xwallet-tabs-pane xwallet-tabs-pane-spacing xwallet-tabs-pane-xl xwallet-tabs-pane-grey xwallet-tabs-pane-underline xwallet-tabs-pane-no-padding ${index === activeIndex ? 'xwallet-tabs-pane-underline-active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {tab.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="xwallet-tabs-panel-list">
        {/* Render only the active tab's content */}
        <div className="xwallet-tabs-panel xwallet-tabs-panel-show">
          {tabs[activeIndex].content}
        </div>
      </div>
    </div>
  );
};
