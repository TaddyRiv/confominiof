import api from "../../shared/api/axios";


export async function listUsers(params = {}) {
  const { data } = await api.get("/usuarios/", { params });
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function createUser(payload) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload)) {
    if (k === "fotoFile") continue;
    if (v !== undefined && v !== null) fd.append(k, v);
  }
  if (payload.fotoFile) fd.append("foto", payload.fotoFile);

  const { data } = await api.post("/usuarios/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}


export async function updateUser(id, payload) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload)) {
    if (k === "fotoFile") continue;
    if (k === "foto" && v === null) {
      // marcar foto para borrar
      fd.append("foto", "");
      continue;
    }
    if (v !== undefined) fd.append(k, v);
  }
  if (payload.fotoFile) fd.append("foto", payload.fotoFile);

  const { data } = await api.patch(`/usuarios/${id}/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}


export async function deleteUser(id) {
  await api.delete(`/usuarios/${id}/`);
}
