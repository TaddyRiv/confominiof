const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

function authHeaders() {
  const token = localStorage.getItem("access_token"); 
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function listVehicles({ apartamento, placa, residentes } = {}) {
  const params = new URLSearchParams();
  if (apartamento) params.append("apartamento", apartamento);
  if (placa) params.append("placa", placa);
  if (residentes !== undefined) params.append("residentes", residentes ? "true" : "false");

  const res = await fetch(`${API_BASE}/vehiculos/?${params.toString()}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error listVehicles: ${res.status}`);
  return res.json();
}

export async function getByPlate(placa) {
  const res = await fetch(`${API_BASE}/vehiculos/por-placa/?placa=${encodeURIComponent(placa)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`No encontrado (${res.status})`);
  return res.json();
}

export async function createVehicle(data) {
  const payload = {
    placa: data.placa,
    descripcion: data.descripcion || null,
    apartamento: data.apartamento ? Number(data.apartamento) : null,
    pase_conocido: !!data.pase_conocido,
  };

  console.log("🚀 createVehicle payload", payload);

  const res = await fetch(`${API_BASE}/vehiculos/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const text = await res.text(); // leemos respuesta cruda
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { detail: text }; // si no es JSON
  }

  if (!res.ok) {
    console.error("❌ Backend error:", json);
    throw new Error(
      json.detail || JSON.stringify(json) || "Error creando vehículo"
    );
  }

  return json;
}


export async function updateVehicle(id, data) {
  const payload = {
    placa: data.placa,
    descripcion: data.descripcion || null,
    apartamento: data.apartamento ? Number(data.apartamento) : null,
    pase_conocido: !!data.pase_conocido,
  };

  const res = await fetch(`${API_BASE}/vehiculos/${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error actualizando vehículo");
  }
  return res.json();
}

export async function deleteVehicle(id) {
  const res = await fetch(`${API_BASE}/vehiculos/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error eliminando vehículo (${res.status})`);
  return true;
}
