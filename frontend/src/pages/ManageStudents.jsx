import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Loader2, Backpack, Search, Phone, User } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");

  // Initial Data Fetch
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch students whenever the selected class filter changes
  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data?.data?.classes || []);
    } catch (error) {
      console.error("Failed to fetch classes", error);
      toast.error("Could not load class list");
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Build query string based on filter
      const query = selectedClass && selectedClass !== "all" 
        ? `?classId=${selectedClass}` 
        : '';
      
      const response = await api.get(`/admin/students${query}`);
      setStudents(response.data?.data?.students || []);
    } catch (error) {
      console.error("Failed to fetch students", error);
      toast.error(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Backpack className="h-8 w-8 text-primary" />
            Students Directory
          </h2>
          <p className="text-muted-foreground">
            View and manage student records, roll numbers, and parent details.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>
                  Grade {cls.grade} - {cls.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchStudents} title="Refresh List">
            <Search size={16} />
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader className="py-4 px-6 border-b bg-gray-50/50 dark:bg-gray-800/50">
            <CardTitle className="text-base font-medium flex justify-between items-center">
                <span>Total Students: {students.length}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Parent Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Loading records...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No students found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <TableCell className="font-medium font-mono text-primary">
                        #{student.rollNumber}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{student.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      {student.studentClass ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                            Grade {student.studentClass.grade}-{student.studentClass.section}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <User size={14} className="text-muted-foreground" />
                            {student.parent?.name || "N/A"}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Phone size={14} className="text-muted-foreground" />
                            {student.parent?.phone || "N/A"}
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageStudents;