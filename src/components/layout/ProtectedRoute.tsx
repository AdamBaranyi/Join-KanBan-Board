import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../lib/session";

/** Lässt nur eingeloggte Nutzer (inkl. Gast) durch, sonst zurück zum Login. */
export default function ProtectedRoute() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
}
