import { useEffect, useState } from 'react';
import api from '../../services/api';
import CreateSchoolDialog from '../../components/superadmin/CreateSchoolDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/admin/schools');
      if (response.data.status === 'success') {
        setSchools(response.data.data.schools);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Manage Schools</h1>
            <p className="text-slate-500 dark:text-slate-400">View and create schools in the system.</p>
        </div>
        <CreateSchoolDialog onSchoolCreated={fetchSchools} />
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Registered Schools</CardTitle>
            <CardDescription>
                List of all schools with generated codes and contact details.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                </div>
            ) : schools.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    No schools found. Create one to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>School Info</TableHead>
                                <TableHead>School Code</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="text-right">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schools.map((school) => (
                                <TableRow key={school._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <Building size={16} />
                                            </div>
                                            <span>{school.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {school.schoolCode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Mail size={12} /> {school.contactInfo?.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone size={12} /> {school.contactInfo?.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={school.contactInfo?.address}>
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <MapPin size={12} />
                                            {school.contactInfo?.address}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-slate-500">
                                        {new Date(school.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageSchools;