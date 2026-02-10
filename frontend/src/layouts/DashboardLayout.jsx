import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  Megaphone,
  FileText,
  LogOut,
  Menu,
  Backpack,
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'School Profile', path: '/dashboard', icon: Building2 },
  { label: 'Classes', path: '/dashboard/classes', icon: GraduationCap },
  { label: 'Students', path: '/dashboard/students', icon: Backpack },
  { label: 'Subjects', path: '/dashboard/subjects', icon: BookOpen },
  
  { label: 'Teachers', path: '/dashboard/teachers', icon: Users },
  { label: 'Notices', path: '/dashboard/notices', icon: Megaphone },
  { label: 'Activity Logs', path: '/dashboard/logs', icon: FileText },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
          <span className="text-base text-gray-800 dark:text-gray-100 truncate" title={user?.school?.name || "School Admin"}>
            {user?.school?.name || "School Admin"}
          </span>
        </div>
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">{user?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </nav>

      {/* Mobile nav */}
      {navOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setNavOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;