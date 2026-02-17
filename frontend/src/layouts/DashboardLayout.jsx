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
  ClipboardCheck // [ADDED] Icon for Attendance
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: Building2 },
  { label: 'Classes', path: '/dashboard/classes', icon: School },
  { label: 'Attendance', path: '/dashboard/attendance', icon: ClipboardCheck }, // [ADDED]
  { label: 'Students', path: '/dashboard/students', icon: GraduationCap },
  { label: 'Subjects', path: '/dashboard/subjects', icon: BookOpen },
  { label: 'Teachers', path: '/dashboard/teachers', icon: Users },
  { label: 'Notices', path: '/dashboard/notices', icon: Megaphone },
  { label: 'Logs', path: '/dashboard/logs', icon: FileText },
];

const DashboardLayout = () => {
    // ... (rest of the file remains exactly the same as the previous version provided in context) ...
    // Copy the full content of your existing DashboardLayout here if replacing the file entirely, 
    // but the key change is just the `navItems` array above.
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                
                <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <School size={20} />
                </div>
                <div className="hidden md:block">
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {user?.school?.name || "School Admin"}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    School Portal
                    </span>
                </div>
                </div>

                <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`
                        relative group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                        ${isActive 
                            ? 'text-primary bg-primary/5' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
                        `}
                    >
                        <Icon size={16} className={isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"} />
                        {item.label}
                        {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full translate-y-1" />
                        )}
                    </Link>
                    );
                })}
                </div>

                <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    title="Logout"
                    >
                    <LogOut size={18} />
                    </Button>
                </div>

                <button
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
                    onClick={() => setNavOpen(!navOpen)}
                >
                    {navOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                </div>
            </div>
            </div>

            {navOpen && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 absolute w-full shadow-lg">
                <div className="px-4 pt-2 pb-4 space-y-1">
                <div className="px-3 py-3 mb-2 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-sm">{user?.name}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-red-600">
                        <LogOut size={14} className="mr-2" /> Logout
                    </Button>
                </div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setNavOpen(false)}
                        className={`
                        flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                        `}
                    >
                        <Icon size={18} />
                        {item.label}
                    </Link>
                    );
                })}
                </div>
            </div>
            )}
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
        </main>
        </div>
    );
};

export default DashboardLayout;