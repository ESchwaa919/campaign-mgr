import type { EmailTemplate, EmailSend, EmailMetrics, SuppressionEntry } from '@/types';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock email templates
const mockTemplates: EmailTemplate[] = [
  {
    id: 'TMPL-001',
    name: 'HCP Product Launch Announcement',
    subject: 'Introducing {{productName}}: A New Treatment Option',
    preheader: 'Learn about the latest clinical evidence and patient benefits',
    htmlContent: '<html><body><h1>Introducing {{productName}}</h1><p>New treatment option with proven efficacy...</p></body></html>',
    textContent: 'Introducing {{productName}}\\n\\nNew treatment option...',
    status: 'ACTIVE',
    audienceType: 'HCP',
    linkedClaimIds: ['CLM-001', 'CLM-002'],
    thumbnailUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=HCP+Launch',
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-20'),
    createdBy: 'user-001',
  },
  {
    id: 'TMPL-002',
    name: 'Patient Adherence Reminder',
    subject: 'Important: Your {{productName}} Refill Reminder',
    preheader: 'Stay on track with your treatment plan',
    htmlContent: '<html><body><h1>Refill Reminder</h1><p>It\'s time to refill your prescription...</p></body></html>',
    status: 'ACTIVE',
    audienceType: 'PATIENT',
    linkedClaimIds: ['CLM-005'],
    thumbnailUrl: 'https://placehold.co/400x300/10b981/ffffff?text=Patient+Reminder',
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-10-05'),
    createdBy: 'user-002',
  },
  {
    id: 'TMPL-003',
    name: 'Clinical Study Results Update',
    subject: 'New Phase 3 Study Data for {{productName}}',
    preheader: 'See the latest clinical evidence',
    htmlContent: '<html><body><h1>Study Results</h1><p>Recent Phase 3 data demonstrates...</p></body></html>',
    status: 'ACTIVE',
    audienceType: 'HCP',
    linkedClaimIds: ['CLM-003', 'CLM-004'],
    thumbnailUrl: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Clinical+Data',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-02'),
    createdBy: 'user-001',
  },
  {
    id: 'TMPL-004',
    name: 'Webinar Invitation - HCP',
    subject: 'You\'re Invited: Live Expert Panel Discussion',
    preheader: 'Join leading physicians for insights on treatment strategies',
    htmlContent: '<html><body><h1>Webinar Invitation</h1><p>Join us for a live discussion...</p></body></html>',
    status: 'DRAFT',
    audienceType: 'HCP',
    linkedClaimIds: [],
    thumbnailUrl: 'https://placehold.co/400x300/f59e0b/ffffff?text=Webinar+Invite',
    createdAt: new Date('2024-11-03'),
    updatedAt: new Date('2024-11-03'),
    createdBy: 'user-003',
  },
];

// Mock email sends
const mockSends: EmailSend[] = [
  {
    id: 'SEND-001',
    name: 'Q4 Product Launch - Northeast Region',
    templateId: 'TMPL-001',
    campaignId: 'CAMP-001',
    status: 'SENT',
    audienceType: 'HCP',
    segmentId: 'SEG-001',
    estimatedRecipients: 2450,
    actualRecipients: 2447,
    scheduledDate: new Date('2024-10-25T09:00:00'),
    sentDate: new Date('2024-10-25T09:02:15'),
    fromName: 'Medical Affairs Team',
    fromEmail: 'medical.affairs@pharma.com',
    replyToEmail: 'medical.affairs@pharma.com',
    subject: 'Introducing NEXORA: A New Treatment Option',
    createdAt: new Date('2024-10-20'),
    createdBy: 'user-001',
  },
  {
    id: 'SEND-002',
    name: 'Patient Refill Reminders - November',
    templateId: 'TMPL-002',
    campaignId: 'CAMP-005',
    status: 'SENT',
    audienceType: 'PATIENT',
    segmentId: 'SEG-005',
    estimatedRecipients: 8500,
    actualRecipients: 8476,
    scheduledDate: new Date('2024-11-01T10:00:00'),
    sentDate: new Date('2024-11-01T10:01:30'),
    fromName: 'Patient Support Program',
    fromEmail: 'support@patientprogram.com',
    replyToEmail: 'support@patientprogram.com',
    subject: 'Important: Your NEXORA Refill Reminder',
    createdAt: new Date('2024-10-28'),
    createdBy: 'user-002',
  },
  {
    id: 'SEND-003',
    name: 'Clinical Data Update - Q4',
    templateId: 'TMPL-003',
    status: 'SCHEDULED',
    audienceType: 'HCP',
    segmentId: 'SEG-002',
    estimatedRecipients: 1250,
    scheduledDate: new Date('2024-11-10T08:00:00'),
    fromName: 'Clinical Research Team',
    fromEmail: 'clinical@pharma.com',
    subject: 'New Phase 3 Study Data for NEXORA',
    createdAt: new Date('2024-11-04'),
    createdBy: 'user-001',
  },
  {
    id: 'SEND-004',
    name: 'West Coast HCP Engagement',
    templateId: 'TMPL-001',
    status: 'DRAFT',
    audienceType: 'HCP',
    estimatedRecipients: 1800,
    fromName: 'Medical Affairs Team',
    fromEmail: 'medical.affairs@pharma.com',
    subject: 'Introducing NEXORA: A New Treatment Option',
    createdAt: new Date('2024-11-04'),
    createdBy: 'user-003',
  },
];

// Mock email metrics
const mockMetrics: Record<string, EmailMetrics> = {
  'SEND-001': {
    sendId: 'SEND-001',
    sent: 2447,
    delivered: 2398,
    bounced: 49,
    opened: 1534,
    clicked: 612,
    unsubscribed: 8,
    complained: 2,
    deliveryRate: 98.0,
    openRate: 64.0,
    clickRate: 25.5,
    clickToOpenRate: 39.9,
    unsubscribeRate: 0.3,
  },
  'SEND-002': {
    sendId: 'SEND-002',
    sent: 8476,
    delivered: 8301,
    bounced: 175,
    opened: 5988,
    clicked: 2854,
    unsubscribed: 42,
    complained: 7,
    deliveryRate: 97.9,
    openRate: 72.1,
    clickRate: 34.4,
    clickToOpenRate: 47.7,
    unsubscribeRate: 0.5,
  },
};

// Mock suppression list
const mockSuppressionList: SuppressionEntry[] = [
  {
    id: 'SUPP-001',
    email: 'john.doe@example.com',
    reason: 'UNSUBSCRIBE',
    suppressedAt: new Date('2024-10-15T14:30:00'),
    source: 'SEND-001',
  },
  {
    id: 'SUPP-002',
    email: 'jane.smith@example.com',
    reason: 'BOUNCE',
    suppressedAt: new Date('2024-10-20T09:45:00'),
    source: 'SEND-001',
  },
];

/**
 * Email Service
 * Manages email templates, sends, and deliverability
 *
 * TODO: Replace with real Marketing Cloud/Braze API integration
 * - Connect to Marketing Cloud Email Studio API
 * - Implement template management
 * - Add send job management
 * - Integrate deliverability monitoring
 */
export const emailService = {
  /**
   * Get all email templates
   * REQ-185: Email template management
   */
  async getTemplates(filters?: {
    status?: string;
    audienceType?: string;
  }): Promise<EmailTemplate[]> {
    await delay(400);

    let templates = [...mockTemplates];

    if (filters?.status) {
      templates = templates.filter(t => t.status === filters.status);
    }
    if (filters?.audienceType) {
      templates = templates.filter(t => t.audienceType === filters.audienceType);
    }

    // TODO: Replace with Marketing Cloud API call
    return templates;
  },

  /**
   * Get template by ID
   */
  async getTemplateById(templateId: string): Promise<EmailTemplate | null> {
    await delay(300);
    return mockTemplates.find(t => t.id === templateId) || null;
  },

  /**
   * Create new email template
   * REQ-186: Email template creation with claim linking
   */
  async createTemplate(data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    await delay(500);

    const newTemplate: EmailTemplate = {
      ...data,
      id: `TMPL-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Validate linked claims exist and are approved
    // TODO: Create template in Marketing Cloud
    // TODO: Store template metadata in Salesforce

    return newTemplate;
  },

  /**
   * Get all email sends
   * REQ-187: Email send management
   */
  async getSends(filters?: {
    status?: string;
    audienceType?: string;
  }): Promise<EmailSend[]> {
    await delay(400);

    let sends = [...mockSends];

    if (filters?.status) {
      sends = sends.filter(s => s.status === filters.status);
    }
    if (filters?.audienceType) {
      sends = sends.filter(s => s.audienceType === filters.audienceType);
    }

    // TODO: Replace with Marketing Cloud API call
    return sends;
  },

  /**
   * Get send by ID
   */
  async getSendById(sendId: string): Promise<EmailSend | null> {
    await delay(300);
    return mockSends.find(s => s.id === sendId) || null;
  },

  /**
   * Create new email send
   * REQ-188: Email campaign execution
   */
  async createSend(data: Omit<EmailSend, 'id' | 'createdAt'>): Promise<EmailSend> {
    await delay(500);

    const newSend: EmailSend = {
      ...data,
      id: `SEND-${Date.now()}`,
      createdAt: new Date(),
    };

    // TODO: Validate template exists and is active
    // TODO: Validate segment exists
    // TODO: Check consent and suppression list
    // TODO: Create send job in Marketing Cloud

    return newSend;
  },

  /**
   * Get email metrics for a send
   * REQ-189: Email performance tracking
   */
  async getMetrics(sendId: string): Promise<EmailMetrics | null> {
    await delay(400);

    // TODO: Fetch real-time metrics from Marketing Cloud
    // TODO: Calculate derived metrics (rates, etc.)

    return mockMetrics[sendId] || null;
  },

  /**
   * Get suppression list
   * REQ-190: Suppression list management
   */
  async getSuppressionList(filters?: {
    reason?: string;
    search?: string;
  }): Promise<SuppressionEntry[]> {
    await delay(400);

    let list = [...mockSuppressionList];

    if (filters?.reason) {
      list = list.filter(e => e.reason === filters.reason);
    }
    if (filters?.search) {
      list = list.filter(e =>
        e.email.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // TODO: Query suppression list from Marketing Cloud
    // TODO: Include both global and domain-specific suppressions

    return list;
  },

  /**
   * Add email to suppression list
   */
  async addToSuppressionList(email: string, reason: string): Promise<SuppressionEntry> {
    await delay(500);

    const entry: SuppressionEntry = {
      id: `SUPP-${Date.now()}`,
      email,
      reason: reason as any,
      suppressedAt: new Date(),
    };

    // TODO: Add to Marketing Cloud suppression list
    // TODO: Trigger automated suppression across all sends

    return entry;
  },

  /**
   * Schedule email send
   * REQ-191: Email scheduling
   */
  async scheduleSend(sendId: string, scheduledDate: Date): Promise<EmailSend> {
    await delay(500);

    const send = mockSends.find(s => s.id === sendId);
    if (!send) throw new Error('Send not found');

    const updated: EmailSend = {
      ...send,
      status: 'SCHEDULED',
      scheduledDate,
    };

    // TODO: Schedule send job in Marketing Cloud
    // TODO: Validate send time compliance (no weekend sends for HCP, etc.)

    return updated;
  },
};
