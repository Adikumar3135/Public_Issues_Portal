import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated, authReady } = useAuth();
  const location = useLocation();
  if (!authReady) return <div className="grid min-h-screen place-items-center text-aubergine">Checking session…</div>;
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location }} />;
  if (!user || (allowedRoles.length && !allowedRoles.includes(user.role))) return <Navigate to="/home" replace />;
  return children || <Outlet />;
}
