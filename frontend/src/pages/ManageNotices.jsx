// import { useState } from 'react';
// import api from '../services/api';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { toast } from 'sonner';

// const ManageNotices = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     audience: 'All'
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post('/admin/broadcast', formData);
//       toast.success('Notice broadcasted successfully');
//       setFormData({ title: '', content: '', audience: 'All' });
//     } catch (error) {
//        console.error(error);
//        toast.error(error.response?.data?.message || 'Failed to send notice');
//     } finally {
//         setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-2xl mx-auto">
//       <div>
//         <h2 className="text-3xl font-bold tracking-tight">Broadcast Notice</h2>
//         <p className="text-muted-foreground">Send announcements to teachers, parents, or everyone.</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Create New Notice</CardTitle>
//           <CardDescription>Fill in the details below to broadcast a message.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input 
//                 id="title" 
//                 placeholder="e.g. School Closed Tomorrow" 
//                 value={formData.title} 
//                 onChange={e => setFormData({...formData, title: e.target.value})} 
//                 required 
//               />
//             </div>
            
//             <div className="space-y-2">
//                 <Label>Audience</Label>
//                 <Select value={formData.audience} onValueChange={val => setFormData({...formData, audience: val})}>
//                     <SelectTrigger>
//                         <SelectValue placeholder="Select Audience" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="All">All (Teachers & Parents)</SelectItem>
//                         <SelectItem value="Teachers">Teachers Only</SelectItem>
//                         <SelectItem value="Parents">Parents Only</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Image (Optional)</Label>
//                <div className="text-sm text-yellow-600 border border-yellow-200 bg-yellow-50 p-2 rounded">
//                   Image upload is currently not supported by the backend broadcast endpoint.
//                </div>
//               {/* <Input type="file" disabled /> */}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="content">Content</Label>
//               <Textarea 
//                 id="content" 
//                 placeholder="Write your message here..." 
//                 className="min-h-[150px]"
//                 value={formData.content} 
//                 onChange={e => setFormData({...formData, content: e.target.value})} 
//                 required 
//               />
//             </div>

//             <Button type="submit" className="w-full" disabled={loading}>
//                 {loading ? 'Sending...' : 'Broadcast Notice'}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ManageNotices;
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
} from "@/components/ui/select"
import { toast } from 'sonner';

const ManageNotices = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'All'
  });
  const [loading, setLoading] = useState(false);

  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  // Fetch notices on mount
  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line
  }, []);

  const fetchNotices = async () => {
    setLoadingNotices(true);
    try {
      const response = await api.get('/admin/notices');
      setNotices(response.data.data?.notices || []);
    } catch (error) {
      toast.error('Failed to fetch notices');
    } finally {
      setLoadingNotices(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/broadcast', formData);
      toast.success('Notice broadcasted successfully');
      setFormData({ title: '', content: '', audience: 'All' });
      fetchNotices(); // Refresh notices list
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Broadcast Notice</h2>
        <p className="text-muted-foreground">Send announcements to teachers, parents, or everyone.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Notice</CardTitle>
          <CardDescription>Fill in the details below to broadcast a message.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. School Closed Tomorrow" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={formData.audience} onValueChange={val => setFormData({...formData, audience: val})}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Audience" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All (Teachers & Parents)</SelectItem>
                        <SelectItem value="Teachers">Teachers Only</SelectItem>
                        <SelectItem value="Parents">Parents Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label>Image (Optional)</Label>
               <div className="text-sm text-yellow-600 border border-yellow-200 bg-yellow-50 p-2 rounded">
                  Image upload is currently not supported by the backend broadcast endpoint.
               </div>
              {/* <Input type="file" disabled /> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                placeholder="Write your message here..." 
                className="min-h-[150px]"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                required 
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Broadcast Notice'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All School Notices</CardTitle>
          <CardDescription>Recent broadcasts and notices posted by your school.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingNotices ? (
            <div className="text-center py-8">Loading...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No notices found.</div>
          ) : (
            <div className="space-y-4">
              {notices.map(notice => (
                <div key={notice._id} className="border-b pb-3 mb-3">
                  <div className="font-semibold">{notice.title}</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {notice.audience} • {new Date(notice.createdAt).toLocaleString()}
                  </div>
                  <div>{notice.content}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageNotices;