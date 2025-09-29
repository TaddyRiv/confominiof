import api from "../../shared/api/axios";

export const listServices = async (params) => {
  const { data } = await api.get("/servicios/", { params });
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const createService = (payload) => api.post("/servicios/", payload);
export const updateService = (id, body) => api.patch(`/servicios/${id}/`, body);
export const deleteService = (id) => api.delete(`/servicios/${id}/`);
