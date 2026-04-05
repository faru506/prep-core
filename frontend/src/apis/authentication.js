import { DOMAIN } from "./config";

export const registerApi = async (form) => {
  return fetch(`${DOMAIN}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        email: form.email,
        password: form.password
      }
    })
  });
};


export const loginApi = async (form) => {
  return fetch(`${DOMAIN}/users/sign_in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        email: form.email,
        password: form.password
      }
    })
  });
};


export const logoutApi = ( token ) => {
  return fetch(
    `${DOMAIN}/users/sign_out`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};