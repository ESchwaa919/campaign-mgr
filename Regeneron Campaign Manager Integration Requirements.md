# Regeneron Integration Requirements
## Campaign Manager, Journey Canvas, Salesforce, Claravine & Snowflake

---

## DOCUMENT OVERVIEW

This document defines the comprehensive integration requirements for the Regeneron Campaign Manager across five critical systems:

1. **Campaign Manager** - Campaign orchestration and governance
2. **Journey Canvas** - Visual journey design and sequence management
3. **Salesforce** - Customer data and segment management
4. **Claravine** - Taxonomy validation and UTM generation
5. **Snowflake** - Data warehouse and analytics

These requirements build upon Phase 1 Foundation and implement the complete Claravine Integration Architecture as defined in the Regeneron reference architecture.

---

## ARCHITECTURE OVERVIEW

### System Integration Flow

```
Journey Canvas → ID Registry → Claravine → [Vendors + Snowflake]
     ↓                ↓            ↓              ↓
  Sequences      Mint IDs    Validate UTMs   Execute & Track
     ↓                ↓            ↓              ↓
Salesforce ←─────────┴────────────┴──────────────┘
  Segments                                   Analytics
```

### Data Flow Summary

1. **Journey Canvas** generates campaign with sequences and variants
2. **ID Registry** mints unique identifiers (Campaign ID, Content IDs, Sequence IDs)
3. **Salesforce** provides segment definitions and customer data
4. **Claravine** validates taxonomy and generates UTM + cm_* tracking parameters
5. **Vendors** (CMI, DSP, Google, SFMC, Veeva) execute campaigns with tracking
6. **Snowflake** ingests events and provides analytics

---

## REQUIREMENTS: CAMPAIGN MANAGER

### CM-001: Campaign Creation and Orchestration
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** None

Campaign Manager provides centralized campaign planning, coordination, and governance across all marketing channels.

**Acceptance Criteria:**
- Campaign creation wizard with taxonomy-driven fields
- Brand, audience type, and segment selection from Salesforce
- Campaign label generation following Claravine naming conventions
- Multi-channel campaign support (Email, Paid Media, Web, Mobile, Field Sales)
- Campaign status lifecycle (Draft → Ready → Active → Paused → Archived)
- 100% of campaigns linked to approved ClaimIDs

**Implementation Notes:**
- Campaign metadata stored in Salesforce Campaign object
- Integration with Claravine for taxonomy validation
- Real-time validation preventing non-compliant campaign creation

---

### CM-002: ClaimID Registry Integration
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** CM-001

All campaigns must link to approved ClaimIDs with substantiation evidence, preventing off-label promotion.

**Acceptance Criteria:**
- ClaimID search and selection from approved registry
- Display of claim text, indication, and approval status
- Evidence document access (clinical studies, regulatory approvals)
- Block campaign activation if claims are expired or unapproved
- Audit trail of all claim-to-campaign linkages

**Data Model:**
```typescript
interface ClaimAssignment {
  campaignId: string;
  claimId: string;
  assignedAt: string;
  assignedBy: string;
  evidence: EvidenceDocument[];
  indication: string;
  therapeuticArea: string;
}
```

---

### CM-003: MLR Workflow Orchestration
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** CM-001, CM-002

Medical Legal Review (MLR) workflow must approve all campaigns before execution.

**Acceptance Criteria:**
- MLR case creation linked to campaign
- Multi-stage review (Medical → Legal → Regulatory)
- Reviewer assignment and notification
- Version control for campaign changes requiring re-review
- Approval/rejection with comments and requested changes
- Block campaign activation until MLR approval obtained

**MLR States:**
- DRAFT - Not yet submitted
- SUBMITTED - Awaiting assignment
- IN_REVIEW - Active review in progress
- CHANGES_REQUESTED - Returned to submitter
- APPROVED - Ready for execution
- REJECTED - Cannot proceed

---

### CM-004: Campaign Performance Dashboard
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** CM-001, Snowflake integration

Real-time dashboard displaying campaign performance metrics aggregated from Snowflake.

**Acceptance Criteria:**
- Key metrics: Impressions, Clicks, Conversions, CTR, Conversion Rate, ROI
- Channel breakdown (Email, Paid Social, Paid Search, Display, Print, Field Sales)
- Sequence-level performance tracking
- Segment/microsegment performance comparison
- Date range filtering and trend analysis
- Export to CSV/Excel for reporting

**Metrics Calculation:**
```sql
-- Campaign Summary Metrics
SELECT
  campaign_id,
  SUM(impressions) as total_impressions,
  SUM(clicks) as total_clicks,
  SUM(conversions) as total_conversions,
  ROUND(SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0) * 100, 2) as ctr,
  ROUND(SUM(conversions)::NUMERIC / NULLIF(SUM(clicks), 0) * 100, 2) as conversion_rate
FROM journey_sequence_performance
WHERE campaign_id = :campaignId
GROUP BY campaign_id;
```

---

### CM-005: Multi-Brand Portfolio Management
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** CM-001

Support for managing multiple pharmaceutical brands with brand-specific configurations.

**Acceptance Criteria:**
- Brand catalog with therapeutic area and indication mappings
- Brand-specific claim registries
- Brand-specific taxonomy rules
- Cross-brand reporting and comparison
- Brand permissions and access controls

**Brand Structure:**
```typescript
interface Brand {
  id: string;
  name: string;
  therapeuticArea: string[];
  approvedIndications: string[];
  claimRegistry: ClaimID[];
  taxonomyRules: TaxonomyRule[];
  activeStatus: boolean;
}
```

---

## REQUIREMENTS: JOURNEY CANVAS

### JC-001: Visual Journey Design
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** None

Visual drag-and-drop interface for designing multi-channel customer journeys with node-based flow.

**Acceptance Criteria:**
- React Flow canvas with zoom, pan, and fit-to-screen controls
- Node palette with 15+ node types (Email, Paid Media, Web, Mobile, Field Sales, Wait, Decision, A/B Test, Suppression, Attribution, etc.)
- Drag-and-drop node placement
- Edge connections with arrow visualization
- Node configuration dialogs for each node type
- Real-time validation of journey logic (no orphaned nodes, valid connections)
- Canvas save/load with localStorage persistence

**Node Types:**
- **Entry**: Journey starting point
- **Email**: Email send
- **Paid Social**: Facebook, LinkedIn, Twitter ads
- **Paid Search**: Google Ads, Bing Ads
- **Paid Display**: Programmatic display advertising
- **Print**: Journal ads, direct mail
- **Web**: Landing pages, microsites
- **Mobile**: SMS, push notifications
- **Field Sales**: Rep visits, speaker programs
- **Wait**: Time-based or event-based delay
- **Decision**: Branching logic based on behavior
- **A/B Test**: Content variant testing
- **Suppression**: Exclude segments (consent, frequency capping)
- **Attribution**: Conversion tracking endpoint
- **Score**: Lead scoring update

---

### JC-002: Microsegment Integration
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** JC-001, Salesforce segment integration

Journey Canvas must support microsegment targeting with behavioral, demographic, and institutional criteria.

**Acceptance Criteria:**
- Microsegment generator with AI-powered suggestions
- Manual microsegment creation with criteria builder
- Microsegment nodes positioned in left-to-right reading order
- Vertical stacking with 180px spacing to prevent overlap
- Connections from Entry (right handle) → Microsegments (left handle)
- Microsegment convergence into unified journey path
- Display microsegment estimated HCP counts
- Show microsegment criteria (engagement score, region, practice setting, specialty)

**Microsegment Criteria:**
```typescript
interface MicrosegmentCriteria {
  demographics?: {
    specialty?: string[];
    region?: string[];
    yearsInPractice?: { min: number; max: number };
    patientVolume?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  institutional?: {
    practiceSetting?: ('ACADEMIC' | 'PRIVATE' | 'COMMUNITY')[];
    facilitySize?: { min: number; max: number };
    teachingHospital?: boolean;
  };
  behavioral?: {
    engagementScore?: { min: number; max: number };
    previousCampaignResponse?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    contentPreference?: ('EMAIL' | 'WEB' | 'PRINT' | 'EVENTS')[];
    lastEngagement?: { withinDays: number };
  };
}
```

---

### JC-003: Content Assignment with Resonance Scoring
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** JC-001, JC-002

Content assignment to journey nodes with AI-powered resonance scoring predicting performance by microsegment.

**Acceptance Criteria:**
- Content library panel with search and filtering
- Content preview with thumbnail and description
- Resonance score display (0-100) for each microsegment
- Historical campaign data showing past performance
- Predicted metrics (open rate, click rate, conversion rate)
- AI recommendations for optimal content-segment matching
- Content drag-and-drop onto journey nodes

**Resonance Score Calculation:**
```typescript
interface ContentResonancePrediction {
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
```

---

### JC-004: Sequence-Level Tracking
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** JC-001

Every node in journey generates unique sequence number for granular tracking and attribution.

**Acceptance Criteria:**
- Auto-generated sequence numbers (SEQ-1, SEQ-2, SEQ-3...)
- Sequence numbers assigned in flow order
- Composite key generation: `{CampaignID}/SEQ-{Sequence}/{ContentID}`
- Variant tracking for A/B tests: `{CampaignID}/SEQ-{Sequence}/{ContentID}/{Variant}`
- Sequence display in Campaign Detail View
- Sequence-level performance metrics in Analytics mode

**Composite Key Format:**
```
Standard:  CMP-2024-001/SEQ-7/CNT-2024-0030
A/B Test:  CMP-2024-001/SEQ-7/CNT-2024-0030/VariantA
           CMP-2024-001/SEQ-7/CNT-2024-0031/VariantB
```

---

### JC-005: Journey Templates
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** JC-001, JC-002, JC-003

Pre-built journey templates for common pharmaceutical marketing scenarios.

**Acceptance Criteria:**
- Template library with 5+ pre-built journeys
- Templates include microsegments with proper layout
- Content pre-assigned with resonance scores
- Template descriptions and use case documentation
- One-click template loading
- Template customization after load

**Template Examples:**
1. **Wet AMD New Product Launch** - Multi-channel launch with HAWK study data
2. **Patient Treatment Adherence** - Injection appointment reminders for DME patients
3. **HCP Education Series** - Multi-touch educational content sequence
4. **Dry Eye Awareness Campaign** - Paid media + email for new indication
5. **Conference Amplification** - Before/during/after event engagement

---

### JC-006: Journey Activation & Export
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** JC-001, JC-004, ID Registry, Claravine integration

Journey activation generates IDs, validates taxonomy, and exports to execution platforms.

**Acceptance Criteria:**
- Pre-activation validation (all nodes configured, no orphans, MLR approved)
- ID minting via ID Registry service
- Claravine validation and UTM generation
- S3 file drop with manifest.json and tracking_parameters.json
- Activation confirmation with generated IDs
- Journey lock after activation (no edits without deactivation)

**Activation Flow:**
1. User clicks "Activate Journey"
2. System validates journey completeness
3. ID Registry mints Campaign ID, Content IDs, Sequence IDs
4. Claravine validates taxonomy and generates UTMs + cm_* parameters
5. Manifest exported to S3 for CMI Media ingestion
6. Campaign activated in Salesforce
7. Confirmation dialog shows activation summary

---

### JC-007: Analytics Mode with Performance Visualization
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** JC-001, JC-004, Snowflake integration

Analytics view mode displays real-time performance metrics on journey canvas nodes.

**Acceptance Criteria:**
- Toggle between Design mode and Analytics mode
- Node overlays showing metrics (entered, converted, conversion rate)
- Microsegment nodes show segment-level performance
- Color-coded performance indicators (green = high, amber = medium, red = low)
- Edge thickness based on volume flowing through path
- Sequence Performance Dashboard with detailed metrics
- Date range filtering for time-based analysis

**Node Metrics Display:**
```typescript
interface NodeAnalytics {
  nodeId: string;
  sequenceNumber: number;
  metrics: {
    entered: number;
    converted: number;
    conversionRate: number;
    avgTimeInNode: number; // seconds
    dropoffRate: number;
  };
}
```

---

## REQUIREMENTS: SALESFORCE INTEGRATION

### SF-001: Customer Master Data Management
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** Salesforce Sales Cloud, Salesforce Data Cloud

Salesforce serves as single source of truth for customer data (HCPs, patients, accounts).

