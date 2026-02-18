import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
  User,
  School,
  Inbox
} from 'lucide-react';

const TeacherRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/teachers/requests');
      setRequests(response.data?.data?.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      if (error.response?.status === 403) {
        toast.error('You are not assigned as a Class Teacher.');
      } else {
        toast.error('Could not load student requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId, status) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      await api.post('/teachers/requests/handle', { requestId, status });
      toast.success(`Request ${status.toLowerCase()} successfully!`);
      // Remove from list with animation
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch (error) {
      console.error('Failed to handle request:', error);
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} request`);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-8 w-8 text-amber-600" />
          Student Requests
        </h2>
        <p className="text-muted-foreground mt-1">
          Review and manage pending student join requests for your class.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {requests.length} {'pending request'}{requests.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Request List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="shadow-sm border-border">
          <CardContent className="py-16 text-center">
            <Inbox size={48} className="mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">No Pending Requests</h3>
            <p className="text-sm text-muted-foreground mt-1">
              All student requests have been handled. Check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const isProcessing = processingIds.has(request.requestId);
            return (
              <Card
                key={request.requestId}
                className="shadow-sm border-border hover:shadow-md transition-shadow overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
                    {/* Student Info */}
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 dark:bg-amber-900/30">
                        <User size={22} className="text-amber-700 dark:text-amber-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-foreground">
                          {request.studentName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <School size={13} />
                            {'Roll #'}{request.rollNumber}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={13} />
                            {request.parent?.name || 'N/A'}
                          </span>
                          {request.parent?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={13} />
                              {request.parent.phone}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {request.requestedClass?.className || 'Unknown Class'}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <Button
                        onClick={() => handleRequest(request.requestId, 'Approved')}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-background font-medium"
                        size="sm"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <><CheckCircle2 size={16} className="mr-1.5" /> Approve</>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleRequest(request.requestId, 'Rejected')}
                        disabled={isProcessing}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        size="sm"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <><XCircle size={16} className="mr-1.5" /> Reject</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherRequests;
