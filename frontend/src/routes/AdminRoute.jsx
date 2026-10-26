import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../utilities/storage";


const AdminRoute = ({ children }) => {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return (
      <Navigate to="/login" replace />
    );
  }

  if (role !== 'admin') {
    return (
      <Navigate to="/" replace />
    );
  }
  return children;
};

export default AdminRoute;