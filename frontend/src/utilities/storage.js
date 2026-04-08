export const saveToken = ( token ) => {
  localStorage.setItem("token", token);
};

export const saveRole = ( role ) => {
  localStorage.setItem("role", role);
}

export const getRole = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;

  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};