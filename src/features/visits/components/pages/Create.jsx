import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisitForm from "../components/VisitForm";
import { registrarVisita } from "../api";

export default function CreateVisitPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      // Si tu backend no tiene /registrar/, pasa false para usar POST /visitas/
      await registrarVisita(payload, true);
      navigate("/admin/visits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Registrar visita</h1>
      <VisitForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
}
