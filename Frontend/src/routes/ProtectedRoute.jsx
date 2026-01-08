import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  console.log("ProtectedRoute check:", { path: location.pathname, token });

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
}
