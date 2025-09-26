import api from "../../shared/api/axios";

// Lista (por cargo, apartamento, etc. usando params si quieres)
export const listPayments = async (params) => {
  const { data } = await api.get("/pagos/", { params });
  return Array.isArray(data) ? data : (data?.results ?? []);
};

// Crear pago; si hay archivo lo manda como multipart/form-data
export const createPayment = (payload) => {
  const hasFile = payload?.comprobante instanceof File || payload?.comprobante instanceof Blob;
  if (hasFile) {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v);
    });
    return api.post("/pagos/", form, { headers: { "Content-Type": "multipart/form-data" } });
  }
  return api.post("/pagos/", payload);
};

// Aprobación / Rechazo (solo Admin)
export const approvePayment = (id, observacion) =>
  api.post(`/pagos/${id}/aprobar/`, observacion ? { observacion } : {});
export const rejectPayment = (id, observacion) =>
  api.post(`/pagos/${id}/rechazar/`, observacion ? { observacion } : {});
