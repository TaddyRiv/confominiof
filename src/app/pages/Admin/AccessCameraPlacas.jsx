import { useEffect, useRef, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "https://3.17.18.25:8000/api";

export default function AccessCameraPlacas() {
  const videoRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [cameraId, setCameraId] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [status, setStatus] = useState(null);
  const [entradas, setEntradas] = useState([]);

  // Listar cámaras
  useEffect(() => {
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const cams = devices.filter(d => d.kind === "videoinput");
      setDevices(cams);
      if (cams.length > 0) setCameraId(cams[0].deviceId);
    }).catch(err => {
      console.error("❌ Error enumerando dispositivos:", err);
    });
  } else {
    console.warn("⚠️ navigator.mediaDevices no está disponible. Usa HTTPS o localhost.");
  }
}, []);


  // Iniciar stream
  const startCamera = (deviceId) => {
    if (!deviceId) return;
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    navigator.mediaDevices.getUserMedia({ video: { deviceId } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("❌ Error al iniciar cámara:", err));
  };

  useEffect(() => {
    startCamera(cameraId);
  }, [cameraId]);

  // Capturar y enviar placa
  const capturarYEnviar = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];

    fetch(`${API_BASE}/rekognition/verificar-placa/`, {
      method: "POST",
      headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // 👈 aquí el token
    },
      body: JSON.stringify({ foto: base64, tipo, camara_id: 2 }) // 👈 camara_id=2 para placas
    })
      .then(res => res.json())
      .then(data => {
        console.log(`📡 Respuesta (${tipo}):`, data);
        setStatus(data.mensaje || "Error");
        fetchEntradas();
      })
      .catch(err => {
        console.error("Error enviando:", err);
        setStatus("Error al enviar");
      });
  };

  // Captura automática cada 10s
  useEffect(() => {
    const interval = setInterval(() => {
      capturarYEnviar();
    }, 10000);
    return () => clearInterval(interval);
  }, [tipo, cameraId]);

  // Cargar historial de accesos vehiculares
  const fetchEntradas = () => {
    fetch(`${API_BASE}/entradas-salidas/`)
      .then(res => res.json())
      .then(data => setEntradas(data))
      .catch(err => console.error("❌ Error cargando accesos:", err));
  };

  useEffect(() => {
    fetchEntradas();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h3>🚗 Cámara Vehículos ({tipo})</h3>

      {/* Selección de cámara */}
      <div style={{ marginBottom: "10px" }}>
        <label>Cámara: </label>
        <select value={cameraId} onChange={e => setCameraId(e.target.value)}>
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Cámara ${d.deviceId}`}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo */}
      <div style={{ marginBottom: "10px" }}>
        <label>Tipo: </label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="ENTRADA">Entrada</option>
          <option value="SALIDA">Salida</option>
        </select>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="320"
        height="240"
        style={{
          border: status === "Acceso permitido" ? "4px solid green" :
            status === "Acceso denegado" ? "4px solid red" :
              "2px solid gray"
        }}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={capturarYEnviar}>📸 Capturar ahora</button>
        {status && <p>Estado: {status}</p>}
      </div>

      {/* Historial */}
      <h3 style={{ marginTop: "20px" }}>📊 Historial de accesos vehiculares</h3>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#1c2833",
        color: "#f1f1f1",
        border: "1px solid #444"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#34495e" }}>
            <th style={{ padding: "8px", border: "1px solid #555" }}>ID</th>
            <th style={{ padding: "8px", border: "1px solid #555" }}>Placa</th>
            <th style={{ padding: "8px", border: "1px solid #555" }}>Apartamento</th>
            <th style={{ padding: "8px", border: "1px solid #555" }}>Fecha</th>
            <th style={{ padding: "8px", border: "1px solid #555" }}>Hora</th>
            <th style={{ padding: "8px", border: "1px solid #555" }}>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {entradas.map((e, idx) => (
            <tr key={e.id} style={{
              backgroundColor: idx % 2 === 0 ? "#2c3e50" : "#1c2833"
            }}>
              <td style={{ padding: "6px", border: "1px solid #444" }}>{e.id}</td>
              <td style={{ padding: "6px", border: "1px solid #444" }}>{e.vehiculo ? e.vehiculo.placa : "N/A"}</td>
              <td style={{ padding: "6px", border: "1px solid #444" }}>{e.vehiculo ? e.vehiculo.apartamento_numero : "Visitante"}</td>
              <td style={{ padding: "6px", border: "1px solid #444" }}>{e.fecha}</td>
              <td style={{ padding: "6px", border: "1px solid #444" }}>{e.hora}</td>
              <td style={{
                padding: "6px",
                border: "1px solid #444",
                color: e.tipo === "ENTRADA" ? "#4caf50" : "#f44336",
                fontWeight: "bold"
              }}>
                {e.tipo}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
