import { DOMAIN, apiFetch } from "./config";
import { getToken } from "../utilities/storage";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

export const fetchBackups = () =>
  apiFetch(`${DOMAIN}/api/v1/admin/backups`, {
    headers: authHeaders()
  });

export const createBackup = () =>
  apiFetch(`${DOMAIN}/api/v1/admin/backups`, {
    method: "POST",
    headers: authHeaders()
  });

export const downloadBackup = (filename) => {
  const token = getToken();
  window.open(`${DOMAIN}/api/v1/admin/backups/${filename}/download?token=${token}`, "_blank");
};

export const deleteBackup = (filename) =>
  apiFetch(`${DOMAIN}/api/v1/admin/backups/${filename}`, {
    method: "DELETE",
    headers: authHeaders()
  });

export const restoreFromBackup = (filename, confirmation) =>
  apiFetch(`${DOMAIN}/api/v1/admin/backups/restore`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ filename, confirmation })
  });

export const restoreFromUpload = (file, confirmation) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("confirmation", confirmation);
  return apiFetch(`${DOMAIN}/api/v1/admin/backups/restore`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });
};
