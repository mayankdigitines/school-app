import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import SchoolProfile from './pages/SchoolProfile';
import ManageClasses from './pages/ManageClasses';
import ManageSubjects from './pages/ManageSubjects';
import ManageTeachers from './pages/ManageTeachers';
import ManageNotices from './pages/ManageNotices';
import ActivityLogs from './pages/ActivityLogs';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
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