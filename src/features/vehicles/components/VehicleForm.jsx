import { useEffect, useState } from "react";
import { createVehicle, listVehicles } from "../api";
import { listApartments } from "../../apartments/api"; // 👈 asumiendo que ya tienes este endpoint

export default function VehicleForm({ onSaved }) {
  const [form, setForm] = useState({
    placa: "",
    descripcion: "",
    apartamento: "",
    pase_conocido: false,
  });
  const [apartamentos, setApartamentos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAptos() {
      try {
        const data = await listApartments(); // 👈 debe traer {id, numero}
        setApartamentos(data);
      } catch (err) {
        console.error("Error cargando apartamentos:", err);
      }
    }
    fetchAptos();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        placa: form.placa,
        descripcion: form.descripcion,
        apartamento: form.apartamento || null, // 👈 id del apartamento
        pase_conocido: form.pase_conocido,
      };
      await createVehicle(payload);
      setForm({ placa: "", descripcion: "", apartamento: "", pase_conocido: false });
      if (onSaved) onSaved(); // refresca lista de vehículos
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <input
        name="placa"
        placeholder="Placa"
        value={form.placa}
        onChange={onChange}
      />
      <input
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={onChange}
      />

      <select
        name="apartamento"
        value={form.apartamento}
        onChange={onChange}
      >
        <option value="">Visitante</option>
        {apartamentos.map((a) => (
          <option key={a.id} value={a.id}>
            {a.numero}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          name="pase_conocido"
          checked={form.pase_conocido}
          onChange={onChange}
        />
        Pase conocido (requiere apartamento)
      </label>

      <button type="submit">Guardar</button>
      {error && <p style={{ color: "tomato" }}>{error}</p>}
    </form>
  );
}
