import { useState, useEffect } from "react";
import { createReserva } from "../api";
import { listAreas, createArea, deleteArea } from "../../areas/api"; // 🔹 nuevo

export default function ReservaCreatePage() {
  const [formData, setFormData] = useState({
    area_comun: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    descripcion: "",
  });

  const [areas, setAreas] = useState([]);
  const [newArea, setNewArea] = useState("");

  // 🔹 cargar áreas al iniciar
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await listAreas();
      setAreas(res);
    } catch (err) {
      console.error("Error cargando áreas", err);
    }
  };

  // 🔹 crear área común
  const handleCreateArea = async (e) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    try {
      await createArea({ nombre: newArea });
      setNewArea("");
      fetchAreas();
    } catch (err) {
      console.error("Error creando área común", err);
    }
  };

  // 🔹 eliminar área común
  const handleDeleteArea = async (id) => {
    if (!window.confirm("¿Eliminar esta área común?")) return;
    try {
      await deleteArea(id);
      fetchAreas();
    } catch (err) {
      console.error("Error eliminando área común", err);
    }
  };

  // 🔹 crear reserva
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReserva(formData);
      alert("Reserva creada con éxito ✅");
      window.location.href = "/admin/reservas";
    } catch (err) {
      console.error("Error creando reserva", err);
      alert("Error al crear la reserva ❌");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Nueva Reserva</h2>

      {/* FORMULARIO RESERVA */}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 500,
          marginTop: 20,
          padding: 20,
          background: "#2a2a40",
          borderRadius: 12,
          color: "white",
        }}
      >
        {/* Área Común (selección) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Área Común
          </label>
          <select
            name="area_comun"
            value={formData.area_comun}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1c1c2b",
              color: "white",
            }}
            required
          >
            <option value="">-- Seleccionar --</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1c1c2b",
              color: "white",
            }}
            required
          />
        </div>

        {/* Hora Inicio */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Hora Inicio
          </label>
          <input
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1c1c2b",
              color: "white",
            }}
            required
          />
        </div>

        {/* Hora Fin */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Hora Fin</label>
          <input
            type="time"
            name="hora_fin"
            value={formData.hora_fin}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1c1c2b",
              color: "white",
            }}
            required
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Ej: Fiesta de cumpleaños"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1c1c2b",
              color: "white",
              minHeight: 80,
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 6,
            background: "#6c5ce7",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Guardar Reserva
        </button>
      </form>

      {/* ÁREAS COMUNES */}
      <div style={{ marginTop: 40 }}>
        <h3>Áreas Comunes</h3>

        {/* Form para nueva área */}
        <form onSubmit={handleCreateArea} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Nueva área común"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1c1c2b",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: 6,
              background: "#00b894",
              color: "white",
              cursor: "pointer",
            }}
          >
            Crear
          </button>
        </form>

        {/* Lista de áreas */}
        <ul style={{ marginTop: 16, padding: 0, listStyle: "none" }}>
          {areas.map((a) => (
            <li
              key={a.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                background: "#2a2a40",
                borderRadius: 6,
                marginBottom: 6,
              }}
            >
              {a.nombre}
              <button
                onClick={() => handleDeleteArea(a.id)}
                style={{
                  background: "#d63031",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 6,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
