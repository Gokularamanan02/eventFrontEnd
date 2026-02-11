import React from "react";

const data = [
  { venue: "Hall A", count: 70 },
  { venue: "Hall B", count: 50 },
  { venue: "Auditorium", count: 90 },
];

const BarChart = () => {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl flex justify-around items-end h-64">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className="w-12 rounded-t-lg"
            style={{
              height: `${item.count}%`,
              background: "linear-gradient(to top, #ff00ff, #00ffff)",
              boxShadow: "0 0 10px #ff00ff, 0 0 20px #00ffff",
              transition: "height 0.5s",
            }}
          ></div>
          <p className="mt-2 text-white">{item.venue}</p>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
