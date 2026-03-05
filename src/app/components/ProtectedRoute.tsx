import { useEffect } from "react";
import { useNavigate } from "react-router";
import { isAuthenticated } from "../../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
