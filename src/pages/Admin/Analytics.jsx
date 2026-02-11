import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { getEvents, getAllRegistrations } from "../../components/utils/frontendFunctions";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("https://eventserver-18lb.onrender.com");

const Analytics = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const fetchData = async () => {
    const eventsData = await getEvents();
    const registrationsData = await getAllRegistrations(token);
    setEvents(eventsData);
    setRegistrations(registrationsData);
  };

  useEffect(() => {
    fetchData();

    socket.on("new-registration", (registration) => {
      setRegistrations((prev) => [...prev, registration]);
    });

    return () => socket.off("new-registration");
  }, [token]);

  const eventLabels = events.map((e) => e.title);
  const registrationCounts = events.map(
    (e) => registrations.filter((r) => r.event?._id === e._id).length
  );

  const categories = [...new Set(events.map((e) => e.category))];
  const categoryCounts = categories.map(
    (cat) => events.filter((e) => e.category === cat).length
  );

  return (
    <div>
      <h2>Live Event Analytics</h2>
      <Bar data={{ labels: eventLabels, datasets: [{ label: "Registrations", data: registrationCounts, backgroundColor: "rgba(54,162,235,0.6)" }]}} />
      <Pie data={{ labels: categories, datasets: [{ data: categoryCounts, backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF"] }]}} />
    </div>
  );
};

export default Analytics;
