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
// // //   DialogTrigger,
// // // } from "@/components/ui/dialog"
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select"
// // // import { toast } from 'sonner';
// // // import { Plus, UserPlus, Pencil } from 'lucide-react';

// // // const ManageTeachers = () => {
// // //   const [teachers, setTeachers] = useState([]);
// // //   const [subjects, setSubjects] = useState([]); // List of available subjects
// // //   const [classes, setClasses] = useState([]); // List of available classes
// // //   const [loading, setLoading] = useState(true);
  
// // //   // Create Teacher State
// // //   const [isAddOpen, setIsAddOpen] = useState(false);
// // //   const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', subjects: [] });
  
// // //   // Edit Teacher State
// // //   const [isEditOpen, setIsEditOpen] = useState(false);
// // //   const [editingTeacherId, setEditingTeacherId] = useState(null);

// // //   // Assign Class State
// // //   const [isAssignOpen, setIsAssignOpen] = useState(false);
// // //   const [selectedTeacher, setSelectedTeacher] = useState(null);
// // //   const [selectedClassId, setSelectedClassId] = useState('');

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, []);

// // //   const fetchData = async () => {
// // //     try {
// // //       const [teachersRes, subjectsRes, classesRes] = await Promise.all([
// // //         api.get('/admin/teachers'),
// // //         api.get('/admin/subjects'),
// // //         api.get('/admin/classes')
// // //       ]);
      
// // //       setTeachers(teachersRes.data.data?.teachers || []);
// // //       setSubjects(subjectsRes.data.data?.subjects || []); 
// // //       setClasses(classesRes.data.data?.classes || []);
// // //       setLoading(false);
// // //     } catch (error) {
// // //       console.error(error);
// // //       toast.error('Failed to fetch data');
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleCreateTeacher = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       await api.post('/admin/add-teacher', formData);
// // //       toast.success('Teacher added successfully');
// // //       setIsAddOpen(false);
// // //       setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
// // //       fetchData();
// // //     } catch (error) {
// // //        console.error(error);
// // //       toast.error(error.response?.data?.message || 'Failed to create teacher');
// // //     }
// // //   };

// // //   const handleUpdateTeacher = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //         await api.patch(`/admin/update-teacher/${editingTeacherId}`, formData);
// // //         toast.success('Teacher updated successfully');
// // //         setIsEditOpen(false);
// // //         setEditingTeacherId(null);
// // //         setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
// // //         fetchData();
// // //     } catch (error) {
// // //         console.error(error);
// // //         toast.error(error.response?.data?.message || 'Failed to update teacher');
// // //     }
// // //   };

// // //   const openEditModal = (teacher) => {
// // //       setEditingTeacherId(teacher._id);
// // //       setFormData({
// // //           name: teacher.name,
// // //           email: teacher.email,
// // //           password: '', // Leave blank if not changing
// // //           phone: teacher.phone || '',
// // //           subjects: teacher.subjects || []
// // //       });
// // //       setIsEditOpen(true);
// // //   };

// // //   const handleSubjectToggle = (subName) => {
// // //     setFormData(prev => {
// // //       const newSubjects = prev.subjects.includes(subName)
// // //         ? prev.subjects.filter(s => s !== subName)
// // //         : [...prev.subjects, subName];
// // //       return { ...prev, subjects: newSubjects };
// // //     });
// // //   };

// // //   const openAssignModal = (teacher) => {
// // //     setSelectedTeacher(teacher);
// // //     setSelectedClassId(teacher.assignedClass?._id || '');
// // //     setIsAssignOpen(true);
// // //   };

// // //   const handleAssignClass = async () => {
// // //     try {
// // //       await api.patch('/admin/assign-class-teacher', {
// // //         teacherId: selectedTeacher._id,
// // //         classId: selectedClassId
// // //       });
// // //       toast.success('Class assigned successfully');
// // //       setIsAssignOpen(false);
// // //       fetchData();
// // //     } catch (error) {
// // //        console.error(error);
// // //        toast.error(error.response?.data?.message || 'Failed to assign class');
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-6">
// // //       <div className="flex justify-between items-center">
// // //         <div>
// // //           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
// // //           <p className="text-muted-foreground">Add teachers and assign them to classes.</p>
// // //         </div>
// // //         <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
// // //           <DialogTrigger asChild>
// // //             <Button className="gap-2"><Plus size={16} /> Add Teacher</Button>
// // //           </DialogTrigger>
// // //           <DialogContent className="max-h-[85vh] overflow-y-auto">
// // //             <DialogHeader>
// // //               <DialogTitle>Add New Teacher</DialogTitle>
// // //               <DialogDescription>Create a teacher account.</DialogDescription>
// // //             </DialogHeader>
// // //             <form onSubmit={handleCreateTeacher} className="space-y-4">
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="name">Full Name</Label>
// // //                 <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="email">Email</Label>
// // //                 <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="phone">Phone</Label>
// // //                 <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="password">Password</Label>
// // //                 <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
// // //               </div>
              
// // //               <div className="space-y-2">
// // //                 <Label>Teaching Subjects</Label>
// // //                 <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
// // //                   {subjects?.data?.subjects.length === 0 ? <p className="text-sm text-muted-foreground">No subjects found. Add subjects first.</p> :
// // //                    subjects?.data?.subjects.map(sub => (
// // //                     <div key={sub._id} className="flex items-center space-x-2">
// // //                       <Checkbox 
// // //                         id={`sub-${sub._id}`} 
// // //                         checked={formData.subjects.includes(sub.name)}
// // //                         onCheckedChange={() => handleSubjectToggle(sub.name)}
// // //                       />
// // //                       <label htmlFor={`sub-${sub._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
// // //                         {sub.name}
// // //                       </label>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
              
