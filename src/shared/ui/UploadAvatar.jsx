import { useState, useEffect } from "react";

export default function UploadAvatar({ valueUrl, onFile, label = "Foto" }) {
  const [preview, setPreview] = useState(valueUrl || null);

  useEffect(() => {
    if (!valueUrl) {
      setPreview(null);
    } else if (valueUrl.startsWith("data:image")) {
      // Ya viene listo del backend
      setPreview(valueUrl);
    } else {
      // Si backend devolviera solo el base64 crudo
      setPreview(`data:image/jpeg;base64,${valueUrl}`);
    }
  }, [valueUrl]);

  // Convierte el archivo a base64 y lo pasa al padre
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fullDataUrl = reader.result; // ej: "data:image/jpeg;base64,AAAA..."
      setPreview(fullDataUrl); // para mostrar preview en <img>
      onFile && onFile(fullDataUrl); // ✅ mandamos TODO con el prefijo
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        />
      ) : (
        <div
          style={{
            width: 120,
            height: 120,
            border: "1px dashed #aaa",
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
          }}
        >
          <span>Sin imagen</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFile} />
    </div>
  );
}
