import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://3.17.18.25/api";


const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

// 📌 Listar reservas
export const listReservas = async () => {
  const res = await axios.get(`${API_BASE}/reservas/`, { headers: authHeader() });
  return res.data;
};

// 📌 Obtener reserva
export const getReserva = async (id) => {
  const res = await axios.get(`${API_BASE}/reservas/${id}/`, { headers: authHeader() });
  return res.data;
};

// 📌 Crear reserva
export const createReserva = async (data) => {
  const res = await axios.post(`${API_BASE}/reservas/`, data, { headers: authHeader() });
  return res.data;
};

// 📌 Actualizar reserva
export const updateReserva = async (id, data) => {
  const res = await axios.put(`${API_BASE}/reservas/${id}/`, data, { headers: authHeader() });
  return res.data;
};

// 📌 Eliminar reserva
export const deleteReserva = async (id) => {
  await axios.delete(`${API_BASE}/reservas/${id}/`, { headers: authHeader() });
};

