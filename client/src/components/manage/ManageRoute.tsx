import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

export default function ManageRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;
  if (user?.role !== "manage") return <Navigate to="/dashboards/default" replace />;

  return <>{children}</>;
}
