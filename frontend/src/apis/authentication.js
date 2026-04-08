import { DOMAIN } from "./config";

export const registerApi = async (form) => {
  return fetch(`${DOMAIN}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password
      }
    })
  });
};


export const loginApi = async (form) => {
  return fetch(`${DOMAIN}/api/v1/users/sign_in`, {
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
    `${DOMAIN}/api/v1/users/sign_out`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};