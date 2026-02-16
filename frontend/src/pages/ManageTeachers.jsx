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
    (item.name || `${item.className}`).toLowerCase().includes(search.toLowerCase())
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
              const labelText = item.name || `${item.className}`;
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
  const formatClass = (cls) => cls ? `${cls.className}` : '';

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

  // Prevent duplicate selection for subjects and teachingClasses
  const handleListToggle = (field, id, isChecked) => {
    setFormData(prev => {
      let currentList = prev[field];
      if (isChecked) {
        // Add only if not already present
        if (!currentList.includes(id)) {
          // For subjects, ensure no duplicates
          if (field === 'subjects') {
            return { ...prev, [field]: [...currentList, id] };
          }
          // For teachingClasses, ensure no duplicates
          if (field === 'teachingClasses') {
            return { ...prev, [field]: [...currentList, id] };
          }
        }
        // If already present, do nothing
        return prev;
      }
      // Remove item
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