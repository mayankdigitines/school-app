// // // import { useEffect, useState } from 'react';
// // // import api from '../services/api';
// // // import { Card, CardContent } from '@/components/ui/card';
// // // import { Button } from '@/components/ui/button';
// // // import { Input } from '@/components/ui/input';
// // // import { Label } from '@/components/ui/label';
// // // import { Checkbox } from '@/components/ui/checkbox';
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table"
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogDescription,
// // //   DialogFooter,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from "@/components/ui/dialog"
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select"
// // // import { toast } from 'sonner';
// // // import { Plus, Loader2, Pencil, UserPlus, Crown, BookOpen } from 'lucide-react';

// // // const ManageTeachers = () => {
// // //   // --- State Management ---
// // //   const [teachers, setTeachers] = useState([]);
// // //   const [subjects, setSubjects] = useState([]);
// // //   const [classes, setClasses] = useState([]);
  
// // //   const [loading, setLoading] = useState(true);

// // //   // Add/Edit Dialog State
// // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [editingTeacherId, setEditingTeacherId] = useState(null);
  
// // //   // Assign Class Dialog State
// // //   const [isAssignOpen, setIsAssignOpen] = useState(false);
// // //   const [selectedTeacher, setSelectedTeacher] = useState(null);
// // //   const [assignClassId, setAssignClassId] = useState('');
// // //   const [isAssigning, setIsAssigning] = useState(false);

// // //   const [formData, setFormData] = useState({
// // //     name: '',
// // //     email: '',
// // //     password: '',
// // //     phone: '',
// // //     subjects: []
// // //   });

// // //   // --- Initial Data Fetching ---
// // //   useEffect(() => {
// // //     fetchAllData();
// // //   }, []);

// // //   const fetchAllData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const [teachersRes, subjectsRes, classesRes] = await Promise.all([
// // //         api.get('/admin/teachers'),
// // //         api.get('/admin/subjects'),
// // //         api.get('/admin/classes')
// // //       ]);

// // //       setTeachers(teachersRes.data?.data?.teachers || []);
// // //       setSubjects(subjectsRes.data?.data?.subjects || []);
// // //       setClasses(classesRes.data?.data?.classes || []);
// // //     } catch (error) {
// // //       console.error("Data fetch error:", error);
// // //       toast.error('Failed to load initial data');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // --- Handlers: Add/Edit Teacher ---

// // //   const handleOpenAddDialog = () => {
// // //     setEditingTeacherId(null);
// // //     setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
// // //     setIsDialogOpen(true);
// // //   };

// // //   const handleEditClick = (teacher) => {
// // //     setEditingTeacherId(teacher._id);
// // //     setFormData({
// // //       name: teacher.name,
// // //       email: teacher.email,
// // //       password: '', 
// // //       phone: teacher.phone || '',
// // //       subjects: teacher.subjects || [] 
// // //     });
// // //     setIsDialogOpen(true);
// // //   };

// // //   const handleSubjectChange = (subjectName, isChecked) => {
// // //     setFormData(prev => {
// // //       const currentSubjects = prev.subjects;
// // //       if (isChecked) return { ...prev, subjects: [...currentSubjects, subjectName] };
// // //       return { ...prev, subjects: currentSubjects.filter(sub => sub !== subjectName) };
// // //     });
// // //   };

// // //   const handleCreateOrUpdate = async (e) => {
// // //     e.preventDefault();
// // //     setIsSubmitting(true);

// // //     try {
// // //       if (formData.subjects.length === 0) {
// // //         toast.warning('Please select at least one subject taught by this teacher.');
// // //         setIsSubmitting(false);
// // //         return;
// // //       }

// // //       if (editingTeacherId) {
// // //         // Update Logic
// // //         const updateData = { ...formData };
// // //         if (!updateData.password) delete updateData.password;
// // //         await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
// // //         toast.success('Teacher updated successfully');
// // //       } else {
// // //         // Create Logic
// // //         if (!formData.password) {
// // //             toast.error('Password is required');
// // //             setIsSubmitting(false);
// // //             return;
// // //         }
// // //         await api.post('/admin/add-teacher', formData);
// // //         toast.success('Teacher added successfully');
// // //       }
      
// // //       setIsDialogOpen(false);
// // //       fetchAllData(); // Refresh all data
// // //     } catch (error) {
// // //       console.error(error);
// // //       toast.error(error.response?.data?.message || 'Operation failed');
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   // --- Handlers: Assign Class ---

// // //   const handleOpenAssignDialog = (teacher) => {
// // //     setSelectedTeacher(teacher);
// // //     setAssignClassId(teacher.assignedClass?._id || ''); 
// // //     setIsAssignOpen(true);
// // //   };

// // //   const handleAssignClassSubmit = async () => {
// // //     if (!assignClassId) {
// // //         toast.warning('Please select a class');
// // //         return;
// // //     }
    
// // //     setIsAssigning(true);
// // //     try {
// // //         await api.patch('/admin/assign-class-teacher', {
// // //             teacherId: selectedTeacher._id,
// // //             classId: assignClassId
// // //         });
// // //         toast.success(`Class assigned to ${selectedTeacher.name}`);
// // //         setIsAssignOpen(false);
// // //         fetchAllData(); 
// // //     } catch (error) {
// // //         console.error("Assignment error:", error);
// // //         toast.error(error.response?.data?.message || 'Failed to assign class');
// // //     } finally {
// // //         setIsAssigning(false);
// // //     }
// // //   };

// // //   // --- Render ---
// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Header & Add Button */}
// // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // //         <div>
// // //           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
// // //           <p className="text-muted-foreground">Add teachers, assign subjects, and appoint class teachers.</p>
// // //         </div>
        
// // //         <Button className="gap-2" onClick={handleOpenAddDialog}>
// // //             <Plus size={16} /> Add Teacher
// // //         </Button>
// // //       </div>

