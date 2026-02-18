import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  BookOpen,
  Loader2,
  CalendarDays,
  Upload,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

const CreateHomework = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    description: '',
    dueDate: '',
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [homeRes, classesRes] = await Promise.all([
        api.get('/teachers/home'),
        api.get('/teachers/classes'),
      ]);
      setTeacherData(homeRes.data?.data?.teacher);
      setClasses(classesRes.data?.data?.classes || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Could not load initial data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classId || !formData.subjectId || !formData.description || !formData.dueDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('classId', formData.classId);
      payload.append('subjectId', formData.subjectId);
      payload.append('description', formData.description);
      payload.append('dueDate', formData.dueDate);

      files.forEach((file) => {
        payload.append('attachments', file);
      });

      await api.post('/teachers/homework', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Homework assigned successfully!');

      // Reset form
      setFormData({ classId: '', subjectId: '', description: '', dueDate: '' });
      setFiles([]);
    } catch (error) {
      console.error('Failed to create homework:', error);
      toast.error(error.response?.data?.message || 'Failed to assign homework');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Create Homework
        </h2>
        <p className="text-muted-foreground mt-1">
          Assign homework to your teaching classes.
        </p>
      </div>

      {/* Form Card */}
      <Card className="shadow-sm border-border max-w-2xl">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText size={18} />
            Homework Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Class Select */}
            <div className="space-y-2">
              <Label htmlFor="classId">
                Class <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.classId} onValueChange={(val) => handleChange('classId', val)}>
                <SelectTrigger id="classId">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.classId} value={cls.classId}>
                      {cls.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Select */}
            <div className="space-y-2">
              <Label htmlFor="subjectId">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.subjectId} onValueChange={(val) => handleChange('subjectId', val)}>
                <SelectTrigger id="subjectId">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {teacherData?.subjects?.map((sub) => (
                    <SelectItem key={sub.subjectId} value={sub.subjectId}>
                      {sub.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter homework description and instructions..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="pl-10"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-300 transition-colors bg-muted/30">
                <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files or click to browse
                </p>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto cursor-pointer"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((file, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-background font-semibold"
              >
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning...</>
                ) : (
                  <><CheckCircle2 className="mr-2 h-4 w-4" /> Assign Homework</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateHomework;
