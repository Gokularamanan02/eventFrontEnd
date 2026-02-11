import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/HomeRegistration.css";

const HomeRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRegisterClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/events");
    }
  };

  return (
    <section className="home-registration">
      <div className="home-registration-container">
        <h2>Event Registration</h2>
        <p>
          Register now to participate in exciting technical events, workshops,
          and competitions conducted as part of our National Level Technical
          Symposium.
        </p>

        <button className="register-btn" onClick={handleRegisterClick}>
          Register Now
        </button>
      </div>
    </section>
  );
};

export default HomeRegistration;