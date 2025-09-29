import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";


export async function listAreas() {
  const res = await axios.get(`${API_BASE}/areas-comunes/`);
  return res.data;
}

export async function createArea(data) {
  const res = await axios.post(`${API_BASE}/areas-comunes/`, data);
  return res.data;
}

export async function deleteArea(id) {
  const res = await axios.delete(`${API_BASE}/areas-comunes/${id}/`);
  return res.data;
}
