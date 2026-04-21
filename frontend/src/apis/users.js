import { DOMAIN, apiFetch } from "./config";
import { getToken } from "../utilities/storage";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

export const fetchUsersApi = async () =>
  apiFetch(`${DOMAIN}/api/v1/admin/users`, {
    method: "GET",
    headers: authHeaders()
  });

export const createUserApi = async (data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const updateUserApi = async (userId, data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/users/${userId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const deleteUserApi = async (userId) =>
  apiFetch(`${DOMAIN}/api/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders()
  });
