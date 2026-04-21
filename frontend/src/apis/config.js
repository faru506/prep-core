import { navigate } from "../utilities/navigation";
import { removeToken } from "../utilities/storage";

export const DOMAIN = "http://localhost:3000";

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    removeToken();
    navigate("/login");
    throw new Error("Unauthorized");
  }

  return response;
};
