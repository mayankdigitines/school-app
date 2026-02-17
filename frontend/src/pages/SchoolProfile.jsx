// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';

// const SchoolProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const response = await api.get('/admin/school');
//       const data = response.data.data.school; // Corrected access
//       setProfile(data);
//       setFormData({
//         name: data.name,
//         email: data.contactInfo?.email || '',
//         phone: data.contactInfo?.phone || '',
//         address: data.contactInfo?.address || ''
//       });
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to fetch school profile');
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         // Backend expects nested object?
//         // Let's check route definition again:
//         // router.patch('/school', updateSchoolDetails);
//         // Request Body: { name, contactInfo: { email, phone, address } }
//         // Wait, looking at adminRoutes.js schema doc:
//         // properties: name, contactInfo: { properties: email, phone, address }
        
//         // I should verify how controller handles it.
//         // It's usually safer to replicate the structure if documentation says so.
//         // But let's check keys.
        
//       await api.patch('/admin/school', {
//         name: formData.name,
//         contactInfo: {
//             email: formData.email,
//             phone: formData.phone,
//             address: formData.address
//         }
//       });
      
//       // I'll check adminController.js updateSchoolDetails implementation in a sec to be sure.
//       // But for now assuming flat or logic handles it.
      
//       toast.success('Profile updated successfully');
//       setProfile({ ...profile, ...formData });
//       setIsEditing(false);
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to update profile');
//     }
//   };

//   if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-3xl font-bold tracking-tight">School Profile</h2>
//         <p className="text-muted-foreground">Manage your school's details and settings.</p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>School Information</CardTitle>
//             <CardDescription>Details visible to parents and teachers.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isEditing ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">School Name</Label>
//                   <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address</Label>
//                   <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
//                 </div>
//                 <div className="flex gap-2 justify-end">
//                   <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
//                   <Button type="submit">Save Changes</Button>
//                 </div>
//               </form>
//             ) : (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 gap-1">
//                   <span className="text-sm font-medium text-muted-foreground">School Name</span>
//                   <span className="font-medium">{profile?.name}</span>
//                 </div>
//                 <div className="grid grid-cols-1 gap-1">
//                   <span className="text-sm font-medium text-muted-foreground">School Code</span>
//                   <span className="font-medium font-mono bg-muted p-1 rounded w-fit">{profile?.schoolCode || "N/A"}</span>
//                 </div>
//                 <div className="grid grid-cols-1 gap-1">
//                     <span className="text-sm font-medium text-muted-foreground">Phone</span>
//                     <span>{profile?.contactInfo?.phone}</span>
//                 </div>
//                 <div className="grid grid-cols-1 gap-1">
//                     <span className="text-sm font-medium text-muted-foreground">Email</span>
//                     <span>{profile?.contactInfo?.email}</span>
//                 </div>
//                 <div className="grid grid-cols-1 gap-1">
//                     <span className="text-sm font-medium text-muted-foreground">Address</span>
//                     <span>{profile?.contactInfo?.address}</span>
//                 </div>
//                 <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default SchoolProfile;


import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Building, Mail, Phone, MapPin, Save, X, PenLine } from 'lucide-react';

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
      setProfile({ ...profile, ...formData, contactInfo: { ...formData } }); // Optimistic update
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile', { id: loadingToast });
    }
  };

  if (loading) {
      return (
        <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Card>
                <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">School Profile</h2>
            <p className="text-muted-foreground mt-1">Manage public details and contact information.</p>
        </div>
        {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
                <PenLine size={16} /> Edit Profile
            </Button>
        )}
      </div>

      <div className="grid gap-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Building className="text-primary h-5 w-5" />
                General Information
            </CardTitle>
            <CardDescription>
                These details are displayed on the school's public page and invoices.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <form id="profile-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
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
                        <Label htmlFor="address">Full Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 p-2">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-sm">
                        <Building className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">School Name</p>
                        <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">{profile?.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                             <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">Code: {profile?.schoolCode || "N/A"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                     <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-sm">
                        <Phone className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Contact Number</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{profile?.contactInfo?.phone}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                     <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-sm">
                        <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Email Address</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{profile?.contactInfo?.email}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                     <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-sm">
                        <MapPin className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Physical Address</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed">{profile?.contactInfo?.address}</p>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t flex justify-end gap-3 py-4">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit" form="profile-form">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SchoolProfile;