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
import AccessCameraPlacas from "./pages/Admin/AccessCameraPlacas";

import ReservaCreatePage from "../features/reservas/pages/create";
import ReservaListPage from "../features/reservas/pages/List";



function RouteError() {
  return <div style={{ padding: 24 }}>Ocurrió un error cargando la ruta.</div>;
}

const router = createBrowserRouter(
  [
    { path: "/", element: <WelcomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/home", element: <HomePage /> },

    // ✅ ahora accesibles por ADMIN y EMPLEADO
    { path: "/admin/services", element: (<RequireRole roles={["ADMIN", "EMPLEADO"]}><ServicesListPage /></RequireRole>) },
    { path: "/admin/charges", element: (<RequireRole roles={["ADMIN", "EMPLEADO"]}><ChargesListPage /></RequireRole>) },

    // pagos → RESIDENTE mantiene el suyo
    { path: "/admin/payments/new", element: (<RequireRole roles={["RESIDENTE"]}><PaymentCreatePage /></RequireRole>) },

    // pagos → ADMIN y EMPLEADO pueden crear/ver
    { path: "/admin/payments/new", element: (<RequireRole roles={["ADMIN", "EMPLEADO"]}><PaymentCreatePage /></RequireRole>) },
    { path: "/admin/payments", element: (<RequireRole roles={["ADMIN", "EMPLEADO"]}><PaymentsListPage /></RequireRole>) },

    { path: "/admin/vehicles", element: (<RequireRole roles={["ADMIN", "EMPLEADO"]}><VehiclesPage /></RequireRole>) },
    { path: "/admin/camaras", element: (<RequireRole roles={["ADMIN", "EMPLEADO"]}><AccessCameras /></RequireRole>) },
    { path: "/admin/camaras-placas", element: (<RequireRole roles={["ADMIN", "EMPLEADO"]}><AccessCameraPlacas /></RequireRole>) },
    {
      path: "/admin/reservas",
      element: (
        <RequireRole roles={["ADMIN", "EMPLEADO", "RESIDENTE"]}>
          <ReservaListPage />
        </RequireRole>
      ),
    },
    {
      path: "/admin/reservas/new",
      element: (
        <RequireRole roles={["ADMIN", "EMPLEADO", "RESIDENTE"]}>
          <ReservaCreatePage />
        </RequireRole>
      ),
    },
    {
      path: "/admin",
      element: (
        <RequireRole roles={["ADMIN", "EMPLEADO"]}>
          <AdminDashboard />
        </RequireRole>
      ),
    },

    {
      path: "/admin/users",
      element: (
        <RequireRole roles={["ADMIN", "EMPLEADO"]}>
          <UsersPage />
        </RequireRole>
      ),
    },

    {
      path: "/admin/apartments",
      element: (
        <RequireRole roles={["ADMIN", "EMPLEADO"]}>
          <ApartmentsPage />
        </RequireRole>
      ),
    },

    // ✅ Rutas reales de Visitas
    {
      path: "/admin/visits",
      element: (
        <RequireRole roles={["ADMIN", "EMPLEADO"]}>
          <VisitsListPage />
        </RequireRole>
      ),
    },
    {
      path: "/admin/visits/new",
      element: (
        <RequireRole roles={["ADMIN", "EMPLEADO"]}>
          <CreateVisitPage />
        </RequireRole>
      ),
    },

    {
  path: "/admin/payments",
  element: (
    <RequireRole roles={["admin", "empleado"]}>
      <PaymentsListPage />
    </RequireRole>
  ),
},
{
  path: "/admin/payments/new",
  element: (
    <RequireRole roles={["admin", "empleado"]}>
      <PaymentCreatePage />
    </RequireRole>
  ),
},
{
    path: "/admin/payments",
    element: (
      <RequireRole roles={["admin", "empleado"]}>
        <PaymentsListPage />
      </RequireRole>
    ),
  },
  {
    path: "/admin/payments/create",   // 👈 esta ruta debe existir
    element: (
      <RequireRole roles={["admin", "empleado"]}>
        <PaymentCreatePage />
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
