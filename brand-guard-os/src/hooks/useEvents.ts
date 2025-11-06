import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/salesforce/eventService';
import type { EventChannel, EventType } from '@/types';

/**
 * Hook to fetch events with optional filtering
 */
export const useEvents = (filters?: {
  channel?: EventChannel;
  eventType?: EventType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getEvents(filters),
    staleTime: 1 * 60 * 1000, // 1 minute (events are real-time)
  });
};

/**
 * Hook to fetch event metrics and aggregations
 */
export const useEventMetrics = (timeRange?: {
  startDate: Date;
  endDate: Date;
}) => {
  return useQuery({
    queryKey: ['event-metrics', timeRange],
    queryFn: () => eventService.getEventMetrics(timeRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  });
};

/**
 * Hook to fetch a single event by ID
 */
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEventById(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch events by contact ID
 */
export const useEventsByContact = (contactId: string) => {
  return useQuery({
    queryKey: ['events', 'contact', contactId],
    queryFn: () => eventService.getEventsByContact(contactId),
    enabled: !!contactId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch events by campaign ID
 */
export const useEventsByCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: ['events', 'campaign', campaignId],
    queryFn: () => eventService.getEventsByCampaign(campaignId),
    enabled: !!campaignId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
