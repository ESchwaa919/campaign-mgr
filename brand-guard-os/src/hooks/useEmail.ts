import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailService } from '@/services/salesforce/emailService';
import type { EmailTemplate, EmailSend } from '@/types';

/**
 * Hook to fetch email templates
 */
export const useEmailTemplates = (filters?: {
  status?: string;
  audienceType?: string;
}) => {
  return useQuery({
    queryKey: ['email-templates', filters],
    queryFn: () => emailService.getTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single template
 */
export const useEmailTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ['email-template', templateId],
    queryFn: () => emailService.getTemplateById(templateId),
    enabled: !!templateId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create email template
 */
export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) =>
      emailService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });
};

/**
 * Hook to fetch email sends
 */
export const useEmailSends = (filters?: {
  status?: string;
  audienceType?: string;
}) => {
  return useQuery({
    queryKey: ['email-sends', filters],
    queryFn: () => emailService.getSends(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a single send
 */
export const useEmailSend = (sendId: string) => {
  return useQuery({
    queryKey: ['email-send', sendId],
    queryFn: () => emailService.getSendById(sendId),
    enabled: !!sendId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to create email send
 */
export const useCreateEmailSend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<EmailSend, 'id' | 'createdAt'>) =>
      emailService.createSend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-sends'] });
    },
  });
};

/**
 * Hook to fetch email metrics
 */
export const useEmailMetrics = (sendId: string) => {
  return useQuery({
    queryKey: ['email-metrics', sendId],
    queryFn: () => emailService.getMetrics(sendId),
    enabled: !!sendId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for near real-time
  });
};

/**
 * Hook to fetch suppression list
 */
export const useSuppressionList = (filters?: {
  reason?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['suppression-list', filters],
    queryFn: () => emailService.getSuppressionList(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to schedule email send
 */
export const useScheduleEmailSend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sendId, scheduledDate }: { sendId: string; scheduledDate: Date }) =>
      emailService.scheduleSend(sendId, scheduledDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['email-sends'] });
      queryClient.invalidateQueries({ queryKey: ['email-send', variables.sendId] });
    },
  });
};
