
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
  X,
  School,
  ClipboardCheck,
  ChevronRight,
  LayoutDashboard,
  Library
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Academics', path: '/dashboard/academics', icon: Library }, // [CHANGED] Combined item
  { label: 'Attendance', path: '/dashboard/attendance', icon: ClipboardCheck },
  { label: 'Students', path: '/dashboard/students', icon: GraduationCap },
  { label: 'Teachers', path: '/dashboard/teachers', icon: Users },
  { label: 'Notices', path: '/dashboard/notices', icon: Megaphone },
  { label: 'Logs', path: '/dashboard/logs', icon: FileText },
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

    // Helper to get current page title
    const currentPage = navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-primary/20">
        
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                
                {/* Logo & School Name */}
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-primary to-blue-600 p-2 rounded-lg text-white shadow-md">
                        <School size={20} fill="currentColor" className="text-white/90" />
                    </div>
                    <div className="hidden md:block">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                        {user?.school?.name || "School Portal"}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">Administration Panel</span>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
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
                            ? 'text-primary bg-white dark:bg-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                        }
                        `}
                    >
                        <Icon size={16} className={isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"} />
                        <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
                    </Link>
                    );
                })}
                </div>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">Administrator</p>
                    </div>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Logout"
                    >
                    <LogOut size={18} />
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
                    onClick={() => setNavOpen(!navOpen)}
                >
                    {navOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                </div>
            </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {navOpen && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 absolute w-full shadow-xl animate-in slide-in-from-top-2">
                <div className="px-4 pt-2 pb-4 space-y-1">
                <div className="px-3 py-3 mb-2 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{user?.name}</span>
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
                                ? 'bg-primary/5 border-primary/20 text-primary' 
                                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
                            }
                            `}
                        >
                            <Icon size={20} className={isActive ? "text-primary" : "text-slate-400"} />
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
            {/* Breadcrumb / Page Title Context */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <span>Dashboard</span>
                <ChevronRight size={14} />
                <span className="font-medium text-slate-900 dark:text-slate-200">{currentPage}</span>
            </div>
            <Outlet />
        </main>
        </div>
    );
};

export default DashboardLayout;