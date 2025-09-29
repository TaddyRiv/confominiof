import api from "../../shared/api/axios";

export async function listUsers(params = {}) {
  const { data } = await api.get("/usuarios/", { params });
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function createUser(payload) {
  const { data } = await api.post("/usuarios/", payload);
  return data;
}

export async function updateUser(id, payload) {
  console.log("PATCH →", `/usuarios/${id}/`, payload); // 👈 log para ver
  const { data } = await api.patch(`/usuarios/${id}/`, payload);
  return data;
}

export async function deleteUser(id) {
  await api.delete(`/usuarios/${id}/`);
}
