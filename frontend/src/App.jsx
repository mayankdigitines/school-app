import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout'; // Import new layout
import SchoolProfile from './pages/SchoolProfile';
import ManageClasses from './pages/ManageClasses';
import ManageSubjects from './pages/ManageSubjects';
import ManageTeachers from './pages/ManageTeachers';
import ManageNotices from './pages/ManageNotices';
import ActivityLogs from './pages/ActivityLogs';
import ManageSchools from './pages/superadmin/ManageSchools'; // Import new page
import { useAuth } from './context/AuthContext';

// Enhanced Protected Route that checks for Roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't match, redirect to their appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'SuperAdmin') return <Navigate to="/super-admin" replace />;
    if (user.role === 'SchoolAdmin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { user } = useAuth();

  // Redirect root based on role
  const getRootRedirect = () => {
    if (user?.role === 'SuperAdmin') return <Navigate to="/super-admin/schools" replace />;
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Root Redirect */}
      <Route path="/" element={getRootRedirect()} />
      
      {/* --- Super Admin Routes --- */}
      <Route path="/super-admin" element={
        <ProtectedRoute allowedRoles={['SuperAdmin']}>
          <SuperAdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/super-admin/schools" replace />} />
        <Route path="schools" element={<ManageSchools />} />
      </Route>

      {/* --- School Admin Routes --- */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['SchoolAdmin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SchoolProfile />} />
        <Route path="classes" element={<ManageClasses />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="teachers" element={<ManageTeachers />} />
        <Route path="notices" element={<ManageNotices />} />
        <Route path="logs" element={<ActivityLogs />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;