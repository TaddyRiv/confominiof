// src/shared/auth/RequireRole.jsx
import { Navigate } from "react-router-dom";

function readRole() {
  try {
    const me = JSON.parse(localStorage.getItem("me"));
    if (me?.rol) return String(me.rol).toUpperCase();
    if (me?.roles) return String(me.roles).toUpperCase(); // 👈 aquí
  } catch {}

  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload?.rol) return String(payload.rol).toUpperCase();
    if (payload?.roles) return String(payload.roles).toUpperCase(); // 👈 aquí
  } catch {}

  return null;
}

export default function RequireRole({ roles = [], children }) {
  const currentRole = readRole();
  console.log("ROL DETECTADO EN REQUIRE:", currentRole); // 👈 depuración

  if (!currentRole) return <Navigate to="/login" replace />;

  const allowedRoles = Array.isArray(roles)
    ? roles.map((r) => r.toUpperCase())
    : [String(roles).toUpperCase()];

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
