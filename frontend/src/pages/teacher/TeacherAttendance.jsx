import { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserCheck,
  UserX,
  CalendarDays,
  Check,
  AlertCircle,
  Users
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

const TeacherAttendance = () => {
  const [date, setDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [absentIds, setAbsentIds] = useState(new Set());
  const [isAlreadyTaken, setIsAlreadyTaken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const dateStr = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    fetchAttendance();
  }, [dateStr]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/teachers/attendance?date=${dateStr}`);
      const history = response.data?.data?.history || [];

      if (history.length > 0 && history[0].records) {
        // Attendance already taken for this date
        const records = history[0].records;
        const studentList = records.map((r) => ({
          studentId: r.student?._id || r.student,
          name: r.student?.name || 'Unknown',
          rollNumber: r.student?.rollNumber || '-',
          status: r.status,
        }));
        setStudents(studentList);
        setAbsentIds(new Set(studentList.filter((s) => s.status === 'Absent').map((s) => s.studentId)));
        setIsAlreadyTaken(true);
      } else {
        // No attendance yet -- fetch student list
        const studentsResponse = await api.get('/teachers/students');
        const studentList = studentsResponse.data?.data?.students || [];
        setStudents(
          studentList.map((s) => ({
            studentId: s.studentId,
            name: s.name,
            rollNumber: s.rollNumber,
            status: 'Present',
          }))
        );
        setAbsentIds(new Set());
        setIsAlreadyTaken(false);
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      if (error.response?.status === 403) {
        toast.error('You are not assigned as a Class Teacher.');
      } else {
        toast.error('Could not load attendance data');
      }
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = useCallback((studentId) => {
    if (isAlreadyTaken) return;
    setAbsentIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  }, [isAlreadyTaken]);

  const presentCount = useMemo(() => students.length - absentIds.size, [students, absentIds]);
  const absentCount = useMemo(() => absentIds.size, [absentIds]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/teachers/attendance', {
        date: dateStr,
        absentStudentIds: Array.from(absentIds),
      });
      toast.success('Attendance submitted successfully!');
      setIsAlreadyTaken(true);
    } catch (error) {
      console.error('Failed to submit attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const goToPrevDay = () => setDate((d) => subDays(d, 1));
  const goToNextDay = () => {
    const tomorrow = addDays(date, 1);
    if (tomorrow <= new Date()) {
      setDate(tomorrow);
    }
  };

  const isFutureBlocked = addDays(date, 1) > new Date();

  return (
    <div className="space-y-6 pb-28">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <UserCheck className="h-8 w-8 text-emerald-600" />
          Take Attendance
        </h2>
        <p className="text-muted-foreground mt-1">
          Mark student attendance for your assigned class.
        </p>
      </div>

      {/* Date Picker */}
      <Card className="shadow-sm border-border">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={goToPrevDay}>
              <ChevronLeft size={18} />
            </Button>
            <div className="flex items-center gap-2 text-foreground">
              <CalendarDays size={18} className="text-emerald-600" />
              <span className="text-lg font-semibold">{format(date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <Button variant="outline" size="icon" onClick={goToNextDay} disabled={isFutureBlocked}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Already Taken Notice */}
      {isAlreadyTaken && !loading && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Attendance already submitted for this date.</p>
            <p className="text-xs opacity-80 mt-0.5">You can re-submit to update the records.</p>
          </div>
        </div>
      )}

      {/* Student List */}
      <Card className="shadow-sm border-border overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users size={18} />
              Student List
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {students.length} {'student'}{students.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No students found in your class.</p>
            </div>
          ) : (
            students.map((student) => {
              const isAbsent = absentIds.has(student.studentId);
              return (
                <button
                  key={student.studentId}
                  onClick={() => toggleStudent(student.studentId)}
                  disabled={isAlreadyTaken}
                  className={`
                    w-full flex items-center justify-between px-5 py-4 transition-colors text-left
                    ${isAbsent
                      ? 'bg-red-50/80 hover:bg-red-50 dark:bg-red-900/10 dark:hover:bg-red-900/20'
                      : 'bg-background hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                    }
                    ${isAlreadyTaken ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                        ${isAbsent
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }
                      `}
                    >
                      {student.rollNumber}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{'Roll No: '}{student.rollNumber}</p>
                    </div>
                  </div>
                  <Badge
                    className={`
                      shadow-none px-3 py-1 text-xs font-semibold
                      ${isAbsent
                        ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                      }
                    `}
                  >
                    {isAbsent ? (
                      <><UserX size={12} className="mr-1" /> Absent</>
                    ) : (
                      <><UserCheck size={12} className="mr-1" /> Present</>
                    )}
                  </Badge>
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* Sticky Bottom Bar */}
      {students.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-foreground">
                    {'Present: '}<span className="font-bold">{presentCount}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-foreground">
                    {'Absent: '}<span className="font-bold">{absentCount}</span>
                  </span>
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={submitting || students.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-background font-semibold px-6"
              >
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Check className="mr-2 h-4 w-4" /> Submit Attendance</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
