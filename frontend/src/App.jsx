
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner'; // [ADDED] Global Toast handler
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SchoolProfile from './pages/SchoolProfile';
import ManageAcademics from './pages/ManageAcademics'; 
import ManageTeachers from './pages/ManageTeachers';
import ManageNotices from './pages/ManageNotices';
import ActivityLogs from './pages/ActivityLogs';
import ManageStudents from './pages/ManageStudents';
import AttendanceDashboard from './pages/AttendanceDashboard';
import ManageSchools from './pages/superadmin/ManageSchools';
import { useAuth } from './context/AuthContext';

// ... (Keep your ProtectedRoute component exactly as is) ...
const ProtectedRoute = ({ children, allowedRoles, fallbackPath }) => {
  // ... existing code
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to={fallbackPath || "/school-login"} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'SuperAdmin') return <Navigate to="/super-admin/schools" replace />;
    if (user.role === 'SchoolAdmin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { user } = useAuth();

  const getRootRedirect = () => {
    if (user?.role === 'SuperAdmin') return <Navigate to="/super-admin/schools" replace />;
    if (user?.role === 'SchoolAdmin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/school-login" replace />;
  };

  return (
    <>
      {/* Global Toast Configuration */}
      <Toaster position="top-right" richColors closeButton />
      
      <Routes>
        <Route path="/super-login" element={<Login allowedRole="SuperAdmin" />} />
        <Route path="/school-login" element={<Login allowedRole="SchoolAdmin" />} />
        <Route path="/teacher-login" element={<Login allowedRole="Teacher" />} />
        <Route path="/parent-login" element={<Login allowedRole="Parent" />} />
        <Route path="/login" element={<Navigate to="/school-login" replace />} />
        <Route path="/" element={getRootRedirect()} />
        
        <Route path="/super-admin" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']} fallbackPath="/super-login">
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/super-admin/schools" replace />} />
          <Route path="schools" element={<ManageSchools />} />
        </Route>

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['SchoolAdmin']} fallbackPath="/school-login">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SchoolProfile />} />
          <Route path="academics" element={<ManageAcademics />} />
          <Route path="attendance" element={<AttendanceDashboard />} /> 
          <Route path="students" element={<ManageStudents />} />
          <Route path="teachers" element={<ManageTeachers />} />
          <Route path="notices" element={<ManageNotices />} />
          <Route path="logs" element={<ActivityLogs />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;