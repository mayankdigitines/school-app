import { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    UserCheck,
    Search,
    Eye,
    MoreHorizontal,
    Filter
} from 'lucide-react';
import { format } from 'date-fns';

const AttendanceDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState({ total: 0, taken: 0, pending: 0 });
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    // Dialog Filters
    const [studentSearch, setStudentSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchAttendanceData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch both Classes and Attendance simultaneously
            const [classesRes, attendanceRes] = await Promise.all([
                api.get('/admin/classes'),
                api.get('/admin/attendance', { params: { date: selectedDate } })
            ]);

            const classes = classesRes.data?.data?.classes || [];
            const attendanceRecords = attendanceRes.data?.data?.attendance || [];

            // 2. Merge them to create a comprehensive report showing Taken & Pending
            const fullReport = classes.map(cls => {
                const classIdStr = cls._id || cls.classId;
                // Check if attendance exists for this class
                const record = attendanceRecords.find(a =>
                    (a.class && a.class._id === classIdStr) || a.class === classIdStr
                );

                if (record) {
                    return {
                        classId: classIdStr,
                        className: cls.className,
                        status: 'Taken',
                        takenBy: record.teacher?.name || 'Unknown',
                        takenAt: record.createdAt || record.date,
                        stats: {
                            present: record.presentCount || 0,
                            absent: record.absentCount || 0
                        },
                        details: {
                            records: record.records || [] // Contains cached rollNumber and name
                        }
                    };
                } else {
                    return {
                        classId: classIdStr,
                        className: cls.className,
                        status: 'Pending',
                        takenBy: null,
                        takenAt: null,
                        stats: null,
                        details: null
                    };
                }
            });

            // Sort: Pending first, or alphabetically by class name
            fullReport.sort((a, b) => a.className.localeCompare(b.className));
            setReport(fullReport);

            // Calculate summary
            const takenCount = fullReport.filter(c => c.status === 'Taken').length;
            setSummary({
                total: fullReport.length,
                taken: takenCount,
                pending: fullReport.length - takenCount
            });

        } catch (error) {
            console.error("Failed to fetch attendance data", error);
            toast.error(error.response?.data?.message || "Could not load attendance records");
            setReport([]);
            setSummary({ total: 0, taken: 0, pending: 0 });
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    // Main Table Search Optimization
    const filteredReport = useMemo(() => {
        if (!searchQuery.trim()) return report;
        const query = searchQuery.toLowerCase();
        return report.filter(item =>
            item.className?.toLowerCase().includes(query) ||
            item.takenBy?.toLowerCase().includes(query)
        );
    }, [searchQuery, report]);

    // Compute Filtered Students for Dialog (Memoized)
    const dialogStudents = useMemo(() => {
        if (!selectedClass?.details?.records) return [];

        let data = selectedClass.details.records;

        if (statusFilter !== "All") {
            data = data.filter(r => r.status === statusFilter);
        }

        if (studentSearch.trim()) {
            const q = studentSearch.toLowerCase();
            data = data.filter(r => {
                // Read from cached model fields directly
                const studentName = (r.name || "").toLowerCase();
                const studentRoll = (r.rollNumber || "").toString().toLowerCase();
                return studentName.includes(q) || studentRoll.includes(q);
            });
        }

        return data;
    }, [selectedClass, statusFilter, studentSearch]);

    const handleViewDetails = (classData) => {
        if (classData.status !== 'Taken') {
            toast.info(`Attendance for Class ${classData.className} hasn't been marked yet.`);
            return;
        }
        setStudentSearch("");
        setStatusFilter("All");
        setSelectedClass(classData);
        setIsDialogOpen(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Present': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none">Present</Badge>;
            case 'Absent': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 shadow-none">Absent</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 h-full">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <UserCheck className="h-8 w-8 text-primary" />
                        Attendance Monitor
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Daily overview of student attendance across all classes.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 px-3 py-1 border-r pr-4 mr-2">
                        <CalendarDays size={18} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">Date:</span>
                    </div>
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border-0 focus-visible:ring-0 w-auto shadow-none p-0 h-auto cursor-pointer font-medium"
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Submitted</p>
                                <h3 className="text-2xl font-bold text-slate-900">{summary.taken} / {summary.total}</h3>
                                <p className="text-xs text-slate-400 mt-1">Classes reported</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pending</p>
                                <h3 className="text-2xl font-bold text-slate-900">{summary.pending}</h3>
                                <p className="text-xs text-slate-400 mt-1">Waiting for update</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <Clock size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Completion</p>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {summary.total > 0 ? Math.round((summary.taken / summary.total) * 100) : 0}%
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">Total Progress</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <UserCheck size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Class List Table */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <CardTitle className="text-lg font-semibold text-slate-800">Class Reports</CardTitle>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search class or teacher..."
                                className="pl-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <div className="rounded-md">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[150px]">Class Name</TableHead>
                                <TableHead className="w-[120px]">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Reported By</TableHead>
                                <TableHead className="hidden md:table-cell">Time</TableHead>
                                <TableHead>Attendance Stats</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-32 bg-slate-200 rounded animate-pulse" /></TableCell>
                                        <TableCell colSpan={3}><div className="h-4 w-full bg-slate-200 rounded animate-pulse" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredReport.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        {searchQuery ? `No records found matching "${searchQuery}"` : "No class or attendance records available."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredReport.map((item) => (
                                    <TableRow key={item.classId} className="hover:bg-slate-50/80 transition-colors">
                                        <TableCell className="font-bold text-slate-800">
                                            Class {item.className}
                                        </TableCell>
                                        <TableCell>
                                            {item.status === 'Taken' ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 shadow-none border-green-200">
                                                    Submitted
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-slate-500 bg-slate-50 shadow-none">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-slate-600">
                                            {item.status === 'Taken' ? item.takenBy : <span className="text-slate-300">-</span>}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-slate-500 text-xs font-mono">
                                            {item.status === 'Taken' && item.takenAt ? (
                                                format(new Date(item.takenAt), 'h:mm a')
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {item.status === 'Taken' ? (
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="flex items-center gap-1.5" title="Present">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                                        <span className="font-medium text-slate-700">{item.stats?.present || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5" title="Absent">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                                        <span className="font-medium text-slate-700">{item.stats?.absent || 0}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Waiting for update...</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-8 w-8 p-0 ${item.status === 'Taken' ? 'hover:bg-slate-200' : 'cursor-not-allowed opacity-50'}`}
                                                onClick={() => handleViewDetails(item)}
                                                disabled={item.status !== 'Taken'}
                                            >
                                                {item.status === 'Taken' ? <Eye className="h-4 w-4 text-primary" /> : <MoreHorizontal className="h-4 w-4 text-slate-300" />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Student Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b bg-white z-10">
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                    Class {selectedClass?.className}
                                </DialogTitle>
                                <p className="text-sm text-slate-500 mt-1">
                                    Attendance Record for <span className="font-medium text-slate-700">{format(new Date(selectedDate), 'PPPP')}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                <Clock size={14} />
                                Recorded at {selectedClass?.takenAt ? format(new Date(selectedClass.takenAt), 'h:mm a') : ''}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
                                {['All', 'Present', 'Absent'].map((status) => {
                                    const count = status === 'All'
                                        ? selectedClass?.details?.records?.length
                                        : (status === 'Present' ? selectedClass?.stats?.present : selectedClass?.stats?.absent);

                                    const isActive = statusFilter === status;

                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${isActive ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                                        >
                                            {status}
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary/10' : 'bg-slate-200'}`}>
                                                {count || 0}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search student or roll no..."
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                    className="pl-9 h-9 bg-white"
                                />
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
                        <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead className="w-[100px] font-semibold text-slate-700">Roll No</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Student Name</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dialogStudents.length > 0 ? (
                                        dialogStudents.map((record, index) => (
                                            <TableRow key={record._id || index} className={record.status === 'Absent' ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50'}>
                                                <TableCell className="font-mono font-medium text-slate-600">
                                                    #{record.rollNumber || "N/A"}
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-800">
                                                    {record.name || "Unknown"}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(record.status)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Filter size={24} className="opacity-20" />
                                                    <p>No students found matching your filters.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AttendanceDashboard;