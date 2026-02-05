import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ grade: '', section: '' });

  useEffect(() => {
    fetchClasses();
  }, []);
  console.log("classes", classes);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data || []); // Access nested classes array safely
      setLoading(false);
    } catch (error) {
       console.error(error);
      toast.error('Failed to fetch classes');
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/add-class', formData);
      toast.success('Class added successfully');
      setIsDialogOpen(false);
      setFormData({ grade: '', section: '' });
      fetchClasses(); // Refresh list
    } catch (error) {
        console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add class');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Classes</h2>
          <p className="text-muted-foreground">Add and view classes and sections.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Create a new class for your school.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade / Class Name</Label>
                <Input 
                    id="grade" 
                    placeholder="e.g. 5, 10, KG" 
                    value={formData.grade} 
                    onChange={e => setFormData({...formData, grade: e.target.value})} 
                    required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input 
                    id="section" 
                    placeholder="e.g. A, B, Red" 
                    value={formData.section} 
                    onChange={e => setFormData({...formData, section: e.target.value})} 
                    required 
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create Class</Button>
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
                <TableHead>Grade</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Class Teacher</TableHead>
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No classes fmound. Add your first class.
                  </TableCell>
                </TableRow>
              ) : (
               classes?.data?.classes?.map((cls) => (
                  <TableRow key={cls._id}>
                    <TableCell className="font-medium">{cls.grade}</TableCell>
                    <TableCell>{cls.section}</TableCell>
                    <TableCell>{cls.classTeacher?.name || "Unassigned"}</TableCell>
                     {/* <TableCell className="text-right"></TableCell> */}
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

export default ManageClasses;
