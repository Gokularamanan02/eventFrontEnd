import React from "react";

const data = [50, 80, 30, 70, 60]; // Example values

const LineChart = () => {
  return (
    <div className="relative w-full h-64 bg-gray-900 rounded-2xl p-4">
      <svg width="100%" height="100%">
        {data.map((val, i) => {
          if (i === 0) return null;
          const prev = data[i - 1];
          return (
            <line
              key={i}
              x1={`${((i - 1) / (data.length - 1)) * 100}%`}
              y1={`${100 - prev}%`}
              x2={`${(i / (data.length - 1)) * 100}%`}
              y2={`${100 - val}%`}
              stroke="#00ffff"
              strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 6px #00ffff)" }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;
