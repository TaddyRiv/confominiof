// src/features/reservas/api.js
import api from "../../shared/api";

// 📌 Listar reservas
export const listReservas = () =>
  api.get("/reservas/").then(res => res.data);

// 📌 Obtener reserva
export const getReserva = (id) =>
  api.get(`/reservas/${id}/`).then(res => res.data);

// 📌 Crear reserva
export const createReserva = (data) =>
  api.post("/reservas/", data).then(res => res.data);

// 📌 Actualizar reserva
export const updateReserva = (id, data) =>
  api.put(`/reservas/${id}/`, data).then(res => res.data);

// 📌 Eliminar reserva
export const deleteReserva = (id) =>
  api.delete(`/reservas/${id}/`);
