import api from "../../shared/api/axios";

export const listCharges = async (params) => {
  const { data } = await api.get("/cargos/", { params });
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const createCharge = (payload) => api.post("/cargos/", payload);
export const updateCharge = (id, body) => api.patch(`/cargos/${id}/`, body);
export const deleteCharge = (id) => api.delete(`/cargos/${id}/`);

// Recomputa total a partir de detalles (endpoint /cargos/:id/recomputar/ si lo agregas)
export const recomputeCharge = (id) => api.post(`/cargos/${id}/recomputar/`);
