import { useNavigate } from "react-router-dom";
import "../styles/HomeDetails.css";

const HomeDetails = () => {
  const navigate = useNavigate();

  // Temporary event data (frontend only)
  const ongoingEvents = [
    {
      id: 1,
      title: "Web Development Workshop",
      time: "Today • 10:00 AM",
      venue: "Computer Lab – 2",
    },
    {
      id: 2,
      title: "Paper Presentation",
      time: "Today • 2:00 PM",
      venue: "Seminar Hall – A",
    }, {
      id: 2,
      title: "Paper Presentation",
      time: "Today • 2:00 PM",
      venue: "Seminar Hall – A",
    }, {
      id: 2,
      title: "Paper Presentation",
      time: "Today • 2:00 PM",
      venue: "Seminar Hall – A",
    }, {
      id: 2,
      title: "Paper Presentation",
      time: "Today • 2:00 PM",
      venue: "Seminar Hall – A",
    }, {
      id: 2,
      title: "Paper Presentation",
      time: "Today • 2:00 PM",
      venue: "Seminar Hall – A",
    }, {
      id: 2,
      title: "Paper Presentation",
      time: "Today • 2:00 PM",
      venue: "Seminar Hall – A",
    },
    {
      id: 3,
      title: "Hackathon",
      time: "Ongoing",
      venue: "Innovation Lab",
    },
  ];

  return (
    <section className="home-details">
      <h2>Ongoing & Today’s Events</h2>

      <div className="event-cards">
        {ongoingEvents.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Venue:</strong> {event.venue}</p>

            <button
              onClick={() => navigate(`/events/ongoing/${event.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeDetails;
