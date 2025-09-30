import { useEffect, useState } from "react";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import SimpleTable from "../../../shared/ui/SimpleTable";
import UploadAvatar from "../../../shared/ui/UploadAvatar";
import { listUsers, createUser, updateUser, deleteUser } from "../api";

const API_BASE = process.env.REACT_APP_API_BASE || "https://3.17.18.25/api";

const normalizeFoto = (foto) => {
  if (!foto) return null;
  if (foto.startsWith("data:image")) return foto;
  return `data:image/jpeg;base64,${foto}`;
};

// Helper para convertir archivo a base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1]; // 👈 quita el prefijo
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

const empty = {
  email: "", username: "", ci: "", rol: "RESIDENTE",
  nombre: "", telefono: "", fecha_nacimiento: "", password: ""
};

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // Crear
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(empty);
  const [createFotoFile, setCreateFotoFile] = useState(null);

  // Editar
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(empty);
  const [editFotoFile, setEditFotoFile] = useState(null);

  const load = async () => {
    try {
      setLoading(true); setErr("");
      const users = await listUsers();
      setRows(users);
    } catch {
      setErr("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const columns = [
    { key: "id", header: "ID" },
    {
      key: "foto",
      header: "Foto",
      render: (u) =>
        u.foto ? (
          <img
            src={normalizeFoto(u.foto)}
            alt="avatar"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span style={{ opacity: 0.6 }}>—</span>
        ),
    },

    { key: "username", header: "Usuario" },
    { key: "nombre", header: "Nombre" },
    { key: "rol", header: "Rol" },
    { key: "email", header: "Email" },
    { key: "telefono", header: "Teléfono" },
    { key: "ci", header: "CI" },
    { key: "fecha_nacimiento", header: "Nacimiento" },
    {
      key: "actions", header: "", render: (u) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => startEdit(u)}
            style={{ border: "1px solid var(--brand)", background: "transparent", color: "var(--brand)", borderRadius: 10, padding: "6px 10px" }}
          >Editar</button>
          <button
            onClick={() => onDelete(u.id)}
            style={{ border: "1px solid tomato", background: "transparent", color: "tomato", borderRadius: 10, padding: "6px 10px" }}
          >Eliminar</button>
        </div>
      )
    },
  ];

  /* ---------- crear ---------- */
  const onChangeCreate = (e) => setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  const submitCreate = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      if (!createForm.username || !createForm.password) {
        setErr("Usuario y contraseña son obligatorios.");
        return;
      }

      let payload = { ...createForm };

      if (createFotoFile) {
        payload.foto = createFotoFile;
      }

      await createUser(payload);   // 👈 ignoramos la respuesta
      await load();                // 👈 recargamos lista completa

      setMsg("Usuario creado correctamente.");
      setCreateForm(empty);
      setCreateFotoFile(null);
      setShowCreate(false);
    } catch (e2) {
      console.error("Error en submitCreate", e2);
      const detail =
        e2?.response?.data?.detail ||
        Object.values(e2?.response?.data || {})?.[0] ||
        "No se pudo crear el usuario.";
      setErr(String(detail));
    }
  };

  /* ---------- editar ---------- */
  function startEdit(u) {
    setEditing(u);
    setEditForm({
      email: u.email || "",
      username: u.username || "",
      ci: u.ci || "",
      rol: u.rol || "RESIDENTE",
      nombre: u.nombre || "",
      telefono: u.telefono || "",
      fecha_nacimiento: u.fecha_nacimiento || "",
      password: "",
      foto: u.foto || null,
    });
    setEditFotoFile(null);
  }
  const onChangeEdit = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const submitEdit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      let payload = { ...editForm };
      if (!payload.password) delete payload.password;

      if (editFotoFile) {
        payload.foto = editFotoFile; // ya base64 completo
      } else if (editForm.foto === null) {
        payload.foto = null;
      }

      console.log("PATCH payload:", payload); // debug
      await updateUser(editing.id, payload);

      setMsg("Usuario actualizado.");
      setEditing(null);
      await load();
    } catch (e2) {
      console.error("Error en submitEdit", e2);
      const detail =
        e2?.response?.data?.detail ||
        Object.values(e2?.response?.data || {})?.[0] ||
        "No se pudo actualizar.";
      setErr(String(detail));
    }
  };

  /* ---------- eliminar ---------- */
  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    setErr(""); setMsg("");
    try {
      await deleteUser(id);
      setMsg("Usuario eliminado.");
      await load();
    } catch (e2) {
      const detail = e2?.response?.data?.detail || "No se pudo eliminar.";
      setErr(String(detail));
    }
  };

  return (
    <AdminLayout>
      <Card title="Usuarios">
        {/* barra superior */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            {msg && <span style={{ color: "var(--brand)", fontWeight: 700 }}>{msg}</span>}
            {err && <span style={{ color: "tomato", marginLeft: 12 }}>{err}</span>}
          </div>
          <button
            onClick={() => setShowCreate((v) => !v)}
            style={{ border: "1px solid var(--brand)", background: "transparent", color: "var(--brand)", borderRadius: 10, padding: "8px 12px", fontWeight: 700 }}
          >
            {showCreate ? "Cerrar" : "Crear usuario"}
          </button>
        </div>

        {/* formulario crear */}
        {showCreate && (
          <form
            onSubmit={submitCreate}
            style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(3, minmax(180px,1fr))", background: "rgba(58,31,86,.35)", padding: 12, borderRadius: 12, border: "1px solid var(--border)", marginBottom: 16 }}
          >
            {/* ✅ Uploader de foto */}
            <div style={{ gridColumn: "1 / -1" }}>
              <UploadAvatar onFile={setCreateFotoFile} />
            </div>

            <input name="username" placeholder="Usuario" value={createForm.username} onChange={onChangeCreate} />
            <input name="email" placeholder="Email" value={createForm.email} onChange={onChangeCreate} />
            <input name="ci" placeholder="CI" value={createForm.ci} onChange={onChangeCreate} />
            <select name="rol" value={createForm.rol} onChange={onChangeCreate}>
              <option value="RESIDENTE">Residente</option>
              <option value="DUEÑO">Propietario</option>
              <option value="EMPLEADO">Empleado</option>
              <option value="ADMIN">Admin</option>
            </select>
            <input name="nombre" placeholder="Nombre completo" value={createForm.nombre} onChange={onChangeCreate} />
            <input name="telefono" placeholder="Teléfono" value={createForm.telefono} onChange={onChangeCreate} />
            <input type="date" name="fecha_nacimiento" value={createForm.fecha_nacimiento} onChange={onChangeCreate} />
            <input type="password" name="password" placeholder="Contraseña" value={createForm.password} onChange={onChangeCreate} />
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" style={{ border: "1px solid var(--brand)", background: "transparent", color: "var(--brand)", borderRadius: 10, padding: "10px 14px", fontWeight: 800 }}>
                Crear
              </button>
            </div>
          </form>
        )}

        {/* tabla */}
        {loading ? (
          <div>Cargando…</div>
        ) : (
          <div style={{ overflow: "auto", borderRadius: 12 }}>
            <SimpleTable columns={columns} rows={rows} keyField="id" />
          </div>
        )}
      </Card>

      {/* Modal edición */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(900px, 92vw)",
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <h3 style={{ marginTop: 0, color: "var(--brand)" }}>
              Editar usuario #{editing.id}
            </h3>

            <form
              onSubmit={submitEdit} // 👈 aquí ya apunta bien
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(3, minmax(180px,1fr))",
              }}
            >
              {/* Uploader con preview */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-end",
                }}
              >
                <UploadAvatar
                  valueUrl={editing?.foto ? editing.foto : null}
                  onFile={setEditFotoFile}
                />
                {editing?.foto && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditFotoFile(null);
                      setEditForm((f) => ({ ...f, foto: null }));
                    }}
                    style={{
                      border: "1px solid tomato",
                      background: "transparent",
                      color: "tomato",
                      borderRadius: 10,
                      padding: "6px 10px",
                      height: 38,
                    }}
                  >
                    Quitar foto
                  </button>
                )}
              </div>

              <input
                name="username"
                placeholder="Usuario"
                value={editForm.username}
                onChange={onChangeEdit}
              />
              <input
                name="email"
                placeholder="Email"
                value={editForm.email}
                onChange={onChangeEdit}
              />
              <input
                name="ci"
                placeholder="CI"
                value={editForm.ci}
                onChange={onChangeEdit}
              />
              <select name="rol" value={editForm.rol} onChange={onChangeEdit}>
                <option value="RESIDENTE">Residente</option>
                <option value="DUEÑO">Propietario</option>
                <option value="EMPLEADO">Empleado</option>
                <option value="ADMIN">Admin</option>
              </select>
              <input
                name="nombre"
                placeholder="Nombre completo"
                value={editForm.nombre}
                onChange={onChangeEdit}
              />
              <input
                name="telefono"
                placeholder="Teléfono"
                value={editForm.telefono}
                onChange={onChangeEdit}
              />
              <input
                type="date"
                name="fecha_nacimiento"
                value={editForm.fecha_nacimiento || ""}
                onChange={onChangeEdit}
              />
              <input
                type="password"
                name="password"
                placeholder="(Opcional) Nueva contraseña"
                value={editForm.password}
                onChange={onChangeEdit}
              />

              {/* botones */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  style={{
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "#e5e7eb",
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit" // 👈 importante: submit
                  style={{
                    border: "1px solid var(--brand)",
                    background: "transparent",
                    color: "var(--brand)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontWeight: 800,
                  }}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
