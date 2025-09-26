// src/shared/api/axios.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL; // p.ej. http://localhost:8000/api

// Instancia principal que usarás en tu app
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 15000,
});

// Instancia "nativa" solo para refrescar (evita recursión de interceptores)
const refreshClient = axios.create({ baseURL: API_BASE });

/* -------------------- helpers -------------------- */
function setAuthHeader(config, token) {
  if (!config.headers) config.headers = {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers["Content-Type"]) config.headers["Content-Type"] = "application/json";
  if (!config.headers.Accept) config.headers.Accept = "application/json";
  return config;
}

function goLogin() {
  // Limpia y manda a login
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}

/* ----------- request interceptor (pone token) ----------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  return setAuthHeader(config, token);
});

/* ----------- response interceptor (refresh 401) ---------- */
let isRefreshing = false;
let queue = []; // callbacks a ejecutar cuando llegue un nuevo token

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const original = error?.config;

    // Si no hay response o no tenemos config original, no podemos reintentar
    if (!error?.response || !original) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Solo intentamos refresh en 401 de endpoints normales (no en login/refresh)
    const isAuthPath =
      original.url?.includes("/auth/login/") ||
      original.url?.includes("/auth/refresh/") ||
      original.url?.includes("/auth/me/");

    if (status === 401 && !original._retry && !isAuthPath) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        goLogin();
        return Promise.reject(error);
      }

      // Si ya hay un refresh en progreso, encolamos la petición y
      // cuando termine reintentamos con el nuevo token
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((newToken) => {
            const cfg = setAuthHeader({ ...original }, newToken);
            resolve(api(cfg));
          });
        });
      }

      // Iniciamos refresh
      isRefreshing = true;
      try {
        const { data } = await refreshClient.post("/auth/refresh/", { refresh });
        const newToken = data?.access;
        if (!newToken) throw new Error("No access token in refresh response");

        localStorage.setItem("access_token", newToken);

        // despacha la cola
        queue.forEach((cb) => cb(newToken));
        queue = [];
        isRefreshing = false;

        // reintenta la original con el nuevo token
        const retried = setAuthHeader({ ...original }, newToken);
        return api(retried);
      } catch (e) {
        // refresh falló: limpia y manda al login
        queue = [];
        isRefreshing = false;
        goLogin();
        return Promise.reject(e);
      }
    }

    // Otros errores / 401 en auth endpoints → no reintentar
    return Promise.reject(error);
  }
);

export default api;
