// src/features/visits/api.js
import api from "../../shared/api/axios";

// 📋 Listado de visitas
export const listVisits = async (params) => {
  const { data } = await api.get("/visitas/", { params });
  return Array.isArray(data) ? data : (data?.results ?? []);
};

// 🆕 Registrar visita
export const registrarVisita = (payload) =>
  api.post("/visitas/registrar/", payload);

// ✅ Cerrar visita (ahora o con hora enviada "HH:MM" o "HH:MM:SS")
export const closeVisit = (id, hora_salida) =>
  api.post(`/visitas/${id}/cerrar/`, hora_salida ? { hora_salida } : {});

// ✏️ Actualizar visita (ej. editar hora_salida)
export const updateVisit = (id, body) =>
  api.patch(`/visitas/${id}/`, body);

// 🗑️ Eliminar visita
export const deleteVisit = (id) =>
  api.delete(`/visitas/${id}/`);

// 🏢 Apartamentos para el <select>
export const listarApartamentos = async () => {
  const { data } = await api.get("/apartamentos/list/");
  return Array.isArray(data) ? data : (data?.results ?? []);
};
