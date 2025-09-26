// src/features/visits/components/VisitForm.jsx
import { useEffect, useState } from "react";
import { listarApartamentos, registrarVisita } from "../api";

export default function VisitForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [apts, setApts] = useState([]);

  const [form, setForm] = useState({
    // ⚠️ aquí guardamos el **ID** (PK) del apartamento, no el número
    apartamento: "",
    detalle: "",

    visitante_nombre: "",
    visitante_ci: "",
    visitante_celular: "",

    vehiculo_placa: "",
    vehiculo_descripcion: "",
    vehiculo_pase_conocido: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const raw = await listarApartamentos();
        const items = Array.isArray(raw?.results) ? raw.results : raw || [];
        // normaliza a { id, label } mostrando el número si existe
        const norm = items.map((a) => ({
          id: a.id,
          numero: a.numero,
          label: (a.numero ?? a.codigo ?? `Apto #${a.id}`) + ` (id ${a.id})`,
        }));
        setApts(norm);
      } catch {
        // si falla, el select quedará vacío y el usuario no podrá enviar (required)
      }
    })();
  }, []);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const aptoId = Number(form.apartamento);
      if (!aptoId || Number.isNaN(aptoId)) {
        setErr("Selecciona un apartamento válido.");
        setLoading(false);
        return;
      }

      const payload = {
        apartamento: aptoId,                 // 👉 se envía el **ID**
        detalle: form.detalle || "",
        visitante: {
          nombre: (form.visitante_nombre || "").trim(),
          ci: form.visitante_ci || null,
          celular: form.visitante_celular || null,
        },
      };

      if (form.vehiculo_placa) {
        payload.vehiculo = {
          placa: form.vehiculo_placa.toUpperCase(),
          descripcion: form.vehiculo_descripcion || null,
          apartamento: aptoId,               // 👉 mismo ID del apto
          pase_conocido: !!form.vehiculo_pase_conocido,
        };
      }

      await registrarVisita(payload);
      onSuccess?.(); // redirigir o refrescar
    } catch (e2) {
      const detail =
        e2?.response?.data?.detail ||
        Object.values(e2?.response?.data || {})?.[0] ||
        "No se pudo registrar la visita.";
      setErr(String(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {err && <div style={{ color: "tomato", fontWeight: 600 }}>{err}</div>}

      {/* Apartamento + Detalle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Apartamento</label>
          <select
            name="apartamento"
            value={form.apartamento}
            onChange={handle}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione…</option>
            {apts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Detalle / Motivo</label>
          <input
            name="detalle"
            value={form.detalle}
            onChange={handle}
            className="w-full border rounded p-2"
            placeholder="Reunión, visita familiar, etc."
          />
        </div>
      </div>

      {/* Visitante */}
      <div className="pt-2">
        <h3 className="font-semibold mb-2">Visitante</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              name="visitante_nombre"
              value={form.visitante_nombre}
              onChange={handle}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">CI (opcional)</label>
            <input
              name="visitante_ci"
              value={form.visitante_ci}
              onChange={handle}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Celular (opcional)</label>
            <input
              name="visitante_celular"
              value={form.visitante_celular}
              onChange={handle}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Vehículo */}
      <div className="pt-2">
        <h3 className="font-semibold mb-2">Vehículo (opcional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Placa</label>
            <input
              name="vehiculo_placa"
              value={form.vehiculo_placa}
              onChange={handle}
              className="w-full border rounded p-2"
              placeholder="ABC123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <input
              name="vehiculo_descripcion"
              value={form.vehiculo_descripcion}
              onChange={handle}
              className="w-full border rounded p-2"
              placeholder="Toyota gris"
            />
          </div>
          <label className="inline-flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="vehiculo_pase_conocido"
              checked={form.vehiculo_pase_conocido}
              onChange={handle}
            />
            Pase conocido
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white"
      >
        {loading ? "Guardando..." : "Registrar visita"}
      </button>
    </form>
  );
}
