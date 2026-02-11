import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToAdmin = () => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "admin") {
      alert("Admin access only");
    } else {
      navigate("/admin/dashboard");
    }
  };

  return <button onClick={goToAdmin}>Admin</button>;
};

export default AdminButton;
