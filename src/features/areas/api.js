// src/features/areas/api.js
import api from "../../shared/api";

// 📌 Listar áreas comunes
export const listAreas = () =>
  api.get("/areas-comunes/").then(res => res.data);

// 📌 Crear área común
export const createArea = (data) =>
  api.post("/areas-comunes/", data).then(res => res.data);

// 📌 Eliminar área común
export const deleteArea = (id) =>
  api.delete(`/areas-comunes/${id}/`).then(res => res.data);