// // //               <DialogFooter>
// // //                 <Button type="submit">Create Teacher</Button>
// // //               </DialogFooter>
// // //             </form>
// // //           </DialogContent>
// // //         </Dialog>
// // //       </div>

// // //       <Card>
// // //         <CardContent className="p-0">
// // //           <Table>
// // //             <TableHeader>
// // //               <TableRow>
// // //                 <TableHead>No.</TableHead>
// // //                 <TableHead>Teacher Name</TableHead>
// // //                 <TableHead>Email</TableHead>
// // //                 <TableHead>Subjects</TableHead>
// // //                 <TableHead>Assigned Class</TableHead>
// // //                 <TableHead>Actions</TableHead>
// // //               </TableRow>
// // //             </TableHeader>
// // //             <TableBody>
// // //               {teachers.map((teacher, idx) => (
// // //                 <TableRow key={teacher._id}>
// // //                   <TableCell>{idx + 1}</TableCell>
// // //                   <TableCell className="font-medium">{teacher.name}</TableCell>
// // //                   <TableCell>{teacher.email}</TableCell>
// // //                   <TableCell>{teacher.subjects.join(', ')}</TableCell>
// // //                   <TableCell>
// // //                     {teacher.assignedClass ? (
// // //                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
// // //                              {teacher.assignedClass.grade} - {teacher.assignedClass.section}
// // //                          </span>
// // //                     ) : (
// // //                         <span className="text-muted-foreground text-sm">None</span>
// // //                     )}
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <div className="flex gap-2">
// // //                         <Button variant="outline" size="icon" onClick={() => openEditModal(teacher)}>
// // //                             <Pencil size={16} />
// // //                         </Button>
// // //                         <Button variant="outline" size="sm" onClick={() => openAssignModal(teacher)}>
// // //                         <UserPlus size={16} className="mr-1" /> Assign Class
// // //                         </Button>
// // //                     </div>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// // //         </CardContent>
// // //       </Card>

// // //       {/* Assign Class Modal */}
// // //       <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
// // //         <DialogContent>
// // //             <DialogHeader>
// // //                 <DialogTitle>Assign Class Teacher</DialogTitle>
// // //                 <DialogDescription>
// // //                     Assign {selectedTeacher?.name} as a class teacher.
// // //                 </DialogDescription>
// // //             </DialogHeader>
// // //             <div className="space-y-4 py-4">
// // //                 <div className="space-y-2">
// // //                     <Label>Select Class</Label>
// // //                     <Select value={selectedClassId} onValueChange={setSelectedClassId}>
// // //                         <SelectTrigger>
// // //                             <SelectValue placeholder="Select a class" />
// // //                         </SelectTrigger>
// // //                         <SelectContent>
// // //                              {classes.map(cls => (
// // //                                  <SelectItem key={cls._id} value={cls._id}>
// // //                                      Grade {cls.grade} - {cls.section}
// // //                                  </SelectItem>
// // //                              ))}
// // //                         </SelectContent>
// // //                     </Select>
// // //                 </div>
// // //             </div>
// // //       {/* Edit Teacher Modal */}
// // //       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
// // //         <DialogContent className="max-h-[85vh] overflow-y-auto">
// // //           <DialogHeader>
// // //             <DialogTitle>Edit Teacher</DialogTitle>
// // //             <DialogDescription>Update teacher details.</DialogDescription>
// // //           </DialogHeader>
// // //           <form onSubmit={handleUpdateTeacher} className="space-y-4">
// // //             <div className="space-y-2">
// // //               <Label htmlFor="edit-name">Full Name</Label>
// // //               <Input id="edit-name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="edit-email">Email</Label>
// // //               <Input id="edit-email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="edit-phone">Phone</Label>
// // //               <Input id="edit-phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="edit-password">New Password (Optional)</Label>
// // //               <Input id="edit-password" type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
// // //             </div>
            
// // //             <div className="space-y-2">
// // //               <Label>Teaching Subjects</Label>
// // //               <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
// // //                 {subjects?.data?.subjects.length === 0 ? <p className="text-sm text-muted-foreground">No subjects found.</p> :
// // //                  subjects?.data?.subjects.map(sub => (
// // //                   <div key={`edit-sub-${sub._id}`} className="flex items-center space-x-2">
// // //                     <Checkbox 
// // //                       id={`edit-sub-${sub._id}`} 
// // //                       checked={formData.subjects.includes(sub.subName)}
// // //                       onCheckedChange={() => handleSubjectToggle(sub.subName)}
// // //                     />
// // //                     <label htmlFor={`edit-sub-${sub._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
// // //                       {sub.subName}
// // //                     </label>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
            
// // //             <DialogFooter>
// // //               <Button type="submit">Update Teacher</Button>
// // //             </DialogFooter>
// // //           </form>
// // //         </DialogContent>
// // //       </Dialog>
// // //             <DialogFooter>
// // //                 <Button onClick={handleAssignClass}>Save Assignment</Button>
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
// //   DialogTrigger,
// // } from "@/components/ui/dialog"
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"
// // import { toast } from 'sonner';
// // import { Plus, Loader2, Pencil, UserPlus, GraduationCap } from 'lucide-react';

// // const ManageTeachers = () => {
// //   // --- State Management ---
// //   const [teachers, setTeachers] = useState([]);
// //   const [subjects, setSubjects] = useState([]);
// //   const [classes, setClasses] = useState([]); // Added for Assign Class
  
// //   const [loading, setLoading] = useState(true);
// //   const [subjectsLoading, setSubjectsLoading] = useState(false);

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
// //     email: '',
// //     password: '',
// //     phone: '',
// //     subjects: []
// //   });

// //   // --- Initial Data Fetching ---
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

// //   // --- Handlers: Add/Edit Teacher ---

// //   const handleOpenAddDialog = () => {
// //     setEditingTeacherId(null);
// //     setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
// //     setIsDialogOpen(true);
// //   };

// //   const handleEditClick = (teacher) => {
// //     setEditingTeacherId(teacher._id);
// //     setFormData({
// //       name: teacher.name,
// //       email: teacher.email,
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
// //         toast.warning('Please assign at least one subject.');
// //         setIsSubmitting(false);
// //         return;
// //       }

// //       if (editingTeacherId) {
// //         // Update Logic
// //         const updateData = { ...formData };
// //         if (!updateData.password) delete updateData.password;
// //         await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
// //         toast.success('Teacher updated successfully');
// //       } else {
// //         // Create Logic
// //         if (!formData.password) {
// //             toast.error('Password is required');
// //             setIsSubmitting(false);
// //             return;
// //         }
// //         await api.post('/admin/add-teacher', formData);
// //         toast.success('Teacher added successfully');
// //       }
      
// //       setIsDialogOpen(false);
// //       fetchAllData(); // Refresh all data
// //     } catch (error) {
// //       console.error(error);
// //       toast.error(error.response?.data?.message || 'Operation failed');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // --- Handlers: Assign Class ---

// //   const handleOpenAssignDialog = (teacher) => {
// //     setSelectedTeacher(teacher);
// //     // Pre-select the class if they already have one
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
// //         fetchAllData(); // Refresh to show updated assignment in table
// //     } catch (error) {
// //         console.error("Assignment error:", error);
// //         toast.error(error.response?.data?.message || 'Failed to assign class');
// //     } finally {
// //         setIsAssigning(false);
// //     }
// //   };

// //   // --- Render ---
// //   return (
// //     <div className="space-y-6">
// //       {/* Header & Add Button */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
// //           <p className="text-muted-foreground">Add, edit, and assign classes to teachers.</p>
// //         </div>
        
// //         <Button className="gap-2" onClick={handleOpenAddDialog}>
// //             <Plus size={16} /> Add Teacher
// //         </Button>
// //       </div>

// //       {/* Main Table */}
// //       <Card>
// //         <CardContent className="p-0">
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Name</TableHead>
// //                 <TableHead>Contact</TableHead>
// //                 <TableHead>Assigned Subjects</TableHead>
// //                 <TableHead>Class Teacher Of</TableHead>
// //                 <TableHead className="text-right">Actions</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {loading ? (
// //                  <TableRow>
// //                     <TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto" /></TableCell>
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
// //                     <TableCell className="font-medium">{teacher.name}</TableCell>
// //                     <TableCell>
// //                         <div className="flex flex-col text-xs text-muted-foreground">
// //                             <span>{teacher.email}</span>
// //                             <span>{teacher.phone}</span>
// //                         </div>
// //                     </TableCell>
// //                     <TableCell>
// //                         <div className="flex flex-wrap gap-1 max-w-[200px]">
// //                             {teacher.subjects?.map((sub, idx) => (
// //                                 <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
// //                                     {sub}
// //                                 </span>
// //                             ))}
// //                         </div>
// //                     </TableCell>
// //                     <TableCell>
// //                         {teacher.assignedClass ? (
// //                              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
// //                                  <GraduationCap size={12} />
// //                                  {teacher.assignedClass.grade} - {teacher.assignedClass.section}
// //                              </span>
// //                         ) : (
// //                             <span className="text-muted-foreground text-xs italic pl-2">None</span>
// //                         )}
// //                     </TableCell>
// //                     <TableCell className="text-right">
// //                         <div className="flex justify-end gap-2">
// //                             <Button 
// //                                 variant="outline" 
// //                                 size="icon" 
// //                                 className="h-8 w-8" 
// //                                 title="Assign Class"
// //                                 onClick={() => handleOpenAssignDialog(teacher)}
// //                             >
// //                                 <UserPlus size={14} />
// //                             </Button>
// //                             <Button 
// //                                 variant="ghost" 
// //                                 size="icon" 
// //                                 className="h-8 w-8 text-blue-600 hover:text-blue-800"
// //                                 onClick={() => handleEditClick(teacher)}
// //                             >
// //                                 <Pencil size={14} />
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
// //         <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
// //             <DialogHeader>
// //               <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
// //               <DialogDescription>
// //                 {editingTeacherId ? 'Update details.' : 'Create account.'}
// //               </DialogDescription>
// //             </DialogHeader>
// //             <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
// //               <div className="space-y-2">
// //                 <Label htmlFor="name">Full Name</Label>
// //                 <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
// //               </div>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                     <Label htmlFor="email">Email</Label>
// //                     <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
// //                 </div>
// //                 <div className="space-y-2">
// //                     <Label htmlFor="phone">Phone</Label>
// //                     <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
// //                 </div>
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="password">{editingTeacherId ? 'New Password (Optional)' : 'Password'}</Label>
// //                 <Input id="password" type="password" placeholder={editingTeacherId ? "Unchanged" : "******"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label>Teaching Subjects</Label>
// //                 <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900">
// //                     {subjects.map((sub) => (
// //                         <div key={sub._id} className="flex items-center space-x-2">
// //                             <Checkbox 
// //                                 id={`sub-${sub._id}`}
// //                                 checked={formData.subjects.includes(sub.name)}
// //                                 onCheckedChange={(checked) => handleSubjectChange(sub.name, checked)}
// //                             />
// //                             <Label htmlFor={`sub-${sub._id}`} className="text-sm font-normal cursor-pointer select-none">
// //                                 {sub.name}
// //                             </Label>
// //                         </div>
// //                     ))}
// //                 </div>
// //               </div>
// //               <DialogFooter>
// //                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
// //                 <Button type="submit" disabled={isSubmitting}>
// //                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingTeacherId ? 'Update' : 'Create')}
// //                 </Button>
// //               </DialogFooter>
// //             </form>
// //         </DialogContent>
// //       </Dialog>

