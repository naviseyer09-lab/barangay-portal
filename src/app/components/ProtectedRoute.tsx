import { useEffect } from "react";
import { useNavigate } from "react-router";
import { isAuthenticated, getUserType } from "../../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'admin' | 'resident';
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect based on required user type
      if (requiredUserType === 'admin') {
        navigate("/admin/login", { replace: true });
      } else if (requiredUserType === 'resident') {
        navigate("/resident/login", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      return;
    }

    // Check if user has the required type
    if (requiredUserType) {
      const userType = getUserType();
      if (userType !== requiredUserType) {
        // Wrong user type, redirect to appropriate login
        if (requiredUserType === 'admin') {
          navigate("/admin/login", { replace: true });
        } else if (requiredUserType === 'resident') {
          navigate("/resident/login", { replace: true });
        }
      }
    }
  }, [navigate, requiredUserType]);

  if (!isAuthenticated()) {
    return null;
  }

  // Check user type
  if (requiredUserType) {
    const userType = getUserType();
    if (userType !== requiredUserType) {
      return null;
    }
  }

  return <>{children}</>;
}
