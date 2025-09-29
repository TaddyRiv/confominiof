import { NavLink } from "react-router-dom";

const Item = ({ to, label }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: "block",
      padding: "10px 12px",
      borderRadius: 10,
      fontWeight: 600,
      background: isActive ? "rgba(250, 204, 21, .15)" : "transparent",
      color: isActive ? "var(--brand)" : "#e5e7eb",
    })}
  >
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        padding: 16,
        gap: 10,
        display: "grid",
        borderRight: "1px solid var(--border)",
        background: "rgba(58,31,86,.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ padding: 8, marginBottom: 6 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--brand)" }}>
          Smart Condominio
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Panel de control</div>
      </div>

      <Item to="/admin" label="Dashboard" />
      <Item to="/admin/users" label="Usuarios" />
      <Item to="/admin/apartments" label="Apartamentos" />
      <Item to="/admin/visits" label="Visitas" />
      <Item to="/admin/reservas" label="Reservas" />
      <Item to="/admin/payments" label="Pagos" />
      <Item to="/admin/services" label="Servicios" />
      <Item to="/admin/charges" label="Cargos" />
      <Item to="/admin/vehicles" label="Vehículos" />
      <Item to="/admin/camaras" label="Cámaras" />
      <Item to="/admin/camaras-placas" label="Cámaras - Placas" />
      <Item to="/admin/avisos" label="Avisos" />
      
      
      
    </aside>
  );
}
