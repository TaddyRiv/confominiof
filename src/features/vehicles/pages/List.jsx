import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import SimpleTable from "../../../shared/ui/SimpleTable";
import { listVehicles, createVehicle, deleteVehicle } from "../api";
// 🔽 si no tienes api de apartamentos, usará fetch directo
import { listApartments } from "../../apartments/api";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

export default function VehiclesPage() {
  const [rows, setRows] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filters, setFilters] = useState({ apartamento: "", placa: "", residentes: true });

  const cols = useMemo(
    () => [
      { key: "id", label: "ID", width: 60 },
      { key: "placa", label: "Placa" },
      { key: "descripcion", label: "Descripción" },
      { key: "apartamento_numero", label: "Apto" },
      {
        key: "pase_conocido",
        label: "Pase",
        render: (v) => (v ? "Conocido" : "Visitante"),
      },
      {
        key: "created_at",
        label: "Creado",
        render: (v) => (v ? new Date(v).toLocaleString() : ""),
      },
      {
        key: "actions",
        label: "",
        width: 160,
        render: (_, r) => (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-danger" onClick={() => onDelete(r.id)}>
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    []
  );

  async function fetchApartmentsDirect() {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/apartamentos/`, {
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!res.ok) throw new Error("Error cargando apartamentos");
    return res.json();
  }

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const [list, apts] = await Promise.all([
        listVehicles(filters),
        listApartments ? listApartments() : fetchApartmentsDirect(),
      ]);
      setRows(list);
      setApartments(apts.results || apts || []);
    } catch (e) {
      setErr(e.message || "Error cargando vehículos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.apartamento, filters.placa, filters.residentes]);

  async function onCreate(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      placa: form.get("placa")?.trim(),
      descripcion: form.get("descripcion")?.trim() || null,
      apartamento: form.get("apartamento") || null,
      pase_conocido: form.get("pase_conocido") === "on",
    };
    if (!data.apartamento) data.pase_conocido = false;

    try {
      await createVehicle(data);
      e.currentTarget.reset();
      await load();
      alert("Vehículo creado");
    } catch (err) {
      alert(err.message || "Error creando vehículo");
    }
  }

  async function onDelete(id) {
    if (!window.confirm("¿Eliminar vehículo?")) return;
    try {
      await deleteVehicle(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: "grid", gap: 16 }}>
        <Card title="Vehículos">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <input
              placeholder="Placa"
              value={filters.placa}
              onChange={(e) => setFilters((f) => ({ ...f, placa: e.target.value }))}
              className="input"
              style={{ minWidth: 160 }}
            />
            <select
              value={filters.apartamento}
              onChange={(e) => setFilters((f) => ({ ...f, apartamento: e.target.value }))}
              className="input"
            >
              <option value="">Todos los apartamentos</option>
              {apartments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.numero}
                </option>
              ))}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={!!filters.residentes}
                onChange={(e) => setFilters((f) => ({ ...f, residentes: e.target.checked }))}
              />
              Solo residentes
            </label>
            <button onClick={load} className="btn">
              Refrescar
            </button>
          </div>

          {err && <p style={{ color: "#f55" }}>{err}</p>}
          {loading ? (
            <p>Cargando…</p>
          ) : (
            <SimpleTable columns={cols} rows={rows} emptyText="No hay vehículos" />
          )}
        </Card>

        <Card title="Registrar vehículo">
          <form
            onSubmit={onCreate}
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div>
              <label>Placa</label>
              <input name="placa" required className="input" />
            </div>
            <div>
              <label>Descripción</label>
              <input name="descripcion" className="input" />
            </div>
            <div>
              <label>Apartamento (opcional)</label>
              <select name="apartamento" className="input" defaultValue="">
                <option value="">— Visitante —</option>
                {apartments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.numero}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" name="pase_conocido" />
              <label>Pase conocido (requiere apartamento)</label>
            </div>
            <div style={{ alignSelf: "end" }}>
              <button className="btn btn-primary" type="submit">
                Guardar
              </button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
