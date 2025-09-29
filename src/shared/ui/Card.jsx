export default function Card({ title, children, footer }){
  return (
    <section style={{
      background: "var(--panel)", border: "1px solid var(--border)",
      borderRadius: 16, padding: 16
    }}>
      {title && <h3 style={{ margin: 0, marginBottom: 8, color: "var(--brand)" }}>{title}</h3>}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>{footer}</div>}
    </section>
  );
}
