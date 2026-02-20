import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Plus, 
  Loader2, 
  Layers, 
  BookOpen, 
  ArrowLeft, 
  Users, 
  UserCircle, 
  GraduationCap 
} from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Class State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [className, setClassName] = useState(''); 

  // Detailed View State
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data?.data?.classes || []); 
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/add-class', { className }); 
      toast.success('Class added successfully');
      setIsDialogOpen(false);
      setClassName(''); 
      fetchClasses(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add class');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClassClick = async (cls) => {
    setSelectedClass(cls);
    fetchClassStudents(cls._id);
  };

  const fetchClassStudents = async (classId) => {
    setLoadingStudents(true);
    try {
      // Assuming your backend supports filtering students by classId
      const response = await api.get(`/admin/students?classId=${classId}`);
      setClassStudents(response.data?.data?.students || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch students for this class');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleBack = () => {
    setSelectedClass(null);
    setClassStudents([]);
  };

  // --- DETAILED CLASS VIEW ---
  if (selectedClass) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header & Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Class {selectedClass.className}</h2>
            <p className="text-muted-foreground">Manage details, subjects, and students for this class.</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Teacher Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Class Teacher
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedClass.classTeacher ? (
                <div className="mt-2">
                  <p className="text-lg font-medium">{selectedClass.classTeacher.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedClass.classTeacher.email}</p>
                </div>
              ) : (
                <div className="mt-2 flex items-center text-muted-foreground">
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Not Assigned</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subject Teachers Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Subject Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedClass.subjectTeachers && selectedClass.subjectTeachers.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {selectedClass.subjectTeachers.map((st, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm border-b last:border-0 pb-2 last:pb-0">
                      <span className="font-medium text-foreground">{st.subject?.name}</span>
                      <span className="text-muted-foreground">{st.teacher?.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No subject teachers assigned yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Students Table Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Enrolled Students
              </CardTitle>
              <CardDescription>
                List of all students currently enrolled in {selectedClass.className}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {classStudents.length} Students
            </Badge>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : classStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <GraduationCap className="h-12 w-12 mb-3 text-muted-foreground/50" />
                <p>No students found in this class.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Parent/Guardian</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell className="font-medium">{student.rollNumber || '-'}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.parent?.name || 'N/A'}</TableCell>
                        <TableCell>{student.parent?.phone || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- MAIN CLASSES GRID VIEW ---
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Manage Classes</h2>
          <p className="text-muted-foreground mt-1">Define and organize the academic structure of your school.</p>
        </div>
        
        {/* Add Class Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus size={18} /> Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Create a new academic class (e.g., "10 A", "Grade 5").</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5 py-4">
              <div className="space-y-3">
                  <Label htmlFor="className">Class Name</Label>
                  <Input 
                      id="className" 
                      placeholder="e.g. 10 A" 
                      value={className} 
                      onChange={e => setClassName(e.target.value)} 
                      required 
                      className="w-full"
                  />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Class'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Area */}
      {loading ? (
        // Loading State: Skeleton Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((skeleton) => (
            <Card key={skeleton} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-5 bg-muted rounded w-1/2"></div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-3/4 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : classes.length === 0 ? (
        // Empty State
        <Card className="border-dashed shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Layers className="h-10 w-10 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Classes Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't added any classes yet. Click the "Add Class" button above to get started.
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus size={16} /> Add Your First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Data State: Responsive Grid of Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <Card 
              key={cls._id} 
              onClick={() => handleClassClick(cls)}
              className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {cls.className}
                  </CardTitle>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <BookOpen size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span className="truncate">
                      {cls.classTeacher ? cls.classTeacher.name : 'No Class Teacher'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{cls.subjectTeachers?.length || 0} Subjects</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageClasses;