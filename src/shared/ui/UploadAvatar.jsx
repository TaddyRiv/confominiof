import { useState, useEffect } from "react";

export default function UploadAvatar({ valueUrl, onFile, label = "Foto" }) {
  const [preview, setPreview] = useState(valueUrl || null);

  useEffect(() => { setPreview(valueUrl || null); }, [valueUrl]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFile && onFile(file);
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12, border: "1px solid #ddd" }}
        />
      ) : (
        <div style={{ width: 120, height: 120, border: "1px dashed #aaa", borderRadius: 12, display: "grid", placeItems: "center" }}>
          <span>Sin imagen</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFile} />
    </div>
  );
}
