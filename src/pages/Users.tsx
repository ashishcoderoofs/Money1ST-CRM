
import { Navigate } from "react-router-dom";

export default function Users() {
  // Redirect to admin page as user management is now part of admin
  return <Navigate to="/admin" replace />;
}