// //       {/* --- Dialog: Assign Class --- */}
// //       <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
// //         <DialogContent className="sm:max-w-[400px]">
// //             <DialogHeader>
// //                 <DialogTitle>Assign Class Teacher</DialogTitle>
// //                 <DialogDescription>
// //                     Assign a class to <strong>{selectedTeacher?.name}</strong>.
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
// //                     <p className="text-[10px] text-muted-foreground">
// //                         Note: A teacher can only manage one class. Previous assignments will be overwritten.
// //                     </p>
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


// // fileName: frontend/src/pages/ManageTeachers.jsx
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
// // import { Plus, Loader2, Pencil, UserPlus, GraduationCap, BookOpen } from 'lucide-react';

// // const ManageTeachers = () => {
// //   // --- Data State ---
// //   const [teachers, setTeachers] = useState([]);
// //   const [subjects, setSubjects] = useState([]);
// //   const [classes, setClasses] = useState([]); 
// //   const [loading, setLoading] = useState(true);

// //   // --- Dialog States ---
// //   const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
// //   const [isClassTeacherOpen, setIsClassTeacherOpen] = useState(false);
// //   const [isSubjectAssignOpen, setIsSubjectAssignOpen] = useState(false);
  
// //   // --- Form States ---
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [editingTeacherId, setEditingTeacherId] = useState(null);
// //   const [selectedTeacher, setSelectedTeacher] = useState(null);
  
// //   // Form Data: Create/Edit Teacher
// //   const [teacherForm, setTeacherForm] = useState({
// //     name: '', email: '', password: '', phone: '', subjects: []
// //   });

// //   // Form Data: Assign Class Teacher
// //   const [assignClassId, setAssignClassId] = useState('');

// //   // Form Data: Assign Subject Load
// //   const [subjectLoadForm, setSubjectLoadForm] = useState({
// //     classId: '',
// //     subjectId: ''
// //   });

// //   // --- Initial Fetch ---
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
// //       console.error(error);
// //       toast.error('Failed to load data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // --- Teacher CRUD Operations ---

// //   const handleOpenAddDialog = () => {
// //     setEditingTeacherId(null);
// //     setTeacherForm({ name: '', email: '', password: '', phone: '', subjects: [] });
// //     setIsTeacherDialogOpen(true);
// //   };

// //   const handleEditClick = (teacher) => {
// //     setEditingTeacherId(teacher._id);
// //     setTeacherForm({
// //       name: teacher.name,
// //       email: teacher.email,
// //       password: '', 
// //       phone: teacher.phone || '',
// //       subjects: teacher.subjects || [] 
// //     });
// //     setIsTeacherDialogOpen(true);
// //   };

// //   const handleSubjectChange = (subjectName, isChecked) => {
// //     setTeacherForm(prev => {
// //       const current = prev.subjects;
// //       return isChecked 
// //         ? { ...prev, subjects: [...current, subjectName] }
// //         : { ...prev, subjects: current.filter(s => s !== subjectName) };
// //     });
// //   };

// //   const handleCreateOrUpdate = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
// //     try {
// //       if (teacherForm.subjects.length === 0) {
// //         toast.warning('Please select at least one qualification subject');
// //         setIsSubmitting(false);
// //         return;
// //       }

// //       if (editingTeacherId) {
// //         const updateData = { ...teacherForm };
// //         if (!updateData.password) delete updateData.password;
// //         await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
// //         toast.success('Teacher updated');
// //       } else {
// //         await api.post('/admin/add-teacher', teacherForm);
// //         toast.success('Teacher created');
// //       }
// //       setIsTeacherDialogOpen(false);
// //       fetchAllData();
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Operation failed');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // --- Assign Class Teacher (Role) ---

// //   const openClassTeacherDialog = (teacher) => {
// //     setSelectedTeacher(teacher);
// //     setAssignClassId(teacher.assignedClass?._id || '');
// //     setIsClassTeacherOpen(true);
// //   };

// //   const submitClassTeacher = async () => {
// //     if (!assignClassId) return toast.warning('Select a class');
// //     setIsSubmitting(true);
// //     try {
// //       await api.patch('/admin/assign-class-teacher', {
// //         teacherId: selectedTeacher._id,
// //         classId: assignClassId
// //       });
// //       toast.success('Class Teacher assigned successfully');
// //       setIsClassTeacherOpen(false);
// //       fetchAllData();
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Failed');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // --- Assign Subject Teaching (Schedule) ---

// //   const openSubjectAssignDialog = (teacher) => {
// //     setSelectedTeacher(teacher);
// //     setSubjectLoadForm({ classId: '', subjectId: '' });
// //     setIsSubjectAssignOpen(true);
// //   };

// //   const submitSubjectAssignment = async () => {
// //     if (!subjectLoadForm.classId || !subjectLoadForm.subjectId) {
// //         return toast.warning('Please select both class and subject');
// //     }
// //     setIsSubmitting(true);
// //     try {
// //         await api.post('/admin/assign-subject-teacher', {
// //             teacherId: selectedTeacher._id,
// //             classId: subjectLoadForm.classId,
// //             subjectId: subjectLoadForm.subjectId
// //         });
// //         toast.success(`Assigned ${selectedTeacher.name} to teach selected subject`);
// //         setIsSubjectAssignOpen(false);
// //         // We don't necessarily need to fetch all data unless we show this count in table
// //         // But good practice to refresh
// //         fetchAllData(); 
// //     } catch (error) {
// //         toast.error(error.response?.data?.message || 'Assignment failed');
// //     } finally {
// //         setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
// //           <p className="text-muted-foreground">Manage teacher profiles, roles, and teaching schedules.</p>
// //         </div>
// //         <Button onClick={handleOpenAddDialog} className="gap-2">
// //             <Plus size={16} /> Add Teacher
// //         </Button>
// //       </div>

