// src/shared/auth/RequireRole.jsx
import { Navigate } from "react-router-dom";

function readRole() {
  // 1) intento con 'me'
  try {
    const me = JSON.parse(localStorage.getItem("me"));
    if (me?.rol) return String(me.rol).toUpperCase();
  } catch {}

  // 2) intento con el token
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload?.rol) return String(payload.rol).toUpperCase();
  } catch {}

  return null;
}

export default function RequireRole({ role, children }) {
  const currentRole = readRole();
  if (!currentRole) return <Navigate to="/login" replace />;
  if (currentRole !== String(role).toUpperCase()) return <Navigate to="/home" replace />;
  return children;
}
