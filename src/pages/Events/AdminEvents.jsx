import { useAuth } from "../../context/AuthContext";
import EventCard from "../../components/EventsUI/EventCard";
import "../../styles/Dashboard.css";
import "../../styles/Events.css";

const AdminEvents = () => {
  const { registrations, getRegistrationsCount } = useAuth();

  return (
    <div className="dashboard">
      <h1>All Events</h1>
      <div className="events-grid">
        {events.map((e) => (
          <div key={e.id} className="event-card-wrapper admin">
            <EventCard event={e} />
            <div className="admin-info">
              <p>Venue: {e.venue}</p>
              <p>Date: {e.date}</p>
              <p>Registrations: {getRegistrationsCount(e.id)}</p>
              <button>Edit Event</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
