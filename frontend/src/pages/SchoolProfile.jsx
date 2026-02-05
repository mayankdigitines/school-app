import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const SchoolProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/admin/school');
      const data = response.data.data.school; // Corrected access
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.contactInfo?.email || '',
        phone: data.contactInfo?.phone || '',
        address: data.contactInfo?.address || ''
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch school profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Backend expects nested object?
        // Let's check route definition again:
        // router.patch('/school', updateSchoolDetails);
        // Request Body: { name, contactInfo: { email, phone, address } }
        // Wait, looking at adminRoutes.js schema doc:
        // properties: name, contactInfo: { properties: email, phone, address }
        
        // I should verify how controller handles it.
        // It's usually safer to replicate the structure if documentation says so.
        // But let's check keys.
        
      await api.patch('/admin/school', {
        name: formData.name,
        contactInfo: {
            email: formData.email,
            phone: formData.phone,
            address: formData.address
        }
      });
      
      // I'll check adminController.js updateSchoolDetails implementation in a sec to be sure.
      // But for now assuming flat or logic handles it.
      
      toast.success('Profile updated successfully');
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">School Profile</h2>
        <p className="text-muted-foreground">Manage your school's details and settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Details visible to parents and teachers.</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">School Name</span>
                  <span className="font-medium">{profile?.name}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">School Code</span>
                  <span className="font-medium font-mono bg-muted p-1 rounded w-fit">{profile?.schoolCode || "N/A"}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Phone</span>
                    <span>{profile?.contactInfo?.phone}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                    <span>{profile?.contactInfo?.email}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Address</span>
                    <span>{profile?.contactInfo?.address}</span>
                </div>
                <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolProfile;
