// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { toast } from 'sonner';
// import { Plus, Loader2, Pencil, UserPlus, Crown, BookOpen } from 'lucide-react';

// const ManageTeachers = () => {
//   // --- State Management ---
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
  
//   const [loading, setLoading] = useState(true);

//   // Add/Edit Dialog State
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingTeacherId, setEditingTeacherId] = useState(null);
  
//   // Assign Class Dialog State
//   const [isAssignOpen, setIsAssignOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [assignClassId, setAssignClassId] = useState('');
//   const [isAssigning, setIsAssigning] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     subjects: []
//   });

//   // --- Initial Data Fetching ---
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [teachersRes, subjectsRes, classesRes] = await Promise.all([
//         api.get('/admin/teachers'),
//         api.get('/admin/subjects'),
//         api.get('/admin/classes')
//       ]);

//       setTeachers(teachersRes.data?.data?.teachers || []);
//       setSubjects(subjectsRes.data?.data?.subjects || []);
//       setClasses(classesRes.data?.data?.classes || []);
//     } catch (error) {
//       console.error("Data fetch error:", error);
//       toast.error('Failed to load initial data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers: Add/Edit Teacher ---

//   const handleOpenAddDialog = () => {
//     setEditingTeacherId(null);
//     setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
//     setIsDialogOpen(true);
//   };

//   const handleEditClick = (teacher) => {
//     setEditingTeacherId(teacher._id);
//     setFormData({
//       name: teacher.name,
//       email: teacher.email,
//       password: '', 
//       phone: teacher.phone || '',
//       subjects: teacher.subjects || [] 
//     });
//     setIsDialogOpen(true);
//   };

//   const handleSubjectChange = (subjectName, isChecked) => {
//     setFormData(prev => {
//       const currentSubjects = prev.subjects;
//       if (isChecked) return { ...prev, subjects: [...currentSubjects, subjectName] };
//       return { ...prev, subjects: currentSubjects.filter(sub => sub !== subjectName) };
//     });
//   };

//   const handleCreateOrUpdate = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (formData.subjects.length === 0) {
//         toast.warning('Please select at least one subject taught by this teacher.');
//         setIsSubmitting(false);
//         return;
//       }

//       if (editingTeacherId) {
//         // Update Logic
//         const updateData = { ...formData };
//         if (!updateData.password) delete updateData.password;
//         await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
//         toast.success('Teacher updated successfully');
//       } else {
//         // Create Logic
//         if (!formData.password) {
//             toast.error('Password is required');
//             setIsSubmitting(false);
//             return;
//         }
//         await api.post('/admin/add-teacher', formData);
//         toast.success('Teacher added successfully');
//       }
      
//       setIsDialogOpen(false);
//       fetchAllData(); // Refresh all data
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- Handlers: Assign Class ---

//   const handleOpenAssignDialog = (teacher) => {
//     setSelectedTeacher(teacher);
//     setAssignClassId(teacher.assignedClass?._id || ''); 
//     setIsAssignOpen(true);
//   };

//   const handleAssignClassSubmit = async () => {
//     if (!assignClassId) {
//         toast.warning('Please select a class');
//         return;
//     }
    
//     setIsAssigning(true);
//     try {
//         await api.patch('/admin/assign-class-teacher', {
//             teacherId: selectedTeacher._id,
//             classId: assignClassId
//         });
//         toast.success(`Class assigned to ${selectedTeacher.name}`);
//         setIsAssignOpen(false);
//         fetchAllData(); 
//     } catch (error) {
//         console.error("Assignment error:", error);
//         toast.error(error.response?.data?.message || 'Failed to assign class');
//     } finally {
//         setIsAssigning(false);
//     }
//   };

//   // --- Render ---
//   return (
//     <div className="space-y-6">
//       {/* Header & Add Button */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
//           <p className="text-muted-foreground">Add teachers, assign subjects, and appoint class teachers.</p>
//         </div>
        
//         <Button className="gap-2" onClick={handleOpenAddDialog}>
//             <Plus size={16} /> Add Teacher
//         </Button>
//       </div>

//       {/* Main Table */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Contact</TableHead>
//                 <TableHead className="w-[30%]">Subjects Taught</TableHead>
//                 <TableHead>Class Teacher Of</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                  <TableRow>
//                     <TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell>
//                  </TableRow>
//               ) : teachers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                     No teachers found. Add a teacher to get started.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 teachers.map((teacher) => (
//                   <TableRow key={teacher._id}>
//                     <TableCell className="font-medium">
//                         {teacher.name}
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex flex-col text-xs text-muted-foreground">
//                             <span>{teacher.email}</span>
//                             <span>{teacher.phone}</span>
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex flex-wrap gap-1.5">
//                             {teacher.subjects && teacher.subjects.length > 0 ? (
//                                 teacher.subjects.map((sub, idx) => (
//                                     <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground border border-border/50">
//                                         <BookOpen size={10} className="opacity-50" />
//                                         {sub}
//                                     </span>
//                                 ))
//                             ) : (
//                                 <span className="text-xs text-muted-foreground italic">No subjects assigned</span>
//                             )}
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         {teacher.assignedClass ? (
//                              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
//                                  <Crown size={12} />
//                                  Grade {teacher.assignedClass.grade} - {teacher.assignedClass.section}
//                              </span>
//                         ) : (
//                             <span className="text-muted-foreground text-xs pl-2">—</span>
//                         )}
//                     </TableCell>
//                     <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                             <Button 
//                                 variant="outline" 
//                                 size="icon" 
//                                 className="h-8 w-8" 
//                                 title="Assign Class Teacher Role"
//                                 onClick={() => handleOpenAssignDialog(teacher)}
//                             >
//                                 <Crown size={14} className="text-muted-foreground" />
//                             </Button>
//                             <Button 
//                                 variant="ghost" 
//                                 size="icon" 
//                                 className="h-8 w-8"
//                                 onClick={() => handleEditClick(teacher)}
//                             >
//                                 <Pencil size={14} className="text-blue-600" />
//                             </Button>
//                         </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* --- Dialog: Add/Edit Teacher --- */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
//               <DialogDescription>
//                 {editingTeacherId ? 'Update teacher details and subjects.' : 'Create a new teacher account.'}
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">{editingTeacherId ? 'New Password (Optional)' : 'Password'}</Label>
//                 <Input id="password" type="password" placeholder={editingTeacherId ? "Unchanged" : "******"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
//               </div>
              
//               <div className="space-y-2">
//                 <Label className="flex items-center justify-between">
//                     <span>Subjects</span>
//                     <span className="text-[10px] font-normal text-muted-foreground">Select all that apply</span>
//                 </Label>
//                 <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {subjects.length === 0 ? (
//                          <div className="col-span-2 text-center text-sm text-muted-foreground py-2">No subjects found. Add subjects first.</div>
//                     ) : (
//                         subjects.map((sub) => (
//                             <div key={sub._id} className="flex items-center space-x-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
//                                 <Checkbox 
//                                     id={`sub-${sub._id}`}
//                                     checked={formData.subjects.includes(sub.name)}
//                                     onCheckedChange={(checked) => handleSubjectChange(sub.name, checked)}
//                                 />
//                                 <Label htmlFor={`sub-${sub._id}`} className="text-sm font-normal cursor-pointer select-none flex-1">
//                                     {sub.name}
//                                 </Label>
//                             </div>
//                         ))
//                     )}
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingTeacherId ? 'Update Teacher' : 'Create Teacher')}
//                 </Button>
//               </DialogFooter>
//             </form>
//         </DialogContent>
//       </Dialog>

//       {/* --- Dialog: Assign Class --- */}
//       <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//             <DialogHeader>
//                 <DialogTitle>Assign Class Teacher</DialogTitle>
//                 <DialogDescription>
//                     Appoint <strong>{selectedTeacher?.name}</strong> as the class teacher for:
//                 </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//                 <div className="space-y-2">
//                     <Label>Select Class</Label>
//                     <Select value={assignClassId} onValueChange={setAssignClassId}>
//                         <SelectTrigger>
//                             <SelectValue placeholder="Select a class..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                              {classes.length === 0 ? (
//                                 <div className="p-2 text-sm text-muted-foreground text-center">No classes available</div>
//                              ) : (
//                                 classes.map(cls => (
//                                      <SelectItem key={cls._id} value={cls._id}>
//                                          Grade {cls.grade} - {cls.section} 
//                                          {cls.classTeacher && cls.classTeacher !== selectedTeacher?._id ? " (Has Teacher)" : ""}
//                                      </SelectItem>
//                                  ))
//                              )}
//                         </SelectContent>
//                     </Select>
//                     <p className="text-[11px] text-muted-foreground">
//                         A teacher can only be the class teacher for one class at a time.
//                     </p>
//                 </div>
//             </div>
//             <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
//                 <Button onClick={handleAssignClassSubmit} disabled={isAssigning}>
//                     {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Assign Class'}
//                 </Button>
//             </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ManageTeachers;


import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Plus, Loader2, Pencil, Crown, BookOpen, KeyRound, Copy } from 'lucide-react';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  
  // Assign Class Dialog State
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [assignClassId, setAssignClassId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '', // Optional now
    password: '',
    phone: '',
    subjects: []
  });

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
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingTeacherId(null);
    setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
    setIsDialogOpen(true);
  };

  const handleEditClick = (teacher) => {
    setEditingTeacherId(teacher._id);
    setFormData({
      name: teacher.name,
      email: teacher.email || '',
      password: '', 
      phone: teacher.phone || '',
      subjects: teacher.subjects || [] 
    });
    setIsDialogOpen(true);
  };

  const handleSubjectChange = (subjectName, isChecked) => {
    setFormData(prev => {
      const currentSubjects = prev.subjects;
      if (isChecked) return { ...prev, subjects: [...currentSubjects, subjectName] };
      return { ...prev, subjects: currentSubjects.filter(sub => sub !== subjectName) };
    });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.subjects.length === 0) {
        toast.warning('Please select at least one subject.');
        setIsSubmitting(false);
        return;
      }

      if (editingTeacherId) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
        toast.success('Teacher updated successfully');
      } else {
        if (!formData.password) {
            toast.error('Password is required');
            setIsSubmitting(false);
            return;
        }
        // Note: Username is generated by backend
        await api.post('/admin/add-teacher', formData);
        toast.success('Teacher created. Username has been generated.');
      }
      
      setIsDialogOpen(false);
      fetchAllData(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAssignDialog = (teacher) => {
    setSelectedTeacher(teacher);
    setAssignClassId(teacher.assignedClass?._id || ''); 
    setIsAssignOpen(true);
  };

  const handleAssignClassSubmit = async () => {
    if (!assignClassId) {
        toast.warning('Please select a class');
        return;
    }
    
    setIsAssigning(true);
    try {
        await api.patch('/admin/assign-class-teacher', {
            teacherId: selectedTeacher._id,
            classId: assignClassId
        });
        toast.success(`Class assigned to ${selectedTeacher.name}`);
        setIsAssignOpen(false);
        fetchAllData(); 
    } catch (error) {
        console.error("Assignment error:", error);
        toast.error(error.response?.data?.message || 'Failed to assign class');
    } finally {
        setIsAssigning(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
          <p className="text-muted-foreground">Add teachers, generate logins, and assign subjects.</p>
        </div>
        
        <Button className="gap-2" onClick={handleOpenAddDialog}>
            <Plus size={16} /> Add Teacher
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Details</TableHead>
                <TableHead>Login ID (Username)</TableHead>
                <TableHead className="w-[30%]">Subjects</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell>
                 </TableRow>
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No teachers found.
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell className="font-medium">
                        <div className="flex flex-col">
                           <span className="font-semibold">{teacher.name}</span>
                           {teacher.email && <span className="text-[10px] text-muted-foreground">{teacher.email}</span>}
                        </div>
                    </TableCell>
                    {/* NEW: Username Display Column */}
                    <TableCell>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                            <KeyRound size={12} className="text-primary" />
                            <span className="font-mono text-xs font-bold">{teacher.username}</span>
                            <button onClick={() => copyToClipboard(teacher.username)} className="text-muted-foreground hover:text-primary">
                                <Copy size={12} />
                            </button>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                            {teacher.subjects && teacher.subjects.length > 0 ? (
                                teacher.subjects.map((sub, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground border border-border/50">
                                        <BookOpen size={10} className="opacity-50" />
                                        {sub}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-muted-foreground italic">No subjects</span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        {teacher.assignedClass ? (
                             <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                                 <Crown size={12} />
                                 {teacher.assignedClass.grade}-{teacher.assignedClass.section}
                             </span>
                        ) : (
                            <span className="text-muted-foreground text-xs pl-2">—</span>
                        )}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8" 
                                title="Assign Class Teacher Role"
                                onClick={() => handleOpenAssignDialog(teacher)}
                            >
                                <Crown size={14} className="text-muted-foreground" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleEditClick(teacher)}
                            >
                                <Pencil size={14} className="text-blue-600" />
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Dialog: Add/Edit Teacher --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
              <DialogDescription>
                {editingTeacherId ? 'Update details.' : 'The system will generate a unique Username for login automatically.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Rahul Sharma" />
              </div>
              
              {/* Email is now optional */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Contact purposes only" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{editingTeacherId ? 'New Password (Optional)' : 'Password'}</Label>
                <Input id="password" type="password" placeholder={editingTeacherId ? "Unchanged" : "Create a password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                    {subjects.length === 0 ? (
                         <div className="col-span-2 text-center text-sm text-muted-foreground py-2">No subjects found. Add subjects first.</div>
                    ) : (
                        subjects.map((sub) => (
                            <div key={sub._id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`sub-${sub._id}`}
                                    checked={formData.subjects.includes(sub.name)}
                                    onCheckedChange={(checked) => handleSubjectChange(sub.name, checked)}
                                />
                                <Label htmlFor={`sub-${sub._id}`} className="text-sm cursor-pointer flex-1">
                                    {sub.name}
                                </Label>
                            </div>
                        ))
                    )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingTeacherId ? 'Update' : 'Generate ID & Create')}
                </Button>
              </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
      
      {/* Assign Class Dialog remains unchanged from your original logic... */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Assign Class Teacher</DialogTitle>
                <DialogDescription>
                    Appoint <strong>{selectedTeacher?.name}</strong> as the class teacher for:
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Select Class</Label>
                    <Select value={assignClassId} onValueChange={setAssignClassId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a class..." />
                        </SelectTrigger>
                        <SelectContent>
                             {classes.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground text-center">No classes available</div>
                             ) : (
                                classes.map(cls => (
                                     <SelectItem key={cls._id} value={cls._id}>
                                         Grade {cls.grade} - {cls.section} 
                                         {cls.classTeacher && cls.classTeacher !== selectedTeacher?._id ? " (Has Teacher)" : ""}
                                     </SelectItem>
                                 ))
                             )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                <Button onClick={handleAssignClassSubmit} disabled={isAssigning}>
                    {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Assign Class'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTeachers;