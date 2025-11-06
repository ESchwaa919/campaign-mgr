export type UserRole = 'ADMIN' | 'REVIEWER' | 'MARKETER' | 'STEWARD' | 'ANALYST';

export type CampaignStatus = 'DRAFT' | 'READY' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type ClaimStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RETIRED';
export type MLRStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'REJECTED';
export type SegmentType = 'DEMOGRAPHIC' | 'INSTITUTIONAL' | 'BEHAVIOURAL';
export type AssetType = 'IMAGE' | 'PDF' | 'HTML' | 'VIDEO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  therapeuticArea: string;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  indications: string[];
  markets: string[];
}

export interface Taxonomy {
  id: string;
  name: string;
  key: string;
  description: string;
  isRequired: boolean;
  regexRule?: string;
  allowedValues?: string[];
  createdBy: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  scope: 'CAMPAIGN' | 'CONTENT' | 'UTM';
  ruleType: 'REGEX' | 'ENUM' | 'REQUIRED' | 'UNIQUE';
  config: Record<string, unknown>;
  isActive: boolean;
  createdBy: string;
}

export interface Campaign {
  id: string;
  productId: string;
  name: string;
  objective: string;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date;
  taxonomy: Record<string, string>;
  linkedClaimIds: string[];
  createdBy: string;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  ruleId: string;
}

export interface Claim {
  id: string;
  productId: string;
  claimText: string;
  claimCategory: string;
  version: number;
  status: ClaimStatus;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdBy: string;
  evidenceDocuments: EvidenceDocument[];
}

export interface EvidenceDocument {
  id: string;
  claimId: string;
  title: string;
  sourceType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  checksum: string;
}

export interface MLRCase {
  id: string;
  campaignId: string;
  status: MLRStatus;
  assignedReviewerId?: string;
  submittedAt?: Date;
  decidedAt?: Date;
  notes: string;
  comments: MLRComment[];
}

export interface MLRComment {
  id: string;
  caseId: string;
  authorId: string;
  authorName: string;
  content: string;
  section?: string;
  createdAt: Date;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  query: Record<string, unknown>;
  segmentType: SegmentType;
  estimatedCount: number;
  createdBy: string;
}

export interface Dashboard {
  totalCampaigns: number;
  activeCampaigns: number;
  pendingMLR: number;
  approvedClaims: number;
  recentEvents: number;
}

export type EventType =
  | 'EMAIL_OPEN'
  | 'EMAIL_CLICK'
  | 'EMAIL_SEND'
  | 'EMAIL_BOUNCE'
  | 'WEB_PAGE_VIEW'
  | 'WEB_FORM_SUBMIT'
  | 'WEB_DOWNLOAD'
  | 'PAID_IMPRESSION'
  | 'PAID_CLICK'
  | 'PAID_CONVERSION'
  | 'FIELD_MEETING'
  | 'FIELD_SAMPLE_DROP'
  | 'CONSENT_GRANTED'
  | 'CONSENT_REVOKED';

export type EventChannel = 'EMAIL' | 'WEB' | 'PAID_MEDIA' | 'FIELD_SALES' | 'CONSENT';

export interface Event {
  id: string;
  eventType: EventType;
  channel: EventChannel;
  timestamp: Date;
  contactId?: string;
  accountId?: string;
  campaignId?: string;
  properties: Record<string, unknown>;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  geography?: string;
}

export interface EventMetrics {
  totalEvents: number;
  eventsByType: Record<EventType, number>;
  eventsByChannel: Record<EventChannel, number>;
  eventsByHour: Array<{ hour: string; count: number }>;
  eventsByDay: Array<{ date: string; count: number }>;
  topCampaigns: Array<{ campaignId: string; eventCount: number }>;
  deviceBreakdown: Record<string, number>;
  geographyBreakdown: Record<string, number>;
}

export type EmailTemplateStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type EmailSendStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
export type EmailAudienceType = 'HCP' | 'PATIENT';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  htmlContent: string;
  textContent?: string;
  status: EmailTemplateStatus;
  audienceType: EmailAudienceType;
  linkedClaimIds: string[];
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EmailSend {
  id: string;
  name: string;
  templateId: string;
  campaignId?: string;
  status: EmailSendStatus;
  audienceType: EmailAudienceType;
  segmentId?: string;
  estimatedRecipients: number;
  actualRecipients?: number;
  scheduledDate?: Date;
  sentDate?: Date;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
  subject: string;
  createdAt: Date;
  createdBy: string;
}

export interface EmailMetrics {
  sendId: string;
  sent: number;
  delivered: number;
  bounced: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  complained: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  clickToOpenRate: number;
  unsubscribeRate: number;
}

export interface SuppressionEntry {
  id: string;
  email: string;
  reason: 'UNSUBSCRIBE' | 'BOUNCE' | 'COMPLAINT' | 'MANUAL';
  suppressedAt: Date;
  source?: string;
}

export type UserRole = 'ADMIN' | 'REVIEWER' | 'MARKETER' | 'STEWARD' | 'ANALYST';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
}

export interface SystemMetrics {
  dataQualityScore: number;
  taxonomyCompliance: number;
  mlrCycleTime: number;
  campaignCount: number;
  activeUsers: number;
  eventVolume: number;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  type: 'SALESFORCE' | 'MARKETING_CLOUD' | 'CLARAVINE' | 'DATA_WAREHOUSE' | 'BRAZE';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSync?: Date;
  errorMessage?: string;
}

export type ContentAssetType =
  | 'EMAIL_TEMPLATE'
  | 'EMAIL_HTML'
  | 'WEB_LANDING_PAGE'
  | 'WEB_BANNER'
  | 'WEB_ARTICLE'
  | 'MOBILE_PUSH'
  | 'MOBILE_IN_APP'
  | 'PDF_DOCUMENT'
  | 'VIDEO'
  | 'IMAGE';

export type ContentChannel = 'EMAIL' | 'WEB' | 'MOBILE' | 'PAID_MEDIA' | 'FIELD_SALES';

export interface ContentAsset {
  id: string;
  title: string;
  description: string;
  assetType: ContentAssetType;
  channel: ContentChannel;
  brandId: string;
  linkedClaimIds: string[];
  mlrStatus: MLRStatus;
  mlrCaseId?: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  tags: string[];
  audienceType: EmailAudienceType;
  version: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
