import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isLoggedIn = document.cookie.includes("isLoggedIn=true");
  const currentUserRaw = localStorage.getItem("currentUser");
  
  let userRole = null;
  if (currentUserRaw) {
    try {
      const currentUser = JSON.parse(currentUserRaw);
      userRole = currentUser.role ? currentUser.role.toLowerCase() : "user";
      // normalize superadmin
      if (userRole === "super_admin") userRole = "superadmin";
    } catch (e) {
      console.error("Failed to parse currentUser from localStorage", e);
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // If we normalized super_admin to superadmin, let's make sure our check aligns
    // the routes sometimes specify 'superadmin' and sometimes 'super_admin'
    const normalizedAllowedRoles = allowedRoles.map(r => r === "super_admin" ? "superadmin" : r.toLowerCase());
    
    if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
      // If unauthorized for admin/superadmin, redirect to default user dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
