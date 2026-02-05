import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
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

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
console.log("subjects", subjects);
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/admin/subjects');
      setSubjects(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch subjects');
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/add-subject', formData);
      toast.success('Subject added successfully');
      setIsDialogOpen(false);
      setFormData({ name: '' });
      fetchSubjects(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add subject');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Subjects</h2>
          <p className="text-muted-foreground">Add and view subjects offered by the school.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>Create a new subject.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subName">Subject Name</Label>
                <Input 
                    id="subName" 
                    placeholder="e.g. Mathematics" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                />
              </div>
           
              <DialogFooter>
                <Button type="submit">Add Subject</Button>
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
                <TableHead>Subject Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects?.data?.subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={1} className="text-center py-8 text-muted-foreground">
                    No subjects found.
                  </TableCell>
                </TableRow>
              ) : (
                subjects?.data?.subjects.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
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

export default ManageSubjects;
