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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';
import { Plus, UserPlus, Pencil } from 'lucide-react';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]); // List of available subjects
  const [classes, setClasses] = useState([]); // List of available classes
  const [loading, setLoading] = useState(true);
  
  // Create Teacher State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', subjects: [] });
  
  // Edit Teacher State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  // Assign Class State
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teachersRes, subjectsRes, classesRes] = await Promise.all([
        api.get('/admin/teachers'),
        api.get('/admin/subjects'),
        api.get('/admin/classes')
      ]);
      
      setTeachers(teachersRes.data.data?.teachers || []);
      setSubjects(subjectsRes.data.data?.subjects || []); 
      setClasses(classesRes.data.data?.classes || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/add-teacher', formData);
      toast.success('Teacher added successfully');
      setIsAddOpen(false);
      setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
      fetchData();
    } catch (error) {
       console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create teacher');
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
        await api.patch(`/admin/update-teacher/${editingTeacherId}`, formData);
        toast.success('Teacher updated successfully');
        setIsEditOpen(false);
        setEditingTeacherId(null);
        setFormData({ name: '', email: '', password: '', phone: '', subjects: [] });
        fetchData();
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to update teacher');
    }
  };

  const openEditModal = (teacher) => {
      setEditingTeacherId(teacher._id);
      setFormData({
          name: teacher.name,
          email: teacher.email,
          password: '', // Leave blank if not changing
          phone: teacher.phone || '',
          subjects: teacher.subjects || []
      });
      setIsEditOpen(true);
  };

  const handleSubjectToggle = (subName) => {
    setFormData(prev => {
      const newSubjects = prev.subjects.includes(subName)
        ? prev.subjects.filter(s => s !== subName)
        : [...prev.subjects, subName];
      return { ...prev, subjects: newSubjects };
    });
  };

  const openAssignModal = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedClassId(teacher.assignedClass?._id || '');
    setIsAssignOpen(true);
  };

  const handleAssignClass = async () => {
    try {
      await api.patch('/admin/assign-class-teacher', {
        teacherId: selectedTeacher._id,
        classId: selectedClassId
      });
      toast.success('Class assigned successfully');
      setIsAssignOpen(false);
      fetchData();
    } catch (error) {
       console.error(error);
       toast.error(error.response?.data?.message || 'Failed to assign class');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
          <p className="text-muted-foreground">Add teachers and assign them to classes.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add Teacher</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>Create a teacher account.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
              
              <div className="space-y-2">
                <Label>Teaching Subjects</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {subjects?.data?.subjects.length === 0 ? <p className="text-sm text-muted-foreground">No subjects found. Add subjects first.</p> :
                   subjects?.data?.subjects.map(sub => (
                    <div key={sub._id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`sub-${sub._id}`} 
                        checked={formData.subjects.includes(sub.name)}
                        onCheckedChange={() => handleSubjectToggle(sub.name)}
                      />
                      <label htmlFor={`sub-${sub._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {sub.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Create Teacher</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Assigned Class</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher, idx) => (
                <TableRow key={teacher._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.subjects.join(', ')}</TableCell>
                  <TableCell>
                    {teacher.assignedClass ? (
                         <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                             {teacher.assignedClass.grade} - {teacher.assignedClass.section}
                         </span>
                    ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditModal(teacher)}>
                            <Pencil size={16} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openAssignModal(teacher)}>
                        <UserPlus size={16} className="mr-1" /> Assign Class
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Class Modal */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Assign Class Teacher</DialogTitle>
                <DialogDescription>
                    Assign {selectedTeacher?.name} as a class teacher.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Select Class</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                             {classes.map(cls => (
                                 <SelectItem key={cls._id} value={cls._id}>
                                     Grade {cls.grade} - {cls.section}
                                 </SelectItem>
                             ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
      {/* Edit Teacher Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Update teacher details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTeacher} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (Optional)</Label>
              <Input id="edit-password" type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label>Teaching Subjects</Label>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {subjects?.data?.subjects.length === 0 ? <p className="text-sm text-muted-foreground">No subjects found.</p> :
                 subjects?.data?.subjects.map(sub => (
                  <div key={`edit-sub-${sub._id}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`edit-sub-${sub._id}`} 
                      checked={formData.subjects.includes(sub.subName)}
                      onCheckedChange={() => handleSubjectToggle(sub.subName)}
                    />
                    <label htmlFor={`edit-sub-${sub._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {sub.subName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit">Update Teacher</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
            <DialogFooter>
                <Button onClick={handleAssignClass}>Save Assignment</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTeachers;
