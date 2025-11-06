import type { Event, EventMetrics, EventType, EventChannel } from '@/types';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock events for the last 7 days
const generateMockEvents = (count: number): Event[] => {
  const events: Event[] = [];
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const eventTypes: EventType[] = [
    'EMAIL_OPEN',
    'EMAIL_CLICK',
    'EMAIL_SEND',
    'EMAIL_BOUNCE',
    'WEB_PAGE_VIEW',
    'WEB_FORM_SUBMIT',
    'WEB_DOWNLOAD',
    'PAID_IMPRESSION',
    'PAID_CLICK',
    'PAID_CONVERSION',
    'FIELD_MEETING',
    'FIELD_SAMPLE_DROP',
  ];

  const channels: EventChannel[] = ['EMAIL', 'WEB', 'PAID_MEDIA', 'FIELD_SALES'];
  const deviceTypes: Array<'desktop' | 'mobile' | 'tablet'> = ['desktop', 'mobile', 'tablet'];
  const geographies = ['US-CA', 'US-NY', 'US-TX', 'US-FL', 'US-IL'];

  for (let i = 0; i < count; i++) {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    let channel: EventChannel;

    // Assign channel based on event type
    if (eventType.startsWith('EMAIL_')) {
      channel = 'EMAIL';
    } else if (eventType.startsWith('WEB_')) {
      channel = 'WEB';
    } else if (eventType.startsWith('PAID_')) {
      channel = 'PAID_MEDIA';
    } else {
      channel = 'FIELD_SALES';
    }

    events.push({
      id: `EVT-${Date.now()}-${i}`,
      eventType,
      channel,
      timestamp: new Date(sevenDaysAgo + Math.random() * (now - sevenDaysAgo)),
      contactId: `CONTACT-${Math.floor(Math.random() * 1000)}`,
      accountId: `ACCOUNT-${Math.floor(Math.random() * 100)}`,
      campaignId: `CAMP-${Math.floor(Math.random() * 20)}`,
      properties: {
        source: channel,
        score: Math.random() * 100,
      },
      deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      geography: geographies[Math.floor(Math.random() * geographies.length)],
    });
  }

  // Sort by timestamp descending (most recent first)
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Mock event data
const mockEvents = generateMockEvents(1000);

/**
 * Event Service
 * Integrates with Salesforce Data Cloud for event collection and analytics
 *
 * TODO: Replace with real Salesforce Data Cloud API integration
 * - Connect to Data Cloud Event API
 * - Implement real-time streaming
 * - Add event ingestion endpoints
 * - Implement event schema validation
 */
export const eventService = {
  /**
   * Get events with optional filtering
   * REQ-270: Event Collection & Measurement
   */
  async getEvents(filters?: {
    channel?: EventChannel;
    eventType?: EventType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<Event[]> {
    await delay(400);

    let events = [...mockEvents];

    // Apply filters
    if (filters?.channel) {
      events = events.filter(e => e.channel === filters.channel);
    }
    if (filters?.eventType) {
      events = events.filter(e => e.eventType === filters.eventType);
    }
    if (filters?.startDate) {
      events = events.filter(e => e.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      events = events.filter(e => e.timestamp <= filters.endDate!);
    }
    if (filters?.limit) {
      events = events.slice(0, filters.limit);
    }

    // TODO: Replace with Salesforce Data Cloud query
    return events;
  },

  /**
   * Get event metrics and aggregations
   * REQ-271: Real-time Dashboards
   */
  async getEventMetrics(timeRange?: {
    startDate: Date;
    endDate: Date;
  }): Promise<EventMetrics> {
    await delay(500);

    let events = [...mockEvents];

    // Filter by time range
    if (timeRange) {
      events = events.filter(
        e => e.timestamp >= timeRange.startDate && e.timestamp <= timeRange.endDate
      );
    }

    // Calculate metrics
    const eventsByType: Record<string, number> = {};
    const eventsByChannel: Record<string, number> = {};
    const deviceBreakdown: Record<string, number> = {};
    const geographyBreakdown: Record<string, number> = {};

    events.forEach(event => {
      // By type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;

      // By channel
      eventsByChannel[event.channel] = (eventsByChannel[event.channel] || 0) + 1;

      // By device
      if (event.deviceType) {
        deviceBreakdown[event.deviceType] = (deviceBreakdown[event.deviceType] || 0) + 1;
      }

      // By geography
      if (event.geography) {
        geographyBreakdown[event.geography] = (geographyBreakdown[event.geography] || 0) + 1;
      }
    });

    // Events by day (last 7 days)
    const eventsByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayEvents = events.filter(
        e => e.timestamp >= date && e.timestamp < nextDay
      );

      eventsByDay.push({
        date: date.toISOString().split('T')[0],
        count: dayEvents.length,
      });
    }

    // Events by hour (last 24 hours)
    const eventsByHour = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i, 0, 0, 0);

      const nextHour = new Date(hour);
      nextHour.setHours(nextHour.getHours() + 1);

      const hourEvents = events.filter(
        e => e.timestamp >= hour && e.timestamp < nextHour
      );

      eventsByHour.push({
        hour: hour.toLocaleTimeString('en-US', { hour: '2-digit' }),
        count: hourEvents.length,
      });
    }

    // Top campaigns by event count
    const campaignCounts: Record<string, number> = {};
    events.forEach(event => {
      if (event.campaignId) {
        campaignCounts[event.campaignId] = (campaignCounts[event.campaignId] || 0) + 1;
      }
    });

    const topCampaigns = Object.entries(campaignCounts)
      .map(([campaignId, eventCount]) => ({ campaignId, eventCount }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 5);

    // TODO: Replace with Salesforce Data Cloud aggregation queries
    return {
      totalEvents: events.length,
      eventsByType: eventsByType as Record<EventType, number>,
      eventsByChannel: eventsByChannel as Record<EventChannel, number>,
      eventsByHour,
      eventsByDay,
      topCampaigns,
      deviceBreakdown,
      geographyBreakdown,
    };
  },

  /**
   * Get real-time event stream (simulates WebSocket/streaming)
   * REQ-270: Real-time Event Collection
   */
  async subscribeToEventStream(
    callback: (event: Event) => void,
    filters?: { channel?: EventChannel }
  ): Promise<() => void> {
    await delay(200);

    // Simulate real-time events every 2-5 seconds
    const interval = setInterval(() => {
      const mockEvent = generateMockEvents(1)[0];

      if (!filters?.channel || mockEvent.channel === filters.channel) {
        callback(mockEvent);
      }
    }, 2000 + Math.random() * 3000);

    // TODO: Replace with Salesforce Data Cloud streaming API
    // - Implement WebSocket connection
    // - Handle reconnection logic
    // - Add event batching

    // Return unsubscribe function
    return () => clearInterval(interval);
  },

  /**
   * Get event by ID
   */
  async getEventById(eventId: string): Promise<Event | null> {
    await delay(300);

    const event = mockEvents.find(e => e.id === eventId);

    // TODO: Replace with Salesforce Data Cloud query
    return event || null;
  },

  /**
   * Get events by contact ID
   * REQ-272: Cross-channel Attribution
   */
  async getEventsByContact(contactId: string): Promise<Event[]> {
    await delay(400);

    const events = mockEvents.filter(e => e.contactId === contactId);

    // TODO: Replace with Salesforce Data Cloud query with identity resolution
    return events;
  },

  /**
   * Get events by campaign ID
   * REQ-273: Campaign Performance Analytics
   */
  async getEventsByCampaign(campaignId: string): Promise<Event[]> {
    await delay(400);

    const events = mockEvents.filter(e => e.campaignId === campaignId);

    // TODO: Replace with Salesforce Data Cloud query
    return events;
  },
};
