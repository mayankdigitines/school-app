import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

const CreateSchoolDialog = ({ onSchoolCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/admin/create-school', formData);
      
      if (response.data.status === 'success') {
        toast.success(`School "${response.data.data.school.name}" created successfully!`);
        toast.info(`Generated School Code: ${response.data.data.school.schoolCode}`);
        
        setOpen(false);
        setFormData({
            name: '', email: '', phone: '', address: '',
            adminName: '', adminEmail: '', adminPassword: ''
        });
        
        if (onSchoolCreated) onSchoolCreated();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
            <Plus size={18} /> Add New School
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New School</DialogTitle>
          <DialogDescription>
            This will create a school entity and a School Admin account. A unique School Code will be generated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          {/* School Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">School Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">School Name</Label>
                    <Input id="name" name="name" required placeholder="e.g. Springfield High" value={formData.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">School Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="info@school.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Contact</Label>
                    <Input id="phone" name="phone" required placeholder="+1 234..." value={formData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required placeholder="123 Street Name, City" value={formData.address} onChange={handleChange} />
                </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4"></div>

          {/* Admin Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Initial Admin Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="adminName">Admin Name</Label>
                    <Input id="adminName" name="adminName" required placeholder="e.g. Principal Skinner" value={formData.adminName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input id="adminEmail" name="adminEmail" type="email" required placeholder="admin@school.com" value={formData.adminEmail} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="adminPassword">Password</Label>
                    <Input id="adminPassword" name="adminPassword" type="password" required placeholder="******" value={formData.adminPassword} onChange={handleChange} />
                </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Create School'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchoolDialog;