// src/features/visits/pages/List.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import SimpleTable from "../../../shared/ui/SimpleTable";
import { listVisits, closeVisit, updateVisit, deleteVisit } from "../api";

export default function VisitsListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // edición de hora_salida
  const [editing, setEditing] = useState(null); // objeto visita
  const [editHora, setEditHora] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const v = await listVisits();
      setRows(v);
    } catch {
      setErr("No se pudo cargar la lista de visitas.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const onCerrarAhora = async (id) => {
    setErr(""); setMsg("");
    try {
      await closeVisit(id); // sin hora_salida => usa la hora actual
      setMsg("Visita cerrada.");
      await load();
    } catch {
      setErr("No se pudo cerrar la visita.");
    }
  };

  const onEditarSalida = (v) => {
    setEditing(v);
    // Normaliza a "HH:MM" si existe
    const h = (v.hora_salida || "").slice(0, 5);
    setEditHora(h);
  };

  const submitEditarSalida = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      if (!editHora) {
        setErr("Debes indicar la hora (HH:MM).");
        return;
      }
      const hhmmss = editHora.length === 5 ? `${editHora}:00` : editHora; // HH:MM -> HH:MM:00
      await updateVisit(editing.id, { hora_salida: hhmmss });
      setMsg("Hora de salida actualizada.");
      setEditing(null);
      await load();
    } catch {
      setErr("No se pudo actualizar la hora de salida.");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta visita?")) return;
    setErr(""); setMsg("");
    try {
      await deleteVisit(id);
      setMsg("Visita eliminada.");
      await load();
    } catch {
      setErr("No se pudo eliminar la visita.");
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "fecha", header: "Fecha" },
    { key: "hora_inicio", header: "Hora entrada" },
    { key: "hora_salida", header: "Hora salida" },
    { key: "visitante_nombre", header: "Visitante" },
    { key: "apartamento_numero", header: "Apto" },
    { key: "vehiculo_placa", header: "Placa" },
    { key: "detalle", header: "Detalle" },
    {
      key: "actions",
      header: "",
      render: (v) => (
        <div style={{ display: "flex", gap: 8 }}>
          {!v.hora_salida && (
            <button
              onClick={() => onCerrarAhora(v.id)}
              style={{ border: "1px solid var(--brand)", background: "transparent", color: "var(--brand)", borderRadius: 10, padding: "6px 10px" }}
            >
              Cerrar
            </button>
          )}
          <button
            onClick={() => onEditarSalida(v)}
            style={{ border: "1px solid #9ca3af", background: "transparent", color: "#e5e7eb", borderRadius: 10, padding: "6px 10px" }}
          >
            Editar salida
          </button>
          <button
            onClick={() => onDelete(v.id)}
            style={{ border: "1px solid tomato", background: "transparent", color: "tomato", borderRadius: 10, padding: "6px 10px" }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Card title="Visitas">
        <div style={{ marginBottom: 12 }}>
          {msg && <span style={{ color: "var(--brand)", fontWeight: 700 }}>{msg}</span>}
          {err && <span style={{ color: "tomato", marginLeft: 12 }}>{err}</span>}
        </div>

        {loading ? (
          <div>Cargando…</div>
        ) : (
          <div style={{ overflow: "auto", borderRadius: 12 }}>
            <SimpleTable columns={columns} rows={rows} keyField="id" />
          </div>
        )}
      </Card>

      {/* Modal edición de hora_salida */}
      {editing && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(520px, 92vw)", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}
          >
            <h3 style={{ marginTop: 0, color: "var(--brand)" }}>
              Editar hora de salida — Visita #{editing.id}
            </h3>
            <form onSubmit={submitEditarSalida} style={{ display: "grid", gap: 12 }}>
              <label>
                Hora de salida
                <input
                  type="time"
                  value={editHora}
                  onChange={(e) => setEditHora(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </label>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  style={{ border: "1px solid var(--border)", background: "transparent", color: "#e5e7eb", borderRadius: 10, padding: "10px 14px" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ border: "1px solid var(--brand)", background: "transparent", color: "var(--brand)", borderRadius: 10, padding: "10px 14px", fontWeight: 800 }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
