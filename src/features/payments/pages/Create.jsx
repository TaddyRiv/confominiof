import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import { listCharges } from "../../charges/api";
import { createPayment } from "../api";

export default function PaymentCreatePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cargoQuery = params.get("cargo") || "";
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    cargo: cargoQuery,
    tipo: "EFECTIVO",
    monto: "",
    observacion: "",
    comprobante: null,
  });

  const load = async () => {
    try {
      setLoading(true); setErr("");
      const c = await listCharges({ estado: "PENDIENTE" });
      setCharges(c);
    } catch {
      setErr("No se pudieron cargar los cargos.");
    } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, []);

  const handle = (e) => {
    const { name, value, files } = e.target;
    if (name === "comprobante") {
      setForm((s)=>({ ...s, comprobante: files?.[0] || null }));
    } else {
      setForm((s)=>({ ...s, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await createPayment({
        cargo: Number(form.cargo),
        tipo: form.tipo,
        monto: Number(form.monto || 0),
        observacion: form.observacion || "",
        comprobante: form.comprobante || undefined,
      });
      navigate("/admin/payments");
    } catch (e2) {
      const detail = e2?.response?.data?.detail || Object.values(e2?.response?.data || {})?.[0] || "No se pudo registrar el pago.";
      setErr(String(detail));
    }
  };

  return (
    <AdminLayout>
      <Card title="Registrar pago">
        <div style={{ marginBottom: 12 }}>
          {msg && <span style={{ color:"var(--brand)", fontWeight:700 }}>{msg}</span>}
          {err && <span style={{ color:"tomato", marginLeft:12 }}>{err}</span>}
        </div>

        {loading ? <div>Cargando…</div> : (
          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Cargo */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-sm">Cargo</label>
              <select
                name="cargo"
                value={form.cargo}
                onChange={handle}
                className="border rounded-lg p-2 bg-white text-black"
                required
              >
                <option value="">Seleccione…</option>
                {charges.map(c => (
                  <option key={c.id} value={c.id}>
                    #{c.id} — Apto {c.apartamento_numero} — Total S/{c.total} — Pagado S/{c.pagado}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-sm">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handle}
                className="border rounded-lg p-2 bg-white text-black"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="QR">QR</option>
              </select>
            </div>

            {/* Monto */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-sm">Monto</label>
              <input
                type="number"
                step="0.01"
                name="monto"
                value={form.monto}
                onChange={handle}
                className="border rounded-lg p-2"
                required
              />
            </div>

            {/* Comprobante */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-sm">Comprobante (opcional)</label>
              <input
                type="file"
                name="comprobante"
                accept="image/*,application/pdf"
                onChange={handle}
                className="border rounded-lg p-2 bg-white text-black"
              />
            </div>

            {/* Observación */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-semibold text-sm">Observación</label>
              <textarea
                name="observacion"
                value={form.observacion}
                onChange={handle}
                rows={3}
                className="border rounded-lg p-2"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 md:col-span-2 mt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/payments")}
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-200 hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border font-bold bg-yellow-400 text-purple-900 hover:bg-yellow-300"
              >
                Registrar
              </button>
            </div>
          </form>
        )}
      </Card>
    </AdminLayout>
  );
}
