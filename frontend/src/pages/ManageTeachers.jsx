import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';
import { 
  Plus, Loader2, Crown, BookOpen, KeyRound, Copy, Users, 
  Search, Eye, EyeOff, UserCog, X
} from 'lucide-react';

const ManageTeachers = () => {
  // --- State ---
  const [showPassword, setShowPassword] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTeacher, setViewTeacher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search Filter
  const [tableSearch, setTableSearch] = useState('');

  // Form State (Updated to handle assignments array)
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    isClassTeacher: false,
    assignedClassId: '',
    assignments: [] // Array of { classId: '', subjectId: '' }
  });

  // --- Init ---
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [teachersRes, subjectsRes, classesRes] = await Promise.all([
        api.get('/admin/teachers'),
        api.get('/admin/subjects'),
        api.get('/admin/classes')
      ]);

      setTeachers(teachersRes.data?.data?.teachers || []);
      setSubjects(subjectsRes.data?.data?.subjects || []);
      setClasses(classesRes.data?.data?.classes || []);
    } catch (error) {
      console.error("Data fetch error:", error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // --- Enhanced Mapping: Maps Teacher ID to specific Classes AND the Subjects taught in that class
  const teacherClassMap = useMemo(() => {
    const map = {}; 
    
    classes.forEach(cls => {
      cls.subjectTeachers?.forEach(st => {
        const tId = typeof st.teacher === 'object' ? st.teacher._id : st.teacher;
        const sId = typeof st.subject === 'object' ? st.subject._id : st.subject;
        
        if (tId) {
          if (!map[tId]) map[tId] = [];
          
          // Find if we already registered this class for this teacher
          let classEntry = map[tId].find(c => c.class._id === cls._id);
          if (!classEntry) {
            classEntry = { class: cls, subjects: [] };
            map[tId].push(classEntry);
          }
          
          // Attach the subject to this specific class
          const subjectObj = typeof st.subject === 'object' ? st.subject : subjects.find(s => s._id === sId);
          if (subjectObj && !classEntry.subjects.some(s => s._id === subjectObj._id)) {
             classEntry.subjects.push(subjectObj);
          }
        }
      });
    });

    return map;
  }, [classes, subjects]);

  // --- Helpers ---
  const formatClass = (cls) => cls ? cls.className : '';

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      t.username.toLowerCase().includes(tableSearch.toLowerCase())
    );
  }, [teachers, tableSearch]);

  const availableForClassTeacher = useMemo(() => {
    return classes.filter(cls => !cls.classTeacher);
  }, [classes]);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      password: '',
      isClassTeacher: false,
      assignedClassId: '',
      assignments: [] // Start empty
    });
    setIsAddOpen(true);
  };

  const handleOpenView = (teacher) => {
    const specificAssignments = teacherClassMap[teacher._id] || [];
    setViewTeacher({ ...teacher, specificAssignments });
    setIsViewOpen(true);
  };

  // --- Dynamic Assignment Handlers ---
  const handleAddAssignmentRow = () => {
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, { classId: '', subjectId: '' }]
    }));
  };

  const handleUpdateAssignment = (index, field, value) => {
    const updatedAssignments = [...formData.assignments];
    updatedAssignments[index][field] = value;
    setFormData(prev => ({ ...prev, assignments: updatedAssignments }));
  };

  const handleRemoveAssignmentRow = (index) => {
    const updatedAssignments = formData.assignments.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, assignments: updatedAssignments }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.password) {
        toast.error('Name and Password are required');
        return;
    }
    if (formData.isClassTeacher && !formData.assignedClassId) {
        toast.error('Select a class for Class Teacher role');
        return;
    }

    // Clean up empty assignments before submitting
    const cleanedAssignments = formData.assignments.filter(a => a.classId && a.subjectId);

    setIsSubmitting(true);
    try {
      await api.post('/admin/add-teacher', {
         ...formData,
         assignments: cleanedAssignments
      });
      toast.success('Teacher added successfully');
      setIsAddOpen(false);
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add teacher');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Staff Management</h2>
          <p className="text-muted-foreground mt-1">Manage teacher profiles, assignments, and credentials.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="Find teacher..." 
                className="pl-9 w-[200px] bg-white dark:bg-background"
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
             />
           </div>
           <Button onClick={handleOpenAdd} className="gap-2 shadow-sm">
              <Plus size={16} /> Add Teacher
           </Button>
        </div>
      </div>

      {/* --- Stats Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-100 dark:border-blue-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{teachers.length}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background border-amber-100 dark:border-amber-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class Teachers</p>
              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {teachers.filter(t => t.assignedClass).length}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600">
              <Crown size={20} />
            </div>
          </CardContent>
        </Card>
        <Card>
           <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Subjects</p>
              <h3 className="text-2xl font-bold">{subjects.length}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <BookOpen size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Main Table --- */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="w-[250px]">Teacher Profile</TableHead>
                <TableHead>Assignments Summary</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-2 block">Loading staff data...</span>
                    </TableCell>
                 </TableRow>
              ) : filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No teachers found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => {
                  const specificAssignments = teacherClassMap[teacher._id] || [];
                  const teachingCount = specificAssignments.length;
                  const subjectCount = teacher.subjects?.length || 0;
                  
                  return (
                    <TableRow key={teacher._id} className="group">
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{teacher.name}</span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 w-fit px-1.5 py-0.5 rounded border">
                            <KeyRound size={10} />
                            <span className="font-mono">{teacher.username}</span>
                            <Copy 
                              size={10} 
                              className="cursor-pointer hover:text-primary" 
                              onClick={() => copyToClipboard(teacher.username)}
                            />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2 text-sm">
                              <BookOpen size={14} className="text-blue-500" />
                              {subjectCount === 0 ? (
                                <span className="text-muted-foreground text-xs italic">No subjects</span>
                              ) : (
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                   {subjectCount} Subject{subjectCount !== 1 && 's'}
                                </span>
                              )}
                           </div>
                           
                           <div className="flex items-center gap-2 text-sm">
                              <Users size={14} className="text-green-500" />
                              {teachingCount === 0 ? (
                                <span className="text-muted-foreground text-xs italic">No classes assigned</span>
                              ) : (
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  Teaches in {teachingCount} Class{teachingCount !== 1 && 'es'}
                                </span>
                              )}
                           </div>
                        </div>
                      </TableCell>

                      <TableCell>
                          {teacher.assignedClass ? (
                             <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 gap-1.5 py-1">
                                 <Crown size={12} className="fill-amber-700 dark:fill-amber-400 text-amber-700 dark:text-amber-400" />
                                 Class Teacher: {formatClass(teacher.assignedClass)}
                             </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Subject Teacher</span>
                          )}
                      </TableCell>

                      <TableCell className="text-right">
                         <Button variant="ghost" size="sm" onClick={() => handleOpenView(teacher)} className="h-8 gap-1 text-muted-foreground hover:text-primary">
                            <Eye size={16} /> View Profile
                         </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- ADD TEACHER MODAL --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl flex items-center gap-2">
                <UserCog className="text-primary" /> Add New Teacher
              </DialogTitle>
              <DialogDescription>
                Create a new staff account and map their exact subject-to-class schedule.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>Full Name <span className="text-red-500">*</span></Label>
                      <Input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Sarah Connor"
                        name="teacher-name"
                        autoComplete="off"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label>Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        placeholder="Set initial password"
                        name="teacher-password"
                        autoComplete="new-password"
                      />
                      <Button type="button" variant="transparent" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
               </div>

               <div className="h-px bg-border" />

               {/* --- Dynamic Assignment Section --- */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <Label className="flex items-center gap-2 font-medium">
                       <BookOpen size={16} className="text-blue-500"/> Subject & Class Mapping
                     </Label>
                     <Button type="button" variant="outline" size="sm" onClick={handleAddAssignmentRow} className="h-7 text-xs">
                        <Plus size={14} className="mr-1" /> Add Class
                     </Button>
                  </div>

                  {formData.assignments.length === 0 && (
                     <div className="text-center p-6 border rounded-md border-dashed text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/50">
                        No subjects assigned yet. Click "Add Class" to map subjects to classes.
                     </div>
                  )}

                  <div className="space-y-2">
                    {formData.assignments.map((assignment, index) => (
                       <div key={index} className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          <Select 
                             value={assignment.classId} 
                             onValueChange={v => handleUpdateAssignment(index, 'classId', v)}
                          >
                             <SelectTrigger className="flex-1">
                               <SelectValue placeholder="Select Class" />
                             </SelectTrigger>
                             <SelectContent>
                                {classes.map(c => <SelectItem key={c._id} value={c._id}>{formatClass(c)}</SelectItem>)}
                             </SelectContent>
                          </Select>

                          <Select 
                             value={assignment.subjectId} 
                             onValueChange={v => handleUpdateAssignment(index, 'subjectId', v)}
                          >
                             <SelectTrigger className="flex-1">
                               <SelectValue placeholder="Select Subject" />
                             </SelectTrigger>
                             <SelectContent>
                                {subjects.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                             </SelectContent>
                          </Select>

                          <Button 
                             variant="ghost" 
                             size="icon" 
                             className="text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0" 
                             onClick={() => handleRemoveAssignmentRow(index)}
                          >
                             <X size={16} />
                          </Button>
                       </div>
                    ))}
                  </div>
               </div>

               <div className="h-px bg-border" />

               {/* --- Class Teacher Section --- */}
               <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Checkbox 
                           id="ct-role"
                           checked={formData.isClassTeacher}
                           onCheckedChange={(c) => setFormData(prev => ({ ...prev, isClassTeacher: c }))}
                        />
                        <Label htmlFor="ct-role" className="font-semibold cursor-pointer text-amber-900 dark:text-amber-200">
                          Assign as Class Teacher?
                        </Label>
                     </div>
                     {formData.isClassTeacher && (
                       <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Admin Role</Badge>
                     )}
                  </div>

                  {formData.isClassTeacher && (
                    <div className="pl-6 animate-in slide-in-from-top-1 fade-in duration-200">
                       <Label className="text-xs text-muted-foreground mb-1.5 block">Select Class to Manage</Label>
                       <Select 
                          value={formData.assignedClassId} 
                          onValueChange={(v) => setFormData(prev => ({...prev, assignedClassId: v}))}
                       >
                          <SelectTrigger className="bg-white dark:bg-black/20 border-amber-200">
                             <SelectValue placeholder="Select class..." />
                          </SelectTrigger>
                          <SelectContent>
                             {availableForClassTeacher.length === 0 ? (
                                <div className="p-2 text-xs text-center text-muted-foreground">All classes have teachers.</div>
                             ) : (
                                availableForClassTeacher.map(c => (
                                   <SelectItem key={c._id} value={c._id}>{formatClass(c)}</SelectItem>
                                ))
                             )}
                          </SelectContent>
                       </Select>
                       <p className="text-[10px] text-muted-foreground mt-1">
                         * Shows only classes without a Class Teacher.
                       </p>
                    </div>
                  )}
               </div>
            </div>

            <DialogFooter className="p-4 border-t bg-slate-50 dark:bg-slate-900/50 gap-2">
               <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
               <Button onClick={handleSubmit} disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Create Teacher Account
               </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- VIEW PROFILE MODAL --- */}
      {viewTeacher && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[600px]">
             <DialogHeader className="border-b pb-4 mb-4">
                <div className="flex items-center gap-3">
                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                      {viewTeacher.name.charAt(0)}
                   </div>
                   <div>
                      <DialogTitle className="text-xl">{viewTeacher.name}</DialogTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                         <KeyRound size={12} /> {viewTeacher.username}
                      </div>
                   </div>
                </div>
             </DialogHeader>

             <div className="space-y-6">
                {/* Admin Role Badge */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-md border">
                   <span className="text-sm font-medium">Administrative Role</span>
                   {viewTeacher.assignedClass ? (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                         <Crown size={12} className="mr-1" /> Class Teacher ({formatClass(viewTeacher.assignedClass)})
                      </Badge>
                   ) : (
                      <span className="text-sm text-muted-foreground">Subject Teacher Only</span>
                   )}
                </div>

                {/* Specific Class -> Subject Mapping Display */}
                <div>
                   <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-500" /> Exact Teaching Schedule
                   </h4>
                   
                   <div className="grid gap-3 max-h-[250px] overflow-y-auto pr-2">
                      {viewTeacher.specificAssignments?.length > 0 ? (
                        viewTeacher.specificAssignments.map((assignment, i) => (
                           <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-950 shadow-sm">
                              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="font-semibold text-sm">Class {formatClass(assignment.class)}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 justify-end">
                                {assignment.subjects.map((sub, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-normal">
                                    {sub.name}
                                  </Badge>
                                ))}
                              </div>
                           </div>
                        ))
                      ) : (
                        <div className="text-center p-4 border rounded-md border-dashed text-sm text-muted-foreground">
                          Not teaching any subjects in any classes yet.
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <DialogFooter className="mt-4">
                <Button onClick={() => setIsViewOpen(false)}>Close Profile</Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ManageTeachers;