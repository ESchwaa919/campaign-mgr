/**
 * Campaign Hooks
 *
 * React Query hooks for campaign data management.
 * Provides automatic caching, loading states, and error handling.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService, type CampaignFilters, type CreateCampaignDto, type UpdateCampaignDto } from '@/services/salesforce/campaignService';
import type { Campaign } from '@/types';

/**
 * Fetch all campaigns with optional filtering
 */
export const useCampaigns = (filters?: CampaignFilters) => {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => campaignService.getCampaigns(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch single campaign by ID
 */
export const useCampaign = (id: string | undefined) => {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return campaignService.getCampaignById(id);
    },
    enabled: !!id,
  });
};

/**
 * Create new campaign
 */
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignDto) => campaignService.createCampaign(data),
    onSuccess: () => {
      // Invalidate campaigns list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

/**
 * Update existing campaign
 */
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignDto }) =>
      campaignService.updateCampaign(id, data),
    onSuccess: (updatedCampaign) => {
      // Update specific campaign in cache
      queryClient.setQueryData(['campaigns', updatedCampaign.id], updatedCampaign);
      // Invalidate campaigns list
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

/**
 * Delete campaign
 */
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),
    onSuccess: () => {
      // Invalidate campaigns list
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

/**
 * Get campaign performance metrics
 */
export const useCampaignMetrics = (id: string | undefined) => {
  return useQuery({
    queryKey: ['campaigns', id, 'metrics'],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return campaignService.getCampaignMetrics(id);
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes (metrics refresh more frequently)
  });
};
