// src/app/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WelcomePage from "./pages/Welcome/Page";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/Home/Page";
import AdminDashboard from "./pages/Admin/Dashboard";

import RequireRole from "../shared/auth/RequireRole";

import UsersPage from "../features/users/pages/List";
import ApartmentsPage from "../features/apartments/pages/List";

import VisitsListPage from "../features/visits/pages/List";
import CreateVisitPage from "../features/visits/pages/Create";

import ServicesListPage from "../features/services/pages/List";
import ChargesListPage from "../features/charges/pages/List";
import PaymentCreatePage from "../features/payments/pages/Create";
import PaymentsListPage from "../features/payments/pages/List";
import VehiclesPage from "../features/vehicles/pages/List";
import AccessCameras from "./pages/Admin/AccessCameras";
function RouteError() {
  return <div style={{ padding: 24 }}>Ocurrió un error cargando la ruta.</div>;
}

const router = createBrowserRouter(
  [
    { path: "/", element: <WelcomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/home", element: <HomePage /> },
    { path: "/admin/services", element: (<RequireRole role="ADMIN"><ServicesListPage /></RequireRole>) },
    { path: "/admin/charges",  element: (<RequireRole role="ADMIN"><ChargesListPage /></RequireRole>) },
    { path: "/admin/payments/new", element: (<RequireRole role="RESIDENTE"><PaymentCreatePage /></RequireRole>) },
    { path: "/admin/payments/new", element: (<RequireRole role="RESIDENTE"><PaymentCreatePage /></RequireRole>) },
    { path: "/admin/payments/new", element: (<RequireRole role="ADMIN"><PaymentCreatePage /></RequireRole>) },
    { path: "/admin/payments", element: (<RequireRole role="ADMIN"><PaymentsListPage /></RequireRole>) },
    { path: "/admin/vehicles", element: (<RequireRole role="ADMIN"><VehiclesPage /></RequireRole>) },
    { path: "/admin/camaras", element: (<RequireRole role="ADMIN"><AccessCameras /></RequireRole>) },
    {
      path: "/admin",
      element: (
        <RequireRole role="ADMIN">
          <AdminDashboard />
        </RequireRole>
      ),
    },

    {
      path: "/admin/users",
      element: (
        <RequireRole role="ADMIN">
          <UsersPage />
        </RequireRole>
      ),
    },

    {
      path: "/admin/apartments",
      element: (
        <RequireRole role="ADMIN">
          <ApartmentsPage />
        </RequireRole>
      ),
    },

    // ✅ Rutas reales de Visitas
    {
      path: "/admin/visits",
      element: (
        <RequireRole role="ADMIN">
          <VisitsListPage />
        </RequireRole>
      ),
    },
    {
      path: "/admin/visits/new",
      element: (
        <RequireRole role="ADMIN">
          <CreateVisitPage />
        </RequireRole>
      ),
    },

    // catch-all
    { path: "*", element: <div style={{ padding: 24 }}>Ruta no encontrada.</div> },
  ],
  { basename: "/" }
);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<RouteError />} />;
}
