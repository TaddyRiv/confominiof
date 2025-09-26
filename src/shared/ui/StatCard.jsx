export default function StatCard({ title, value, hint }){
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(250,204,21,.25), rgba(250,204,21,.1))",
      border: "1px solid rgba(250,204,21,.5)",
      color: "#111", borderRadius: 16, padding: 16, minHeight: 100
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#3b2b09", opacity:.9 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#1f1505" }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: "#3b2b09" }}>{hint}</div>}
    </div>
  );
}
