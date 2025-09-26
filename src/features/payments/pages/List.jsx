import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import SimpleTable from "../../../shared/ui/SimpleTable";
import { listPayments, approvePayment, rejectPayment } from "../api";
import { listarApartamentos } from "../../visits/api";
import { listCharges } from "../../charges/api";

export default function PaymentsListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [apts, setApts] = useState([]);
  const [charges, setCharges] = useState([]);

  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const aptoSel = params.get("apto") || "";
  const cargoSel = params.get("cargo") || "";

  const load = async () => {
    try {
      setLoading(true); setErr("");
      const [p, a, c] = await Promise.all([
        listPayments(),          // trae todos; filtramos en cliente si hace falta
        listarApartamentos(),
        listCharges()
      ]);
      setRows(p); setApts(a); setCharges(c);
    } catch {
      setErr("No se pudo cargar la lista de pagos.");
    } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, []);

  const filtered = useMemo(() => {
    let r = rows;
    if (aptoSel) {
      const cargoIds = charges.filter(ch => String(ch.apartamento) === String(aptoSel)).map(ch => ch.id);
      r = r.filter(p => cargoIds.includes(p.cargo));
    }
    if (cargoSel) r = r.filter(p => String(p.cargo) === String(cargoSel));
    return r;
  }, [rows, charges, aptoSel, cargoSel]);

  const onChangeApto = (e) => {
    const v = e.target.value;
    const next = new URLSearchParams(params);
    if (v) next.set("apto", v); else next.delete("apto");
    next.delete("cargo"); // al cambiar apto limpiamos cargo
    setParams(next, { replace: true });
  };
  const onChangeCargo = (e) => {
    const v = e.target.value;
    const next = new URLSearchParams(params);
    if (v) next.set("cargo", v); else next.delete("cargo");
    setParams(next, { replace: true });
  };

  const toNew = () => navigate("/admin/payments/new" + (cargoSel ? `?cargo=${cargoSel}` : ""));

  const onApprove = async (id) => {
    setErr(""); setMsg("");
    try {
      await approvePayment(id);
      setMsg("Pago aprobado.");
      await load();
    } catch {
      setErr("No se pudo aprobar.");
    }
  };
  const onReject = async (id) => {
    const obs = prompt("Motivo (opcional):") || "";
    setErr(""); setMsg("");
    try {
      await rejectPayment(id, obs ? { observacion: obs } : undefined);
      setMsg("Pago rechazado.");
      await load();
    } catch {
      setErr("No se pudo rechazar.");
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "cargo", header: "Cargo" },
    { key: "tipo", header: "Tipo" },
    { key: "monto", header: "Monto" },
    { key: "pagador_email", header: "Pagador" },
    { key: "estado", header: "Estado" },
    { key: "created_at", header: "Fecha" },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => navigate(`/admin/payments/new?cargo=${p.cargo}`)}
                  style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"6px 10px" }}>
            Registrar otro
          </button>
          {/* Muestra acciones de admin solo si está pendiente */}
          {p.estado === "PENDIENTE" && (
            <>
              <button onClick={() => onApprove(p.id)}
                      style={{ border:"1px solid #22c55e", background:"transparent", color:"#22c55e", borderRadius:10, padding:"6px 10px" }}>
                Aprobar
              </button>
              <button onClick={() => onReject(p.id)}
                      style={{ border:"1px solid tomato", background:"transparent", color:"tomato", borderRadius:10, padding:"6px 10px" }}>
                Rechazar
              </button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <AdminLayout>
      <Card title="Pagos">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            {msg && <span style={{ color:"var(--brand)", fontWeight:700 }}>{msg}</span>}
            {err && <span style={{ color:"tomato", marginLeft:12 }}>{err}</span>}
          </div>
          <button onClick={toNew}
                  style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"8px 12px", fontWeight:700 }}>
            Nuevo pago
          </button>
        </div>

        {/* Filtros */}
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          <select value={aptoSel} onChange={onChangeApto} className="w-full border rounded p-2" style={{ maxWidth:250 }}>
            <option value="">Apartamento…</option>
            {apts.map(a => <option key={a.id} value={a.id}>{a.numero || `Apto #${a.id}`}</option>)}
          </select>

          <select value={cargoSel} onChange={onChangeCargo} className="w-full border rounded p-2" style={{ maxWidth:260 }}>
            <option value="">Cargo…</option>
            {charges
              .filter(ch => !aptoSel || String(ch.apartamento) === String(aptoSel))
              .map(ch => (
                <option key={ch.id} value={ch.id}>
                  #{ch.id} — Apto {ch.apartamento_numero} — S/{ch.total} (pag. S/{ch.pagado})
                </option>
              ))}
          </select>
        </div>

        {loading ? <div>Cargando…</div> : (
          <div style={{ overflow:"auto", borderRadius:12 }}>
            <SimpleTable columns={columns} rows={filtered} keyField="id" />
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
