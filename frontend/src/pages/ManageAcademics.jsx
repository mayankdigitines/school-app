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
  GraduationCap,
  School,
  Library
} from 'lucide-react';

const ManageAcademics = () => {
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' or 'subjects'

  // --- CLASSES STATE ---
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isClassSubmitting, setIsClassSubmitting] = useState(false);
  const [className, setClassName] = useState(''); 
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // --- SUBJECTS STATE ---
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({ name: '' });
  const [isSubjectSubmitting, setIsSubjectSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  // --- CLASSES LOGIC ---
  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data?.data?.classes || []); 
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setIsClassSubmitting(true);
    try {
      await api.post('/admin/add-class', { className }); 
      toast.success('Class added successfully');
      setIsClassDialogOpen(false);
      setClassName(''); 
      fetchClasses(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add class');
    } finally {
      setIsClassSubmitting(false);
    }
  };

  const handleClassClick = async (cls) => {
    setSelectedClass(cls);
    fetchClassStudents(cls._id);
  };

  const fetchClassStudents = async (classId) => {
    setLoadingStudents(true);
    try {
      const response = await api.get(`/admin/students?classId=${classId}`);
      setClassStudents(response.data?.data?.students || []);
    } catch (error) {
      toast.error('Failed to fetch students for this class');
    } finally {
      setLoadingStudents(false);
    }
  };

  // --- SUBJECTS LOGIC ---
  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const response = await api.get('/admin/subjects');
      setSubjects(response.data?.data?.subjects || []);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setIsSubjectSubmitting(true);
    try {
      await api.post('/admin/add-subject', subjectFormData);
      toast.success('Subject added successfully');
      setIsSubjectDialogOpen(false);
      setSubjectFormData({ name: '' });
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subject');
    } finally {
      setIsSubjectSubmitting(false);
    }
  };

  // --- DETAILED CLASS VIEW ---
  if (selectedClass) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => setSelectedClass(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Class {selectedClass.className}</h2>
            <p className="text-muted-foreground">Manage details, subjects, and students for this class.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all">
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
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">Not Assigned</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Library className="h-5 w-5 text-blue-500" />
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

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 border-b">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Enrolled Students
              </CardTitle>
              <CardDescription>
                List of all students currently enrolled in {selectedClass.className}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20">
              {classStudents.length} Students
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {loadingStudents ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : classStudents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                <GraduationCap className="h-12 w-12 mb-3 text-muted-foreground/30" />
                <p>No students found in this class.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                      <TableHead className="pl-6">Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Parent/Guardian</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell className="font-medium pl-6">{student.rollNumber || '-'}</TableCell>
                        <TableCell className="font-semibold">{student.name}</TableCell>
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER & TAB CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Academics</h2>
          <p className="text-muted-foreground mt-1">Manage your school's classes and curriculum in one place.</p>
        </div>

        {/* Custom Segmented Control for Tabs */}
        <div className="flex p-1 space-x-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'classes'
                ? 'bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <School size={16} /> Classes
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'subjects'
                ? 'bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen size={16} /> Subjects
          </button>
        </div>
      </div>

      {/* ---------------- CLASSES VIEW ---------------- */}
      {activeTab === 'classes' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-end">
            <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm bg-primary hover:bg-primary/90 text-white rounded-xl">
                  <Plus size={18} /> Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>Create a new academic class (e.g., "10 A", "Grade 5").</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateClass} className="space-y-5 py-4">
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
                    <Button type="button" variant="outline" onClick={() => setIsClassDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isClassSubmitting}>
                        {isClassSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Class'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loadingClasses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((skeleton) => (
                <Card key={skeleton} className="animate-pulse border-none shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                    <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                  </CardHeader>
                  <CardContent className="pt-4"><div className="h-10 bg-slate-200 rounded w-full"></div></CardContent>
                </Card>
              ))}
            </div>
          ) : classes.length === 0 ? (
            <Card className="border-dashed shadow-sm border-2 border-slate-200 bg-slate-50/30">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-primary/10 p-5 rounded-full mb-4 ring-8 ring-primary/5">
                  <School className="h-10 w-10 text-primary opacity-80" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Classes Found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">You haven't established any classes yet. Create your first class to start structuring your school.</p>
                <Button onClick={() => setIsClassDialogOpen(true)} className="gap-2 rounded-xl">
                  <Plus size={16} /> Add Your First Class
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {classes.map((cls) => (
                <Card 
                  key={cls._id} 
                  onClick={() => handleClassClick(cls)}
                  className="group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition-all duration-300 border-slate-200 overflow-hidden"
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
                    <div className="space-y-1">
                      <CardDescription className="font-semibold text-primary/80 uppercase tracking-wider text-xs">Class</CardDescription>
                      <CardTitle className="text-3xl font-black tracking-tight text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                        {cls.className}
                      </CardTitle>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                      <Layers size={22} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5 bg-white dark:bg-slate-950">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center text-sm p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <UserCircle className="mr-3 h-5 w-5 text-slate-400" />
                        <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                          {cls.classTeacher ? cls.classTeacher.name : <span className="text-slate-400 italic">No Teacher</span>}
                        </span>
                      </div>
                      <div className="flex items-center text-sm p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <BookOpen className="mr-3 h-5 w-5 text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {cls.subjectTeachers?.length || 0} <span className="text-slate-500 font-normal">Subjects Assigned</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- SUBJECTS VIEW ---------------- */}
      {activeTab === 'subjects' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-end">
            <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Plus size={18} /> Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription>Create a new subject to add to the curriculum.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSubject} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subName">Subject Name</Label>
                    <Input
                      id="subName"
                      placeholder="e.g. Mathematics"
                      value={subjectFormData.name}
                      onChange={e => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubjectSubmitting} className="bg-blue-600 hover:bg-blue-700">
                      {isSubjectSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Subject'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loadingSubjects ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
              <p>Loading subjects...</p>
            </div>
          ) : subjects.length === 0 ? (
             <Card className="border-dashed shadow-sm border-2 border-slate-200 bg-slate-50/30">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-4 ring-8 ring-blue-50 dark:ring-blue-900/10">
                  <Library className="h-10 w-10 text-blue-600 opacity-80" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Subjects Found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">You haven't added any subjects to the curriculum yet.</p>
                <Button onClick={() => setIsSubjectDialogOpen(true)} className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} /> Add First Subject
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {subjects.map((sub) => (
                <Card 
                  key={sub._id} 
                  className="group hover:-translate-y-1 hover:shadow-lg hover:border-blue-400/50 transition-all duration-300 overflow-hidden cursor-default flex flex-col border-slate-200"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center flex-1 gap-4 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900">
                    <div className="relative">
                      {sub.subjectIcon ? (
                        <div 
                          className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300 bg-white"
                          dangerouslySetInnerHTML={{ __html: sub.subjectIcon }} 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform duration-300">
                          <BookOpen size={28} className="text-blue-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sub.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ManageAcademics;