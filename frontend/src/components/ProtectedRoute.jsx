import { Navigate } from "react-router-dom";
import { getToken } from "../utilities/storage";


const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return (
      <Navigate to="/login" />
    );
  }
  return children;
};

export default ProtectedRoute;