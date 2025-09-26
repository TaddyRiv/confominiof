import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      background: "#0f172a",
      color: "#e2e8f0",
      padding: "2rem"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 560,
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: 16,
        padding: "2rem",
        boxShadow: "0 10px 30px rgba(0,0,0,.35)"
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Smart Condominium</h1>
        <p style={{ opacity: .8, marginTop: 8 }}>
          Bienvenido. Gestione usuarios, apartamentos, visitas, reservas y pagos.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <Link
            to="/login"
            style={{ flex: 1, textAlign: "center", padding: 12, borderRadius: 10,
                     textDecoration: "none", background: "#2563eb", color: "#fff",
                     fontWeight: 600 }}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            style={{ flex: 1, textAlign: "center", padding: 12, borderRadius: 10,
                     textDecoration: "none", background: "#374151", color: "#fff",
                     fontWeight: 600 }}
          >
            Registrarme
          </Link>
        </div>
      </div>
    </div>
  );
}