**Acceptance Criteria:**
- Account object stores healthcare facilities and institutions
- Contact object stores HCPs with NPI, specialty, credentials
- Person Account object stores patients (for DTC campaigns)
- Lead object captures prospects and unidentified visitors
- Data Cloud identity resolution across channels
- Golden record creation with deduplication
- Data quality scores (completeness, accuracy, freshness)

**HCP Data Model:**
```typescript
interface HCP {
  id: string; // Salesforce Contact ID
  npi: string; // National Provider Identifier
  firstName: string;
  lastName: string;
  credentials: string; // MD, OD, etc.
  specialty: string; // Retina Specialist, Ophthalmologist, etc.
  practiceType: 'ACADEMIC' | 'PRIVATE' | 'COMMUNITY';
  facilityName: string;
  address: Address;
  patientVolume: 'LOW' | 'MEDIUM' | 'HIGH';
  prescriptionVolume: number;
  yearsInPractice: number;
  teachingAffiliate: boolean;
}
```

---

### SF-002: Segment Definition and Management
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** SF-001

Segment builder for defining target audiences with demographic, institutional, and behavioral criteria.

**Acceptance Criteria:**
- Visual segment builder with drag-and-drop criteria
- Three segmentation types: Demographic, Institutional, Behavioral
- Real-time segment count estimation
- Segment save and reuse across campaigns
- Integration with Salesforce Audience Studio / Data Cloud
- Segment export to BrandGuard OS for journey targeting

**Segmentation Types:**

**Demographic:**
- Specialty (Retina Specialist, Cornea Specialist, Glaucoma Specialist, General Ophthalmologist)
- Region (Northeast, Southeast, Midwest, Southwest, West)
- Years in Practice
- Patient Volume

**Institutional:**
- Practice Setting (Academic Medical Center, Private Practice, Community Hospital)
- Facility Size
- Teaching Hospital Affiliation
- Health System Membership

**Behavioral:**
- Engagement Score (0-100)
- Previous Campaign Response (HIGH, MEDIUM, LOW, NONE)
- Content Preference (EMAIL, WEB, PRINT, EVENTS)
- Last Engagement Date
- Prescription History
- CME/Event Attendance

---

### SF-003: Campaign Object Integration
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** SF-001, SF-002

Salesforce Campaign object stores all campaign metadata, linked segments, and performance metrics.

**Acceptance Criteria:**
- Campaign creation synchronized from BrandGuard OS
- Campaign Members (HCPs, Patients) linked to segments
- Campaign hierarchy (parent campaigns, child campaigns for multi-touch)
- Campaign influence tracking for attribution
- Custom fields: Brand, Therapeutic Area, Indication, ClaimIDs, MLR Case ID, Journey ID
- Campaign status sync (Draft, Active, Paused, Completed)

**Campaign Custom Fields:**
```
Brand__c: Lookup to Brand__c object
Therapeutic_Area__c: Picklist
Indication__c: Multi-select Picklist
Claim_IDs__c: Long Text Area (comma-separated ClaimIDs)
MLR_Case_ID__c: Text
Journey_ID__c: External ID (links to Journey Canvas)
Journey_Template__c: Text
Campaign_Label__c: Text (Claravine-validated)
Total_Budget__c: Currency
Actual_Spend__c: Currency
ROI__c: Percent (calculated)
```

---

### SF-004: Real-Time Segment Sync
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** SF-002

Real-time synchronization of segment membership changes to execution platforms.

**Acceptance Criteria:**
- Change Data Capture (CDC) on Contact/Lead/Account objects
- Segment membership updates pushed to Marketing Cloud, DSP, Google Ads
- Suppression list updates (opt-outs, consent withdrawals) within 15 minutes
- Bi-directional sync: Platform events → Salesforce for behavioral updates

**CDC Events:**
```javascript
// Salesforce Platform Event
{
  "event": "Contact_Updated__e",
  "contactId": "003xx000001234AAA",
  "field": "Engagement_Score__c",
  "oldValue": 45,
  "newValue": 68,
  "timestamp": "2024-11-12T10:30:00Z"
}
```

---

### SF-005: Data Cloud Identity Resolution
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** SF-001, Salesforce Data Cloud

Data Cloud resolves identities across channels (email, web, mobile, field sales) into unified profiles.

**Acceptance Criteria:**
- Identity resolution rules based on email, NPI, device ID, cookie ID
- Unified Individual object with harmonized attributes
- Cross-channel event history aggregation
- Calculated Insights (engagement score, content affinity, channel preference)
- Golden record creation for duplicates
- Data quality metrics dashboard

**Identity Graph:**
```
Unified Individual: UI-12345
├─ Contact (Salesforce): 003xx000001234AAA
├─ Email Identity: john.doe@hospital.com
├─ NPI: 1234567890
├─ Cookie ID: abc123def456
├─ Mobile Device ID: xyz789uvw012
└─ Events:
   ├─ Email Open (2024-11-10)
   ├─ Web Visit (2024-11-11)
   └─ Field Sales Call (2024-11-12)
```

---

## REQUIREMENTS: CLARAVINE INTEGRATION

### CV-001: Taxonomy Validation Gateway
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** None

Claravine serves as mandatory validation gateway for all campaign taxonomy, UTM parameters, and metadata.

**Acceptance Criteria:**
- 100% of campaigns validated through Claravine before activation
- API integration preventing bypass
- Real-time validation feedback in Campaign Manager
- Validation rejection with clear error messages
- Override capability requires executive approval with audit trail
- Validation turnaround time < 4 hours for standard campaigns

**Validation Rules:**
- Campaign naming convention compliance
- Required field completion (brand, audience, channel, quarter, theme)
- Brand-specific taxonomy rules
- UTM parameter format validation
- Character limits and special character restrictions

---

### CV-002: Campaign Naming Convention Enforcement
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** CV-001

Standardized campaign naming following pharma taxonomy best practices.

**Acceptance Criteria:**
- Naming template: `{Brand} {Audience} {Segment} {Channel} {Channel} {Quarter} {Theme}`
- Example: `Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL Q4 AMD Launch`
- Automatic validation of component values against approved lists
- Suggestions for auto-completion
- Historical naming pattern analysis

