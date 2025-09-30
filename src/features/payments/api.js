import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "https://3.17.18.25/api";

function authHeaders() {
  const token = localStorage.getItem("access_token"); // 👈 ahora correcto
  return { Authorization: `Bearer ${token}` };
}

// listar todos los pagos
export async function listPayments() {
  const res = await axios.get(`${API_BASE}/pagos/`, {
    headers: authHeaders(),
  });
  return res.data;
}

// aprobar un pago
export async function approvePayment(id) {
  const res = await axios.post(`${API_BASE}/pagos/${id}/aprobar/`, {}, {
    headers: authHeaders(),
  });
  return res.data;
}

// rechazar un pago
export async function rejectPayment(id, body) {
  const res = await axios.post(`${API_BASE}/pagos/${id}/rechazar/`, body || {}, {
    headers: authHeaders(),
  });
  return res.data;
}

// crear pago (ya lo tenías pero lo dejo aquí completo)
export async function createPayment(data) {
  const formData = new FormData();
  formData.append("cargo", data.cargo);
  formData.append("tipo", data.tipo);
  formData.append("monto", data.monto);
  if (data.observacion) formData.append("observacion", data.observacion);
  if (data.comprobante) formData.append("comprobante", data.comprobante);

  const res = await axios.post(`${API_BASE}/pagos/`, formData, {
    headers: {
      ...authHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}