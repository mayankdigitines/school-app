import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useSchools = () => {
  const queryClient = useQueryClient();

  const schoolsQuery = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const response = await api.get('/admin/schools');
      // Ensure we return the array directly if possible, or the full structure
      return response.data; 
    },
    staleTime: 5 * 60 * 1000,
  });

  const createSchoolMutation = useMutation({
    mutationFn: async (newSchoolData) => {
      const response = await api.post('/admin/create-school', newSchoolData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });

  return {
    schools: schoolsQuery.data?.data?.schools || [],
    isLoading: schoolsQuery.isLoading,
    isError: schoolsQuery.isError,
    error: schoolsQuery.error,
    createSchool: createSchoolMutation.mutateAsync,
    isCreating: createSchoolMutation.isPending,
  };
};
