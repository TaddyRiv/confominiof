import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const UsersList = lazy(() => import("../../features/users/pages/List.jsx"));
const ApartmentsList = lazy(() => import("../../features/apartments/pages/List.jsx"));
const AdminDashboard = lazy(() => import("./Dashboard.jsx"));

export default function AdminRoutes() {
  return {
    path: "/admin",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <UsersList /> },
      { path: "apartments", element: <ApartmentsList /> },
    ],
  };
}