import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/salesforce/adminService';
import type { SystemUser } from '@/types';

/**
 * Hook to fetch system users
 */
export const useUsers = (filters?: {
  role?: string;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => adminService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single user
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => adminService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<SystemUser, 'id' | 'createdAt'>) =>
      adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook to update user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<SystemUser> }) =>
      adminService.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
  });
};

/**
 * Hook to fetch audit logs
 */
export const useAuditLogs = (filters?: {
  userId?: string;
  entity?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => adminService.getAuditLogs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch system metrics
 */
export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: () => adminService.getSystemMetrics(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

/**
 * Hook to fetch integration statuses
 */
export const useIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => adminService.getIntegrations(),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to test integration
 */
export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (integrationId: string) => adminService.testIntegration(integrationId),
  });
};