**Naming Components:**
- **Brand**: Eylea, Dupixent, Praluent, Kevzara, Libtayo, Evkeeza, Inmazeb, Regen-COV
- **Audience**: HCP, PATIENT, CAREGIVER, PAYER
- **Segment**: Free text (from Salesforce segment names)
- **Channels**: EMAIL, PAID_SOCIAL, PAID_SEARCH, PAID_DISPLAY, PRINT, WEB, MOBILE, FIELD_SALES, EVENTS
- **Quarter**: Q1, Q2, Q3, Q4
- **Theme**: New Product Launch, Indication Expansion, Adherence, Awareness, Education, etc.

---

### CV-003: UTM Parameter Generation
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** CV-001, CV-002

Claravine auto-generates standardized UTM parameters for all campaign tracking URLs.

**Acceptance Criteria:**
- UTM template configuration per campaign type
- Auto-population of utm_source, utm_medium, utm_campaign, utm_content, utm_term
- URL builder with preview
- Bulk URL generation for multi-channel campaigns
- QR code generation with embedded UTMs (for print)
- Short link creation with tracking

**UTM Structure:**
```javascript
{
  "utm_source": "cmi_media",           // Traffic source (cmi_media, google, linkedin, etc.)
  "utm_medium": "paid_display",        // Marketing medium (email, paid_social, paid_display, etc.)
  "utm_campaign": "eylea_hcp_retina_q4_amd", // Campaign label (lowercased, underscored)
  "utm_content": "CNT-2024-0030",      // Content ID
  "utm_term": "SEQ-7"                  // Sequence number
}

// Generated URL:
https://eylea.com/hcp/wet-amd?utm_source=cmi_media&utm_medium=paid_display&utm_campaign=eylea_hcp_retina_q4_amd&utm_content=CNT-2024-0030&utm_term=SEQ-7
```

---

### CV-004: Custom Marketing Parameters (cm_*)
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** CV-003

Custom `cm_*` parameters provide richer tracking beyond standard UTMs for pharma-specific attribution.

**Acceptance Criteria:**
- cm_journey_id: Campaign/Journey ID
- cm_node_seq: Sequence number
- cm_variant: A/B test variant
- cm_brand: Brand name
- cm_audience: Audience type
- cm_segment: Segment ID
- cm_therapeutic_area: Therapeutic area
- cm_indication: Medical indication
- URL length optimization (parameter compression)

**Enhanced Tracking:**
```javascript
{
  // Standard UTMs
  "utm_source": "cmi_media",
  "utm_medium": "paid_display",
  "utm_campaign": "eylea_hcp_retina_q4_amd",
  "utm_content": "CNT-2024-0030",
  "utm_term": "SEQ-7",

  // Custom cm_* parameters
  "cm_journey_id": "CMP-2024-001",
  "cm_node_seq": "7",
  "cm_variant": "A",
  "cm_brand": "eylea",
  "cm_audience": "hcp",
  "cm_segment": "retina_specialists_high_volume",
  "cm_therapeutic_area": "ophthalmology",
  "cm_indication": "wet_amd"
}
```

---

### CV-005: API Integration for Auto-Validation
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** CV-001, CV-002, CV-003

Direct API integration with Claravine for automated validation and URL generation during journey activation.

**Acceptance Criteria:**
- Claravine API authentication via OAuth 2.0
- POST endpoint for campaign validation submission
- GET endpoint for validation status polling
- Webhook support for validation completion notification
- Error handling with retry logic
- Validation response includes generated UTMs and approval status

**API Flow:**
```javascript
// 1. Submit campaign for validation
POST /api/v1/campaigns/validate
{
  "campaign_id": "CMP-2024-001",
  "campaign_label": "Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL Q4 AMD Launch",
  "brand": "Eylea",
  "audience_type": "HCP",
  "segment": "High-Volume Retina Specialists",
  "channels": ["EMAIL", "PAID_SOCIAL"],
  "quarter": "Q4",
  "theme": "AMD Launch",
  "sequences": [
    { "sequence": 1, "content_id": "CNT-2024-0001", "channel": "EMAIL" },
    { "sequence": 2, "content_id": "CNT-2024-0011", "channel": "PAID_SOCIAL" }
  ]
}

// 2. Receive validation response
{
  "validation_id": "VAL-2024-0123",
  "status": "approved",
  "utm_templates": [
    {
      "sequence": 1,
      "utm_source": "sfmc",
      "utm_medium": "email",
      "utm_campaign": "eylea_hcp_retina_q4_amd",
      "utm_content": "CNT-2024-0001",
      "utm_term": "SEQ-1"
    },
    {
      "sequence": 2,
      "utm_source": "cmi_media",
      "utm_medium": "paid_social",
      "utm_campaign": "eylea_hcp_retina_q4_amd",
      "utm_content": "CNT-2024-0011",
      "utm_term": "SEQ-2"
    }
  ],
  "validated_at": "2024-11-12T10:30:00Z",
  "validated_by": "system"
}
```

---

### CV-006: Vendor Platform Distribution
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** CV-003, CV-004, S3 file drop

Claravine-validated campaigns and UTMs distributed to vendor platforms for execution.

**Acceptance Criteria:**
- S3 file drop with manifest.json and tracking_parameters.json
- CMI Media ingestion of campaign files
- CMI distribution to downstream platforms (Pulsepoint, Medscape, Epocrates, Doximity)
- SFMC (Salesforce Marketing Cloud) integration for email execution
- Google Ads integration for paid search
- Veeva integration for field sales tracking
- File format validation and schema compliance

**S3 File Drop Structure:**
```
s3://brandguard-campaigns/CMP-2024-001/
├── manifest.json
├── tracking_parameters.json
├── content/
│   ├── CNT-2024-0001_email.html
│   ├── CNT-2024-0011_300x250.jpg
│   └── CNT-2024-0011_728x90.jpg
└── segments/
    ├── segment_001_hcps.csv
    └── suppression_list.csv
```

