import { useEffect } from "react";
import "../../styles/EventsModal.css";

const EventModal = ({ event, onClose }) => {
  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>{event.title}</h2>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Date:</strong> {event.date}</p>

        <p style={{ margin: "16px 0", color: "#cbd5f5" }}>
          {event.description || "Detailed event information will be updated soon."}
        </p>

        <button
          className="register-btn"
          style={{ width: "100%" }}
          onClick={() => alert("Registered Successfully")}
        >
          Register for Event
        </button>
      </div>
    </div>
  );
};

export default EventModal;
