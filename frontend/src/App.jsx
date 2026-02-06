// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import DashboardLayout from './layouts/DashboardLayout';
// import SuperAdminLayout from './layouts/SuperAdminLayout'; // Import new layout
// import SchoolProfile from './pages/SchoolProfile';
// import ManageClasses from './pages/ManageClasses';
// import ManageSubjects from './pages/ManageSubjects';
// import ManageTeachers from './pages/ManageTeachers';
// import ManageNotices from './pages/ManageNotices';
// import ActivityLogs from './pages/ActivityLogs';
// import ManageSchools from './pages/superadmin/ManageSchools'; // Import new page
// import { useAuth } from './context/AuthContext';

// // Enhanced Protected Route that checks for Roles
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // If roles are specified and user doesn't match, redirect to their appropriate dashboard
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     if (user.role === 'SuperAdmin') return <Navigate to="/super-admin" replace />;
//     if (user.role === 'SchoolAdmin') return <Navigate to="/dashboard" replace />;
//     return <Navigate to="/login" replace />;
//   }
  
//   return children;
// };

// function App() {
//   const { user } = useAuth();

//   // Redirect root based on role
//   const getRootRedirect = () => {
//     if (user?.role === 'SuperAdmin') return <Navigate to="/super-admin/schools" replace />;
//     return <Navigate to="/dashboard" replace />;
//   };

//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
      
//       {/* Root Redirect */}
//       <Route path="/" element={getRootRedirect()} />
      
//       {/* --- Super Admin Routes --- */}
//       <Route path="/super-admin" element={
//         <ProtectedRoute allowedRoles={['SuperAdmin']}>
//           <SuperAdminLayout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<Navigate to="/super-admin/schools" replace />} />
//         <Route path="schools" element={<ManageSchools />} />
//       </Route>

//       {/* --- School Admin Routes --- */}
//       <Route path="/dashboard" element={
//         <ProtectedRoute allowedRoles={['SchoolAdmin']}>
//           <DashboardLayout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<SchoolProfile />} />
//         <Route path="classes" element={<ManageClasses />} />
//         <Route path="subjects" element={<ManageSubjects />} />
//         <Route path="teachers" element={<ManageTeachers />} />
//         <Route path="notices" element={<ManageNotices />} />
//         <Route path="logs" element={<ActivityLogs />} />
//       </Route>
      
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SchoolProfile from './pages/SchoolProfile';
import ManageClasses from './pages/ManageClasses';
import ManageSubjects from './pages/ManageSubjects';
import ManageTeachers from './pages/ManageTeachers';
import ManageNotices from './pages/ManageNotices';
import ActivityLogs from './pages/ActivityLogs';
import ManageSchools from './pages/superadmin/ManageSchools';
import { useAuth } from './context/AuthContext';

// Optimized ProtectedRoute with Custom Redirect
const ProtectedRoute = ({ children, allowedRoles, fallbackPath }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  if (!user) {
    // Redirect to the specific login page requested
    return <Navigate to={fallbackPath || "/school-login"} replace />;
  }

  // Role Validation
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but wrong role, send them to their own dashboard
    if (user.role === 'SuperAdmin') return <Navigate to="/super-admin/schools" replace />;
    if (user.role === 'SchoolAdmin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const { user } = useAuth();

  // Root redirect logic
  const getRootRedirect = () => {
    if (user?.role === 'SuperAdmin') return <Navigate to="/super-admin/schools" replace />;
    if (user?.role === 'SchoolAdmin') return <Navigate to="/dashboard" replace />;
    // Default for unauthenticated users
    return <Navigate to="/school-login" replace />;
  };

  return (
    <Routes>
      {/* --- Dedicated Login Routes --- */}
      <Route path="/super-login" element={<Login allowedRole="SuperAdmin" />} />
      <Route path="/school-login" element={<Login allowedRole="SchoolAdmin" />} />
      <Route path="/teacher-login" element={<Login allowedRole="Teacher" />} />
      <Route path="/parent-login" element={<Login allowedRole="Parent" />} />
      
      {/* Legacy/Generic Login Redirect */}
      <Route path="/login" element={<Navigate to="/school-login" replace />} />
      
      {/* Root Redirect */}
      <Route path="/" element={getRootRedirect()} />
      
      {/* --- Super Admin Routes --- */}
      {/* If not logged in, redirect to /super-login */}
      <Route path="/super-admin" element={
        <ProtectedRoute allowedRoles={['SuperAdmin']} fallbackPath="/super-login">
          <SuperAdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/super-admin/schools" replace />} />
        <Route path="schools" element={<ManageSchools />} />
      </Route>

      {/* --- School Admin Routes --- */}
      {/* If not logged in, redirect to /school-login */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['SchoolAdmin']} fallbackPath="/school-login">
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