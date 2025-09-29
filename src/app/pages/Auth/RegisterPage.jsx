import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Registro</h2>
      {/* Aquí luego pondremos el formulario real */}
      <p>Formulario de registro (pendiente)</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/home">Ir al Home</Link> · <Link to="/">Volver</Link>
      </div>
    </div>
  );
}
