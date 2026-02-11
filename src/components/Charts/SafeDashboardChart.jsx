// src/components/Charts/SafeDashboardChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

// ✅ Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

/**
 * Props:
 * - type: 'bar' | 'line'
 * - data: Chart.js data object
 * - options: Chart.js options object
 */
const SafeDashboardChart = ({ type = "bar", data, options }) => {
  const ChartComponent = type === "line" ? Line : Bar;

  return (
    <div className="chart-container">
      <ChartComponent
        data={data}
        options={options}
        redraw={true} // ✅ forces Chart.js to destroy/recreate canvas safely
      />
    </div>
  );
};

export default SafeDashboardChart;
