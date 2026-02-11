// src/pages/Admin/Analytics.jsx
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { getEvents, getAllRegistrations } from "../../components/utils/frontendFunctions";
import { useAuth } from "../../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventsData = await getEvents();
        const registrationsData = await getAllRegistrations(token);
        setEvents(eventsData);
        setRegistrations(registrationsData);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <p>Loading analytics...</p>;

  // Prepare chart data
  const eventLabels = events.map((e) => e.title);
  const registrationCounts = events.map(
    (e) => registrations.filter((r) => r.event?._id === e._id).length
  );

  // Category distribution
  const categories = [...new Set(events.map((e) => e.category))];
  const categoryCounts = categories.map(
    (cat) => events.filter((e) => e.category === cat).length
  );

  return (
    <div className="analytics-container p-4">
      <h2>Event Analytics Dashboard</h2>

      <div className="charts grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bar-chart">
          <h3>Registrations per Event</h3>
          <Bar
            data={{
              labels: eventLabels,
              datasets: [
                {
                  label: "Registrations",
                  data: registrationCounts,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        <div className="pie-chart">
          <h3>Events by Category</h3>
          <Pie
            data={{
              labels: categories,
              datasets: [
                {
                  label: "Category Distribution",
                  data: categoryCounts,
                  backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                  ],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