// //       <Card>
// //         <CardContent className="p-0">
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Teacher</TableHead>
// //                 <TableHead>Role</TableHead>
// //                 <TableHead>Qualified Subjects</TableHead>
// //                 <TableHead className="text-right">Actions</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {teachers.map((teacher) => (
// //                 <TableRow key={teacher._id}>
// //                   <TableCell className="font-medium">
// //                     <div>{teacher.name}</div>
// //                     <div className="text-xs text-muted-foreground">{teacher.email}</div>
// //                   </TableCell>
// //                   <TableCell>
// //                     {teacher.assignedClass ? (
// //                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
// //                              <GraduationCap size={12} /> Class Teacher ({teacher.assignedClass.grade}-{teacher.assignedClass.section})
// //                          </span>
// //                     ) : (
// //                         <span className="text-xs text-muted-foreground">No Class Assigned</span>
// //                     )}
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex flex-wrap gap-1">
// //                         {teacher.subjects.map((sub, i) => (
// //                             <span key={i} className="rounded border bg-slate-50 px-1 py-0.5 text-[10px] font-medium text-slate-600">
// //                                 {sub}
// //                             </span>
// //                         ))}
// //                     </div>
// //                   </TableCell>
// //                   <TableCell className="text-right">
// //                     <div className="flex justify-end gap-2">
// //                         {/* Assign Subject Teaching */}
// //                         <Button variant="outline" size="sm" onClick={() => openSubjectAssignDialog(teacher)} title="Assign Teaching Subject">
// //                             <BookOpen size={14} className="mr-1" /> Assign Subject
// //                         </Button>
                        
// //                         {/* Assign Class Teacher Role */}
// //                         <Button variant="outline" size="sm" onClick={() => openClassTeacherDialog(teacher)} title="Assign Class Teacher Role">
// //                             <GraduationCap size={14} className="mr-1" /> Set Class Teacher
// //                         </Button>

// //                         {/* Edit */}
// //                         <Button variant="ghost" size="icon" onClick={() => handleEditClick(teacher)}>
// //                             <Pencil size={14} />
// //                         </Button>
// //                     </div>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </CardContent>
// //       </Card>

// //       {/* 1. CREATE/EDIT TEACHER DIALOG */}
// //       <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
// //         <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
// //            <DialogHeader>
// //              <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
// //            </DialogHeader>
// //            <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
// //              <div className="space-y-2">
// //                 <Label>Name</Label>
// //                 <Input value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} required />
// //              </div>
// //              <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                     <Label>Email</Label>
// //                     <Input type="email" value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} required />
// //                 </div>
// //                 <div className="space-y-2">
// //                     <Label>Phone</Label>
// //                     <Input value={teacherForm.phone} onChange={e => setTeacherForm({...teacherForm, phone: e.target.value})} />
// //                 </div>
// //              </div>
// //              <div className="space-y-2">
// //                 <Label>Password</Label>
// //                 <Input type="password" placeholder={editingTeacherId ? "Unchanged" : "Required"} value={teacherForm.password} onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} />
// //              </div>
// //              <div className="space-y-2">
// //                 <Label>Qualified Subjects</Label>
// //                 <div className="grid grid-cols-2 gap-2 border p-3 rounded-md bg-slate-50">
// //                     {subjects.map(sub => (
// //                         <div key={sub._id} className="flex items-center gap-2">
// //                             <Checkbox 
// //                                 id={`sub-${sub._id}`} 
// //                                 checked={teacherForm.subjects.includes(sub.name)}
// //                                 onCheckedChange={(c) => handleSubjectChange(sub.name, c)} 
// //                             />
// //                             <Label htmlFor={`sub-${sub._id}`} className="cursor-pointer">{sub.name}</Label>
// //                         </div>
// //                     ))}
// //                 </div>
// //              </div>
// //              <DialogFooter>
// //                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Save'}</Button>
// //              </DialogFooter>
// //            </form>
// //         </DialogContent>
// //       </Dialog>