**manifest.json:**
```json
{
  "campaign_id": "CMP-2024-001",
  "campaign_name": "Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL Q4 AMD Launch",
  "brand": "Eylea",
  "start_date": "2024-11-15",
  "end_date": "2024-12-31",
  "sequences": [
    {
      "sequence_number": 1,
      "channel": "EMAIL",
      "content_id": "CNT-2024-0001",
      "subject_line": "New HAWK Study Data: Eylea High-Dose in Wet AMD",
      "segment_file": "segments/segment_001_hcps.csv",
      "send_datetime": "2024-11-15T09:00:00Z"
    },
    {
      "sequence_number": 2,
      "channel": "PAID_SOCIAL",
      "content_id": "CNT-2024-0011",
      "creative_files": ["content/CNT-2024-0011_300x250.jpg", "content/CNT-2024-0011_728x90.jpg"],
      "platforms": ["linkedin", "doximity"],
      "start_date": "2024-11-17",
      "end_date": "2024-12-15",
      "budget": 25000
    }
  ],
  "suppression_list": "segments/suppression_list.csv"
}
```

---

## REQUIREMENTS: SNOWFLAKE INTEGRATION

### SW-001: Data Warehouse Architecture
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** Snowflake account provisioning

Snowflake serves as centralized data warehouse for all marketing event data and analytics.

**Acceptance Criteria:**
- Multi-layer architecture: Raw → Staging → Curated → Analytics
- Database schemas: MARKETING_RAW, MARKETING_CURATED, MARKETING_ANALYTICS
- Role-based access control (RBAC) with least privilege
- Data retention policies (7 years for audit compliance)
- Encryption at rest and in transit
- Cost monitoring and query optimization

**Database Structure:**
```sql
-- RAW LAYER: Unprocessed event data
CREATE DATABASE MARKETING_RAW;
CREATE SCHEMA MARKETING_RAW.EVENTS;

-- STAGING LAYER: Cleaned and validated data
CREATE DATABASE MARKETING_STAGING;
CREATE SCHEMA MARKETING_STAGING.EVENTS;
CREATE SCHEMA MARKETING_STAGING.DIMENSIONS;

-- CURATED LAYER: Business-ready datasets
CREATE DATABASE MARKETING_CURATED;
CREATE SCHEMA MARKETING_CURATED.CAMPAIGNS;
CREATE SCHEMA MARKETING_CURATED.JOURNEYS;
CREATE SCHEMA MARKETING_CURATED.ATTRIBUTION;

-- ANALYTICS LAYER: Aggregated metrics
CREATE DATABASE MARKETING_ANALYTICS;
CREATE SCHEMA MARKETING_ANALYTICS.DASHBOARDS;
CREATE SCHEMA MARKETING_ANALYTICS.REPORTS;
```

---

### SW-002: Event Ingestion Pipeline
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** SW-001

Real-time event ingestion from all marketing channels with UTM and cm_* parameter parsing.

**Acceptance Criteria:**
- Snowpipe auto-ingestion from S3 event buckets
- Event schema validation and rejection handling
- UTM parameter parsing into structured fields
- cm_* parameter extraction
- Deduplication logic for duplicate events
- Latency < 5 minutes from event generation to availability in Snowflake

**Event Schema:**
```sql
CREATE TABLE MARKETING_RAW.EVENTS.marketing_events (
  event_id VARCHAR(100) PRIMARY KEY,
  event_timestamp TIMESTAMP_NTZ,
  event_type VARCHAR(50),  -- impression, click, conversion, email_open, email_click, etc.

  -- Composite Key Components
  campaign_id VARCHAR(50),
  sequence_number INTEGER,
  content_id VARCHAR(50),
  variant VARCHAR(20),

  -- UTM Parameters
  utm_source VARCHAR(50),
  utm_medium VARCHAR(50),
  utm_campaign VARCHAR(200),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),

  -- Custom Marketing Parameters
  cm_journey_id VARCHAR(50),
  cm_node_seq INTEGER,
  cm_variant VARCHAR(20),
  cm_brand VARCHAR(50),
  cm_audience VARCHAR(50),
  cm_segment VARCHAR(100),
  cm_therapeutic_area VARCHAR(100),
  cm_indication VARCHAR(100),

  -- User/Device Identifiers
  user_id VARCHAR(100),
  device_id VARCHAR(100),
  cookie_id VARCHAR(100),
  email_address VARCHAR(255),
  npi VARCHAR(20),

  -- Event Metadata
  channel VARCHAR(50),
  platform VARCHAR(50),  -- SFMC, Google Ads, Pulsepoint, etc.
  vendor VARCHAR(50),    -- CMI Media, Veeva, etc.

  -- Technical Fields
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer_url TEXT,
  destination_url TEXT,

  -- Ingestion Metadata
  ingested_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  source_file VARCHAR(500)
);
```

---

### SW-003: Journey Sequence Performance Aggregation
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** SW-002

Pre-aggregated tables for sequence-level performance metrics enabling fast dashboard queries.

**Acceptance Criteria:**
- Hourly aggregation jobs via Snowflake Tasks
- Metrics: Impressions, Clicks, Conversions, CTR, Conversion Rate, CPC, CPA, ROI
- Segment/microsegment breakdowns
- Channel breakdowns
- Date/time aggregations (hour, day, week, month)
- Incremental updates for cost efficiency

