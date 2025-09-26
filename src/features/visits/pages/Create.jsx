// src/features/visits/pages/Create.jsx
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../app/pages/Admin/Layout";
import Card from "../../../shared/ui/Card";
import VisitForm from "../components/VisitForm";

export default function CreateVisitPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/admin/visits");
  };

  return (
    <AdminLayout>
      <Card title="Registrar visita">
        <VisitForm onSuccess={handleSuccess} />
      </Card>
    </AdminLayout>
  );
}