// // //       {/* Main Table */}
// // //       <Card>
// // //         <CardContent className="p-0">
// // //           <Table>
// // //             <TableHeader>
// // //               <TableRow>
// // //                 <TableHead>Name</TableHead>
// // //                 <TableHead>Contact</TableHead>
// // //                 <TableHead className="w-[30%]">Subjects Taught</TableHead>
// // //                 <TableHead>Class Teacher Of</TableHead>
// // //                 <TableHead className="text-right">Actions</TableHead>
// // //               </TableRow>
// // //             </TableHeader>
// // //             <TableBody>
// // //               {loading ? (
// // //                  <TableRow>
// // //                     <TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell>
// // //                  </TableRow>
// // //               ) : teachers.length === 0 ? (
// // //                 <TableRow>
// // //                   <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
// // //                     No teachers found. Add a teacher to get started.
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ) : (
// // //                 teachers.map((teacher) => (
// // //                   <TableRow key={teacher._id}>
// // //                     <TableCell className="font-medium">
// // //                         {teacher.name}
// // //                     </TableCell>
// // //                     <TableCell>
// // //                         <div className="flex flex-col text-xs text-muted-foreground">
// // //                             <span>{teacher.email}</span>
// // //                             <span>{teacher.phone}</span>
// // //                         </div>
// // //                     </TableCell>
// // //                     <TableCell>
// // //                         <div className="flex flex-wrap gap-1.5">
// // //                             {teacher.subjects && teacher.subjects.length > 0 ? (
// // //                                 teacher.subjects.map((sub, idx) => (
// // //                                     <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground border border-border/50">
// // //                                         <BookOpen size={10} className="opacity-50" />
// // //                                         {sub}
// // //                                     </span>
// // //                                 ))
// // //                             ) : (
// // //                                 <span className="text-xs text-muted-foreground italic">No subjects assigned</span>
// // //                             )}
// // //                         </div>
// // //                     </TableCell>
// // //                     <TableCell>
// // //                         {teacher.assignedClass ? (
// // //                              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
// // //                                  <Crown size={12} />
// // //                                  Grade {teacher.assignedClass.grade} - {teacher.assignedClass.section}
// // //                              </span>
// // //                         ) : (
// // //                             <span className="text-muted-foreground text-xs pl-2">—</span>
// // //                         )}
// // //                     </TableCell>
// // //                     <TableCell className="text-right">
// // //                         <div className="flex justify-end gap-2">
// // //                             <Button 
// // //                                 variant="outline" 
// // //                                 size="icon" 
// // //                                 className="h-8 w-8" 
// // //                                 title="Assign Class Teacher Role"
// // //                                 onClick={() => handleOpenAssignDialog(teacher)}
// // //                             >
// // //                                 <Crown size={14} className="text-muted-foreground" />
// // //                             </Button>
// // //                             <Button 
// // //                                 variant="ghost" 
// // //                                 size="icon" 
// // //                                 className="h-8 w-8"
// // //                                 onClick={() => handleEditClick(teacher)}
// // //                             >
// // //                                 <Pencil size={14} className="text-blue-600" />
// // //                             </Button>
// // //                         </div>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ))
// // //               )}
// // //             </TableBody>
// // //           </Table>
// // //         </CardContent>
// // //       </Card>

// // //       {/* --- Dialog: Add/Edit Teacher --- */}
// // //       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// // //         <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
// // //             <DialogHeader>
// // //               <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
// // //               <DialogDescription>
// // //                 {editingTeacherId ? 'Update teacher details and subjects.' : 'Create a new teacher account.'}
// // //               </DialogDescription>
// // //             </DialogHeader>
// // //             <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="name">Full Name</Label>
// // //                 <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div className="space-y-2">
// // //                     <Label htmlFor="email">Email</Label>
// // //                     <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
// // //                 </div>
// // //                 <div className="space-y-2">
// // //                     <Label htmlFor="phone">Phone</Label>
// // //                     <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
// // //                 </div>
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="password">{editingTeacherId ? 'New Password (Optional)' : 'Password'}</Label>
// // //                 <Input id="password" type="password" placeholder={editingTeacherId ? "Unchanged" : "******"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
// // //               </div>
              
// // //               <div className="space-y-2">
// // //                 <Label className="flex items-center justify-between">
// // //                     <span>Subjects</span>
// // //                     <span className="text-[10px] font-normal text-muted-foreground">Select all that apply</span>
// // //                 </Label>
// // //                 <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
// // //                     {subjects.length === 0 ? (
// // //                          <div className="col-span-2 text-center text-sm text-muted-foreground py-2">No subjects found. Add subjects first.</div>
// // //                     ) : (
// // //                         subjects.map((sub) => (
// // //                             <div key={sub._id} className="flex items-center space-x-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
// // //                                 <Checkbox 
// // //                                     id={`sub-${sub._id}`}
// // //                                     checked={formData.subjects.includes(sub.name)}
// // //                                     onCheckedChange={(checked) => handleSubjectChange(sub.name, checked)}
// // //                                 />
// // //                                 <Label htmlFor={`sub-${sub._id}`} className="text-sm font-normal cursor-pointer select-none flex-1">
// // //                                     {sub.name}
// // //                                 </Label>
// // //                             </div>
// // //                         ))
// // //                     )}
// // //                 </div>
// // //               </div>

// // //               <DialogFooter>
// // //                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
// // //                 <Button type="submit" disabled={isSubmitting}>
// // //                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingTeacherId ? 'Update Teacher' : 'Create Teacher')}
// // //                 </Button>
// // //               </DialogFooter>
// // //             </form>
// // //         </DialogContent>
// // //       </Dialog>

// // //       {/* --- Dialog: Assign Class --- */}
// // //       <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
// // //         <DialogContent className="sm:max-w-[400px]">
// // //             <DialogHeader>
// // //                 <DialogTitle>Assign Class Teacher</DialogTitle>
// // //                 <DialogDescription>
// // //                     Appoint <strong>{selectedTeacher?.name}</strong> as the class teacher for:
// // //                 </DialogDescription>
// // //             </DialogHeader>
// // //             <div className="space-y-4 py-4">
// // //                 <div className="space-y-2">
// // //                     <Label>Select Class</Label>
// // //                     <Select value={assignClassId} onValueChange={setAssignClassId}>
// // //                         <SelectTrigger>
// // //                             <SelectValue placeholder="Select a class..." />
// // //                         </SelectTrigger>
// // //                         <SelectContent>
// // //                              {classes.length === 0 ? (
// // //                                 <div className="p-2 text-sm text-muted-foreground text-center">No classes available</div>
// // //                              ) : (
// // //                                 classes.map(cls => (
// // //                                      <SelectItem key={cls._id} value={cls._id}>
// // //                                          Grade {cls.grade} - {cls.section} 
// // //                                          {cls.classTeacher && cls.classTeacher !== selectedTeacher?._id ? " (Has Teacher)" : ""}
// // //                                      </SelectItem>
// // //                                  ))
// // //                              )}
// // //                         </SelectContent>
// // //                     </Select>
// // //                     <p className="text-[11px] text-muted-foreground">
// // //                         A teacher can only be the class teacher for one class at a time.
// // //                     </p>
// // //                 </div>
// // //             </div>
// // //             <DialogFooter>
// // //                 <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
// // //                 <Button onClick={handleAssignClassSubmit} disabled={isAssigning}>
// // //                     {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Assign Class'}
// // //                 </Button>
// // //             </DialogFooter>
// // //         </DialogContent>
// // //       </Dialog>
// // //     </div>
// // //   );
// // // };

// // // export default ManageTeachers;


// // import { useEffect, useState } from 'react';
// // import api from '../services/api';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Checkbox } from '@/components/ui/checkbox';
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table"
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog"
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"
// // import { toast } from 'sonner';
// // import { Plus, Loader2, Pencil, Crown, BookOpen, KeyRound, Copy } from 'lucide-react';

// // const ManageTeachers = () => {
// //   const [teachers, setTeachers] = useState([]);
// //   const [subjects, setSubjects] = useState([]);
// //   const [classes, setClasses] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Add/Edit Dialog State
// //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [editingTeacherId, setEditingTeacherId] = useState(null);
  
// //   // Assign Class Dialog State
// //   const [isAssignOpen, setIsAssignOpen] = useState(false);
// //   const [selectedTeacher, setSelectedTeacher] = useState(null);
// //   const [assignClassId, setAssignClassId] = useState('');
// //   const [isAssigning, setIsAssigning] = useState(false);

// //   const [formData, setFormData] = useState({
// //     name: '',
// //     email: '', // Optional now
// //     password: '',
// //     phone: '',
// //     subjects: []
// //   });

// //   useEffect(() => {
// //     fetchAllData();
// //   }, []);

// //   const fetchAllData = async () => {
// //     setLoading(true);
// //     try {
// //       const [teachersRes, subjectsRes, classesRes] = await Promise.all([
// //         api.get('/admin/teachers'),
// //         api.get('/admin/subjects'),
// //         api.get('/admin/classes')
// //       ]);

// //       setTeachers(teachersRes.data?.data?.teachers || []);
// //       setSubjects(subjectsRes.data?.data?.subjects || []);
// //       setClasses(classesRes.data?.data?.classes || []);
// //     } catch (error) {
// //       console.error("Data fetch error:", error);
// //       toast.error('Failed to load initial data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleOpenAddDialog = () => {
// //     setEditingTeacherId(null);
// //     setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
// //     setIsDialogOpen(true);
// //   };

// //   const handleEditClick = (teacher) => {
// //     setEditingTeacherId(teacher._id);
// //     setFormData({
// //       name: teacher.name,
// //       email: teacher.email || '',
// //       password: '', 
// //       phone: teacher.phone || '',
// //       subjects: teacher.subjects || [] 
// //     });
// //     setIsDialogOpen(true);
// //   };

// //   const handleSubjectChange = (subjectName, isChecked) => {
// //     setFormData(prev => {
// //       const currentSubjects = prev.subjects;
// //       if (isChecked) return { ...prev, subjects: [...currentSubjects, subjectName] };
// //       return { ...prev, subjects: currentSubjects.filter(sub => sub !== subjectName) };
// //     });
// //   };

// //   const handleCreateOrUpdate = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       if (formData.subjects.length === 0) {
// //         toast.warning('Please select at least one subject.');
// //         setIsSubmitting(false);
// //         return;
// //       }

// //       if (editingTeacherId) {
// //         const updateData = { ...formData };
// //         if (!updateData.password) delete updateData.password;
// //         await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
// //         toast.success('Teacher updated successfully');
// //       } else {
// //         if (!formData.password) {
// //             toast.error('Password is required');
// //             setIsSubmitting(false);
// //             return;
// //         }
// //         // Note: Username is generated by backend
// //         await api.post('/admin/add-teacher', formData);
// //         toast.success('Teacher created. Username has been generated.');
// //       }
      
// //       setIsDialogOpen(false);
// //       fetchAllData(); 
// //     } catch (error) {
// //       console.error(error);
// //       toast.error(error.response?.data?.message || 'Operation failed');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleOpenAssignDialog = (teacher) => {
// //     setSelectedTeacher(teacher);
// //     setAssignClassId(teacher.assignedClass?._id || ''); 
// //     setIsAssignOpen(true);
// //   };

// //   const handleAssignClassSubmit = async () => {
// //     if (!assignClassId) {
// //         toast.warning('Please select a class');
// //         return;
// //     }
    
// //     setIsAssigning(true);
// //     try {
// //         await api.patch('/admin/assign-class-teacher', {
// //             teacherId: selectedTeacher._id,
// //             classId: assignClassId
// //         });
// //         toast.success(`Class assigned to ${selectedTeacher.name}`);
// //         setIsAssignOpen(false);
// //         fetchAllData(); 
// //     } catch (error) {
// //         console.error("Assignment error:", error);
// //         toast.error(error.response?.data?.message || 'Failed to assign class');
// //     } finally {
// //         setIsAssigning(false);
// //     }
// //   };

// //   const copyToClipboard = (text) => {
// //     navigator.clipboard.writeText(text);
// //     toast.success("Copied to clipboard");
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
// //           <p className="text-muted-foreground">Add teachers, generate logins, and assign subjects.</p>
// //         </div>
        
// //         <Button className="gap-2" onClick={handleOpenAddDialog}>
// //             <Plus size={16} /> Add Teacher
// //         </Button>
// //       </div>

// //       <Card>
// //         <CardContent className="p-0">
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Teacher Details</TableHead>
// //                 <TableHead>Login ID (Username)</TableHead>
// //                 <TableHead className="w-[30%]">Subjects</TableHead>
// //                 <TableHead>Class Teacher</TableHead>
// //                 <TableHead className="text-right">Actions</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {loading ? (
// //                  <TableRow>
// //                     <TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell>
// //                  </TableRow>
// //               ) : teachers.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
// //                     No teachers found.
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 teachers.map((teacher) => (
// //                   <TableRow key={teacher._id}>
// //                     <TableCell className="font-medium">
// //                         <div className="flex flex-col">
// //                            <span className="font-semibold">{teacher.name}</span>
// //                            {teacher.email && <span className="text-[10px] text-muted-foreground">{teacher.email}</span>}
// //                         </div>
// //                     </TableCell>
// //                     {/* NEW: Username Display Column */}
// //                     <TableCell>
// //                         <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
// //                             <KeyRound size={12} className="text-primary" />
// //                             <span className="font-mono text-xs font-bold">{teacher.username}</span>
// //                             <button onClick={() => copyToClipboard(teacher.username)} className="text-muted-foreground hover:text-primary">
// //                                 <Copy size={12} />
// //                             </button>
// //                         </div>
// //                     </TableCell>
// //                     <TableCell>
// //                         <div className="flex flex-wrap gap-1.5">
// //                             {teacher.subjects && teacher.subjects.length > 0 ? (
// //                                 teacher.subjects.map((sub, idx) => (
// //                                     <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground border border-border/50">
// //                                         <BookOpen size={10} className="opacity-50" />
// //                                         {sub}
// //                                     </span>
// //                                 ))
// //                             ) : (
// //                                 <span className="text-xs text-muted-foreground italic">No subjects</span>
// //                             )}
// //                         </div>
// //                     </TableCell>
// //                     <TableCell>
// //                         {teacher.assignedClass ? (
// //                              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
// //                                  <Crown size={12} />
// //                                  {teacher.assignedClass.grade}-{teacher.assignedClass.section}
// //                              </span>
// //                         ) : (
// //                             <span className="text-muted-foreground text-xs pl-2">—</span>
// //                         )}
// //                     </TableCell>
// //                     <TableCell className="text-right">
// //                         <div className="flex justify-end gap-2">
// //                             <Button 
// //                                 variant="outline" 
// //                                 size="icon" 
// //                                 className="h-8 w-8" 
// //                                 title="Assign Class Teacher Role"
// //                                 onClick={() => handleOpenAssignDialog(teacher)}
// //                             >
// //                                 <Crown size={14} className="text-muted-foreground" />
// //                             </Button>
// //                             <Button 
// //                                 variant="ghost" 
// //                                 size="icon" 
// //                                 className="h-8 w-8"
// //                                 onClick={() => handleEditClick(teacher)}
// //                             >
// //                                 <Pencil size={14} className="text-blue-600" />
// //                             </Button>
// //                         </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </CardContent>
// //       </Card>

// //       {/* --- Dialog: Add/Edit Teacher --- */}
// //       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// //         <DialogContent className="sm:max-w-[500px]">
// //             <DialogHeader>
// //               <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
// //               <DialogDescription>
// //                 {editingTeacherId ? 'Update details.' : 'The system will generate a unique Username for login automatically.'}
// //               </DialogDescription>
// //             </DialogHeader>
// //             <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
// //               <div className="space-y-2">
// //                 <Label htmlFor="name">Full Name</Label>
// //                 <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Rahul Sharma" />
// //               </div>
              
// //               {/* Email is now optional */}
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                     <Label htmlFor="email">Email (Optional)</Label>
// //                     <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Contact purposes only" />
// //                 </div>
// //                 <div className="space-y-2">
// //                     <Label htmlFor="phone">Phone (Optional)</Label>
// //                     <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
// //                 </div>
// //               </div>
              
// //               <div className="space-y-2">
// //                 <Label htmlFor="password">{editingTeacherId ? 'New Password (Optional)' : 'Password'}</Label>
// //                 <Input id="password" type="password" placeholder={editingTeacherId ? "Unchanged" : "Create a password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
// //               </div>
              
// //               <div className="space-y-2">
// //                 <Label>Subjects</Label>
// //                 <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
// //                     {subjects.length === 0 ? (
// //                          <div className="col-span-2 text-center text-sm text-muted-foreground py-2">No subjects found. Add subjects first.</div>
// //                     ) : (
// //                         subjects.map((sub) => (
// //                             <div key={sub._id} className="flex items-center space-x-2">
// //                                 <Checkbox 
// //                                     id={`sub-${sub._id}`}
// //                                     checked={formData.subjects.includes(sub.name)}
// //                                     onCheckedChange={(checked) => handleSubjectChange(sub.name, checked)}
// //                                 />
// //                                 <Label htmlFor={`sub-${sub._id}`} className="text-sm cursor-pointer flex-1">
// //                                     {sub.name}
// //                                 </Label>
// //                             </div>
// //                         ))
// //                     )}
// //                 </div>
// //               </div>

// //               <DialogFooter>
// //                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
// //                 <Button type="submit" disabled={isSubmitting}>
// //                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingTeacherId ? 'Update' : 'Generate ID & Create')}
// //                 </Button>
// //               </DialogFooter>
// //             </form>
// //         </DialogContent>
// //       </Dialog>
      
// //       {/* Assign Class Dialog remains unchanged from your original logic... */}
// //       <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
// //         <DialogContent className="sm:max-w-[400px]">
// //             <DialogHeader>
// //                 <DialogTitle>Assign Class Teacher</DialogTitle>
// //                 <DialogDescription>
// //                     Appoint <strong>{selectedTeacher?.name}</strong> as the class teacher for:
// //                 </DialogDescription>
// //             </DialogHeader>
// //             <div className="space-y-4 py-4">
// //                 <div className="space-y-2">
// //                     <Label>Select Class</Label>
// //                     <Select value={assignClassId} onValueChange={setAssignClassId}>
// //                         <SelectTrigger>
// //                             <SelectValue placeholder="Select a class..." />
// //                         </SelectTrigger>
// //                         <SelectContent>
// //                              {classes.length === 0 ? (
// //                                 <div className="p-2 text-sm text-muted-foreground text-center">No classes available</div>
// //                              ) : (
// //                                 classes.map(cls => (
// //                                      <SelectItem key={cls._id} value={cls._id}>
// //                                          Grade {cls.grade} - {cls.section} 
// //                                          {cls.classTeacher && cls.classTeacher !== selectedTeacher?._id ? " (Has Teacher)" : ""}
// //                                      </SelectItem>
// //                                  ))
// //                              )}
// //                         </SelectContent>
// //                     </Select>
// //                 </div>
// //             </div>
// //             <DialogFooter>
// //                 <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
// //                 <Button onClick={handleAssignClassSubmit} disabled={isAssigning}>
// //                     {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Assign Class'}
// //                 </Button>
// //             </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // };

// // export default ManageTeachers;


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
// import { Plus, Loader2, Pencil, Crown, BookOpen, KeyRound, Copy, BookPlus } from 'lucide-react';

// const ManageTeachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- Add/Edit Dialog State ---
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingTeacherId, setEditingTeacherId] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '', 
//     password: '',
//     phone: '',
//     subjects: []
//   });
  
//   // --- Assign Class Teacher Dialog State ---
//   const [isAssignOpen, setIsAssignOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [assignClassId, setAssignClassId] = useState('');
//   const [isAssigning, setIsAssigning] = useState(false);

//   // --- Assign Subject Load (Multiple Classes) State ---
//   const [isSubjectLoadOpen, setIsSubjectLoadOpen] = useState(false);
//   const [loadTeacher, setLoadTeacher] = useState(null);
//   const [loadSubjectId, setLoadSubjectId] = useState('');
//   const [loadClassIds, setLoadClassIds] = useState([]);
//   const [isAssigningLoad, setIsAssigningLoad] = useState(false);

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
//       email: teacher.email || '',
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
//         toast.warning('Please select at least one subject.');
//         setIsSubmitting(false);
//         return;
//       }

//       if (editingTeacherId) {
//         const updateData = { ...formData };
//         if (!updateData.password) delete updateData.password;
//         await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
//         toast.success('Teacher updated successfully');
//       } else {
//         if (!formData.password) {
//             toast.error('Password is required');
//             setIsSubmitting(false);
//             return;
//         }
//         await api.post('/admin/add-teacher', formData);
//         toast.success('Teacher created. Username has been generated.');
//       }
      
//       setIsDialogOpen(false);
//       fetchAllData(); 
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- Handlers: Assign Class Teacher ---
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

//   // --- Handlers: Assign Subject Load (Multiple Classes) ---
//   const handleOpenSubjectLoadDialog = (teacher) => {
//     setLoadTeacher(teacher);
//     setLoadSubjectId('');
//     setLoadClassIds([]);
//     setIsSubjectLoadOpen(true);
//   };

//   const handleLoadClassToggle = (classId) => {
//     setLoadClassIds(prev => 
//       prev.includes(classId) 
//         ? prev.filter(id => id !== classId) 
//         : [...prev, classId]
//     );
//   };

//   const handleSubjectLoadSubmit = async () => {
//     if (!loadSubjectId) {
//       toast.warning('Please select a subject');
//       return;
//     }
//     if (loadClassIds.length === 0) {
//       toast.warning('Please select at least one class');
//       return;
//     }

//     setIsAssigningLoad(true);
//     try {
//       await api.post('/admin/assign-subject-load', {
//         teacherId: loadTeacher._id,
//         subjectId: loadSubjectId,
//         classIds: loadClassIds
//       });
      
//       toast.success(`Subject load assigned to ${loadTeacher.name}`);
//       setIsSubjectLoadOpen(false);
//     } catch (error) {
//       console.error("Subject Load Error:", error);
//       toast.error(error.response?.data?.message || 'Failed to assign subject load');
//     } finally {
//       setIsAssigningLoad(false);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Copied to clipboard");
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
//           <p className="text-muted-foreground">Add teachers, generate logins, and assign subjects/classes.</p>
//         </div>
        
//         <Button className="gap-2" onClick={handleOpenAddDialog}>
//             <Plus size={16} /> Add Teacher
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Teacher Details</TableHead>
//                 <TableHead>Login ID (Username)</TableHead>
//                 <TableHead className="w-[30%]">Subjects</TableHead>
//                 <TableHead>Class Teacher</TableHead>
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
//                     No teachers found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 teachers.map((teacher) => (
//                   <TableRow key={teacher._id}>
//                     <TableCell className="font-medium">
//                         <div className="flex flex-col">
//                            <span className="font-semibold">{teacher.name}</span>
//                            {teacher.email && <span className="text-[10px] text-muted-foreground">{teacher.email}</span>}
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
//                             <KeyRound size={12} className="text-primary" />
//                             <span className="font-mono text-xs font-bold">{teacher.username}</span>
//                             <button onClick={() => copyToClipboard(teacher.username)} className="text-muted-foreground hover:text-primary">
//                                 <Copy size={12} />
//                             </button>
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
//                                 <span className="text-xs text-muted-foreground italic">No subjects</span>
//                             )}
//                         </div>
//                     </TableCell>
//                     <TableCell>
//                         {teacher.assignedClass ? (
//                              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
//                                  <Crown size={12} />
//                                  {teacher.assignedClass.grade}-{teacher.assignedClass.section}
//                              </span>
//                         ) : (
//                             <span className="text-muted-foreground text-xs pl-2">—</span>
//                         )}
//                     </TableCell>
//                     <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                              {/* Assign Subject Load Button */}
//                              <Button 
//                                 variant="outline" 
//                                 size="icon" 
//                                 className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" 
//                                 title="Assign Subject Load (Multiple Classes)"
//                                 onClick={() => handleOpenSubjectLoadDialog(teacher)}
//                             >
//                                 <BookPlus size={14} />
//                             </Button>

//                             {/* Assign Class Teacher Button */}
//                             <Button 
//                                 variant="outline" 
//                                 size="icon" 
//                                 className="h-8 w-8" 
//                                 title="Assign Class Teacher Role"
//                                 onClick={() => handleOpenAssignDialog(teacher)}
//                             >
//                                 <Crown size={14} className="text-orange-500" />
//                             </Button>

//                             {/* Edit Button */}
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

//       {/* --- Dialog 1: Add/Edit Teacher --- */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
//               <DialogDescription>
//                 {editingTeacherId ? 'Update details.' : 'The system will generate a unique Username for login automatically.'}
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Rahul Sharma" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label htmlFor="email">Email (Optional)</Label>
//                     <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Contact purposes only" />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="phone">Phone (Optional)</Label>
//                     <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">{editingTeacherId ? 'New Password (Optional)' : 'Password'}</Label>
//                 <Input id="password" type="password" placeholder={editingTeacherId ? "Unchanged" : "Create a password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
//               </div>
//               <div className="space-y-2">
//                 <Label>Subjects</Label>
//                 <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {subjects.length === 0 ? (
//                          <div className="col-span-2 text-center text-sm text-muted-foreground py-2">No subjects found. Add subjects first.</div>
//                     ) : (
//                         subjects.map((sub) => (
//                             <div key={sub._id} className="flex items-center space-x-2">
//                                 <Checkbox 
//                                     id={`sub-${sub._id}`}
//                                     checked={formData.subjects.includes(sub.name)}
//                                     onCheckedChange={(checked) => handleSubjectChange(sub.name, checked)}
//                                 />
//                                 <Label htmlFor={`sub-${sub._id}`} className="text-sm cursor-pointer flex-1">
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
//                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingTeacherId ? 'Update' : 'Generate ID & Create')}
//                 </Button>
//               </DialogFooter>
//             </form>
//         </DialogContent>
//       </Dialog>
      
//       {/* --- Dialog 2: Assign Class Teacher --- */}
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

//       {/* --- Dialog 3: Assign Subject Load (Multiple Classes) --- */}
//       <Dialog open={isSubjectLoadOpen} onOpenChange={setIsSubjectLoadOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//                 <DialogTitle>Assign Subject Load</DialogTitle>
//                 <DialogDescription>
//                     Assign <strong>{loadTeacher?.name}</strong> to teach a subject in one or more classes.
//                 </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//                  {/* 1. Select Subject */}
//                  <div className="space-y-2">
//                     <Label>Select Subject</Label>
//                     <Select value={loadSubjectId} onValueChange={setLoadSubjectId}>
//                         <SelectTrigger>
//                             <SelectValue placeholder="Choose a subject..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                              {subjects.length === 0 ? (
//                                 <div className="p-2 text-sm text-muted-foreground">No subjects available</div>
//                              ) : (
//                                 subjects.map(sub => (
//                                      <SelectItem key={sub._id} value={sub._id}>
//                                          {sub.name}
//                                      </SelectItem>
//                                  ))
//                              )}
//                         </SelectContent>
//                     </Select>
//                  </div>

//                  {/* 2. Select Multiple Classes */}
//                  <div className="space-y-2">
//                     <Label>Select Classes (Multiple)</Label>
//                     <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[200px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                         {classes.length === 0 ? (
//                              <div className="col-span-2 text-center text-sm text-muted-foreground py-2">No classes found.</div>
//                         ) : (
//                             classes.map((cls) => (
//                                 <div key={cls._id} className="flex items-center space-x-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
//                                     <Checkbox 
//                                         id={`load-cls-${cls._id}`}
//                                         checked={loadClassIds.includes(cls._id)}
//                                         onCheckedChange={() => handleLoadClassToggle(cls._id)}
//                                     />
//                                     <Label htmlFor={`load-cls-${cls._id}`} className="text-sm cursor-pointer select-none flex-1">
//                                         Grade {cls.grade} - {cls.section}
//                                     </Label>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                     <p className="text-[11px] text-muted-foreground text-right">
//                         Selected: {loadClassIds.length} classes
//                     </p>
//                  </div>
//             </div>

//             <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsSubjectLoadOpen(false)}>Cancel</Button>
//                 <Button onClick={handleSubjectLoadSubmit} disabled={isAssigningLoad}>
//                     {isAssigningLoad ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Assign Load'}
//                 </Button>
//             </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ManageTeachers;



// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge'; // You might need to import Badge or use a span
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
// import { Plus, Loader2, Pencil, Crown, BookOpen, KeyRound, Copy, GraduationCap, Users } from 'lucide-react';

// const ManageTeachers = () => {
//   // --- State ---
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Dialog State
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     password: '',
//     subjects: [],        // Array of Subject IDs
//     isClassTeacher: false,
//     assignedClassId: '', // Class ID if isClassTeacher is true
//     teachingClasses: []  // Array of Class IDs where they teach
//   });

//   // --- Init ---
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
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---

//   const handleOpenAddDialog = () => {
//     setFormData({
//       name: '',
//       password: '',
//       subjects: [],
//       isClassTeacher: false,
//       assignedClassId: '',
//       teachingClasses: []
//     });
//     setIsDialogOpen(true);
//   };

//   const handleCheckboxChange = (field, id, isChecked) => {
//     setFormData(prev => {
//       const currentList = prev[field];
//       if (isChecked) {
//         return { ...prev, [field]: [...currentList, id] };
//       } else {
//         return { ...prev, [field]: currentList.filter(item => item !== id) };
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validation
//     if (!formData.name.trim()) {
//         toast.error('Teacher name is required');
//         setIsSubmitting(false);
//         return;
//     }
//     if (!formData.password) {
//         toast.error('Password is required');
//         setIsSubmitting(false);
//         return;
//     }
//     if (formData.subjects.length === 0) {
//         toast.warning('Please select at least one subject to teach.');
//         setIsSubmitting(false);
//         return;
//     }
//     if (formData.isClassTeacher && !formData.assignedClassId) {
//         toast.error('Please select a class to assign as Class Teacher.');
//         setIsSubmitting(false);
//         return;
//     }

//     try {
//       // Backend expects:
//       // { name, password, subjects: [ids], isClassTeacher, assignedClassId, teachingClasses: [ids] }
//       await api.post('/admin/add-teacher', formData);
      
//       toast.success('Teacher created successfully!');
//       setIsDialogOpen(false);
//       fetchAllData();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to create teacher');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Username copied!");
//   };

//   // Helper to format class name
//   const formatClass = (cls) => `Grade ${cls.grade} - ${cls.section}`;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
//           <p className="text-muted-foreground">Add teachers, assign subjects, and manage class responsibilities.</p>
//         </div>
//         <Button onClick={handleOpenAddDialog} className="gap-2">
//             <Plus size={16} /> Add Teacher
//         </Button>
//       </div>

//       {/* Teachers List */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Teacher Name</TableHead>
//                 <TableHead>Login Username</TableHead>
//                 <TableHead className="w-[30%]">Subjects</TableHead>
//                 <TableHead>Class Teacher Of</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                  <TableRow>
//                     <TableCell colSpan={4} className="h-24 text-center">
//                         <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
//                     </TableCell>
//                  </TableRow>
//               ) : teachers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
//                     No teachers found. Add one to get started.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 teachers.map((teacher) => (
//                   <TableRow key={teacher._id}>
//                     <TableCell className="font-medium text-base">
//                         {teacher.name}
//                     </TableCell>
                    
//                     <TableCell>
//                         <div className="flex items-center gap-2 bg-secondary/50 px-2 py-1 rounded w-fit border">
//                             <KeyRound size={12} className="text-muted-foreground" />
//                             <span className="font-mono text-xs font-bold">{teacher.username}</span>
//                             <button onClick={() => copyToClipboard(teacher.username)} className="text-muted-foreground hover:text-primary transition-colors">
//                                 <Copy size={12} />
//                             </button>
//                         </div>
//                     </TableCell>

//                     <TableCell>
//                         <div className="flex flex-wrap gap-1.5">
//                             {teacher.subjects && teacher.subjects.length > 0 ? (
//                                 teacher.subjects.map((sub, idx) => (
//                                     <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
//                                         <BookOpen size={10} className="opacity-70" />
//                                         {/* Handle both populated object or raw ID just in case */}
//                                         {typeof sub === 'object' ? sub.name : 'Subject'}
//                                     </span>
//                                 ))
//                             ) : (
//                                 <span className="text-xs text-muted-foreground italic">No subjects</span>
//                             )}
//                         </div>
//                     </TableCell>

//                     <TableCell>
//                         {teacher.assignedClass ? (
//                              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
//                                  <Crown size={12} />
//                                  {formatClass(teacher.assignedClass)}
//                              </span>
//                         ) : (
//                             <span className="text-muted-foreground text-xs pl-2">—</span>
//                         )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* --- ADD TEACHER DIALOG --- */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Add New Teacher</DialogTitle>
//               <DialogDescription>
//                 Create credentials and assign teaching responsibilities.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleSubmit} className="space-y-6 py-2">
              
//               {/* 1. Basic Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label htmlFor="name">Teacher Name</Label>
//                     <Input 
//                         id="name" 
//                         value={formData.name} 
//                         onChange={e => setFormData({...formData, name: e.target.value})} 
//                         placeholder="e.g. Amit Verma"
//                         required 
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input 
//                         id="password" 
//                         type="password"
//                         value={formData.password} 
//                         onChange={e => setFormData({...formData, password: e.target.value})} 
//                         placeholder="Create password"
//                         required 
//                     />
//                 </div>
//               </div>

//               {/* 2. Subject Selection */}
//               <div className="space-y-3">
//                 <Label className="flex items-center gap-2">
//                     <BookOpen size={16} /> Select Subjects to Teach
//                 </Label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {subjects.length === 0 ? (
//                          <div className="col-span-full text-center text-sm text-muted-foreground py-2">No subjects available. Add subjects first.</div>
//                     ) : (
//                         subjects.map((sub) => (
//                             <div key={sub._id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                                 <Checkbox 
//                                     id={`sub-${sub._id}`}
//                                     checked={formData.subjects.includes(sub._id)}
//                                     onCheckedChange={(checked) => handleCheckboxChange('subjects', sub._id, checked)}
//                                 />
//                                 <Label htmlFor={`sub-${sub._id}`} className="text-sm font-normal cursor-pointer flex-1">
//                                     {sub.name}
//                                 </Label>
//                             </div>
//                         ))
//                     )}
//                 </div>
//               </div>

//               <div className="h-px bg-border my-4" />

//               {/* 3. Class Teacher Assignment */}
//               <div className="space-y-4">
//                  <div className="flex items-center justify-between">
//                     <Label className="flex items-center gap-2 text-base font-semibold">
//                         <Crown size={18} className="text-amber-500" /> Assign as Class Teacher?
//                     </Label>
//                     <Checkbox 
//                         id="isClassTeacher"
//                         checked={formData.isClassTeacher}
//                         onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isClassTeacher: checked }))}
//                     />
//                  </div>

//                  {formData.isClassTeacher && (
//                      <div className="pl-6 pt-2 animate-in slide-in-from-top-2 fade-in duration-300">
//                         <Label className="text-xs text-muted-foreground mb-1.5 block">Select Class to Monitor</Label>
//                         <Select 
//                             value={formData.assignedClassId} 
//                             onValueChange={(val) => setFormData(prev => ({...prev, assignedClassId: val}))}
//                         >
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select Class..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {classes.map(cls => (
//                                     <SelectItem 
//                                         key={cls._id} 
//                                         value={cls._id}
//                                         disabled={cls.classTeacher} // Disable if already has a teacher
//                                         className={cls.classTeacher ? "opacity-50" : ""}
//                                     >
//                                         {formatClass(cls)} {cls.classTeacher ? '(Occupied)' : ''}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                      </div>
//                  )}
//               </div>

//               <div className="h-px bg-border my-4" />

//               {/* 4. Teaching Classes Selection */}
//               <div className="space-y-3">
//                 <Label className="flex items-center gap-2">
//                     <Users size={16} /> Select Classes to Teach
//                     <span className="text-xs font-normal text-muted-foreground ml-auto">
//                         (Selected subjects will be assigned to these classes)
//                     </span>
//                 </Label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {classes.length === 0 ? (
//                          <div className="col-span-full text-center text-sm text-muted-foreground py-2">No classes found.</div>
//                     ) : (
//                         classes.map((cls) => (
//                             <div key={cls._id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                                 <Checkbox 
//                                     id={`teach-${cls._id}`}
//                                     checked={formData.teachingClasses.includes(cls._id)}
//                                     onCheckedChange={(checked) => handleCheckboxChange('teachingClasses', cls._id, checked)}
//                                 />
//                                 <Label htmlFor={`teach-${cls._id}`} className="text-sm font-normal cursor-pointer flex-1">
//                                     {formatClass(cls)}
//                                 </Label>
//                             </div>
//                         ))
//                     )}
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Teacher'}
//                 </Button>
//               </DialogFooter>
//             </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ManageTeachers;



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
// import { Plus, Loader2, Crown, BookOpen, KeyRound, Copy, Users } from 'lucide-react';

// const ManageTeachers = () => {
//   // --- State ---
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Dialog State
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     password: '',
//     subjects: [],        // Array of Subject IDs
//     isClassTeacher: false,
//     assignedClassId: '', // Class ID if isClassTeacher is true
//     teachingClasses: []  // Array of Class IDs where they teach subjects
//   });

//   // --- Init ---
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
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---

//   const handleOpenAddDialog = () => {
//     setFormData({
//       name: '',
//       password: '',
//       subjects: [],
//       isClassTeacher: false,
//       assignedClassId: '',
//       teachingClasses: []
//     });
//     setIsDialogOpen(true);
//   };

//   const handleCheckboxChange = (field, id, isChecked) => {
//     setFormData(prev => {
//       const currentList = prev[field];
//       if (isChecked) {
//         return { ...prev, [field]: [...currentList, id] };
//       } else {
//         return { ...prev, [field]: currentList.filter(item => item !== id) };
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validation
//     if (!formData.name.trim()) {
//         toast.error('Teacher name is required');
//         setIsSubmitting(false);
//         return;
//     }
//     if (!formData.password) {
//         toast.error('Password is required');
//         setIsSubmitting(false);
//         return;
//     }
//     if (formData.subjects.length === 0) {
//         toast.warning('Please select at least one subject to teach.');
//         setIsSubmitting(false);
//         return;
//     }
//     if (formData.isClassTeacher && !formData.assignedClassId) {
//         toast.error('Please select the class they will manage.');
//         setIsSubmitting(false);
//         return;
//     }

//     try {
//       await api.post('/admin/add-teacher', formData);
//       toast.success('Teacher created successfully!');
//       setIsDialogOpen(false);
//       fetchAllData();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to create teacher');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Username copied!");
//   };

//   const formatClass = (cls) => `Grade ${cls.grade} - ${cls.section}`;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
//           <p className="text-muted-foreground">Add teachers, assign subjects, and manage class responsibilities.</p>
//         </div>
//         <Button onClick={handleOpenAddDialog} className="gap-2">
//             <Plus size={16} /> Add Teacher
//         </Button>
//       </div>

//       {/* Teachers List */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Teacher Name</TableHead>
//                 <TableHead>Login Username</TableHead>
//                 <TableHead className="w-[30%]">Subjects</TableHead>
//                 <TableHead>Class Teacher Of</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                  <TableRow>
//                     <TableCell colSpan={4} className="h-24 text-center">
//                         <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
//                     </TableCell>
//                  </TableRow>
//               ) : teachers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
//                     No teachers found. Add one to get started.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 teachers.map((teacher) => (
//                   <TableRow key={teacher._id}>
//                     <TableCell className="font-medium text-base">
//                         {teacher.name}
//                     </TableCell>
                    
//                     <TableCell>
//                         <div className="flex items-center gap-2 bg-secondary/50 px-2 py-1 rounded w-fit border">
//                             <KeyRound size={12} className="text-muted-foreground" />
//                             <span className="font-mono text-xs font-bold">{teacher.username}</span>
//                             <button onClick={() => copyToClipboard(teacher.username)} className="text-muted-foreground hover:text-primary transition-colors">
//                                 <Copy size={12} />
//                             </button>
//                         </div>
//                     </TableCell>

//                     <TableCell>
//                         <div className="flex flex-wrap gap-1.5">
//                             {teacher.subjects && teacher.subjects.length > 0 ? (
//                                 teacher.subjects.map((sub, idx) => (
//                                     <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
//                                         <BookOpen size={10} className="opacity-70" />
//                                         {/* Handle populated object or raw ID */}
//                                         {typeof sub === 'object' ? sub.name : 'Subject'}
//                                     </span>
//                                 ))
//                             ) : (
//                                 <span className="text-xs text-muted-foreground italic">No subjects</span>
//                             )}
//                         </div>
//                     </TableCell>

//                     <TableCell>
//                         {teacher.assignedClass ? (
//                              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
//                                  <Crown size={12} />
//                                  {formatClass(teacher.assignedClass)}
//                              </span>
//                         ) : (
//                             <span className="text-muted-foreground text-xs pl-2">—</span>
//                         )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* --- ADD TEACHER DIALOG --- */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Add New Teacher</DialogTitle>
//               <DialogDescription>
//                 Create credentials and assign teaching responsibilities.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleSubmit} className="space-y-6 py-2">
              
//               {/* 1. Basic Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label htmlFor="name">Teacher Name</Label>
//                     <Input 
//                         id="name" 
//                         value={formData.name} 
//                         onChange={e => setFormData({...formData, name: e.target.value})} 
//                         placeholder="e.g. Amit Verma"
//                         required 
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input 
//                         id="password" 
//                         type="password"
//                         value={formData.password} 
//                         onChange={e => setFormData({...formData, password: e.target.value})} 
//                         placeholder="Create password"
//                         required 
//                     />
//                 </div>
//               </div>

//               {/* 2. Subject Selection */}
//               <div className="space-y-3">
//                 <Label className="flex items-center gap-2">
//                     <BookOpen size={16} /> Select Subjects to Teach
//                 </Label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {subjects.length === 0 ? (
//                          <div className="col-span-full text-center text-sm text-muted-foreground py-2">No subjects available. Add subjects first.</div>
//                     ) : (
//                         subjects.map((sub) => (
//                             <div key={sub._id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                                 <Checkbox 
//                                     id={`sub-${sub._id}`}
//                                     checked={formData.subjects.includes(sub._id)}
//                                     onCheckedChange={(checked) => handleCheckboxChange('subjects', sub._id, checked)}
//                                 />
//                                 <Label htmlFor={`sub-${sub._id}`} className="text-sm font-normal cursor-pointer flex-1">
//                                     {sub.name}
//                                 </Label>
//                             </div>
//                         ))
//                     )}
//                 </div>
//               </div>

//               <div className="h-px bg-border my-4" />

//               {/* 3. Class Teacher Assignment (FIXED) */}
//               <div className="space-y-4 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50">
//                  <div className="flex items-center space-x-3">
//                     <Checkbox 
//                         id="isClassTeacher"
//                         checked={formData.isClassTeacher}
//                         onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isClassTeacher: checked }))}
//                     />
//                     <Label 
//                         htmlFor="isClassTeacher" 
//                         className="text-base font-semibold cursor-pointer flex items-center gap-2"
//                     >
//                         <Crown size={18} className="text-amber-500" /> Assign as Class Teacher?
//                     </Label>
//                  </div>

//                  {/* Dropdown appears when checked */}
//                  {formData.isClassTeacher && (
//                      <div className="pl-7 animate-in slide-in-from-top-2 fade-in duration-200">
//                         <Label className="text-xs text-muted-foreground mb-1.5 block">Select Class to Manage</Label>
//                         <Select 
//                             value={formData.assignedClassId} 
//                             onValueChange={(val) => setFormData(prev => ({...prev, assignedClassId: val}))}
//                         >
//                             <SelectTrigger className="w-full bg-white dark:bg-background">
//                                 <SelectValue placeholder="Select Class..." />
//                             </SelectTrigger>
                            
//                             {/* Force Z-Index High to appear above Dialog */}
//                             <SelectContent className="z-[9999]"> 
//                                 {classes.length === 0 ? (
//                                     <div className="p-2 text-sm text-center text-muted-foreground">No classes available</div>
//                                 ) : (
//                                     classes.map(cls => (
//                                         <SelectItem 
//                                             key={cls._id} 
//                                             value={cls._id}
//                                             disabled={!!cls.classTeacher} 
//                                             className={cls.classTeacher ? "opacity-50" : ""}
//                                         >
//                                             {formatClass(cls)} {cls.classTeacher ? '(Has Teacher)' : ''}
//                                         </SelectItem>
//                                     ))
//                                 )}
//                             </SelectContent>
//                         </Select>
//                      </div>
//                  )}
//               </div>

//               <div className="h-px bg-border my-4" />

//               {/* 4. Teaching Classes Selection */}
//               <div className="space-y-3">
//                 <Label className="flex items-center gap-2">
//                     <Users size={16} /> Select Classes to Teach
//                     <span className="text-xs font-normal text-muted-foreground ml-auto">
//                         (Selected subjects will be assigned to these classes)
//                     </span>
//                 </Label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {classes.length === 0 ? (
//                          <div className="col-span-full text-center text-sm text-muted-foreground py-2">No classes found.</div>
//                     ) : (
//                         classes.map((cls) => (
//                             <div key={cls._id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                                 <Checkbox 
//                                     id={`teach-${cls._id}`}
//                                     checked={formData.teachingClasses.includes(cls._id)}
//                                     onCheckedChange={(checked) => handleCheckboxChange('teachingClasses', cls._id, checked)}
//                                 />
//                                 <Label htmlFor={`teach-${cls._id}`} className="text-sm font-normal cursor-pointer flex-1">
//                                     {formatClass(cls)}
//                                 </Label>
//                             </div>
//                         ))
//                     )}
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Teacher'}
//                 </Button>
//               </DialogFooter>
//             </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ManageTeachers;




// import { useEffect, useState, useMemo } from 'react';
// import api from '../services/api';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
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
// import { Plus, Loader2, Crown, BookOpen, KeyRound, Copy, Users, CheckCircle2, XCircle } from 'lucide-react';

// const ManageTeachers = () => {
//   // --- State ---
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Dialog State
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingTeacherId, setEditingTeacherId] = useState(null);
  
//   // Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     password: '',
//     subjects: [],        // Array of Subject IDs
//     isClassTeacher: false,
//     assignedClassId: '', // Class ID if isClassTeacher is true
//     teachingClasses: []  // Array of Class IDs where they teach subjects
//   });

//   // --- Init ---
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
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Helpers ---
  
//   // Format class name helper
//   const formatClass = (cls) => cls ? `Grade ${cls.grade} - ${cls.section}` : '';

//   // Calculate which classes a teacher is teaching based on the "Classes" data
//   // The Teacher model doesn't store this, the Class model does (in subjectTeachers array)
//   const getTeachingClassesForTeacher = (teacherId) => {
//     return classes.filter(cls => 
//       cls.subjectTeachers?.some(st => 
//         // Handle both populated object or raw ID
//         (st.teacher?._id === teacherId) || (st.teacher === teacherId)
//       )
//     );
//   };

//   // Filter available classes for "Class Teacher" role
//   // Exclude classes that already have a teacher, unless it's the current teacher we are editing
//   const availableForClassTeacher = useMemo(() => {
//     return classes.filter(cls => 
//       !cls.classTeacher || (editingTeacherId && cls.classTeacher._id === editingTeacherId)
//     );
//   }, [classes, editingTeacherId]);

//   // --- Handlers ---

//   const handleOpenAddDialog = () => {
//     setEditingTeacherId(null);
//     setFormData({
//       name: '',
//       password: '',
//       subjects: [],
//       isClassTeacher: false,
//       assignedClassId: '',
//       teachingClasses: []
//     });
//     setIsDialogOpen(true);
//   };

//   // Optional: Add logic to pre-fill form for editing (not fully requested but good for production)
//   // For now, focusing on the "Add" and "View" requirements.

//   const handleCheckboxChange = (field, id, isChecked) => {
//     setFormData(prev => {
//       const currentList = prev[field];
//       if (isChecked) {
//         return { ...prev, [field]: [...currentList, id] };
//       } else {
//         return { ...prev, [field]: currentList.filter(item => item !== id) };
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validation
//     if (!formData.name.trim()) {
//         toast.error('Teacher name is required');
//         setIsSubmitting(false);
//         return;
//     }
//     if (!formData.password) {
//         toast.error('Password is required');
//         setIsSubmitting(false);
//         return;
//     }
//     if (formData.subjects.length === 0) {
//         toast.warning('Please select at least one subject to teach.');
//         setIsSubmitting(false);
//         return;
//     }
//     if (formData.isClassTeacher && !formData.assignedClassId) {
//         toast.error('Please select the class they will manage.');
//         setIsSubmitting(false);
//         return;
//     }

//     try {
//       await api.post('/admin/add-teacher', formData);
//       toast.success('Teacher created successfully!');
//       setIsDialogOpen(false);
//       fetchAllData();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to create teacher');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Username copied!");
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
//           <p className="text-muted-foreground">Add teachers, assign subjects, and manage class responsibilities.</p>
//         </div>
//         <Button onClick={handleOpenAddDialog} className="gap-2">
//             <Plus size={16} /> Add Teacher
//         </Button>
//       </div>

//       {/* Teachers List */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Teacher Name</TableHead>
//                 <TableHead>Login Username</TableHead>
//                 <TableHead className="w-[20%]">Subjects</TableHead>
//                 <TableHead className="w-[25%]">Teaching Classes</TableHead>
//                 <TableHead>Class Teacher Of</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                  <TableRow>
//                     <TableCell colSpan={5} className="h-24 text-center">
//                         <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
//                     </TableCell>
//                  </TableRow>
//               ) : teachers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
//                     No teachers found. Add one to get started.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 teachers.map((teacher) => {
//                   const teachingClasses = getTeachingClassesForTeacher(teacher._id);
                  
//                   return (
//                     <TableRow key={teacher._id}>
//                       <TableCell className="font-medium text-base">
//                           {teacher.name}
//                       </TableCell>
                      
//                       <TableCell>
//                           <div className="flex items-center gap-2 bg-secondary/50 px-2 py-1 rounded w-fit border">
//                               <KeyRound size={12} className="text-muted-foreground" />
//                               <span className="font-mono text-xs font-bold">{teacher.username}</span>
//                               <button onClick={() => copyToClipboard(teacher.username)} className="text-muted-foreground hover:text-primary transition-colors">
//                                   <Copy size={12} />
//                               </button>
//                           </div>
//                       </TableCell>

//                       <TableCell>
//                           <div className="flex flex-wrap gap-1.5">
//                               {teacher.subjects && teacher.subjects.length > 0 ? (
//                                   teacher.subjects.map((sub, idx) => (
//                                       <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
//                                           <BookOpen size={10} className="opacity-70" />
//                                           {typeof sub === 'object' ? sub.name : 'Subject'}
//                                       </span>
//                                   ))
//                               ) : (
//                                   <span className="text-xs text-muted-foreground italic">No subjects</span>
//                               )}
//                           </div>
//                       </TableCell>

//                       {/* Calculated Teaching Classes */}
//                       <TableCell>
//                           <div className="flex flex-wrap gap-1.5">
//                               {teachingClasses.length > 0 ? (
//                                   teachingClasses.map((cls, idx) => (
//                                       <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
//                                           {formatClass(cls)}
//                                       </span>
//                                   ))
//                               ) : (
//                                   <span className="text-xs text-muted-foreground italic">Not assigned yet</span>
//                               )}
//                           </div>
//                       </TableCell>

//                       <TableCell>
//                           {teacher.assignedClass ? (
//                                <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
//                                    <Crown size={12} />
//                                    {formatClass(teacher.assignedClass)}
//                                </span>
//                           ) : (
//                               <span className="text-muted-foreground text-xs pl-2">—</span>
//                           )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* --- ADD TEACHER DIALOG --- */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Add New Teacher</DialogTitle>
//               <DialogDescription>
//                 Configure credentials, subjects, and class assignments.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleSubmit} className="space-y-6 py-2">
              
//               {/* 1. Basic Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label htmlFor="name">Teacher Name</Label>
//                     <Input 
//                         id="name" 
//                         value={formData.name} 
//                         onChange={e => setFormData({...formData, name: e.target.value})} 
//                         placeholder="e.g. Amit Verma"
//                         required 
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input 
//                         id="password" 
//                         type="password"
//                         value={formData.password} 
//                         onChange={e => setFormData({...formData, password: e.target.value})} 
//                         placeholder="Create password"
//                         required 
//                     />
//                 </div>
//               </div>

//               {/* 2. Subject Selection */}
//               <div className="space-y-3">
//                 <Label className="flex items-center gap-2">
//                     <BookOpen size={16} /> Select Subjects to Teach <span className="text-red-500">*</span>
//                 </Label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {subjects.length === 0 ? (
//                          <div className="col-span-full text-center text-sm text-muted-foreground py-2">No subjects available. Add subjects first.</div>
//                     ) : (
//                         subjects.map((sub) => (
//                             <div key={sub._id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                                 <Checkbox 
//                                     id={`sub-${sub._id}`}
//                                     checked={formData.subjects.includes(sub._id)}
//                                     onCheckedChange={(checked) => handleCheckboxChange('subjects', sub._id, checked)}
//                                 />
//                                 <Label htmlFor={`sub-${sub._id}`} className="text-sm font-normal cursor-pointer flex-1 select-none">
//                                     {sub.name}
//                                 </Label>
//                             </div>
//                         ))
//                     )}
//                 </div>
//               </div>

//               <div className="h-px bg-border my-4" />

//               {/* 3. Class Teacher Assignment (Production Ready) */}
//               <div className="space-y-4 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50">
//                  <div className="flex items-center space-x-3">
//                     <Checkbox 
//                         id="isClassTeacher"
//                         checked={formData.isClassTeacher}
//                         onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isClassTeacher: checked }))}
//                     />
//                     <Label 
//                         htmlFor="isClassTeacher" 
//                         className="text-base font-semibold cursor-pointer flex items-center gap-2 select-none"
//                     >
//                         <Crown size={18} className="text-amber-500" /> Assign as Class Teacher?
//                     </Label>
//                  </div>

//                  {/* Unique Class List Dropdown */}
//                  {formData.isClassTeacher && (
//                      <div className="pl-7 animate-in slide-in-from-top-2 fade-in duration-200 space-y-2">
//                         <Label className="text-xs text-muted-foreground block">
//                             Select a class to manage (Only unassigned classes shown)
//                         </Label>
//                         <Select 
//                             value={formData.assignedClassId} 
//                             onValueChange={(val) => setFormData(prev => ({...prev, assignedClassId: val}))}
//                         >
//                             <SelectTrigger className="w-full bg-white dark:bg-background border-amber-200">
//                                 <SelectValue placeholder="Select a class..." />
//                             </SelectTrigger>
//                             <SelectContent className="max-h-[200px] z-[9999]">
//                                 {availableForClassTeacher.length === 0 ? (
//                                     <div className="p-3 text-sm text-center text-muted-foreground">
//                                         All classes already have Class Teachers.
//                                     </div>
//                                 ) : (
//                                     availableForClassTeacher.map(cls => (
//                                         <SelectItem key={cls._id} value={cls._id}>
//                                             {formatClass(cls)}
//                                         </SelectItem>
//                                     ))
//                                 )}
//                             </SelectContent>
//                         </Select>
//                      </div>
//                  )}
//               </div>

//               <div className="h-px bg-border my-4" />

//               {/* 4. Teaching Classes Selection */}
//               <div className="space-y-3">
//                 <Label className="flex items-center gap-2">
//                     <Users size={16} /> Select Classes to Teach
//                     <span className="text-xs font-normal text-muted-foreground ml-auto">
//                         (Selected subjects will be assigned to these classes)
//                     </span>
//                 </Label>
                
//                 {/* Visual Feedback of Selected Classes */}
//                 {formData.teachingClasses.length > 0 && (
//                     <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-secondary/30 rounded-md border border-dashed">
//                         <span className="text-[10px] text-muted-foreground w-full uppercase tracking-wider font-bold">Selected to Teach:</span>
//                         {classes.filter(c => formData.teachingClasses.includes(c._id)).map(c => (
//                             <Badge key={c._id} variant="secondary" className="h-6 gap-1 bg-white dark:bg-secondary">
//                                 {formatClass(c)}
//                                 <button 
//                                     type="button"
//                                     onClick={() => handleCheckboxChange('teachingClasses', c._id, false)}
//                                     className="ml-1 hover:text-red-500"
//                                 >
//                                     <XCircle size={12} />
//                                 </button>
//                             </Badge>
//                         ))}
//                     </div>
//                 )}

//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
//                     {classes.length === 0 ? (
//                          <div className="col-span-full text-center text-sm text-muted-foreground py-2">No classes found.</div>
//                     ) : (
//                         classes.map((cls) => (
//                             <div key={cls._id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                                 <Checkbox 
//                                     id={`teach-${cls._id}`}
//                                     checked={formData.teachingClasses.includes(cls._id)}
//                                     onCheckedChange={(checked) => handleCheckboxChange('teachingClasses', cls._id, checked)}
//                                 />
//                                 <Label htmlFor={`teach-${cls._id}`} className="text-sm font-normal cursor-pointer flex-1 select-none">
//                                     {formatClass(cls)}
//                                 </Label>
//                             </div>
//                         ))
//                     )}
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Teacher'}
//                 </Button>
//               </DialogFooter>
//             </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ManageTeachers;



import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Search, Eye, MoreHorizontal, CheckCircle2, XCircle, UserCog 
} from 'lucide-react';

// --- Internal Component: Searchable Selection List ---
// Handles long lists of subjects/classes gracefully
const SearchableList = ({ items, selectedIds, onItemToggle, label, icon: Icon, emptyMsg }) => {
  const [search, setSearch] = useState('');

  const filteredItems = items.filter(item => 
    (item.name || `Grade ${item.grade} - ${item.section}`).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          {Icon && <Icon size={16} />} {label}
          <Badge variant="secondary" className="ml-2 text-[10px] h-5">
            {selectedIds.length} selected
          </Badge>
        </Label>
      </div>
      
      <div className="border rounded-md bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
        {/* Search Header */}
        <div className="p-2 border-b bg-white dark:bg-black/20 sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder={`Search ${label.toLowerCase()}...`} 
              className="h-8 pl-8 text-xs border-none shadow-none focus-visible:ring-0 bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="max-h-[180px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
             <div className="text-center py-4 text-xs text-muted-foreground">{emptyMsg || "No items found."}</div>
          ) : (
            filteredItems.map(item => {
              const labelText = item.name || `Grade ${item.grade} - ${item.section}`;
              const isSelected = selectedIds.includes(item._id);
              return (
                <div 
                  key={item._id} 
                  className={`flex items-center space-x-2 p-1.5 rounded-md transition-colors cursor-pointer group ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                  onClick={() => onItemToggle(item._id, !isSelected)}
                >
                  <Checkbox 
                    id={`item-${item._id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => onItemToggle(item._id, checked)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`item-${item._id}`} className="text-sm font-normal cursor-pointer flex-1 truncate select-none">
                    {labelText}
                  </Label>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};

const ManageTeachers = () => {
  // --- State ---
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTeacher, setViewTeacher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search Filter for Main Table
  const [tableSearch, setTableSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    subjects: [],
    isClassTeacher: false,
    assignedClassId: '',
    teachingClasses: []
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

  // --- Helpers ---
  const formatClass = (cls) => cls ? `Grade ${cls.grade} - ${cls.section}` : '';

  const getTeachingClassesForTeacher = (teacherId) => {
    return classes.filter(cls => 
      cls.subjectTeachers?.some(st => 
        (st.teacher?._id === teacherId) || (st.teacher === teacherId)
      )
    );
  };

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
      subjects: [],
      isClassTeacher: false,
      assignedClassId: '',
      teachingClasses: []
    });
    setIsAddOpen(true);
  };

  const handleOpenView = (teacher) => {
    const teachingCls = getTeachingClassesForTeacher(teacher._id);
    setViewTeacher({ ...teacher, teachingClassesDetails: teachingCls });
    setIsViewOpen(true);
  };

  const handleListToggle = (field, id, isChecked) => {
    setFormData(prev => {
      const currentList = prev[field];
      if (isChecked) return { ...prev, [field]: [...currentList, id] };
      return { ...prev, [field]: currentList.filter(item => item !== id) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.password) {
        toast.error('Name and Password are required');
        setIsSubmitting(false);
        return;
    }
    if (formData.subjects.length === 0) {
        toast.warning('Select at least one subject');
        setIsSubmitting(false);
        return;
    }
    if (formData.isClassTeacher && !formData.assignedClassId) {
        toast.error('Select a class for Class Teacher role');
        setIsSubmitting(false);
        return;
    }

    try {
      await api.post('/admin/add-teacher', formData);
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
      {/* --- Top Stats & Header --- */}
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
                  const teachingCount = getTeachingClassesForTeacher(teacher._id).length;
                  const subjectCount = teacher.subjects?.length || 0;
                  
                  return (
                    <TableRow key={teacher._id} className="group">
                      {/* 1. Profile Column */}
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

                      {/* 2. Assignments Summary Column (Clean UI) */}
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                           {/* Subjects Summary */}
                           <div className="flex items-center gap-2 text-sm">
                              <BookOpen size={14} className="text-blue-500" />
                              {subjectCount === 0 ? (
                                <span className="text-muted-foreground text-xs italic">No subjects</span>
                              ) : (
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                   {subjectCount} Subject{subjectCount !== 1 && 's'}
                                   <span className="text-xs text-muted-foreground font-normal ml-1">
                                     ({teacher.subjects[0]?.name || 'Unknown'} 
                                     {subjectCount > 1 && ` + ${subjectCount - 1} more`})
                                   </span>
                                </span>
                              )}
                           </div>
                           
                           {/* Classes Summary */}
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

                      {/* 3. Role Column */}
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

                      {/* 4. Actions */}
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

      {/* --- ADD TEACHER MODAL (Improved Layout) --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl flex items-center gap-2">
                <UserCog className="text-primary" /> Add New Teacher
              </DialogTitle>
              <DialogDescription>
                Create a new staff account and configure their teaching schedule.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
               {/* Section 1: Credentials */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>Full Name <span className="text-red-500">*</span></Label>
                      <Input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Sarah Connor"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label>Password <span className="text-red-500">*</span></Label>
                      <Input 
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        placeholder="Set initial password"
                      />
                  </div>
               </div>

               <div className="h-px bg-border" />

               {/* Section 2: Workload (Searchable Lists) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SearchableList 
                     label="Subjects to Teach"
                     icon={BookOpen}
                     items={subjects}
                     selectedIds={formData.subjects}
                     onItemToggle={(id, checked) => handleListToggle('subjects', id, checked)}
                     emptyMsg="No subjects found. Create subjects first."
                  />
                  
                  <SearchableList 
                     label="Assign to Classes"
                     icon={Users}
                     items={classes}
                     selectedIds={formData.teachingClasses}
                     onItemToggle={(id, checked) => handleListToggle('teachingClasses', id, checked)}
                     emptyMsg="No classes found."
                  />
               </div>

               <div className="h-px bg-border" />

               {/* Section 3: Administrative Role */}
               <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Checkbox 
                           id="ct-role"
                           checked={formData.isClassTeacher}
                           onCheckedChange={(c) => setFormData(prev => ({ ...prev, isClassTeacher: c }))}
                        />
                        <Label htmlFor="ct-role" className="font-semibold cursor-pointer">Assign as Class Teacher?</Label>
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
                          <SelectTrigger className="bg-white dark:bg-black/20">
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

      {/* --- VIEW PROFILE MODAL (Detailed Read-Only View) --- */}
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
                {/* Role Badge */}
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

                {/* Subjects Grid */}
                <div>
                   <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-500" /> Teaching Subjects
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {viewTeacher.subjects?.length > 0 ? (
                        viewTeacher.subjects.map((sub, i) => (
                           <Badge key={i} variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                              {sub.name}
                           </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic">No subjects assigned.</span>
                      )}
                   </div>
                </div>

                {/* Classes Grid */}
                <div>
                   <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Users size={16} className="text-green-500" /> Teaching In Classes
                   </h4>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto pr-2">
                      {viewTeacher.teachingClassesDetails?.length > 0 ? (
                        viewTeacher.teachingClassesDetails.map((cls, i) => (
                           <div key={i} className="text-xs border rounded px-2 py-1.5 flex items-center gap-2 bg-slate-50 dark:bg-slate-900">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              {formatClass(cls)}
                           </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic col-span-3">Not teaching in any specific class yet.</span>
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