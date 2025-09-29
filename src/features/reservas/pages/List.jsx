import { useEffect, useState } from "react";
import { listReservas, deleteReserva } from "../api";

export default function ReservaListPage() {
  const [reservas, setReservas] = useState([]);

  const fetchData = async () => {
    try {
      const data = await listReservas();
      setReservas(data);
    } catch (err) {
      console.error("Error cargando reservas", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta reserva?")) {
      try {
        await deleteReserva(id);
        fetchData(); // refrescar la lista
      } catch (err) {
        console.error("Error eliminando reserva", err);
      }
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Reservas</h2>
      <a href="/admin/reservas/new" className="btn btn-primary">
        + Nueva Reserva
      </a>

      <div style={{ marginTop: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#2a2a40", color: "white" }}>
            <tr>
              <th style={{ padding: 8, border: "1px solid #444" }}>ID</th>
              <th style={{ padding: 8, border: "1px solid #444" }}>Área Común</th>
              <th style={{ padding: 8, border: "1px solid #444" }}>Fecha</th>
              <th style={{ padding: 8, border: "1px solid #444" }}>Inicio</th>
              <th style={{ padding: 8, border: "1px solid #444" }}>Fin</th>
              <th style={{ padding: 8, border: "1px solid #444" }}>Estado</th>
              <th style={{ padding: 8, border: "1px solid #444" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? (
              reservas.map((r) => (
                <tr key={r.id} style={{ textAlign: "center" }}>
                  <td style={{ padding: 8, border: "1px solid #444" }}>{r.id}</td>
                  <td style={{ padding: 8, border: "1px solid #444" }}>{r.area_comun_nombre}</td>
                  <td style={{ padding: 8, border: "1px solid #444" }}>{r.fecha}</td>
                  <td style={{ padding: 8, border: "1px solid #444" }}>{r.hora_inicio}</td>
                  <td style={{ padding: 8, border: "1px solid #444" }}>{r.hora_fin}</td>
                  <td style={{ padding: 8, border: "1px solid #444" }}>{r.estado}</td>
                  <td style={{ padding: 8, border: "1px solid #444" }}>
                    <a href={`/admin/reservas/${r.id}`} className="btn btn-sm">Ver</a>{" "}
                    <a href={`/admin/reservas/${r.id}/edit`} className="btn btn-sm">Editar</a>{" "}
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: 16 }}>
                  No hay reservas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
