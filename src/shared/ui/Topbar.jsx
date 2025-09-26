export default function Topbar() {
  return (
    <header
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(58,31,86,.6)",
      }}
    >
      <div style={{ fontWeight: 700 }}>Dashboard</div>
      <button
        style={{
          border: "1px solid var(--brand)",
          background: "transparent",
          color: "var(--brand)",
          borderRadius: 10,
          padding: "8px 12px",
          fontWeight: 700,
        }}
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Cerrar sesión
      </button>
    </header>
  );
}
