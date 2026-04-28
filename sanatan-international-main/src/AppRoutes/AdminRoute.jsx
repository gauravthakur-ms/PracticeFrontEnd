import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { ADMIN_ROLES } from "./adminRoles";

export default function AdminRoute() {
  const { user } = useAuth();
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
