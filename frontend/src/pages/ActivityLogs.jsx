import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ActivityLogs = () => {
    // "Activity Logs: Logs of Teacher Notices, Homeworks etc."
    // Backend API only exposes `getHomeworkActivityLogs`
    // I will list homework logs here.
    
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchLogs();
  }, []);


  console.log(logs);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/admin/homework-logs');
      // Verify response structure
      // controller: res.status(200).json({ status: 'success', results: logs.length, data: { logs } });
      setLogs(response.data?.data?.homeworks || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch activity logs');
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
        <p className="text-muted-foreground">View recent homework activities.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Posted By (Teacher)</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Title/Description</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            {/* <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{new Date(log.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{log.teacher?.name || 'Unknown'}</TableCell>
                    <TableCell>{log.subject?.subName || 'N/A'}</TableCell>
                    <TableCell>
                        <div className="max-w-[200px] truncate" title={log.description}>
                            {log.description}
                        </div>
                    </TableCell>
                     <TableCell>
                        {log.class?.grade} - {log.class?.section}
                    </TableCell>
                    <TableCell>{log.dueDate ? new Date(log.dueDate).toLocaleDateString() : 'No Due Date'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody> */}
         
<TableBody>
  {logs.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
        No activity logs found.
      </TableCell>
    </TableRow>
  ) : (
    logs.map((log) => (
      <TableRow key={log._id}>
        <TableCell>
          {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Unknown'}
        </TableCell>
        <TableCell className="font-medium">
          {log.teacher && log.teacher.name ? log.teacher.name : 'Unknown'}
        </TableCell>
        <TableCell>
          {log.subject && log.subject.name ? log.subject.name : 'N/A'}
        </TableCell>
        <TableCell>
          <div className="max-w-50 truncate" title={log.description || ''}>
            {log.description || 'No Description'}
          </div>
        </TableCell>
        <TableCell>
          {log.class && log.class.grade && log.class.section
            ? `${log.class.grade} - ${log.class.section}`
            : 'N/A'}
        </TableCell>
        <TableCell>
          {log.dueDate ? new Date(log.dueDate).toLocaleDateString() : 'No Due Date'}
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

          </Table>
          
          <div className="p-4 text-xs text-muted-foreground text-center">
             Showing recent homework posts.
          </div>
        </CardContent>
      </Card>
      
      {/* 
         If generic notices logs were available, we would fetch and merge them or show in another tab.
         For now, restricted to available API.
      */}
    </div>
  );
};

export default ActivityLogs;