**Performance Table:**
```sql
CREATE TABLE MARKETING_ANALYTICS.DASHBOARDS.journey_sequence_performance (
  -- Primary Key
  performance_date DATE,
  campaign_id VARCHAR(50),
  sequence_number INTEGER,
  content_id VARCHAR(50),
  variant VARCHAR(20),
  segment_id VARCHAR(50),
  channel VARCHAR(50),

  -- Performance Metrics
  impressions BIGINT,
  clicks INTEGER,
  conversions INTEGER,
  email_opens INTEGER,
  email_clicks INTEGER,

  -- Calculated Metrics
  ctr DECIMAL(10, 4),              -- Click-Through Rate
  conversion_rate DECIMAL(10, 4),   -- Conversion Rate
  open_rate DECIMAL(10, 4),         -- Email Open Rate
  click_to_open_rate DECIMAL(10, 4), -- Email CTOR

  -- Financial Metrics
  spend_amount DECIMAL(18, 2),
  cpc DECIMAL(10, 2),              -- Cost Per Click
  cpa DECIMAL(10, 2),              -- Cost Per Acquisition
  revenue DECIMAL(18, 2),
  roi DECIMAL(10, 4),              -- Return on Investment

  -- Engagement Metrics
  avg_time_on_site INTEGER,        -- seconds
  bounce_rate DECIMAL(10, 4),
  pages_per_session DECIMAL(10, 2),

  -- Metadata
  updated_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (performance_date, campaign_id, sequence_number, content_id, variant, segment_id, channel)
);

-- Aggregation Task (runs hourly)
CREATE TASK aggregate_sequence_performance
  WAREHOUSE = MARKETING_WH
  SCHEDULE = 'USING CRON 0 * * * * UTC'
AS
INSERT INTO MARKETING_ANALYTICS.DASHBOARDS.journey_sequence_performance
SELECT
  DATE(event_timestamp) as performance_date,
  campaign_id,
  sequence_number,
  content_id,
  COALESCE(variant, 'control') as variant,
  cm_segment as segment_id,
  channel,

  -- Metrics
  COUNT(CASE WHEN event_type = 'impression' THEN 1 END) as impressions,
  COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks,
  COUNT(CASE WHEN event_type = 'conversion' THEN 1 END) as conversions,
  COUNT(CASE WHEN event_type = 'email_open' THEN 1 END) as email_opens,
  COUNT(CASE WHEN event_type = 'email_click' THEN 1 END) as email_clicks,

  -- Calculated
  ROUND(clicks::NUMERIC / NULLIF(impressions, 0) * 100, 4) as ctr,
  ROUND(conversions::NUMERIC / NULLIF(clicks, 0) * 100, 4) as conversion_rate,
  ROUND(email_opens::NUMERIC / NULLIF(impressions, 0) * 100, 4) as open_rate,
  ROUND(email_clicks::NUMERIC / NULLIF(email_opens, 0) * 100, 4) as click_to_open_rate,

  -- Financials (joined from spend data)
  0 as spend_amount,  -- TODO: Join with spend table
  0 as cpc,
  0 as cpa,
  0 as revenue,
  0 as roi,

  -- Engagement
  0 as avg_time_on_site,
  0 as bounce_rate,
  0 as pages_per_session,

  CURRENT_TIMESTAMP() as updated_at
FROM MARKETING_RAW.EVENTS.marketing_events
WHERE event_timestamp >= DATEADD(hour, -1, CURRENT_TIMESTAMP())
GROUP BY 1, 2, 3, 4, 5, 6, 7
ON CONFLICT (performance_date, campaign_id, sequence_number, content_id, variant, segment_id, channel)
DO UPDATE SET
  impressions = EXCLUDED.impressions,
  clicks = EXCLUDED.clicks,
  conversions = EXCLUDED.conversions,
  email_opens = EXCLUDED.email_opens,
  email_clicks = EXCLUDED.email_clicks,
  ctr = EXCLUDED.ctr,
  conversion_rate = EXCLUDED.conversion_rate,
  updated_at = CURRENT_TIMESTAMP();
```

---

### SW-004: Multi-Touch Attribution Modeling
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** SW-002, SW-003

Attribution models allocate conversion credit across journey touchpoints using configurable rules.

**Acceptance Criteria:**
- Support for 5 attribution models: Last-touch, First-touch, Linear, Time-decay, Position-based
- Lookback window configuration (7, 14, 30, 60, 90 days)
- Conversion path reconstruction from event sequences
- Fractional credit allocation per touchpoint
- Model comparison reporting

**Attribution Models:**

1. **Last-Touch**: 100% credit to final touchpoint before conversion
2. **First-Touch**: 100% credit to first touchpoint
3. **Linear**: Equal credit to all touchpoints
4. **Time-Decay**: Exponentially more credit to recent touchpoints
5. **Position-Based**: 40% to first, 40% to last, 20% distributed to middle

**Attribution Query:**
```sql
-- Multi-Touch Attribution (Linear Model)
WITH conversion_paths AS (
  SELECT
    user_id,
    conversion_event_id,
    conversion_timestamp,
    ARRAY_AGG(
      OBJECT_CONSTRUCT(
        'campaign_id', campaign_id,
        'sequence_number', sequence_number,
        'content_id', content_id,
        'channel', channel,
        'event_timestamp', event_timestamp
      ) ORDER BY event_timestamp
    ) as touchpoints
  FROM MARKETING_RAW.EVENTS.marketing_events
  WHERE event_timestamp <= conversion_timestamp
    AND event_timestamp >= DATEADD(day, -30, conversion_timestamp)  -- 30-day lookback
  GROUP BY user_id, conversion_event_id, conversion_timestamp
)
SELECT
  touchpoint.value:campaign_id::VARCHAR as campaign_id,
  touchpoint.value:sequence_number::INTEGER as sequence_number,
  touchpoint.value:content_id::VARCHAR as content_id,
  touchpoint.value:channel::VARCHAR as channel,

  -- Linear attribution: 1 / number of touchpoints
  COUNT(DISTINCT conversion_event_id) * (1.0 / ARRAY_SIZE(touchpoints)) as attributed_conversions
FROM conversion_paths,
LATERAL FLATTEN(input => touchpoints) touchpoint
GROUP BY 1, 2, 3, 4;
```

---

### SW-005: Cohort Analysis and Retention
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** SW-002

Cohort analysis tracking user engagement and retention over time by segment, campaign, and entry sequence.

**Acceptance Criteria:**
- Cohort definition by entry point (first touchpoint campaign/sequence)
- Retention curves showing engagement over weeks/months
- Segment-level cohort comparison
- Campaign effectiveness by cohort
- Reactivation tracking (dormant users re-engaged)

**Cohort Table:**
```sql
CREATE TABLE MARKETING_ANALYTICS.REPORTS.cohort_retention (
  cohort_month VARCHAR(7),           -- YYYY-MM
  campaign_id VARCHAR(50),
  sequence_number INTEGER,
  segment_id VARCHAR(50),

  -- Cohort Size
  cohort_size INTEGER,

  -- Retention by Period
  retained_week_1 INTEGER,
  retained_week_2 INTEGER,
  retained_week_4 INTEGER,
  retained_week_8 INTEGER,
  retained_week_12 INTEGER,

  -- Retention Rates
  retention_rate_week_1 DECIMAL(10, 4),
  retention_rate_week_2 DECIMAL(10, 4),
  retention_rate_week_4 DECIMAL(10, 4),
  retention_rate_week_8 DECIMAL(10, 4),
  retention_rate_week_12 DECIMAL(10, 4),

  updated_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (cohort_month, campaign_id, sequence_number, segment_id)
);
```

