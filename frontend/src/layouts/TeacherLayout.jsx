import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  ClipboardCheck,
  Users,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', path: '/teacher/attendance', icon: ClipboardCheck },
  { label: 'Requests', path: '/teacher/requests', icon: Users },
  { label: 'Homework', path: '/teacher/homework', icon: BookOpen },
];

const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/teacher-login');
  };

  const currentPage = navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg shadow-md">
                <GraduationCap size={20} className="text-background" />
              </div>
              <div className="hidden md:block">
                <span className="block text-sm font-bold text-foreground leading-none">
                  Teacher Portal
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {user?.school?.name || 'School App'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative group flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'text-emerald-700 bg-background shadow-sm dark:text-emerald-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon size={16} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground group-hover:text-foreground'} />
                    <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Teacher</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-md"
                onClick={() => setNavOpen(!navOpen)}
                aria-label={navOpen ? 'Close menu' : 'Open menu'}
              >
                {navOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {navOpen && (
          <div className="md:hidden border-t border-border bg-background absolute w-full shadow-xl animate-in slide-in-from-top-2">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <div className="px-3 py-3 mb-2 bg-muted rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="font-medium text-sm text-foreground">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-red-600 hover:bg-red-50">
                  <LogOut size={14} className="mr-2" /> Logout
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setNavOpen(false)}
                      className={`
                        flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl text-xs font-medium transition-all border
                        ${isActive
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400'
                          : 'bg-background border-border text-muted-foreground hover:bg-accent hover:border-accent'
                        }
                      `}
                    >
                      <Icon size={20} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span>Teacher Portal</span>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground">{currentPage}</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
