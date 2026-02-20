import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
} from "@/components/ui/dialog"
import { toast } from 'sonner';
import { Plus, Loader2, BookOpen } from 'lucide-react';

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/subjects');
      setSubjects(response.data?.data?.subjects || []);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/add-subject', formData);
      toast.success('Subject added successfully');
      setIsDialogOpen(false);
      setFormData({ name: '' });
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subject');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Subjects</h2>
          <p className="text-muted-foreground">Add and view subjects offered by the school.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" size="sm">
              <Plus size={16} /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>Create a new subject to add to the curriculum.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subName">Subject Name</Label>
                <Input
                  id="subName"
                  placeholder="e.g. Mathematics"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Subject'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p>Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <BookOpen size={32} className="opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No subjects found</h3>
              <p className="mb-4">You haven't added any subjects yet.</p>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus size={16} /> Add your first subject
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {subjects.map((sub) => (
              <Card 
                key={sub._id} 
                className="group hover:shadow-md hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-default flex flex-col"
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center flex-1 gap-4">
                  {/* Subject SVG Avatar */}
                  <div className="relative">
                    {sub.subjectIcon ? (
                      <div 
                        className="w-20 h-20 rounded-full overflow-hidden shadow-sm border border-border group-hover:scale-105 transition-transform duration-300"
                        // Inject the SVG string directly into the DOM
                        dangerouslySetInnerHTML={{ __html: sub.subjectIcon }} 
                      />
                    ) : (
                      // Fallback just in case older subjects don't have an icon yet
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border border-border group-hover:scale-105 transition-transform duration-300">
                        <BookOpen size={32} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* Subject Name */}
                  <div className="w-full">
                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                      {sub.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubjects;