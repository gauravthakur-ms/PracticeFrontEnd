import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function GuestRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}
