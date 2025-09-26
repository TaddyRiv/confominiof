import api from "../../shared/api/axios";

export async function assignResidence({ usuario_id, apartamento_id, fecha_inicio }) {
  const { data } = await api.post("/residencias/asignar/", {
    usuario_id,
    apartamento_id,
    ...(fecha_inicio ? { fecha_inicio } : {})
  });
  return data; // viene con usuario, apartamento, fechas
}
