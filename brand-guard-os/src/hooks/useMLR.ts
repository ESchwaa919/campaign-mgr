/**
 * MLR (Medical Legal Review) Hooks
 *
 * React Query hooks for MLR workflow management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mlrService,
  type CreateMLRCaseDto,
  type AddCommentDto,
  type AssignReviewerDto,
} from '@/services/salesforce/mlrService';
import type { MLRCase } from '@/types';

/**
 * Fetch all MLR cases with filtering
 */
export const useMLRCases = (filters?: { status?: MLRCase['status']; assignedTo?: string }) => {
  return useQuery({
    queryKey: ['mlr-cases', filters],
    queryFn: () => mlrService.getMLRCases(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (MLR cases update frequently)
  });
};

/**
 * Fetch single MLR case by ID
 */
export const useMLRCase = (id: string | undefined) => {
  return useQuery({
    queryKey: ['mlr-cases', id],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return mlrService.getMLRCaseById(id);
    },
    enabled: !!id,
  });
};

/**
 * Create new MLR case
 */
export const useCreateMLRCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMLRCaseDto) => mlrService.createMLRCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mlr-cases'] });
    },
  });
};

/**
 * Submit case for review
 */
export const useSubmitForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (caseId: string) => mlrService.submitForReview(caseId),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['mlr-cases', updatedCase.id], updatedCase);
      queryClient.invalidateQueries({ queryKey: ['mlr-cases'] });
    },
  });
};

/**
 * Assign reviewer to case
 */
export const useAssignReviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, reviewer }: { caseId: string; reviewer: AssignReviewerDto }) =>
      mlrService.assignReviewer(caseId, reviewer),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['mlr-cases', updatedCase.id], updatedCase);
      queryClient.invalidateQueries({ queryKey: ['mlr-cases'] });
    },
  });
};

/**
 * Add comment to case
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, comment }: { caseId: string; comment: AddCommentDto }) =>
      mlrService.addComment(caseId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mlr-cases', variables.caseId] });
    },
  });
};

/**
 * Approve case
 */
export const useApproveCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, notes }: { caseId: string; notes?: string }) =>
      mlrService.approveCase(caseId, notes),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['mlr-cases', updatedCase.id], updatedCase);
      queryClient.invalidateQueries({ queryKey: ['mlr-cases'] });
      queryClient.invalidateQueries({ queryKey: ['mlr-metrics'] });
    },
  });
};

/**
 * Reject case
 */
export const useRejectCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, reason }: { caseId: string; reason: string }) =>
      mlrService.rejectCase(caseId, reason),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['mlr-cases', updatedCase.id], updatedCase);
      queryClient.invalidateQueries({ queryKey: ['mlr-cases'] });
      queryClient.invalidateQueries({ queryKey: ['mlr-metrics'] });
    },
  });
};

/**
 * Request changes
 */
export const useRequestChanges = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, changeRequest }: { caseId: string; changeRequest: string }) =>
      mlrService.requestChanges(caseId, changeRequest),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['mlr-cases', updatedCase.id], updatedCase);
      queryClient.invalidateQueries({ queryKey: ['mlr-cases'] });
    },
  });
};

/**
 * Get MLR workflow metrics
 */
export const useMLRMetrics = () => {
  return useQuery({
    queryKey: ['mlr-metrics'],
    queryFn: () => mlrService.getMLRMetrics(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get overdue MLR cases
 */
export const useOverdueCases = () => {
  return useQuery({
    queryKey: ['mlr-cases', 'overdue'],
    queryFn: () => mlrService.getOverdueCases(),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Get reviewer workload
 */
export const useReviewerWorkload = (reviewerId: string | undefined) => {
  return useQuery({
    queryKey: ['mlr-reviewer-workload', reviewerId],
    queryFn: () => {
      if (!reviewerId) return Promise.resolve(null);
      return mlrService.getReviewerWorkload(reviewerId);
    },
    enabled: !!reviewerId,
    staleTime: 2 * 60 * 1000,
  });
};
