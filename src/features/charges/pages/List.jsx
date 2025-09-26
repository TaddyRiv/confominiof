import { useEffect, useState } from "react";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import SimpleTable from "../../../shared/ui/SimpleTable";
import { listCharges, createCharge, deleteCharge } from "../api";
import { listarApartamentos } from "../../visits/api";
import { listServices } from "../../services/api";

export default function ChargesListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [apts, setApts] = useState([]);
  const [services, setServices] = useState([]);

  // Crear cargo
  const [showCreate, setShowCreate] = useState(false);
  const [cargo, setCargo] = useState({
    apartamento: "",
    periodo: "",            // YYYY-MM-DD
    fecha_vencimiento: "",
    notas: "",
    detalles: [
      { servicio: "", cantidad: 1, precio_unitario: "" },
    ],
  });

  const load = async () => {
    try {
      setLoading(true); setErr("");
      const [c, a, s] = await Promise.all([
        listCharges(), listarApartamentos(), listServices()
      ]);
      setRows(c); setApts(a); setServices(s);
    } catch {
      setErr("No se pudieron cargar cargos/servicios/apartamentos.");
    } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, []);

  const onChangeCargo = (e) => {
    const { name, value } = e.target;
    setCargo((s) => ({ ...s, [name]: value }));
  };
  const onChangeDetalle = (idx, key, value) => {
    setCargo((s) => {
      const detalles = s.detalles.slice();
      detalles[idx] = { ...detalles[idx], [key]: value };
      return { ...s, detalles };
    });
  };
  const addDetalle = () => setCargo((s)=>({ ...s, detalles:[...s.detalles, { servicio:"", cantidad:1, precio_unitario:"" }] }));
  const removeDetalle = (idx) => setCargo((s)=>({ ...s, detalles: s.detalles.filter((_,i)=>i!==idx) }));

  const submitCreate = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      const payload = {
        apartamento: Number(cargo.apartamento),
        periodo: cargo.periodo || undefined,
        fecha_vencimiento: cargo.fecha_vencimiento || undefined,
        notas: cargo.notas || "",
        detalles: cargo.detalles
          .filter(d => d.servicio)
          .map(d => ({
            servicio: Number(d.servicio),
            cantidad: Number(d.cantidad || 1),
            precio_unitario: Number(d.precio_unitario || 0),
          })),
      };
      if (!payload.detalles.length) {
        setErr("Añade al menos un servicio en Detalles.");
        return;
      }
      await createCharge(payload);
      setMsg("Cargo creado.");
      setShowCreate(false);
      setCargo({ apartamento:"", periodo:"", fecha_vencimiento:"", notas:"", detalles:[{ servicio:"", cantidad:1, precio_unitario:"" }] });
      await load();
    } catch (e2) {
      const detail = e2?.response?.data?.detail || Object.values(e2?.response?.data || {})?.[0] || "No se pudo crear el cargo.";
      setErr(String(detail));
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este cargo?")) return;
    setErr(""); setMsg("");
    try {
      await deleteCharge(id);
      setMsg("Cargo eliminado.");
      await load();
    } catch {
      setErr("No se pudo eliminar el cargo.");
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "apartamento_numero", header: "Apto" },
    { key: "periodo", header: "Periodo" },
    { key: "fecha_vencimiento", header: "Vence" },
    { key: "estado", header: "Estado" },
    { key: "total", header: "Total" },
    { key: "pagado", header: "Pagado" },
    {
      key: "actions", header: "",
      render: (r) => (
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>onDelete(r.id)}
            style={{ border:"1px solid tomato", background:"transparent", color:"tomato", borderRadius:10, padding:"6px 10px" }}>
            Eliminar
          </button>
        </div>
      )
    },
  ];

  return (
    <AdminLayout>
      <Card title="Cargos">
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            {msg && <span style={{ color:"var(--brand)", fontWeight:700 }}>{msg}</span>}
            {err && <span style={{ color:"tomato", marginLeft:12 }}>{err}</span>}
          </div>
          <button onClick={()=>setShowCreate(v=>!v)}
            style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"8px 12px", fontWeight:700 }}>
            {showCreate ? "Cerrar" : "Nuevo cargo"}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={submitCreate}
            style={{ background:"rgba(58,31,86,.35)", padding:12, borderRadius:12, border:"1px solid var(--border)", marginBottom:16 }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label className="block">
                Apartamento
                <select name="apartamento" value={cargo.apartamento} onChange={onChangeCargo} className="w-full border rounded p-2" required>
                  <option value="">Seleccione…</option>
                  {apts.map(a => <option key={a.id} value={a.id}>{a.numero || `Apto #${a.id}`}</option>)}
                </select>
              </label>
              <label className="block">
                Periodo
                <input type="date" name="periodo" value={cargo.periodo} onChange={onChangeCargo} className="w-full border rounded p-2"/>
              </label>
              <label className="block">
                Vencimiento
                <input type="date" name="fecha_vencimiento" value={cargo.fecha_vencimiento} onChange={onChangeCargo} className="w-full border rounded p-2"/>
              </label>
              <label className="block md:col-span-1">
                Notas
                <input name="notas" value={cargo.notas} onChange={onChangeCargo} className="w-full border rounded p-2"/>
              </label>
            </div>

            <div style={{ marginTop:12, marginBottom:8, fontWeight:700 }}>Detalles</div>
            <div className="grid gap-2">
              {cargo.detalles.map((d, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <select value={d.servicio} onChange={(e)=>onChangeDetalle(idx,"servicio", e.target.value)} className="w-full border rounded p-2">
                    <option value="">Servicio…</option>
                    {services.filter(s=>s.activo).map(s=>(
                      <option key={s.id} value={s.id}>{s.nombre} (S/{s.precio})</option>
                    ))}
                  </select>
                  <input type="number" step="0.01" placeholder="Cantidad" value={d.cantidad}
                         onChange={(e)=>onChangeDetalle(idx,"cantidad", e.target.value)} className="w-full border rounded p-2"/>
                  <input type="number" step="0.01" placeholder="Precio unit."
                         value={d.precio_unitario} onChange={(e)=>onChangeDetalle(idx,"precio_unitario", e.target.value)} className="w-full border rounded p-2"/>
                  <button type="button" onClick={addDetalle}
                          style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"6px 10px" }}>
                    + Detalle
                  </button>
                  {cargo.detalles.length > 1 && (
                    <button type="button" onClick={()=>removeDetalle(idx)}
                            style={{ border:"1px solid tomato", background:"transparent", color:"tomato", borderRadius:10, padding:"6px 10px" }}>
                      Quitar
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop:12 }}>
              <button type="submit" style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"10px 14px", fontWeight:800 }}>
                Crear cargo
              </button>
            </div>
          </form>
        )}

        {loading ? <div>Cargando…</div> : (
          <div style={{ overflow:"auto", borderRadius:12 }}>
            <SimpleTable columns={columns} rows={rows} keyField="id" />
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
