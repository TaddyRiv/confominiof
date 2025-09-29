import api from "../../shared/api/axios";

// LIST
export async function listApartments(params = {}) {
  const { data } = await api.get("/apartamentos/", { params });
  return Array.isArray(data) ? data : (data.results ?? []);
}

// CREATE
export async function createApartment(payload) {
  // payload: { numero, bloque, estado }
  const { data } = await api.post("/apartamentos/", payload);
  return data;
}

// UPDATE
export async function updateApartment(id, payload) {
  const { data } = await api.put(`/apartamentos/${id}/`, payload);
  return data;
}

// DELETE
export async function deleteApartment(id) {
  await api.delete(`/apartamentos/${id}/`);
}
