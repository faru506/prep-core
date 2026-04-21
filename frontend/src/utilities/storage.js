export const saveToken = ( token ) => {
  localStorage.setItem("token", token);
};

export const saveRole = ( role ) => {
  localStorage.setItem("role", role);
}

export const getRole = () => {
  const payload = getTokenPayload();
  return payload?.role || null;
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = getTokenPayload();
  if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
    removeToken();
    return null;
  }

  return token;
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getTokenPayload = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};