---

### SW-006: BI Tool Integration (Tableau/Power BI)
**Priority:** P1 - Strategic (Phase 2)
**Dependencies:** SW-003, SW-004, SW-005

Direct integration with Tableau and Power BI for self-service analytics and executive dashboards.

**Acceptance Criteria:**
- Snowflake connector configuration for Tableau and Power BI
- Published semantic layer with business-friendly table/column names
- Row-level security enforcing brand-based access
- Pre-built dashboard templates (Campaign Performance, Attribution, Cohort Analysis)
- Scheduled refresh for daily/hourly updates
- Export capabilities for presentations

**Key Dashboards:**
1. **Executive Dashboard**: Portfolio-level metrics across all brands
2. **Campaign Performance**: Sequence-level metrics with drill-down
3. **Attribution Analysis**: Multi-touch attribution model comparison
4. **Cohort Retention**: Engagement and retention curves
5. **Channel Effectiveness**: ROI by channel with optimization recommendations
6. **Segment Performance**: Microsegment comparison and resonance validation

---

### SW-007: Data Quality Monitoring
**Priority:** P0 - Foundation (Phase 1)
**Dependencies:** SW-001, SW-002

Automated data quality checks ensuring event data completeness, accuracy, and timeliness.

**Acceptance Criteria:**
- Schema validation (required fields present)
- Referential integrity (valid campaign IDs, content IDs, segment IDs)
- Duplicate detection and flagging
- Missing UTM parameter alerts
- Event volume anomaly detection (sudden drops/spikes)
- Latency monitoring (event timestamp vs ingestion timestamp)
- Daily data quality scorecard

**Data Quality Rules:**
```sql
-- Missing UTM Parameters
SELECT
  DATE(event_timestamp) as event_date,
  COUNT(*) as total_events,
  COUNT(CASE WHEN utm_campaign IS NULL THEN 1 END) as missing_utm_campaign,
  COUNT(CASE WHEN utm_source IS NULL THEN 1 END) as missing_utm_source,
  COUNT(CASE WHEN utm_medium IS NULL THEN 1 END) as missing_utm_medium,
  ROUND(
    COUNT(CASE WHEN utm_campaign IS NULL OR utm_source IS NULL OR utm_medium IS NULL THEN 1 END)::NUMERIC
    / COUNT(*) * 100,
    2
  ) as incomplete_pct
FROM MARKETING_RAW.EVENTS.marketing_events
WHERE event_timestamp >= DATEADD(day, -7, CURRENT_DATE())
GROUP BY event_date
HAVING incomplete_pct > 5  -- Alert if >5% incomplete
ORDER BY event_date DESC;

-- Duplicate Events
SELECT
  event_id,
  COUNT(*) as duplicate_count
FROM MARKETING_RAW.EVENTS.marketing_events
WHERE event_timestamp >= DATEADD(day, -1, CURRENT_DATE())
GROUP BY event_id
HAVING duplicate_count > 1;

-- Volume Anomaly Detection
WITH daily_volumes AS (
  SELECT
    DATE(event_timestamp) as event_date,
    channel,
    COUNT(*) as event_count
  FROM MARKETING_RAW.EVENTS.marketing_events
  WHERE event_timestamp >= DATEADD(day, -30, CURRENT_DATE())
  GROUP BY event_date, channel
),
stats AS (
  SELECT
    channel,
    AVG(event_count) as avg_volume,
    STDDEV(event_count) as stddev_volume
  FROM daily_volumes
  GROUP BY channel
)
SELECT
  dv.event_date,
  dv.channel,
  dv.event_count,
  s.avg_volume,
  ROUND((dv.event_count - s.avg_volume) / NULLIF(s.stddev_volume, 0), 2) as z_score
FROM daily_volumes dv
JOIN stats s ON dv.channel = s.channel
WHERE ABS((dv.event_count - s.avg_volume) / NULLIF(s.stddev_volume, 0)) > 3  -- Alert if >3 std devs
ORDER BY dv.event_date DESC, ABS(z_score) DESC;
```

---

## INTEGRATION WORKFLOW: END-TO-END

### Complete Campaign Activation Flow

**Phase 1: Campaign Planning (Campaign Manager)**
1. User creates campaign in Campaign Manager
2. Selects brand, audience type, and segment from Salesforce
3. Links approved ClaimIDs from registry
4. Submits campaign for MLR review
5. MLR approval obtained (Medical → Legal → Regulatory)

**Phase 2: Journey Design (Journey Canvas)**
6. User opens Journey Canvas
7. Drags nodes onto canvas (Email, Paid Social, Wait, Decision, etc.)
8. Generates or selects microsegments with behavioral criteria
9. Assigns content to nodes from content library
10. Reviews resonance scores for content-segment fit
11. Configures node settings (wait times, decision logic, A/B variants)
12. Validates journey (no orphans, all nodes configured)

**Phase 3: ID Minting & Validation (ID Registry + Claravine)**
13. User clicks "Activate Journey"
14. System calls ID Registry to mint:
    - Campaign ID: `CMP-2024-001`
    - Content IDs: `CNT-2024-0001`, `CNT-2024-0011`, etc.
    - Sequence IDs: `SEQ-1`, `SEQ-2`, `SEQ-3`, etc.
15. System submits campaign to Claravine API for validation
16. Claravine validates taxonomy and naming convention
17. Claravine generates UTM parameters + cm_* custom parameters
18. Claravine returns validation approval with tracking templates

**Phase 4: Export & Distribution (S3 + Vendor Platforms)**
19. System generates manifest.json with campaign metadata
20. System generates tracking_parameters.json with UTMs and cm_*
21. System exports content files (emails, banners, landing pages)
22. System exports segment CSVs from Salesforce
23. All files uploaded to S3 bucket: `s3://brandguard-campaigns/CMP-2024-001/`
24. CMI Media ingests files from S3
25. CMI distributes to vendor platforms:
    - SFMC (Salesforce Marketing Cloud) for email execution
    - Pulsepoint, Medscape, Epocrates, Doximity for paid media
    - Google Ads for search
    - Veeva for field sales presentations
26. Campaign activated in Salesforce with status: ACTIVE

