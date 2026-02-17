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
import { Plus, Loader2, Layers } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // REF: Single field state
  const [className, setClassName] = useState(''); 

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
      // REF: Sending className object
      await api.post('/admin/add-class', { className }); 
      toast.success('Class added successfully');
      setIsDialogOpen(false);
      setClassName(''); // Reset single field
      fetchClasses(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add class');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Classes</h2>
          <p className="text-muted-foreground">Define the academic structure.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add Class</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Create a new class (e.g., "10 A", "Grade 5").</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input 
                      id="className" 
                      placeholder="e.g. 10 A" 
                      value={className} 
                      onChange={e => setClassName(e.target.value)} 
                      required 
                  />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Class'}
                </Button>
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
                <TableHead className="w-25">#</TableHead>
                <TableHead>Class Name</TableHead>
                {/* Removed separate Grade/Section headers */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                    <TableCell colSpan={2} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell>
                </TableRow>
              ) : classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <Layers className="h-8 w-8 opacity-50" />
                        <p>No classes found. Add your first class to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((cls, idx) => (
                  <TableRow key={cls._id}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-semibold text-base">
                        <span className="inline-flex items-center justify-center rounded-md border bg-secondary px-2.5 py-0.5 text-sm font-medium text-secondary-foreground">
                            {cls.className}
                        </span>
                    </TableCell>
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