// //       {/* 2. ASSIGN CLASS TEACHER ROLE DIALOG */}
// //       <Dialog open={isClassTeacherOpen} onOpenChange={setIsClassTeacherOpen}>
// //         <DialogContent className="sm:max-w-[400px]">
// //             <DialogHeader>
// //                 <DialogTitle>Set Class Teacher</DialogTitle>
// //                 <DialogDescription>Assign <strong>{selectedTeacher?.name}</strong> as the sole Class Teacher.</DialogDescription>
// //             </DialogHeader>
// //             <div className="space-y-4 py-4">
// //                 <Label>Select Class</Label>
// //                 <Select value={assignClassId} onValueChange={setAssignClassId}>
// //                     <SelectTrigger><SelectValue placeholder="Select Class..." /></SelectTrigger>
// //                     <SelectContent>
// //                         {classes.map(cls => (
// //                             <SelectItem key={cls._id} value={cls._id}>
// //                                 {cls.grade}-{cls.section} 
// //                                 {cls.classTeacher && cls.classTeacher._id !== selectedTeacher?._id ? " (Has Teacher)" : ""}
// //                             </SelectItem>
// //                         ))}
// //                     </SelectContent>
// //                 </Select>
// //                 <p className="text-xs text-red-500">Warning: If this teacher is already assigned to a class, they will be removed from it. If the selected class has a teacher, they will be replaced.</p>
// //             </div>
// //             <DialogFooter>
// //                 <Button onClick={submitClassTeacher} disabled={isSubmitting}>Confirm Assignment</Button>
// //             </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       {/* 3. ASSIGN SUBJECT TEACHING DIALOG */}
// //       <Dialog open={isSubjectAssignOpen} onOpenChange={setIsSubjectAssignOpen}>
// //         <DialogContent className="sm:max-w-[400px]">
// //             <DialogHeader>
// //                 <DialogTitle>Assign Subject Load</DialogTitle>
// //                 <DialogDescription>Assign <strong>{selectedTeacher?.name}</strong> to teach a specific subject in a class.</DialogDescription>
// //             </DialogHeader>
// //             <div className="space-y-4 py-4">
// //                 <div className="space-y-2">
// //                     <Label>1. Select Class</Label>
// //                     <Select value={subjectLoadForm.classId} onValueChange={(val) => setSubjectLoadForm({...subjectLoadForm, classId: val})}>
// //                         <SelectTrigger><SelectValue placeholder="Select Class..." /></SelectTrigger>
// //                         <SelectContent>
// //                             {classes.map(cls => (
// //                                 <SelectItem key={cls._id} value={cls._id}>{cls.grade}-{cls.section}</SelectItem>
// //                             ))}
// //                         </SelectContent>
// //                     </Select>
// //                 </div>
// //                 <div className="space-y-2">
// //                     <Label>2. Select Subject</Label>
// //                     <Select value={subjectLoadForm.subjectId} onValueChange={(val) => setSubjectLoadForm({...subjectLoadForm, subjectId: val})}>
// //                         <SelectTrigger><SelectValue placeholder="Select Subject..." /></SelectTrigger>
// //                         <SelectContent>
// //                             {/* Only show subjects the teacher is qualified for? Or all subjects? 
// //                                 Usually better to show all School Subjects, but highlighting qualified ones is nice.
// //                                 For simplicity, let's show all School Subjects. */}
// //                             {subjects.map(sub => (
// //                                 <SelectItem key={sub._id} value={sub._id}>
// //                                     {sub.name} {selectedTeacher?.subjects.includes(sub.name) ? "(Qualified)" : ""}
// //                                 </SelectItem>
// //                             ))}
// //                         </SelectContent>
// //                     </Select>
// //                 </div>
// //             </div>
// //             <DialogFooter>
// //                 <Button onClick={submitSubjectAssignment} disabled={isSubmitting}>Assign Subject</Button>
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
// import { Plus, Loader2, Pencil, UserPlus, GraduationCap, BookOpen, User } from 'lucide-react';

// const ManageTeachers = () => {
//   // --- Data State ---
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]); 
//   const [loading, setLoading] = useState(true);

//   // --- Dialog States ---
//   const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
//   const [isClassTeacherOpen, setIsClassTeacherOpen] = useState(false);
//   const [isSubjectAssignOpen, setIsSubjectAssignOpen] = useState(false);
  
//   // --- Form States ---
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingTeacherId, setEditingTeacherId] = useState(null);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
  
//   const [teacherForm, setTeacherForm] = useState({
//     name: '', email: '', password: '', phone: '', subjects: []
//   });

//   const [assignClassId, setAssignClassId] = useState('');
  
//   // Multi-Class Assignment State
//   const [selectedSubjectId, setSelectedSubjectId] = useState('');
//   const [selectedClassIds, setSelectedClassIds] = useState([]);

//   // --- Initial Fetch ---
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
//       console.error(error);
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Helpers ---
//   // Fix for "Undefined Role"
//   const getTeacherRole = (teacher) => {
//     if (teacher.assignedClass) return 'Class Teacher';
//     return 'Subject Teacher';
//   };

//   const getTeacherRoleColor = (teacher) => {
//       if (teacher.assignedClass) return 'bg-purple-100 text-purple-700 border-purple-200';
//       return 'bg-blue-50 text-blue-700 border-blue-200';
//   }

//   // --- Teacher CRUD ---
//   const handleOpenAddDialog = () => {
//     setEditingTeacherId(null);
//     setTeacherForm({ name: '', email: '', password: '', phone: '', subjects: [] });
//     setIsTeacherDialogOpen(true);
//   };

//   const handleEditClick = (teacher) => {
//     setEditingTeacherId(teacher._id);
//     setTeacherForm({
//       name: teacher.name,
//       email: teacher.email,
//       password: '', 
//       phone: teacher.phone || '',
//       subjects: teacher.subjects || [] 
//     });
//     setIsTeacherDialogOpen(true);
//   };

//   const handleSubjectChange = (subjectName, isChecked) => {
//     setTeacherForm(prev => {
//       const current = prev.subjects;
//       return isChecked 
//         ? { ...prev, subjects: [...current, subjectName] }
//         : { ...prev, subjects: current.filter(s => s !== subjectName) };
//     });
//   };

//   const handleCreateOrUpdate = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       if (teacherForm.subjects.length === 0) {
//         toast.warning('Please select at least one qualified subject');
//         setIsSubmitting(false);
//         return;
//       }

//       if (editingTeacherId) {
//         const updateData = { ...teacherForm };
//         if (!updateData.password) delete updateData.password;
//         await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
//         toast.success('Teacher updated');
//       } else {
//         await api.post('/admin/add-teacher', teacherForm);
//         toast.success('Teacher created successfully');
//       }
//       setIsTeacherDialogOpen(false);
//       fetchAllData();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- 1. Assign Class Teacher (Unique Role) ---
//   const openClassTeacherDialog = (teacher) => {
//     setSelectedTeacher(teacher);
//     setAssignClassId(teacher.assignedClass?._id || '');
//     setIsClassTeacherOpen(true);
//   };

//   const submitClassTeacher = async () => {
//     if (!assignClassId) return toast.warning('Select a class');
//     setIsSubmitting(true);
//     try {
//       await api.patch('/admin/assign-class-teacher', {
//         teacherId: selectedTeacher._id,
//         classId: assignClassId
//       });
//       toast.success('Class Teacher assigned');
//       setIsClassTeacherOpen(false);
//       fetchAllData();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Assignment failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- 2. Assign Subject Load (Multiple Classes) ---
//   const openSubjectAssignDialog = (teacher) => {
//     setSelectedTeacher(teacher);
//     setSelectedSubjectId('');
//     setSelectedClassIds([]);
//     setIsSubjectAssignOpen(true);
//   };

