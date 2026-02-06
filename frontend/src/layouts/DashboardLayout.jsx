// // import { useState } from 'react';
// // import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { Button } from '@/components/ui/button';
// // import { 
// //   Building2, 
// //   Users, 
// //   BookOpen, 
// //   GraduationCap, 
// //   Megaphone, 
// //   FileText, 
// //   LogOut,
// //   Menu,
// //   X
// // } from 'lucide-react';
// // import { toast } from 'sonner';

// // const DashboardLayout = () => {
// //   const { user, logout } = useAuth();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// //   const handleLogout = () => {
// //     logout();
// //     toast.info('Logged out successfully');
// //     navigate('/login');
// //   };

// //   const navItems = [
// //     { label: 'School Profile', path: '/dashboard', icon: Building2 },
// //     { label: 'Classes', path: '/dashboard/classes', icon: GraduationCap },
// //     { label: 'Subjects', path: '/dashboard/subjects', icon: BookOpen },
// //     { label: 'Teachers', path: '/dashboard/teachers', icon: Users },
// //     { label: 'Notices', path: '/dashboard/notices', icon: Megaphone },
// //     { label: 'Activity Logs', path: '/dashboard/logs', icon: FileText },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
// //       {/* Mobile Sidebar Overlay */}
// //       {isSidebarOpen && (
// //         <div 
// //           className="fixed inset-0 bg-black/50 z-40 md:hidden"
// //           onClick={() => setIsSidebarOpen(false)}
// //         />
// //       )}

// //       {/* Sidebar */}
// //       <aside 
// //         className={`fixed md:relative z-50 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
// //           isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
// //         }`}
// //       >
// //         <div className="h-full flex flex-col">
// //           <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
// //             <h1 className="text-xl font-bold text-primary truncate" title={user?.school?.name || "School Admin"}>
// //               {user?.school?.name || "School Admin"}
// //             </h1>
// //             <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
// //               <X size={24} />
// //             </button>
// //           </div>
          
// //           <nav className="flex-1 overflow-y-auto p-4 space-y-2">
// //             {navItems.map((item) => {
// //               const Icon = item.icon;
// //               const isActive = location.pathname === item.path; // Exact match for simplicity, effectively handles sub-routes if careful
              
// //               return (
// //                 <Link
// //                   key={item.path}
// //                   to={item.path}
// //                   onClick={() => setIsSidebarOpen(false)}
// //                   className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
// //                     isActive 
// //                       ? 'bg-primary text-primary-foreground font-medium' 
// //                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
// //                   }`}
// //                 >
// //                   <Icon size={20} />
// //                   {item.label}
// //                 </Link>
// //               );
// //             })}
// //           </nav>

// //           <div className="p-4 border-t border-gray-200 dark:border-gray-700">
// //             <div className="mb-4 px-4">
// //               <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
// //               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
// //             </div>
// //             <Button variant="destructive" className="w-full justify-start gap-3" onClick={handleLogout}>
// //               <LogOut size={20} />
// //               Logout
// //             </Button>
// //           </div>
// //         </div>
// //       </aside>

// //       {/* Main Content */}
// //       <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
// //         {/* Mobile Header */}
// //         <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center md:hidden">
// //             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
// //               <Menu size={24} />
// //             </button>
// //             <span className="ml-4 font-semibold">Menu</span>
// //         </header>
        
// //         <div className="flex-1 overflow-auto p-6">
// //           <Outlet />
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default DashboardLayout;

// import { useState } from 'react';
// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '@/components/ui/button';
// import {
//   Building2,
//   Users,
//   BookOpen,
//   GraduationCap,
//   Megaphone,
//   FileText,
//   LogOut,
//   Menu,
//   X,
// } from 'lucide-react';
// import { toast } from 'sonner';

// const navItems = [
//   { label: 'School Profile', path: '/dashboard', icon: Building2 },
//   { label: 'Classes', path: '/dashboard/classes', icon: GraduationCap },
//   { label: 'Subjects', path: '/dashboard/subjects', icon: BookOpen },
//   { label: 'Teachers', path: '/dashboard/teachers', icon: Users },
//   { label: 'Notices', path: '/dashboard/notices', icon: Megaphone },
//   { label: 'Activity Logs', path: '/dashboard/logs', icon: FileText },
// ];

// const DashboardLayout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     toast.info('Logged out successfully');
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-40 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-200 ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//         }`}
//         style={{ minHeight: '100vh' }}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//           <span className="text-lg font-bold truncate text-primary" title={user?.school?.name || "School Admin"}>
//             {user?.school?.name || "School Admin"}
//           </span>
//           <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
//             <X size={22} />
//           </button>
//         </div>
//         <nav className="flex-1 py-4 px-2 space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
//                   isActive
//                     ? 'bg-primary text-primary-foreground font-semibold'
//                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <Icon size={18} />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>
//         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//           <div className="mb-2">
//             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
//             <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//           </div>
//           <Button
//             variant="destructive"
//             className="w-full flex items-center gap-2"
//             onClick={handleLogout}
//           >
//             <LogOut size={18} />
//             Logout
//           </Button>
//         </div>
//       </aside>

//       {/* Overlay for mobile */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-h-screen md:ml-64">
//         {/* Mobile Header */}
//         <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center md:hidden">
//           <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
//             <Menu size={22} />
//           </button>
//           <span className="ml-4 font-semibold text-base">Dashboard</span>
//         </header>
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


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
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'School Profile', path: '/dashboard', icon: Building2 },
  { label: 'Classes', path: '/dashboard/classes', icon: GraduationCap },
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