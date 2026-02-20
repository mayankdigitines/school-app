import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Plus, Loader2, Layers, BookOpen } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Single field state
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
      await api.post('/admin/add-class', { className }); 
      toast.success('Class added successfully');
      setIsDialogOpen(false);
      setClassName(''); 
      fetchClasses(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add class');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Manage Classes</h2>
          <p className="text-muted-foreground mt-1">Define and organize the academic structure of your school.</p>
        </div>
        
        {/* Add Class Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus size={18} /> Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Create a new academic class (e.g., "10 A", "Grade 5").</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5 py-4">
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Class'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Area */}
      {loading ? (
        // Loading State: Skeleton Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((skeleton) => (
            <Card key={skeleton} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-5 bg-muted rounded w-1/2"></div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-3/4 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : classes.length === 0 ? (
        // Empty State
        <Card className="border-dashed shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Layers className="h-10 w-10 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Classes Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't added any classes yet. Click the "Add Class" button above to get started.
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus size={16} /> Add Your First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Data State: Responsive Grid of Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <Card 
              key={cls._id} 
              className="group hover:shadow-md hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    {cls.className}
                  </CardTitle>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <BookOpen size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                  <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
                    Active Class
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageClasses;