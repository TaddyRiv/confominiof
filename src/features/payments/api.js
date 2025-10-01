// src/features/payments/api.js
import api from "../../shared/api";

// 📌 Listar todos los pagos
export const listPayments = () =>
  api.get("/pagos/").then(res => res.data);

// 📌 Aprobar un pago
export const approvePayment = (id) =>
  api.post(`/pagos/${id}/aprobar/`).then(res => res.data);

// 📌 Rechazar un pago
export const rejectPayment = (id, body = {}) =>
  api.post(`/pagos/${id}/rechazar/`, body).then(res => res.data);

// 📌 Crear pago (usa multipart/form-data para comprobante)
export const createPayment = (data) => {
  const formData = new FormData();
  formData.append("cargo", data.cargo);
  formData.append("tipo", data.tipo);
  formData.append("monto", data.monto);
  if (data.observacion) formData.append("observacion", data.observacion);
  if (data.comprobante) formData.append("comprobante", data.comprobante);

  return api.post("/pagos/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(res => res.data);
};
