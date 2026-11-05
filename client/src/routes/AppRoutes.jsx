import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuizHome from "../pages/home/QuizHome";
import QuizListing from "../pages/quizzes/QuizListing";
import QuizDetails from "../pages/quizzes/QuizDetails";
import QuizScreen from "../pages/quizzes/QuizScreen";
import QuizResult from "../pages/results/QuizResult";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Imports
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageQuizzes from "../pages/admin/ManageQuizzes";
import ManageQuestions from "../pages/admin/ManageQuestions";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminResults from "../pages/admin/AdminResults";
import AdminReports from "../pages/admin/AdminReports";

// Super Admin Imports
import SuperAdminLayout from "../pages/superadmin/SuperAdminLayout";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import SuperManageQuizzes from "../pages/superadmin/SuperManageQuizzes";
import SuperManageQuestions from "../pages/superadmin/SuperManageQuestions";
import SuperManageCategories from "../pages/superadmin/SuperManageCategories";
import SuperManageUsers from "../pages/superadmin/SuperManageUsers";
import SuperAdminResults from "../pages/superadmin/SuperAdminResults";
import SuperManageRoles from "../pages/superadmin/SuperManageRoles";
import SuperAdminReports from "../pages/superadmin/SuperAdminReports";

const RootRedirect = () => {
  const isLoggedIn = document.cookie.includes("isLoggedIn=true");
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const currentUserRaw = localStorage.getItem("currentUser");
  let userRole = "user";
  if (currentUserRaw) {
    try {
      const currentUser = JSON.parse(currentUserRaw);
      userRole = (currentUser.role || "user").toLowerCase();
    } catch (e) {
      console.error(e);
    }
  }

  if (userRole === "super_admin" || userRole === "superadmin") {
    return <Navigate to="/superadmin" replace />;
  } else if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Smart Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* User Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}><QuizHome /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}><QuizListing /></ProtectedRoute>} />

        <Route
          path="/quizzes/:quizId"
          element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}><QuizDetails /></ProtectedRoute>}
        />

        <Route
          path="/quizzes/:quizId/start"
          element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}><QuizScreen /></ProtectedRoute>}
        />

        <Route
          path="/quizzes/:quizId/result"
          element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}><QuizResult /></ProtectedRoute>}
        />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="quizzes" element={<ManageQuizzes />} />
          <Route path="questions" element={<ManageQuestions />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Redirect /admin/super-dashboard to /superadmin */}
        <Route path="/admin/super-dashboard" element={<Navigate to="/superadmin" replace />} />

        {/* Super Admin Protected Routes */}
        <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin', 'super_admin']}><SuperAdminLayout /></ProtectedRoute>}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="roles" element={<SuperManageRoles />} />
          <Route path="quizzes" element={<SuperManageQuizzes />} />
          <Route path="questions" element={<SuperManageQuestions />} />
          <Route path="categories" element={<SuperManageCategories />} />
          <Route path="users" element={<SuperManageUsers />} />
          <Route path="results" element={<SuperAdminResults />} />
          <Route path="reports" element={<SuperAdminReports />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;