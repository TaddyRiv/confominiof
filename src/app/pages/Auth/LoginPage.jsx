import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../../features/auth/api";
import axios from "axios";

// Roles que tienen acceso al dashboard
const DASHBOARD_ROLES = [
  "ADMIN",
  "ADMINISTRADOR",
  "ADMINISTRATOR",
  "EMPLEADO",
];

function decodeRoleFromJWT() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.rol ?? payload?.roles ?? null;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ identity: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1) login → tokens
      const data = await login(form);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // 2) perfil (si falla, igual intentamos leer rol del token)
      let me = null;
      try {
        const meResp = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/me/`,
          { headers: { Authorization: `Bearer ${data.access}` } }
        );
        me = meResp.data;
      } catch {
        // no pasa nada, intentaremos con el token
      }

      // 3) rol: prioriza /me, sino token
      let role =
        (me?.rol ?? me?.roles ?? decodeRoleFromJWT() ?? "")
          .toString()
          .toUpperCase();

      console.log("ROL DETECTADO:", role);

      // guardamos 'me' para los guards
      if (!me) me = { rol: role };
      localStorage.setItem("me", JSON.stringify(me));

      // 4) redirección por rol
      if (DASHBOARD_ROLES.includes(role)) {
        nav("/admin");
      } else {
        nav("/home");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail || "Credenciales inválidas.";
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "64px auto" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="identity"
          placeholder="Usuario o correo"
          value={form.identity}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={onChange}
        />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: "tomato" }}>{error}</p>}
      </form>
      <p style={{ marginTop: 8 }}>
        ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </div>
  );
}