//   const toggleClassSelection = (classId) => {
//     setSelectedClassIds(prev => 
//         prev.includes(classId) 
//         ? prev.filter(id => id !== classId)
//         : [...prev, classId]
//     );
//   };

//   const submitSubjectLoad = async () => {
//       if (!selectedSubjectId) return toast.warning('Please select a subject');
//       if (selectedClassIds.length === 0) return toast.warning('Please select at least one class');
      
//       setIsSubmitting(true);
//       try {
//           await api.post('/admin/assign-subject-load', {
//               teacherId: selectedTeacher._id,
//               subjectId: selectedSubjectId,
//               classIds: selectedClassIds
//           });
//           toast.success('Teaching schedule updated');
//           setIsSubjectAssignOpen(false);
//           // Optional: Refresh data to show logs or counts if needed
//       } catch (error) {
//           toast.error(error.response?.data?.message || 'Failed to assign schedule');
//       } finally {
//           setIsSubmitting(false);
//       }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
//           <p className="text-muted-foreground">Manage roles, profiles, and teaching schedules.</p>
//         </div>
//         <Button onClick={handleOpenAddDialog} className="gap-2">
//             <Plus size={16} /> Add Teacher
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Teacher Info</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Qualified Subjects</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                  <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin mx-auto"/></TableCell></TableRow>
//               ) : teachers.map((teacher) => (
//                 <TableRow key={teacher._id}>
//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-2">
//                         <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
//                             <User size={16} />
//                         </div>
//                         <div>
//                             <div className="font-semibold">{teacher.name}</div>
//                             <div className="text-xs text-muted-foreground">{teacher.email}</div>
//                         </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {/* Fixed "Undefined Role" Issue */}
//                     <div className="space-y-1">
//                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getTeacherRoleColor(teacher)}`}>
//                             {getTeacherRole(teacher)}
//                         </span>
//                         {teacher.assignedClass && (
//                             <div className="text-xs text-muted-foreground flex items-center gap-1">
//                                 <GraduationCap size={10} /> Class: {teacher.assignedClass.grade}-{teacher.assignedClass.section}
//                             </div>
//                         )}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-wrap gap-1 max-w-[200px]">
//                         {teacher.subjects.map((sub, i) => (
//                             <Badge key={i} variant="secondary" className="text-[10px] px-1 h-5">{sub}</Badge>
//                         ))}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                         <Button variant="outline" size="icon" onClick={() => openSubjectAssignDialog(teacher)} title="Assign Teaching Schedule">
//                             <BookOpen size={14} />
//                         </Button>
//                         <Button variant="outline" size="icon" onClick={() => openClassTeacherDialog(teacher)} title="Assign Class Teacher Role">
//                             <GraduationCap size={14} />
//                         </Button>
//                         <Button variant="ghost" size="icon" onClick={() => handleEditClick(teacher)}>
//                             <Pencil size={14} />
//                         </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* 1. Add/Edit Teacher Dialog */}
//       <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
//         <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
//            <DialogHeader>
//              <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
//            </DialogHeader>
//            <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
//              <div className="space-y-2">
//                 <Label>Name</Label>
//                 <Input value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} required />
//              </div>
//              <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label>Email</Label>
//                     <Input type="email" value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} required />
//                 </div>
//                 <div className="space-y-2">
//                     <Label>Phone</Label>
//                     <Input value={teacherForm.phone} onChange={e => setTeacherForm({...teacherForm, phone: e.target.value})} />
//                 </div>
//              </div>
//              <div className="space-y-2">
//                 <Label>Password</Label>
//                 <Input type="password" placeholder={editingTeacherId ? "Unchanged" : "Required"} value={teacherForm.password} onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} />
//              </div>
//              <div className="space-y-2">
//                 <Label>Qualified Subjects</Label>
//                 <div className="grid grid-cols-2 gap-2 border p-3 rounded-md bg-slate-50 max-h-[150px] overflow-y-auto">
//                     {subjects.map(sub => (
//                         <div key={sub._id} className="flex items-center gap-2">
//                             <Checkbox 
//                                 id={`sub-${sub._id}`} 
//                                 checked={teacherForm.subjects.includes(sub.name)}
//                                 onCheckedChange={(c) => handleSubjectChange(sub.name, c)} 
//                             />
//                             <Label htmlFor={`sub-${sub._id}`} className="cursor-pointer text-sm">{sub.name}</Label>
//                         </div>
//                     ))}
//                 </div>
//              </div>
//              <DialogFooter>
//                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Teacher'}</Button>
//              </DialogFooter>
//            </form>
//         </DialogContent>
//       </Dialog>

