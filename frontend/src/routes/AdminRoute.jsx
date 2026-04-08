import { Navigate } from "react-router-dom";
import { getRole } from "../utilities/storage";


const AdminRoute = ({ children }) => {
  const role = getRole();

  if (role !== 'admin') {
    return (
      <Navigate to="/" replace />
    );
  }
  return children;
};

export default AdminRoute;