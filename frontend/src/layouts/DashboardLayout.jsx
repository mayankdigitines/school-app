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
  X
} from 'lucide-react';
import { toast } from 'sonner';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { label: 'School Profile', path: '/dashboard', icon: Building2 },
    { label: 'Classes', path: '/dashboard/classes', icon: GraduationCap },
    { label: 'Subjects', path: '/dashboard/subjects', icon: BookOpen },
    { label: 'Teachers', path: '/dashboard/teachers', icon: Users },
    { label: 'Notices', path: '/dashboard/notices', icon: Megaphone },
    { label: 'Activity Logs', path: '/dashboard/logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary truncate" title={user?.school?.name || "School Admin"}>
              {user?.school?.name || "School Admin"}
            </h1>
            <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path; // Exact match for simplicity, effectively handles sub-routes if careful
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground font-medium' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4 px-4">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <Button variant="destructive" className="w-full justify-start gap-3" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center md:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
              <Menu size={24} />
            </button>
            <span className="ml-4 font-semibold">Menu</span>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
