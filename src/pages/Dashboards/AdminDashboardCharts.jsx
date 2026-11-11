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

const STATUS_COLORS = {
  Approved: "#10b981",
  Pending: "#f59e0b",
  Rejected: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-2.5 rounded-xl border border-white/10 text-xs shadow-xl">
        <p className="font-semibold text-white">{label || payload[0].name}</p>
        <p className="text-indigo-300 font-bold mt-0.5">
          {payload[0].value} {payload[0].name ? payload[0].name : "Registrations"}
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboardCharts = ({ events = [], registrations = [] }) => {
  // Bar Chart: Registrations per Event
  const barData = useMemo(() => {
    return events.slice(0, 6).map((event) => {
      const count =
        registrations?.filter(
          (r) => (r.event?._id || r.event) === event._id
        ).length || 0;
      return {
        name: event.title.length > 15 ? event.title.substring(0, 15) + "..." : event.title,
        registrations: count,
      };
    });
  }, [events, registrations]);

  // Pie Chart: Status Breakdown
  const pieData = useMemo(() => {
    let approved = 0;
    let pending = 0;
    let rejected = 0;

    registrations?.forEach((r) => {
      if (r.status === "approved") approved++;
      else if (r.status === "rejected") rejected++;
      else pending++;
    });

    return [
      { name: "Approved", value: approved, color: STATUS_COLORS.Approved },
      { name: "Pending", value: pending, color: STATUS_COLORS.Pending },
      { name: "Rejected", value: rejected, color: STATUS_COLORS.Rejected },
    ].filter((item) => item.value > 0);
  }, [registrations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* BAR CHART */}
      <div className="lg:col-span-7 glass-card p-6 border border-white/10 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Registrations by Event
          </h3>
          <p className="text-xs text-slate-400">Attendee turnout per symposium event</p>
        </div>

        <div className="h-64 w-full">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="registrations" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No event registration data yet
            </div>
          )}
        </div>
      </div>

      {/* PIE CHART */}
      <div className="lg:col-span-5 glass-card p-6 border border-white/10 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Approval Distribution
          </h3>
          <p className="text-xs text-slate-400">Review ratio across all submissions</p>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No registrations submitted yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCharts;
