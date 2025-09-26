import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import { listCharges } from "../../charges/api";
import { createPayment } from "../api";

export default function PaymentCreatePage() {
  const [params] = useSearchParams();
  const cargoQuery = params.get("cargo") || "";
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    cargo: cargoQuery,
    tipo: "EFECTIVO",           // "QR" | "EFECTIVO"
    monto: "",
    observacion: "",
    comprobante: null,          // File opcional
  });

  const load = async () => {
    try {
      setLoading(true); setErr("");
      const c = await listCharges({ estado: "PENDIENTE" }); // opcional
      setCharges(c);
    } catch {
      setErr("No se pudieron cargar los cargos.");
    } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, []);

  const handle = (e) => {
    const { name, value, files } = e.target;
    if (name === "comprobante") setForm((s)=>({ ...s, comprobante: files?.[0] || null }));
    else setForm((s)=>({ ...s, [name]: value }));
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
      setMsg("Pago enviado. Pendiente de verificación.");
      setForm({ cargo:"", tipo:"EFECTIVO", monto:"", observacion:"", comprobante:null });
      await load();
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
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <label className="block">
              Cargo
              <select name="cargo" value={form.cargo} onChange={handle} className="w-full border rounded p-2" required>
                <option value="">Seleccione…</option>
                {charges.map(c => (
                  <option key={c.id} value={c.id}>
                    #{c.id} — Apto {c.apartamento_numero} — Total S/{c.total} — Pagado S/{c.pagado}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              Tipo
              <select name="tipo" value={form.tipo} onChange={handle} className="w-full border rounded p-2">
                <option value="EFECTIVO">Efectivo</option>
                <option value="QR">QR</option>
              </select>
            </label>

            <label className="block">
              Monto
              <input type="number" step="0.01" name="monto" value={form.monto} onChange={handle} className="w-full border rounded p-2" required />
            </label>

            <label className="block">
              Comprobante (opcional)
              <input type="file" name="comprobante" onChange={handle} className="w-full border rounded p-2" />
            </label>

            <label className="block md:col-span-2">
              Observación
              <input name="observacion" value={form.observacion} onChange={handle} className="w-full border rounded p-2" />
            </label>

            <div className="md:col-span-2">
              <button type="submit" style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"10px 14px", fontWeight:800 }}>
                Registrar
              </button>
            </div>
          </form>
        )}
      </Card>
    </AdminLayout>
  );
}