//       {/* 2. Assign Class Teacher Dialog */}
//       <Dialog open={isClassTeacherOpen} onOpenChange={setIsClassTeacherOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//             <DialogHeader>
//                 <DialogTitle>Assign Class Teacher</DialogTitle>
//                 <DialogDescription>Assign <strong>{selectedTeacher?.name}</strong> as the sole Class Teacher.</DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//                 <Label>Select Class</Label>
//                 <Select value={assignClassId} onValueChange={setAssignClassId}>
//                     <SelectTrigger><SelectValue placeholder="Select Class..." /></SelectTrigger>
//                     <SelectContent>
//                         {classes.map(cls => {
//                             const hasOtherTeacher = cls.classTeacher && cls.classTeacher._id !== selectedTeacher?._id;
//                             return (
//                                 <SelectItem key={cls._id} value={cls._id} disabled={hasOtherTeacher}>
//                                     Grade {cls.grade}-{cls.section} 
//                                     {hasOtherTeacher ? " (Assigned - Cannot Replace)" : ""}
//                                 </SelectItem>
//                             );
//                         })}
//                     </SelectContent>
//                 </Select>
//                 <p className="text-[10px] text-muted-foreground">
//                     Note: A class can only have one Class Teacher. You cannot replace an existing assignment without removing it first.
//                 </p>
//             </div>
//             <DialogFooter>
//                 <Button onClick={submitClassTeacher} disabled={isSubmitting}>Confirm Assignment</Button>
//             </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* 3. Assign Subject Load (Schedule) Dialog */}
//       <Dialog open={isSubjectAssignOpen} onOpenChange={setIsSubjectAssignOpen}>
//         <DialogContent className="sm:max-w-[450px]">
//             <DialogHeader>
//                 <DialogTitle>Assign Teaching Schedule</DialogTitle>
//                 <DialogDescription>Select a subject and assign it to multiple classes for <strong>{selectedTeacher?.name}</strong>.</DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-2">
//                 {/* Step 1: Select Subject */}
//                 <div className="space-y-2">
//                     <Label>1. Select Subject to Teach</Label>
//                     <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
//                         <SelectTrigger><SelectValue placeholder="Select Subject..." /></SelectTrigger>
//                         <SelectContent>
//                             {subjects.map(sub => (
//                                 <SelectItem key={sub._id} value={sub._id}>
//                                     {sub.name} {selectedTeacher?.subjects.includes(sub.name) ? "(Qualified)" : ""}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Step 2: Select Multiple Classes */}
//                 <div className="space-y-2">
//                     <Label>2. Select Classes (Multiple)</Label>
//                     <div className="border rounded-md p-2 h-[150px] overflow-y-auto space-y-1 bg-slate-50">
//                         {classes.map(cls => (
//                             <div key={cls._id} className="flex items-center space-x-2 p-1 hover:bg-slate-100 rounded">
//                                 <Checkbox 
//                                     id={`cls-${cls._id}`}
//                                     checked={selectedClassIds.includes(cls._id)}
//                                     onCheckedChange={() => toggleClassSelection(cls._id)}
//                                 />
//                                 <Label htmlFor={`cls-${cls._id}`} className="flex-1 cursor-pointer text-sm">
//                                     Grade {cls.grade} - {cls.section}
//                                 </Label>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="text-xs text-muted-foreground text-right">
//                         {selectedClassIds.length} classes selected
//                     </div>
//                 </div>
//             </div>
//             <DialogFooter>
//                 <Button onClick={submitSubjectLoad} disabled={isSubmitting}>
//                     {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
//                     Assign Schedule
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
import { Plus, Loader2, Pencil, UserPlus, Crown, BookOpen } from 'lucide-react';

const ManageTeachers = () => {
  // --- State Management ---
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
    email: '',
    password: '',
    phone: '',
    subjects: []
  });

  // --- Initial Data Fetching ---
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

  // --- Handlers: Add/Edit Teacher ---

  const handleOpenAddDialog = () => {
    setEditingTeacherId(null);
    setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
    setIsDialogOpen(true);
  };

  const handleEditClick = (teacher) => {
    setEditingTeacherId(teacher._id);
    setFormData({
      name: teacher.name,
      email: teacher.email,
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
        toast.warning('Please select at least one subject taught by this teacher.');
        setIsSubmitting(false);
        return;
      }

      if (editingTeacherId) {
        // Update Logic
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.patch(`/admin/update-teacher/${editingTeacherId}`, updateData);
        toast.success('Teacher updated successfully');
      } else {
        // Create Logic
        if (!formData.password) {
            toast.error('Password is required');
            setIsSubmitting(false);
            return;
        }
        await api.post('/admin/add-teacher', formData);
        toast.success('Teacher added successfully');
      }
      
      setIsDialogOpen(false);
      fetchAllData(); // Refresh all data
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handlers: Assign Class ---

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

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
          <p className="text-muted-foreground">Add teachers, assign subjects, and appoint class teachers.</p>
        </div>
        
        <Button className="gap-2" onClick={handleOpenAddDialog}>
            <Plus size={16} /> Add Teacher
        </Button>
      </div>

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-[30%]">Subjects Taught</TableHead>
                <TableHead>Class Teacher Of</TableHead>
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
                    No teachers found. Add a teacher to get started.
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell className="font-medium">
                        {teacher.name}
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col text-xs text-muted-foreground">
                            <span>{teacher.email}</span>
                            <span>{teacher.phone}</span>
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
                                <span className="text-xs text-muted-foreground italic">No subjects assigned</span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        {teacher.assignedClass ? (
                             <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                                 <Crown size={12} />
                                 Grade {teacher.assignedClass.grade} - {teacher.assignedClass.section}
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
              <DialogDescription>
                {editingTeacherId ? 'Update teacher details and subjects.' : 'Create a new teacher account.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{editingTeacherId ? 'New Password (Optional)' : 'Password'}</Label>
                <Input id="password" type="password" placeholder={editingTeacherId ? "Unchanged" : "******"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                    <span>Subjects</span>
                    <span className="text-[10px] font-normal text-muted-foreground">Select all that apply</span>
                </Label>
                <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                    {subjects.length === 0 ? (
                         <div className="col-span-2 text-center text-sm text-muted-foreground py-2">No subjects found. Add subjects first.</div>
                    ) : (
                        subjects.map((sub) => (
                            <div key={sub._id} className="flex items-center space-x-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                <Checkbox 
                                    id={`sub-${sub._id}`}
                                    checked={formData.subjects.includes(sub.name)}
                                    onCheckedChange={(checked) => handleSubjectChange(sub.name, checked)}
                                />
                                <Label htmlFor={`sub-${sub._id}`} className="text-sm font-normal cursor-pointer select-none flex-1">
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
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingTeacherId ? 'Update Teacher' : 'Create Teacher')}
                </Button>
              </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* --- Dialog: Assign Class --- */}
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
                    <p className="text-[11px] text-muted-foreground">
                        A teacher can only be the class teacher for one class at a time.
                    </p>
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