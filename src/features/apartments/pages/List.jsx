import { useEffect, useState } from "react";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import SimpleTable from "../../../shared/ui/SimpleTable";
import { listApartments, createApartment, updateApartment, deleteApartment } from "../api";
import { assignResidence } from "../../residences/api";
import { assignProperty } from "../../properties/api";

const empty = { numero: "", bloque: "", estado: "LIBRE" };

export default function ApartmentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);    // id o null
  const [form, setForm] = useState(empty);

  // mini-form para asignaciones
  const [showAssign, setShowAssign] = useState(false);
  const [assignType, setAssignType] = useState("residencia"); // "residencia" | "propiedad"
  const [assign, setAssign] = useState({ usuario_id: "", apartamento_id: "", fecha_inicio: "", fecha_fin: "", vive: false });

  const load = async () => {
    try {
      setLoading(true); setErr("");
      const data = await listApartments();
      setRows(data);
    } catch (e) {
      setErr("No se pudo cargar la lista de apartamentos.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onChangeAssign = (e) => {
    const { name, value, type, checked } = e.target;
    setAssign({ ...assign, [name]: type === "checkbox" ? checked : value });
  };

  const startCreate = () => {
    setForm(empty); setEditing(null); setShowForm(true); setMsg(""); setErr("");
  };

  const startEdit = (r) => {
    setForm({
      numero: r.numero ?? "",
      bloque: r.bloque ?? "",
      estado: r.estado ?? "LIBRE",
    });
    setEditing(r.id);
    setShowForm(true);
    setMsg(""); setErr("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.numero?.trim()) {
        setErr("El número es obligatorio.");
        return;
      }
      if (editing) {
        await updateApartment(editing, form);
        setMsg("Apartamento actualizado.");
      } else {
        await createApartment(form);
        setMsg("Apartamento creado.");
      }
      setShowForm(false);
      await load();
    } catch (e2) {
      setErr("No se pudo guardar el apartamento.");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este apartamento?")) return;
    try {
      await deleteApartment(id);
      setMsg("Apartamento eliminado.");
      await load();
    } catch {
      setErr("No se pudo eliminar.");
    }
  };

  const openAssign = (apto) => {
    setAssign({
      usuario_id: "",
      apartamento_id: apto.id,
      fecha_inicio: "",
      fecha_fin: "",
      vive: false,
    });
    setAssignType("residencia");
    setShowAssign(true);
  };

  const submitAssign = async (e) => {
    e.preventDefault();
    try {
      if (!assign.usuario_id || !assign.apartamento_id) {
        setErr("Completa usuario y apartamento.");
        return;
      }
      if (assignType === "residencia") {
        await assignResidence({
          usuario_id: Number(assign.usuario_id),
          apartamento_id: Number(assign.apartamento_id),
          fecha_inicio: assign.fecha_inicio || undefined,
        });
        setMsg("Residencia asignada.");
      } else {
        await assignProperty({
          usuario_id: Number(assign.usuario_id),
          apartamento_id: Number(assign.apartamento_id),
          fecha_inicio: assign.fecha_inicio || undefined,
          fecha_fin: assign.fecha_fin || undefined,
          vive: !!assign.vive,
        });
        setMsg("Propiedad asignada.");
      }
      setShowAssign(false);
      await load();
    } catch (e2) {
      setErr("No se pudo asignar. Revisa reglas (activos/solapes).");
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "numero", header: "Número" },
    { key: "bloque", header: "Bloque" },
    { key: "estado", header: "Estado" },
    { key: "actions", header: "", render: (r) => (
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => startEdit(r)} style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"6px 10px" }}>Editar</button>
          <button onClick={() => onDelete(r.id)} style={{ border:"1px solid tomato", background:"transparent", color:"tomato", borderRadius:10, padding:"6px 10px" }}>Eliminar</button>
          <button onClick={() => openAssign(r)} style={{ border:"1px solid #fbbf24", background:"transparent", color:"#fbbf24", borderRadius:10, padding:"6px 10px" }}>Asignar</button>
        </div>
      )
    },
  ];

  return (
    <AdminLayout>
      <Card title="Apartamentos">
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            {msg && <span style={{ color:"var(--brand)", fontWeight:700 }}>{msg}</span>}
            {err && <span style={{ color:"tomato", marginLeft:12 }}>{err}</span>}
          </div>
          <button onClick={startCreate}
            style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"8px 12px", fontWeight:700 }}>
            Nuevo apartamento
          </button>
        </div>

        {/* Form Apto */}
        {showForm && (
          <form onSubmit={onSubmit}
            style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(4, minmax(160px, 1fr))", background:"rgba(58,31,86,.35)", padding:12, borderRadius:12, border:"1px solid var(--border)", marginBottom:16 }}>
            <input name="numero" placeholder="Número" value={form.numero} onChange={onChange} />
            <input name="bloque" placeholder="Bloque" value={form.bloque} onChange={onChange} />
            <select name="estado" value={form.estado} onChange={onChange}>
              <option value="LIBRE">LIBRE</option>
              <option value="OCUPADO">OCUPADO</option>
            </select>
            <div style={{ gridColumn:"1 / -1" }}>
              <button type="submit" style={{ border:"1px solid var(--brand)", background:"transparent", color:"var(--brand)", borderRadius:10, padding:"10px 14px", fontWeight:800 }}>
                {editing ? "Guardar cambios" : "Crear"}
              </button>
            </div>
          </form>
        )}

        {/* Form Asignación */}
        {showAssign && (
          <form onSubmit={submitAssign}
            style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(4, minmax(160px, 1fr))", background:"rgba(58,31,86,.35)", padding:12, borderRadius:12, border:"1px solid var(--border)", marginBottom:16 }}>
            <select name="assignType" value={assignType} onChange={(e)=>setAssignType(e.target.value)}>
              <option value="residencia">Residencia</option>
              <option value="propiedad">Propiedad</option>
            </select>
            <input name="usuario_id" placeholder="Usuario ID" value={assign.usuario_id} onChange={onChangeAssign} />
            <input name="apartamento_id" placeholder="Apartamento ID" value={assign.apartamento_id} onChange={onChangeAssign} />
            <input type="date" name="fecha_inicio" value={assign.fecha_inicio} onChange={onChangeAssign} />
            {assignType === "propiedad" && (
              <>
                <input type="date" name="fecha_fin" value={assign.fecha_fin} onChange={onChangeAssign} />
                <label style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <input type="checkbox" name="vive" checked={assign.vive} onChange={onChangeAssign} /> Vive
                </label>
              </>
            )}
            <div style={{ gridColumn:"1 / -1" }}>
              <button type="submit" style={{ border:"1px solid #fbbf24", background:"transparent", color:"#fbbf24", borderRadius:10, padding:"10px 14px", fontWeight:800 }}>
                Asignar {assignType}
              </button>
              <button type="button" onClick={()=>setShowAssign(false)} style={{ marginLeft:8, border:"1px solid var(--border)", background:"transparent", color:"#e5e7eb", borderRadius:10, padding:"10px 14px" }}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Tabla */}
        {loading ? <div>Cargando…</div> : (
          <div style={{ overflow:"auto", borderRadius:12 }}>
            <SimpleTable columns={columns} rows={rows} keyField="id" />
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
