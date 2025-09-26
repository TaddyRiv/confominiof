import api from "../../shared/api/axios";

export async function assignProperty({ usuario_id, apartamento_id, fecha_inicio, fecha_fin, vive=false }) {
  const { data } = await api.post("/propiedades/asignar/", {
    usuario_id,
    apartamento_id,
    ...(fecha_inicio ? { fecha_inicio } : {}),
    ...(fecha_fin ? { fecha_fin } : {}),
    vive
  });
  return data; // { propiedad: {...}, residencia?: {...} }
}
