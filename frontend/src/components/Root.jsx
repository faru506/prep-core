import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/LandingPage";
import { getToken } from "../utilities/storage";
import { setNavigate } from "../utilities/navigation";

const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return getToken() ? <App /> : <LandingPage />;
};

export default Root;
