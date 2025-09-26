import api from "../../shared/api/axios";

function isEmail(v) {
  return /\S+@\S+\.\S+/.test(v);
}

export async function login({ identity, password }) {
  const payload = isEmail(identity)
    ? { email: identity, password }
    : { username: identity, password };

  const { data } = await api.post("/auth/login/", payload);
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/auth/me/");
  return data;
}
