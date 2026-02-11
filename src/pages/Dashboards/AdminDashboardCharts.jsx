import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

const AdminDashboardCharts = ({ events, registrations }) => {
  // Bar Chart
  const barData = useMemo(() => {
    return events.map((event) => {
      const count =
        registrations?.filter((r) => r.event?._id === event._id).length || 0;
      return { name: event.title, registrations: count };
    });
  }, [events, registrations]);

  // Pie Chart
  const pieData = useMemo(() => {
    let approved = 0,
      pending = 0,
      rejected = 0;
    registrations?.forEach((r) => {
      if (r.status === "approved") approved++;
      else if (r.status === "pending") pending++;
      else if (r.status === "rejected") rejected++;
    });
    return [
      { name: "Approved", value: approved },
      { name: "Pending", value: pending },
      { name: "Rejected", value: rejected },
    ];
  }, [registrations]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "2rem" }}>
      <div style={{ flex: 1, minWidth: 300, height: 300 }}>
        <h3>Registrations per Event</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="registrations" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: 1, minWidth: 300, height: 300 }}>
        <h3>Overall Registration Status</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardCharts;
