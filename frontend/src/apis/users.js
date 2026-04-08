import { DOMAIN } from "./config";

export const fetchUsersApi = async (token) => {
  return await fetch(`${DOMAIN}/api/v1/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
};