import { Navigate } from "react-router-dom";
import { getToken } from "../utilities/storage";

const PublicRoute = ({ children }) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;