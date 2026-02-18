import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ClipboardCheck,
  Users,
  BookOpen,
  School,
  Loader2,
  GraduationCap,
  ArrowRight
} from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherHome();
  }, []);

  const fetchTeacherHome = async () => {
    try {
      const response = await api.get('/teachers/home');
      setTeacher(response.data?.data?.teacher);
    } catch (error) {
      console.error('Failed to fetch teacher home:', error);
      toast.error('Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Could not load teacher data.</p>
        <p className="text-sm mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  const isClassTeacher = !!teacher.assignedClass;

  const quickActions = [
    ...(isClassTeacher
      ? [
          {
            label: 'Take Attendance',
            description: `Mark attendance for ${teacher.assignedClass?.className}`,
            icon: ClipboardCheck,
            path: '/teacher/attendance',
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
          },
          {
            label: 'Student Requests',
            description: 'Approve or reject join requests',
            icon: Users,
            path: '/teacher/requests',
            color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
            iconBg: 'bg-amber-100 dark:bg-amber-900/40',
          },
        ]
      : []),
    {
      label: 'Create Homework',
      description: 'Assign homework to your classes',
      icon: BookOpen,
      path: '/teacher/homework',
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
          {'Welcome, '}{teacher.name}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <School size={16} />
          <span className="text-sm">{teacher.school?.schoolName}</span>
          {isClassTeacher && (
            <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-200 shadow-none dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
              Class Teacher - {teacher.assignedClass?.className}
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={`group text-left p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${action.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${action.iconBg}`}>
                    <Icon size={22} />
                  </div>
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>
                <h3 className="text-base font-semibold mt-4">{action.label}</h3>
                <p className="text-sm opacity-70 mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* My Classes Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">My Classes</h2>
        {teacher.teachingClasses?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {teacher.teachingClasses.map((cls) => (
              <Card
                key={cls.classId}
                className="shadow-sm border-border hover:shadow-md transition-shadow"
              >
                <CardContent className="flex items-center gap-3 py-3 px-4">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <GraduationCap size={18} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{cls.className}</p>
                    <p className="text-xs text-muted-foreground">Subject Teacher</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-border">
            <CardContent className="py-8 text-center text-muted-foreground">
              <GraduationCap size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No classes assigned yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Subjects Section */}
      {teacher.subjects?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">My Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((sub) => (
              <Badge
                key={sub.subjectId}
                variant="outline"
                className="px-3 py-1.5 text-sm font-medium bg-background border-border text-foreground"
              >
                <BookOpen size={14} className="mr-1.5 text-muted-foreground" />
                {sub.subjectName}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
