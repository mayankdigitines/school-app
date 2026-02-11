import { useState } from 'react';
import { useSchools } from '../../hooks/useSchools';
import CreateSchoolDialog from '../../components/superadmin/CreateSchoolDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

const ManageSchools = () => {
  const { schools, isLoading, isError, error } = useSchools();
  const [currentPage, setCurrentPage] = useState(1);

  if (isError) {
    console.error(error);
    toast.error('Failed to fetch schools');
  }

  // Pagination Logic
  const totalPages = Math.ceil(schools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSchools = schools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Manage Schools</h1>
            <p className="text-slate-500 dark:text-slate-400">View and create schools in the system.</p>
        </div>
        <CreateSchoolDialog />
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Registered Schools</CardTitle>
            <CardDescription>
                List of all schools with generated codes and contact details.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <TableSkeleton columns={5} rows={5} />
            ) : schools.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    No schools found. Create one to get started.
                </div>
            ) : (
                <>
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
                            {paginatedSchools.map((school) => (
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
                {/* Pagination Controls */}
                {schools.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm text-slate-600">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageSchools;