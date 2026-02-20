import { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Building, Mail, Phone, MapPin, PenLine, Save, X } from 'lucide-react';

// 1. Reusable InfoCard Component for a clean, consistent data display
const InfoCard = ({ icon: Icon, label, value, badge }) => (
  <div className="flex items-start gap-3">
    {/* Subtle icon styling without heavy background blocks */}
    <div className="mt-0.5 text-slate-400">
      <Icon className="w-5 h-5" strokeWidth={1.75} />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-base text-slate-900 dark:text-slate-100 font-medium leading-snug">
          {value || '—'}
        </span>
        {badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
    </div>
  </div>
);

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
      const data = response.data.data.school; 
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
    const loadingToast = toast.loading('Updating profile...');
    try {
      await api.patch('/admin/school', {
        name: formData.name,
        contactInfo: {
            email: formData.email,
            phone: formData.phone,
            address: formData.address
        }
      });
      
      toast.success('Profile updated successfully', { id: loadingToast });
      setProfile({ ...profile, ...formData, contactInfo: { ...formData } }); 
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile', { id: loadingToast });
    }
  };

  // 2. Refined, minimal loading skeleton matching the new layout
  if (loading) {
      return (
        <div className="max-w-4xl mx-auto w-full space-y-8 animate-pulse p-4 md:p-6">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="h-4 w-72 bg-slate-100 dark:bg-slate-900 rounded-md"></div>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <div className="h-6 w-40 bg-slate-100 dark:bg-slate-900 rounded-md mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-12 w-full bg-slate-50 dark:bg-slate-900 rounded-md"></div>
                    <div className="h-12 w-full bg-slate-50 dark:bg-slate-900 rounded-md"></div>
                </div>
            </div>
        </div>
      )
  }

  return (
    // 3. Constrained width for optimal reading and SaaS feel
    <div className="max-w-4xl mx-auto w-full p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* 4. Header Section: Title and Action button on the same horizontal plane */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                School Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
                Manage your school's public details and primary contact information.
            </p>
        </div>
        {!isEditing && (
            <Button 
                onClick={() => setIsEditing(true)} 
                size="sm" 
                className="rounded-lg shadow-sm h-9 px-4 transition-all"
            >
                <PenLine className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
        )}
      </div>

      {/* 5. Main Card Container: Pure white, subtle border, no inner background blocks */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {isEditing ? (
          /* Form View */
          <form id="profile-form" onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-6">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
                    <Building className="w-5 h-5 text-slate-400" />
                    General Information
                </h2>
                
                {/* 2-Column Grid for inputs with tight labels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-slate-600 dark:text-slate-400">School Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="h-9 rounded-lg border-slate-200 shadow-none" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-slate-600 dark:text-slate-400">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="h-9 rounded-lg border-slate-200 shadow-none" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-slate-600 dark:text-slate-400">Email Address</Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleChange} className="h-9 rounded-lg border-slate-200 shadow-none" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-slate-600 dark:text-slate-400">Full Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} className="h-9 rounded-lg border-slate-200 shadow-none" required />
                    </div>
                </div>
            </div>
            
            {/* Subtle divider instead of boxed footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)} className="rounded-lg h-9">
                    <X className="w-4 h-4 mr-1.5" /> Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-lg h-9 shadow-sm">
                    <Save className="w-4 h-4 mr-1.5" /> Save Changes
                </Button>
            </div>
          </form>
        ) : (
          /* Read-Only View */
          <div className="p-6 md:p-8">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-slate-400" />
                General Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <InfoCard 
                  icon={Building} 
                  label="School Name" 
                  value={profile?.name} 
                  badge={profile?.schoolCode ? `Code: ${profile.schoolCode}` : null} 
              />
              <InfoCard 
                  icon={Phone} 
                  label="Contact Number" 
                  value={profile?.contactInfo?.phone} 
              />
              <InfoCard 
                  icon={Mail} 
                  label="Email Address" 
                  value={profile?.contactInfo?.email} 
              />
              <InfoCard 
                  icon={MapPin} 
                  label="Physical Address" 
                  value={profile?.contactInfo?.address} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolProfile;