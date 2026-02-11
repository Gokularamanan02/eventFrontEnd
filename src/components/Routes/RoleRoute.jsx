import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleRoute = ({ role, children }) => {
  const { user } = useAuth();

  // Logged in but wrong role
  if (user?.role !== role) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default RoleRoute;
