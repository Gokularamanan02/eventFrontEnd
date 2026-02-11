import "../components/SummaryCards.jsx";

const SummaryCards = ({ role, events }) => {
  const totalEvents = events.length;
  const totalRegistrations = events.reduce(
    (sum, e) => sum + (e.registrations || 0),
    0
  );

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <h4>Total Events</h4>
        <p>{totalEvents}</p>
      </div>

      {role === "admin" && (
        <div className="summary-card">
          <h4>Total Registrations</h4>
          <p>{totalRegistrations}</p>
        </div>
      )}

      <div className="summary-card">
        <h4>Upcoming Events</h4>
        <p>{totalEvents}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
