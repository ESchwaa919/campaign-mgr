/**
 * Claims Hooks
 *
 * React Query hooks for claim data management (ClaimID Framework).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimService, type ClaimFilters, type CreateClaimDto } from '@/services/claravine/claimService';

/**
 * Fetch all claims with optional filtering
 */
export const useClaims = (filters?: ClaimFilters) => {
  return useQuery({
    queryKey: ['claims', filters],
    queryFn: () => claimService.getClaims(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch single claim by ID
 */
export const useClaim = (id: string | undefined) => {
  return useQuery({
    queryKey: ['claims', id],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return claimService.getClaimById(id);
    },
    enabled: !!id,
  });
};

/**
 * Create new claim
 */
export const useCreateClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClaimDto) => claimService.createClaim(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};

/**
 * Validate claim text
 */
export const useValidateClaim = () => {
  return useMutation({
    mutationFn: ({ claimText, productId }: { claimText: string; productId: string }) =>
      claimService.validateClaim(claimText, productId),
  });
};

/**
 * Upload evidence document
 */
export const useUploadEvidence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, file }: { claimId: string; file: Parameters<typeof claimService.uploadEvidence>[1] }) =>
      claimService.uploadEvidence(claimId, file),
    onSuccess: (_, variables) => {
      // Invalidate the specific claim to refetch with new evidence
      queryClient.invalidateQueries({ queryKey: ['claims', variables.claimId] });
    },
  });
};

/**
 * Get evidence documents for a claim
 */
export const useClaimEvidence = (claimId: string | undefined) => {
  return useQuery({
    queryKey: ['claims', claimId, 'evidence'],
    queryFn: () => {
      if (!claimId) return Promise.resolve([]);
      return claimService.getClaimEvidence(claimId);
    },
    enabled: !!claimId,
  });
};

/**
 * Check claim expiry status
 */
export const useClaimExpiry = (claimId: string | undefined) => {
  return useQuery({
    queryKey: ['claims', claimId, 'expiry'],
    queryFn: () => {
      if (!claimId) return Promise.resolve(null);
      return claimService.checkClaimExpiry(claimId);
    },
    enabled: !!claimId,
  });
};

/**
 * Get claims expiring soon
 * For renewal workflow monitoring
 */
export const useExpiringClaims = (daysThreshold: number = 90) => {
  return useQuery({
    queryKey: ['claims', 'expiring', daysThreshold],
    queryFn: () => claimService.getExpiringClaims(daysThreshold),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Retire claim
 */
export const useRetireClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, reason }: { claimId: string; reason: string }) =>
      claimService.retireClaim(claimId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};
