// src/pages/Graphs/GraphPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import SafeDashboardChart from "../../components/Charts/SafeDashboardChart";
import { getAllRegistrations } from "../../components/utils/frontendFunctions";

const GraphPage = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regs = await getAllRegistrations();
        setRegistrations(regs || []);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const counts = {};
    registrations.forEach(r => {
      const title = r.event?.title || "Unknown Event";
      counts[title] = (counts[title] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Registrations",
          data: Object.values(counts),
          backgroundColor: "rgba(99, 102, 241, 0.7)",
        },
      ],
    };
  }, [registrations]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <h2>Event Registrations Graph</h2>
        <SafeDashboardChart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GraphPage;