**Phase 5: Execution & Event Tracking (Vendors + Snowflake)**
27. Vendors execute campaigns with tracking URLs
28. User actions generate events (impressions, clicks, opens, conversions)
29. Events sent to S3 event bucket with full UTM + cm_* parameters
30. Snowpipe auto-ingests events into Snowflake RAW layer
31. Hourly Snowflake Tasks aggregate events into performance tables
32. Data quality checks validate event completeness

**Phase 6: Analytics & Reporting (Snowflake + BrandGuard OS)**
33. BrandGuard OS Campaign Detail View queries Snowflake for metrics
34. Sequence Performance Dashboard displays real-time data
35. Journey Canvas Analytics mode shows performance on nodes
36. Tableau/Power BI dashboards refresh with latest data
37. Attribution models calculate multi-touch credit allocation
38. Cohort analysis tracks retention and engagement over time
39. Executive reports generated for leadership review

---

## DEPENDENCY MATRIX

| Requirement | Depends On | Priority | Phase |
|-------------|-----------|----------|-------|
| CM-001 | None | P0 | 1 |
| CM-002 | CM-001 | P0 | 1 |
| CM-003 | CM-001, CM-002 | P0 | 1 |
| CM-004 | CM-001, SW-003 | P0 | 1 |
| CM-005 | CM-001 | P1 | 2 |
| JC-001 | None | P0 | 1 |
| JC-002 | JC-001, SF-002 | P0 | 1 |
| JC-003 | JC-001, JC-002 | P1 | 2 |
| JC-004 | JC-001 | P0 | 1 |
| JC-005 | JC-001, JC-002, JC-003 | P1 | 2 |
| JC-006 | JC-001, JC-004, CV-001 | P0 | 1 |
| JC-007 | JC-001, JC-004, SW-003 | P1 | 2 |
| SF-001 | Salesforce | P0 | 1 |
| SF-002 | SF-001 | P0 | 1 |
| SF-003 | SF-001, SF-002 | P0 | 1 |
| SF-004 | SF-002 | P1 | 2 |
| SF-005 | SF-001, Data Cloud | P1 | 2 |
| CV-001 | None | P0 | 1 |
| CV-002 | CV-001 | P0 | 1 |
| CV-003 | CV-001, CV-002 | P0 | 1 |
| CV-004 | CV-003 | P1 | 2 |
| CV-005 | CV-001, CV-002, CV-003 | P1 | 2 |
| CV-006 | CV-003, CV-004 | P0 | 1 |
| SW-001 | Snowflake | P0 | 1 |
| SW-002 | SW-001 | P0 | 1 |
| SW-003 | SW-002 | P0 | 1 |
| SW-004 | SW-002, SW-003 | P1 | 2 |
| SW-005 | SW-002 | P1 | 2 |
| SW-006 | SW-003, SW-004, SW-005 | P1 | 2 |
| SW-007 | SW-001, SW-002 | P0 | 1 |

---

## SUMMARY

### Total Requirements: 33

**By System:**
- Campaign Manager: 5 requirements
- Journey Canvas: 7 requirements
- Salesforce: 5 requirements
- Claravine: 6 requirements
- Snowflake: 7 requirements
- Integration Workflow: 3 requirements

**By Priority:**
- P0 (Foundation - Phase 1): 21 requirements
- P1 (Strategic - Phase 2): 12 requirements

**By Phase:**
- Phase 1 (Months 1-3): 21 requirements
- Phase 2 (Months 4-9): 12 requirements

### Key Implementation Milestones

**Month 1:**
- Salesforce platform configuration (SF-001, SF-002, SF-003)
- Snowflake data warehouse setup (SW-001, SW-002)
- Claravine instance configuration (CV-001, CV-002)

**Month 2:**
- Campaign Manager build (CM-001, CM-002, CM-003)
- Journey Canvas foundation (JC-001, JC-002, JC-004)
- Claravine UTM generation (CV-003, CV-006)
- Snowflake aggregation (SW-003, SW-007)

**Month 3:**
- Journey activation workflow (JC-006)
- Campaign performance dashboard (CM-004)
- End-to-end validation and pilot campaigns

**Months 4-9 (Phase 2):**
- Advanced journey features (JC-003, JC-005, JC-007)
- Multi-brand portfolio (CM-005)
- Advanced Salesforce features (SF-004, SF-005)
- Claravine API automation (CV-004, CV-005)
- Advanced analytics (SW-004, SW-005, SW-006)

---

## APPENDIX: GLOSSARY

**BrandGuard OS** - Pharmaceutical marketing compliance and operations platform

**Campaign Manager** - Campaign orchestration module within BrandGuard OS

**Journey Canvas** - Visual journey design interface within BrandGuard OS

**Claravine** - Taxonomy validation and UTM generation platform

**Snowflake** - Cloud data warehouse for marketing analytics

**Salesforce** - CRM platform serving as customer data master

**Data Cloud** - Salesforce identity resolution and CDP platform

**ClaimID** - Unique identifier for product marketing claims with evidence

**MLR** - Medical Legal Review approval workflow

**UTM Parameters** - Tracking parameters for campaign attribution (utm_source, utm_medium, utm_campaign, utm_content, utm_term)

**cm_* Parameters** - Custom marketing parameters for enhanced tracking

**Composite Key** - Unique identifier combining Campaign ID, Sequence, Content ID, and Variant

**Microsegment** - Refined audience segment with behavioral criteria

**Resonance Score** - AI-predicted content performance score (0-100) for segment fit

**ID Registry** - Service for minting and resolving unique identifiers

**S3 File Drop** - AWS S3 bucket for campaign file distribution

**CMI Media** - Agency partner for paid media distribution

**SFMC** - Salesforce Marketing Cloud for email execution

**Veeva** - Pharma CRM and field sales platform

**NPI** - National Provider Identifier for healthcare providers

**HCP** - Healthcare Professional (doctors, nurses, pharmacists)

**DTC** - Direct-to-Consumer marketing

**Snowpipe** - Snowflake's continuous data ingestion service

**CDC** - Change Data Capture for real-time sync

---

**Document Version:** 1.0
**Last Updated:** 2024-11-12
**Author:** BrandGuard OS Product Team
**Status:** Draft for Review
