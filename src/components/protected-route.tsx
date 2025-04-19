import { Navigate, Outlet } from "react-router-dom";
import { IProtectedRouteProps } from "../types/types";

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  isAdmin = false,
  redirect = "/",
}: IProtectedRouteProps) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;

  if (adminOnly && !isAdmin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
