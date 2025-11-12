export type UserRole = 'ADMIN' | 'REVIEWER' | 'MARKETER' | 'STEWARD' | 'ANALYST';

export type CampaignStatus = 'DRAFT' | 'READY' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type ClaimStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RETIRED';
export type MLRStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'REJECTED';
export type SegmentType = 'DEMOGRAPHIC' | 'INSTITUTIONAL' | 'BEHAVIOURAL';
export type AssetType = 'IMAGE' | 'PDF' | 'HTML' | 'VIDEO';

// Journey Node Configuration Types
export interface WaitConfig {
  type: 'time' | 'event' | 'time_or_event';
  duration?: number;
  durationUnit?: 'hours' | 'days' | 'weeks';
  event?: string;
  maxWaitDuration?: number;
  maxWaitUnit?: 'hours' | 'days' | 'weeks';
}

export interface DecisionConfig {
  type: 'engagement' | 'demographic' | 'behavioral' | 'segment' | 'custom';
  criterion?: string;
  paths: {
    label: string;
    condition: string;
  }[];
}

export interface SuppressionConfig {
  lists: string[];
  logic: 'AND' | 'OR';
  action: 'remove_from_journey' | 'skip_sequence';
  allowOverride: boolean;
  auditLog: boolean;
}

export interface ABTestConfig {
  testName: string;
  hypothesis: string;
  variants: {
    name: string;
    allocation: number;
    contentId?: string;
  }[];
  randomization: 'random' | 'stable_hash' | 'stratified';
  successMetric: string;
  duration: number;
  durationUnit: 'days' | 'weeks';
  autoPromote: boolean;
  significanceThreshold: number;
}

export interface AttributionConfig {
  eventType: string;
  eventName: string;
  conversionValue: number;
  attributionWeight: number;
  lookbackWindow: number;
  lookbackUnit: 'days' | 'weeks';
  crossCampaignAttribution: boolean;
  deduplication: 'allow_multiple' | 'first_only' | 'most_recent';
  notifyOnConversion: boolean;
  updateCRM: boolean;
}

export interface ScoreConfig {
  scoreType: string;
  updateLogic: 'add' | 'subtract' | 'set' | 'multiply';
  pointValue: number;
  minBound: number;
  maxBound: number;
  triggerCondition: 'immediate' | 'end_of_sequence' | 'on_event';
  reevaluateSegment: boolean;
  alertOnThreshold: boolean;
  thresholdValue?: number;
}

export type NodeConfig = WaitConfig | DecisionConfig | SuppressionConfig | ABTestConfig | AttributionConfig | ScoreConfig;

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
  | 'SOCIAL_POST'
  | 'SOCIAL_AD'
  | 'SOCIAL_VIDEO'
  | 'PAID_SOCIAL_AD'
  | 'PAID_SEARCH_AD'
  | 'PAID_DISPLAY_AD'
  | 'PRINT_AD'
  | 'PRINT_JOURNAL_AD'
  | 'TV_SPOT'
  | 'RADIO_SPOT'
  | 'OOH_CREATIVE'
  | 'PDF_DOCUMENT'
  | 'VIDEO'
  | 'IMAGE';

export type ContentChannel = 'EMAIL' | 'WEB' | 'MOBILE' | 'SOCIAL' | 'PAID_MEDIA' | 'FIELD_SALES';

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

export type JourneyStatus = 'DESIGN' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'COMPLETE' | 'PAUSED';

export interface JourneyNodeMetrics {
  nodeId: string;
  entered: number;
  completed: number;
  inProgress: number;
  dropped: number;
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  converted?: number;
  averageTimeSpent?: number; // in seconds
}

export interface JourneyEdgeMetrics {
  sourceNodeId: string;
  targetNodeId: string;
  transitioned: number;
  transitionRate: number; // percentage
}

// Microsegment Types
export interface MicrosegmentCriteria {
  demographics?: {
    ageRange?: { min: number; max: number };
    gender?: 'M' | 'F' | 'ALL';
    region?: string[];
    income?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  };
  behavioral?: {
    engagementScore?: { min: number; max: number };
    previousCampaignResponse?: 'HIGH' | 'MEDIUM' | 'LOW';
    channelPreference?: ContentChannel[];
    lastInteractionDays?: number;
  };
  institutional?: {
    practiceSetting?: string[];
    volumeCategory?: 'HIGH' | 'MEDIUM' | 'LOW';
    tier?: number;
  };
}

export interface Microsegment {
  id: string;
  parentSegmentId: string;
  name: string;
  description: string;
  criteria: MicrosegmentCriteria;
  estimatedCount: number;
  autoGenerated: boolean;
  isActive: boolean;
  createdAt: Date;
}

// Content Resonance Prediction
export interface ContentResonancePrediction {
  contentId: string;
  microsegmentId: string;
  resonanceScore: number; // 0-100
  historicalData: {
    campaignId: string;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    sampleSize: number;
  }[];
  predictedMetrics: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
    confidence: number;
  };
  recommendations: string[];
}

// ID Registry and Tracking
export interface UTMParameters {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
}

export interface CMParameters {
  cm_journey_id: string;
  cm_node_seq: string;
  cm_microsegment_id?: string;
  cm_variant?: string;
  cm_brand: string;
  cm_audience: string;
  cm_segment: string;
  cm_therapeutic_area: string;
  cm_indication?: string;
}

export interface IDRegistryEntry {
  id: string;
  type: 'CAMPAIGN' | 'SEQUENCE' | 'CONTENT' | 'VARIANT';
  compositeKey: string; // {CampaignName}/SEQ-{Sequence}/{ContentID}/{Variant}
  campaignId: string;
  sequenceNumber?: number;
  contentId?: string;
  variantName?: string;
  microsegmentId?: string;
  utmParameters: UTMParameters;
  cmParameters: CMParameters;
  mintedAt: Date;
  mintedBy: string;
  status: 'MINTED' | 'ACTIVE' | 'RETIRED';
}

// Journey Activation Result
export interface JourneyActivationResult {
  campaignId: string;
  activatedAt: Date;
  idRegistryEntries: IDRegistryEntry[];
  claravineValidated: boolean;
  s3ExportPath?: string;
  sequenceCount: number;
  microsegmentCount: number;
  trackingURLs: Record<string, string>; // nodeId -> tracking URL
}

// Campaign Detail View Data
export interface CampaignDetailView {
  campaign: Campaign;
  journeyVisualization: {
    nodes: any[]; // React Flow nodes
    edges: any[]; // React Flow edges
  };
  audienceHierarchy: {
    brand: Brand;
    audienceType: 'HCP' | 'PATIENT';
    segment: Segment;
    microsegments: Microsegment[];
  };
  contentMappings: {
    microsegmentId: string;
    microsegmentName: string;
    sequences: {
      sequenceNumber: number;
      nodeId: string;
      nodeType: string;
      contentAsset?: ContentAsset;
      resonanceScore: number;
    }[];
  }[];
  idRegistry: IDRegistryEntry[];
  utmStructure: {
    sequenceNumber: number;
    compositeKey: string;
    utmParameters: UTMParameters;
    cmParameters: CMParameters;
  }[];
  performanceData?: {
    sequenceNumber: number;
    microsegmentId: string;
    impressions: number;
    clicks: number;
    conversions: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  }[];
}
