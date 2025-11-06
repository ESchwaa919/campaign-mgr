/**
 * Segment Hooks
 *
 * React Query hooks for audience segment management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { segmentService, type SegmentDefinition } from '@/services/salesforce/segmentService';

/**
 * Fetch all saved segments
 */
export const useSegments = () => {
  return useQuery({
    queryKey: ['segments'],
    queryFn: () => segmentService.getSegments(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch single segment by ID
 */
export const useSegment = (id: string | undefined) => {
  return useQuery({
    queryKey: ['segments', id],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return segmentService.getSegmentById(id);
    },
    enabled: !!id,
  });
};

/**
 * Preview segment before saving
 * Returns estimated count without persisting
 */
export const usePreviewSegment = () => {
  return useMutation({
    mutationFn: (definition: SegmentDefinition) =>
      segmentService.previewSegment(definition),
  });
};

/**
 * Create new segment
 */
export const useCreateSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (definition: SegmentDefinition) =>
      segmentService.createSegment(definition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
};

/**
 * Update segment definition
 */
export const useUpdateSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SegmentDefinition> }) =>
      segmentService.updateSegment(id, updates),
    onSuccess: (updatedSegment) => {
      queryClient.setQueryData(['segments', updatedSegment.id], updatedSegment);
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
};

/**
 * Export segment members
 */
export const useExportSegment = () => {
  return useMutation({
    mutationFn: ({ id, format }: { id: string; format?: 'csv' | 'json' }) =>
      segmentService.exportSegment(id, format),
  });
};

/**
 * Refresh segment membership
 */
export const useRefreshSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => segmentService.refreshSegment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['segments', id] });
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
};

/**
 * Delete segment
 */
export const useDeleteSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => segmentService.deleteSegment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
};
