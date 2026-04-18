import { DOMAIN } from "./config";
import { getToken } from "../utilities/storage";

export const fetchUsersApi = async () =>
  fetch(`${DOMAIN}/api/v1/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  });

export const createUserApi = async (data) =>
  fetch(`${DOMAIN}/api/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

export const updateUserApi = async (userId, data) =>
  fetch(`${DOMAIN}/api/v1/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

export const deleteUserApi = async (userId) =>
  fetch(`${DOMAIN}/api/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
