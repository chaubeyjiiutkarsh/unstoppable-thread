import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null;

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
