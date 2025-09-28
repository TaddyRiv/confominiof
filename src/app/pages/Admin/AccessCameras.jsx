import { useEffect, useRef, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

export default function AccessCamera() {
  const videoRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [cameraId, setCameraId] = useState("");
  const [tipo, setTipo] = useState("ENTRADA"); // Valor inicial
  const [status, setStatus] = useState(null); // Para feedback visual

  // Listar cámaras disponibles
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const cams = devices.filter(d => d.kind === "videoinput");
      setDevices(cams);
      if (cams.length > 0) setCameraId(cams[0].deviceId);
    });
  }, []);

  // Inicializar stream de cámara
  const startCamera = (deviceId) => {
    if (!deviceId) return;

    // Cerrar stream anterior
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia({ video: { deviceId } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("❌ Error al iniciar cámara:", err));
  };

  // Reiniciar cámara cuando cambia la selección
  useEffect(() => {
    startCamera(cameraId);
  }, [cameraId]);

  // Captura y envía imagen al backend
  const capturarYEnviar = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];

    fetch(`${API_BASE}/rekognition/verificar-acceso/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foto: base64, tipo, camara_id: 1 }) // camara_id fijo o dinámico
    })
      .then(res => res.json())
      .then(data => {
        console.log(`📡 Respuesta (${tipo}):`, data);
        setStatus(data.mensaje || "Error");
      })
      .catch(err => {
        console.error("Error enviando:", err);
        setStatus("Error al enviar");
      });
  };

  // Captura automática cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      capturarYEnviar();
    }, 10000);
    return () => clearInterval(interval);
  }, [tipo, cameraId]);

  return (
    <div style={{ padding: "20px" }}>
      <h3>📷 Cámara ({tipo})</h3>

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

      <div style={{ marginBottom: "10px" }}>
        <label>Tipo: </label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="ENTRADA">Entrada</option>
          <option value="SALIDA">Salida</option>
        </select>
      </div>

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
    </div>
  );
}
