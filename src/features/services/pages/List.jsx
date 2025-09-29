import { useEffect, useState } from "react";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import SimpleTable from "../../../shared/ui/SimpleTable";
import { listServices, createService, updateService, deleteService } from "../api";

const empty = { nombre: "", descripcion: "", precio: "", activo: true };

export default function ServicesListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(empty);

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(empty);

  const load = async () => {
    try {
      setLoading(true); setErr("");
      const data = await listServices();
      setRows(data);
    } catch {
      setErr("No se pudo cargar la lista de servicios.");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e, setter) => {
    const { name, type, checked, value } = e.target;
    setter((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await createService({ ...form, precio: Number(form.precio || 0) });
      setMsg("Servicio creado.");
      setForm(empty); setShowCreate(false);
      await load();
    } catch (e2) {
      const detail = e2?.response?.data?.detail || Object.values(e2?.response?.data || {})?.[0] || "No se pudo crear.";
      setErr(String(detail));
    }
  };

  const startEdit = (s) => {
    setEditing(s);
    setEditForm({
      nombre: s.nombre || "",
      descripcion: s.descripcion || "",
      precio: s.precio ?? "",
      activo: !!s.activo,
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await updateService(editing.id, { ...editForm, precio: Number(editForm.precio || 0) });
      setMsg("Servicio actualizado.");
      setEditing(null);
      await load();
    } catch (e2) {
      const detail = e2?.response?.data?.detail || Object.values(e2?.response?.data || {})?.[0] || "No se pudo actualizar.";
      setErr(String(detail));
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    setErr(""); setMsg("");
    try {
      await deleteService(id);
      setMsg("Servicio eliminado.");
      await load();
    } catch {
      setErr("No se pudo eliminar.");
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "nombre", header: "Nombre" },
    { key: "descripcion", header: "Descripción" },
    { key: "precio", header: "Precio" },
    { key: "activo", header: "Activo", render: (r) => (r.activo ? "Sí" : "No") },
    {
      key: "actions",
      header: "",
      render: (s) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => startEdit(s)} style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"6px 10px" }}>
            Editar
          </button>
          <button onClick={() => onDelete(s.id)} style={{ border:"1px solid tomato", background:"transparent", color:"tomato", borderRadius:10, padding:"6px 10px" }}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Card title="Servicios">
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            {msg && <span style={{ color:"var(--brand)", fontWeight:700 }}>{msg}</span>}
            {err && <span style={{ color:"tomato", marginLeft:12 }}>{err}</span>}
          </div>
          <button onClick={() => setShowCreate(v=>!v)}
            style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"8px 12px", fontWeight:700 }}>
            {showCreate ? "Cerrar" : "Crear servicio"}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={submitCreate}
            style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(4, minmax(160px,1fr))", background:"rgba(58,31,86,.35)", padding:12, borderRadius:12, border:"1px solid var(--border)", marginBottom:16 }}>
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={(e)=>onChange(e,setForm)} />
            <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={(e)=>onChange(e,setForm)} />
            <label style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="checkbox" name="activo" checked={!!form.activo} onChange={(e)=>onChange(e,setForm)} /> Activo
            </label>
            <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={(e)=>onChange(e,setForm)} style={{ gridColumn:"1 / -1" }} />
            <div style={{ gridColumn:"1 / -1" }}>
              <button type="submit" style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"10px 14px", fontWeight:800 }}>
                Crear
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

      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }}
             onClick={()=>setEditing(null)}>
          <div onClick={(e)=>e.stopPropagation()} style={{ width:"min(720px, 92vw)", background:"var(--panel)", border:"1px solid var(--border)", borderRadius:16, padding:16 }}>
            <h3 style={{ marginTop:0, color:"var(--brand)" }}>Editar servicio #{editing.id}</h3>
            <form onSubmit={submitEdit} style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(4, minmax(160px,1fr))" }}>
              <input name="nombre" value={editForm.nombre} onChange={(e)=>onChange(e,setEditForm)} />
              <input type="number" step="0.01" name="precio" value={editForm.precio} onChange={(e)=>onChange(e,setEditForm)} />
              <label style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input type="checkbox" name="activo" checked={!!editForm.activo} onChange={(e)=>onChange(e,setEditForm)} /> Activo
              </label>
              <input name="descripcion" value={editForm.descripcion} onChange={(e)=>onChange(e,setEditForm)} style={{ gridColumn:"1 / -1" }} />
              <div style={{ gridColumn:"1 / -1", display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button type="button" onClick={()=>setEditing(null)} style={{ border:"1px solid var(--border)", background:"transparent", color:"#e5e7eb", borderRadius:10, padding:"10px 14px" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"10px 14px", fontWeight:800 }}>
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
