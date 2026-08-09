import { useState } from "react";

function AnimalProfileTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="button"
            onClick={() => setActiveTab(index)}
            style={{
              opacity: activeTab === index ? 1 : 0.7,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tabs[activeTab].content}
      </div>

    </div>
  );
}

export default AnimalProfileTabs;