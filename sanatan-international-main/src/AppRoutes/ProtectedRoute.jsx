import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";
import LoadingSpinner from "../Components/shared/LoadingSpinner";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
