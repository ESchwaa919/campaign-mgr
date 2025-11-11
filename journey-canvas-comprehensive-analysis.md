# Journey Canvas: Comprehensive Feature Analysis & Architecture

## Document Overview

**Purpose:** Complete enumeration of Journey Canvas features with business, product, and technical mappings aligned to third-party paid media execution, sequence-level tracking, and Data Cloud segmentation.

**Date:** 2025-11-11
**Version:** 1.0
**Scope:** Campaign OS for Pharmaceutical Marketing (Ophthalmology Focus)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Feature Enumeration: Complete Inventory](#feature-enumeration-complete-inventory)
3. [Third-Party Paid Media Architecture](#third-party-paid-media-architecture)
4. [Sequence-Level Tracking Framework](#sequence-level-tracking-framework)
5. [Data Cloud Segmentation Integration](#data-cloud-segmentation-integration)
6. [S3 File Drop Architecture (4C Framework)](#s3-file-drop-architecture-4c-framework)
7. [Content Tracking Across Sequences](#content-tracking-across-sequences)
8. [Technical Implementation Guide](#technical-implementation-guide)
9. [Integration Patterns](#integration-patterns)
10. [Recommendations & Optimizations](#recommendations-optimizations)

---

## Executive Summary

### Journey Canvas Mission
The Journey Canvas is a **Campaign Operating System (Campaign OS)** that orchestrates omnichannel pharmaceutical marketing campaigns with sequence-level content performance tracking, enabling marketers to design, execute, and measure multi-touchpoint patient and HCP journeys while maintaining regulatory compliance.

### Three Critical Alignment Areas

#### 1. Third-Party Paid Media (CMI Media Agency Model)
- **Business Need:** Execute paid media through agency partners while maintaining brand control and measurement
- **Partners:** CMI Media → Pulsepoint, Medscape, Epocrates, Doximity
- **Challenge:** Bridge internal campaign design with external agency execution
- **Solution:** S3-based file drop system with 4C metadata structure

#### 2. Sequence-Level Tracking Composite Key
- **Business Need:** Track content performance at granular sequence level to understand effectiveness
- **Structure:** `{CampaignName}/{SequenceNumber}/{ContentID}/{Version}`
- **Use Case:** Determine which content in which position drives outcomes
- **Foundation:** Enables content optimization and journey refinement

#### 3. Data Cloud for Audience Segmentation
- **Business Need:** Unified customer profiles spanning HCP and Patient personas
- **Capability:** Real-time identity resolution across web, email, mobile, CRM, paid media
- **Advantage:** Single source of truth for segment definition and activation
- **Compliance:** HIPAA-compliant identity management with consent enforcement

---

## Feature Enumeration: Complete Inventory

### 1. CANVAS DESIGN & ORCHESTRATION FEATURES

#### 1.1 Visual Journey Builder
**Business Functionality:**
- Drag-and-drop interface for marketers to design multi-step campaigns
- Visual representation of customer journey paths
- Non-technical users can create complex workflows
- Pre-built templates accelerate campaign creation

**Product Functionality:**
- React Flow-based canvas with zoom/pan controls
- Node palette organized by media type (owned, paid, flow control)
- Real-time node positioning and connection drawing
- Undo/redo capability with version snapshots

**Technical Functionality:**
- React Flow library v11+ with custom node types
- State management via React hooks (useState, useCallback, useMemo)
- Position tracking in flow coordinates (x, y)
- Edge connections with MarkerType.ArrowClosed styling
- Canvas export to JSON for persistence

**Data Model:**
```typescript
interface JourneyCanvas {
  id: string;
  name: string;
  brand: string;
  audienceType: 'HCP' | 'PATIENT';
  segment: string;
  nodes: Node[];
  edges: Edge[];
  status: JourneyStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

---

#### 1.2 Node Type System

**A. Entry Point Node**
- **Business:** Defines journey start trigger (segment entry, date, event)
- **Product:** Green play icon, always sequence #1
- **Technical:** `nodeType: 'entry'`, no content attachment

**B. Content Touchpoint Nodes (Owned Media)**

**B1. Email Node**
- **Business:** Send email communication with MLR-approved content
- **Product:** Blue mail icon, displays email template preview
- **Technical:** `nodeType: 'email'`, links to ContentAsset (channel: EMAIL)
- **Execution:** Triggers via Marketing Cloud/Braze API
- **Metrics:** sent, delivered, opened, clicked, converted

**B2. Web Content Node**
- **Business:** Display web landing page or article
- **Product:** Purple globe icon, shows URL/page title
- **Technical:** `nodeType: 'web'`, links to WEB_LANDING_PAGE or WEB_ARTICLE
- **Execution:** CMS publish with analytics tracking
- **Metrics:** pageviews, time_on_page, form_submits, downloads

**B3. Mobile Push Node**
- **Business:** Send push notification to mobile app users
- **Product:** Cyan smartphone icon, shows notification text preview
- **Technical:** `nodeType: 'mobile'`, links to MOBILE_PUSH content
- **Execution:** Braze/Iterable mobile SDK
- **Metrics:** sent, delivered, opened, clicked

**B4. Social Media Node**
- **Business:** Post organic social content (LinkedIn, Twitter)
- **Product:** Pink share icon, displays post preview
- **Technical:** `nodeType: 'social'`, links to SOCIAL_POST
- **Execution:** Social media management platform API
- **Metrics:** impressions, engagements, shares, clicks

**C. Paid Media Nodes (Third-Party Execution)**

**C1. Paid Social Node**
- **Business:** Execute paid social ads via CMI Media → LinkedIn/Facebook
- **Product:** Lime dollar icon, "3rd party agency execution" label
- **Technical:** `nodeType: 'paid-social'`, links to PAID_SOCIAL_AD
- **Execution:** S3 file drop → CMI Media ingestion → Platform execution
- **Vendors:** LinkedIn Ads, Facebook Ads
- **Metrics:** impressions, clicks, conversions, spend, CPM, CPC

**C2. Paid Search Node**
- **Business:** Execute search ads via CMI Media → Google Ads
- **Product:** Lime search icon, displays keywords/ad copy
- **Technical:** `nodeType: 'paid-search'`, links to PAID_SEARCH_AD
- **Execution:** S3 file drop with keyword targeting parameters
- **Vendors:** Google Ads (primary)
- **Metrics:** impressions, clicks, conversions, spend, CPC, quality_score

**C3. Paid Display Node**
- **Business:** Execute programmatic display via CMI Media → Pulsepoint/Medscape
- **Product:** Lime monitor icon, shows creative preview
- **Technical:** `nodeType: 'paid-display'`, links to PAID_DISPLAY_AD
- **Execution:** S3 file drop with creative assets + targeting rules
- **Vendors:** Pulsepoint, Medscape, Epocrates, Doximity
- **Metrics:** impressions, clicks, viewability, conversions, CPM

**C4. Print Media Node**
- **Business:** Journal advertising (Retina Times, JAMA Ophthalmology)
- **Product:** Slate newspaper icon, displays publication schedule
- **Technical:** `nodeType: 'print'`, links to PRINT_JOURNAL_AD
- **Execution:** Manual coordination with print vendor
- **Metrics:** circulation, estimated_reach, publication_date

**C5. TV/Radio Node**
- **Business:** Broadcast media (DTC patient awareness)
- **Product:** Red TV icon, shows spot length and stations
- **Technical:** `nodeType: 'tv-radio'`, links to TV_SPOT or RADIO_SPOT
- **Execution:** Media buying agency coordination
- **Metrics:** GRPs, reach, frequency, airings

**C6. Out-of-Home Node**
- **Business:** Conference signage, airport ads (AAO meeting)
- **Product:** Teal map pin icon, displays location and dates
- **Technical:** `nodeType: 'ooh'`, links to OOH_CREATIVE
- **Execution:** Event-based vendor coordination
- **Metrics:** estimated_impressions, venue_traffic, display_dates

**D. Flow Control Nodes**

**D1. Wait Node**
- **Business:** Add time delay or wait for event
- **Product:** Gray clock icon, shows wait configuration
- **Technical:** `nodeType: 'wait'`, stores WaitConfig
- **Configuration Types:**
  - Time-based: `{type: 'time', duration: 48, durationUnit: 'hours'}`
  - Event-based: `{type: 'event', event: 'email_opened'}`
  - Time OR Event: `{type: 'time_or_event', duration: 72, event: 'link_clicked'}`
- **Execution:** Journey orchestration engine holds until condition met

**D2. Decision Split Node**
- **Business:** Branch journey based on behavior/attribute
- **Product:** Yellow branch icon, shows decision criteria
- **Technical:** `nodeType: 'decision'`, stores DecisionConfig with multiple path handles
- **Configuration:**
```typescript
interface DecisionConfig {
  criterion: 'email_opened' | 'link_clicked' | 'segment_match' | 'score_threshold';
  paths: Array<{label: string; value: string}>;
}
```
- **Execution:** Real-time or batch evaluation, route to appropriate path

**D3. A/B Test Node**
- **Business:** Split traffic for content testing
- **Product:** Indigo split icon, shows variants and allocation
- **Technical:** `nodeType: 'abtest'`, stores variant definitions and split percentage
- **Execution:** Random assignment with stable hashing on customer ID

**D4. Attribution Point Node**
- **Business:** Mark key conversion milestone (rep meeting, prescription, enrollment)
- **Product:** Emerald target icon, shows attribution event
- **Technical:** `nodeType: 'attribution'`, triggers attribution model update
- **Execution:** Event capture with journey context metadata

**D5. Score Update Node**
- **Business:** Update engagement score based on behavior
- **Product:** Amber zap icon, shows scoring logic
- **Technical:** `nodeType: 'score'`, modifies customer engagement score
- **Execution:** Real-time score calculation and persistence

**D6. Suppression Node**
- **Business:** Apply suppression filters (unsubscribed, consent revoked, duplicate)
- **Product:** Rose X icon, shows suppression rules
- **Technical:** `nodeType: 'suppression'`, queries suppression lists
- **Execution:** Real-time API check before audience entry

---

#### 1.3 Journey Hierarchy & Naming Convention

**Business Functionality:**
- Auto-generated campaign names ensure consistency
- Hierarchical structure enables roll-up reporting
- Taxonomy compliance enforced via Claravine integration

**Product Functionality:**
- 4-part filter system: Brand → Audience Type → Segment → Label
- Real-time name generation as filters selected
- Active channels automatically appended to name
- Campaign name format: `{Brand} {AudienceType} {Segment} {Channels} {Label}`

**Technical Functionality:**
```typescript
// Example generated name:
// "Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch"

const campaignName = useMemo(() => {
  const parts: string[] = [];
  if (selectedBrand) parts.push(brands.find(b => b.id === selectedBrand)?.name);
  if (selectedAudienceType) parts.push(selectedAudienceType);
  if (selectedSegment) parts.push(mockSegments.find(s => s.id === selectedSegment)?.name);
  if (activeChannels.length > 0) parts.push(...activeChannels.sort());
  if (campaignLabel.trim()) parts.push(campaignLabel.trim());
  return parts.join(' ');
}, [selectedBrand, selectedAudienceType, selectedSegment, activeChannels, campaignLabel]);
```

**Active Channel Detection:**
- Automatically detects which channels are present on canvas
- Channels added/removed dynamically as nodes placed
- Ensures campaign name reflects actual execution channels

---

#### 1.4 Sequence Numbering System

**Business Functionality:**
- Unique sequence numbers enable tracking position in journey
- Sequence-level reporting shows where drop-off occurs
- Content performance can be analyzed by position

**Product Functionality:**
- Sequence numbers assigned via breadth-first traversal from entry node
- Displayed as badge on each node: `#1`, `#2`, `#3`, etc.
- Sequential numbering follows flow direction

**Technical Functionality:**
```typescript
// BFS algorithm for sequence assignment
const nodeSequences = useMemo(() => {
  const sequences = new Map<string, number>();
  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; sequence: number }> = [];

  const entryNode = nodes.find((n) => n.data.nodeType === 'entry');
  if (entryNode) {
    queue.push({ nodeId: entryNode.id, sequence: 1 });
    visited.add(entryNode.id);
  }

  while (queue.length > 0) {
    const { nodeId, sequence } = queue.shift()!;
    sequences.set(nodeId, sequence);

    const outgoingEdges = edges.filter((e) => e.source === nodeId);
    outgoingEdges.forEach((edge) => {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push({ nodeId: edge.target, sequence: sequence + 1 });
      }
    });
  }

  return sequences;
}, [nodes, edges]);
```

**Composite Key for Tracking:**
- **Format:** `{CampaignName}/SEQ-{SequenceNumber}/{ContentID}`
- **Example:** `Eylea HCP Retina EMAIL PAID_SOCIAL Q4/SEQ-3/CNT-2024-0011`
- **Usage:** Every event tracked includes this composite key
- **Benefit:** Enables sequence-level attribution and content performance analysis

---

#### 1.5 Content Library Integration

**Business Functionality:**
- Centralized repository of MLR-approved content
- Smart filtering by brand, audience, channel
- Prevents use of non-approved or expired content

**Product Functionality:**
- Side panel displays filtered content cards
- Drag-and-drop content onto canvas nodes
- Content details panel shows ClaimIDs, evidence, expiry
- Visual preview (thumbnails, subject lines, headlines)

**Technical Functionality:**
- Content filtering logic:
```typescript
const filteredContent = useMemo(() => {
  let content = mockContentLibrary;

  // Always filter to approved only
  content = content.filter((c) => c.mlrStatus === 'APPROVED');

  // Filter by brand
  if (selectedBrand) {
    content = content.filter((c) => c.brandId === selectedBrand);
  }

  // Filter by audience type
  if (selectedAudienceType) {
    content = content.filter((c) => c.audienceType === selectedAudienceType);
  }

  // Filter by active channels on canvas (smart filtering!)
  if (activeChannels.length > 0) {
    content = content.filter((c) => activeChannels.includes(c.channel));
  }

  return content;
}, [selectedBrand, selectedAudienceType, activeChannels]);
```

**Content Asset Data Model:**
```typescript
interface ContentAsset {
  id: string;                    // CNT-2024-0001
  title: string;                 // "Eylea HAWK Study Email"
  description: string;
  assetType: ContentAssetType;   // EMAIL_TEMPLATE, PAID_SOCIAL_AD, etc.
  channel: ContentChannel;       // EMAIL, WEB, MOBILE, SOCIAL, PAID_MEDIA
  brandId: string;               // Links to Brand
  linkedClaimIds: string[];      // ClaimID references
  mlrStatus: MLRStatus;          // APPROVED, IN_REVIEW, etc.
  mlrCaseId?: string;            // MLR approval case
  thumbnailUrl?: string;         // Preview image
  fileUrl?: string;              // Asset location (S3, DAM)
  tags: string[];                // Searchable metadata
  audienceType: 'HCP' | 'PATIENT';
  version: number;               // Version control
  effectiveFrom: Date;           // Approval date
  effectiveTo?: Date;            // Expiry date
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

#### 1.6 Journey Status Lifecycle

**Business Functionality:**
- Lifecycle gates ensure governance compliance
- Status transitions trigger workflow actions
- Audit trail of journey activation/deactivation

**Product Functionality:**
- Status badge displayed in header with emoji indicators
- "Activate Journey" button transitions DESIGN → ACTIVE
- Status controls which features are enabled

**Status States:**
1. **DESIGN** 🎨
   - Initial state, canvas editing enabled
   - Can add/remove nodes, edit configuration
   - Analytics view disabled
   - No execution occurring

2. **REVIEW** 🔍
   - Submitted for stakeholder approval
   - Canvas editing locked (read-only)
   - Review comments enabled
   - Approval workflow active

3. **APPROVED** ✅
   - Stakeholder approval granted
   - Ready for activation
   - Execution systems notified
   - Audience preparation begins

4. **ACTIVE** ▶️
   - Journey executing, customers flowing through
   - Analytics view enabled with real-time metrics
   - Limited editing (non-destructive changes only)
   - Monitoring and alerting active

5. **PAUSED** ⏸️
   - Execution temporarily halted
   - In-flight customers frozen at current position
   - Can resume or terminate
   - Troubleshooting mode

6. **COMPLETE** 📊
   - Journey finished, all customers exited
   - Full analytics available
   - Canvas locked (archival)
   - Performance reporting active

**Technical Functionality:**
```typescript
type JourneyStatus = 'DESIGN' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'COMPLETE' | 'PAUSED';

const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>('DESIGN');

// Activation logic
const activateJourney = () => {
  if (journeyStatus === 'DESIGN') {
    setJourneyStatus('ACTIVE');
    setViewMode('analytics');
    // Trigger backend orchestration engine
    publishJourneyToExecutionEngine(journeyDefinition);
  }
};
```

---

#### 1.7 Design vs. Analytics View Mode

**Business Functionality:**
- Design mode: Build and configure campaign
- Analytics mode: Monitor performance and optimize

**Product Functionality:**

**Design Mode Features:**
- Node palette visible
- Content library visible
- Drag-and-drop enabled
- Node configuration dialogs
- Canvas editing enabled
- No metrics displayed

**Analytics Mode Features:**
- Node metrics overlay (sent, opened, clicked, converted)
- Edge labels show flow volume
- Animated connections indicate active paths
- Sequence dashboard toggle
- Performance comparison tools
- No editing (read-only canvas)

**Technical Functionality:**
```typescript
const [viewMode, setViewMode] = useState<'design' | 'analytics'>('design');

// Enriched nodes with metrics
const enrichedNodes = useMemo(() => {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      sequence: nodeSequences.get(node.id),
      viewMode,
      metrics: mockNodeMetrics[node.id],  // Only populated in analytics mode
    },
  }));
}, [nodes, nodeSequences, viewMode, mockNodeMetrics]);
```

**Metrics Display in Node (Analytics Mode):**
```tsx
{isAnalyticsMode && metrics && (
  <div className="mt-2 space-y-1.5">
    {metrics.sent && (
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Sent</span>
        <span className="font-semibold">{metrics.sent.toLocaleString()}</span>
      </div>
    )}
    {metrics.opened && openRate && (
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Opened</span>
        <span className="font-semibold">
          {metrics.opened.toLocaleString()} ({openRate}%)
        </span>
      </div>
    )}
    {/* Content tracking key */}
    {data.contentAsset && data.sequence && (
      <div className="pt-1.5 mt-1.5 border-t space-y-0.5">
        <p className="text-xs font-medium text-muted-foreground">Tracking Key:</p>
        <Badge variant="secondary" className="text-xs font-mono px-1.5 py-0.5">
          SEQ-{data.sequence}/{data.contentAsset.id}
        </Badge>
      </div>
    )}
  </div>
)}
```

---

### 2. AUDIENCE SEGMENTATION FEATURES

#### 2.1 Data Cloud Integration

**Business Functionality:**
- Unified customer profiles across HCP and Patient personas
- Real-time identity resolution from multiple data sources
- Segment size estimation before campaign launch
- HIPAA-compliant customer data management

**Product Functionality:**
- Segment dropdown populated from Data Cloud segment library
- Estimated audience size displayed: `(1,245)`
- Segment filtering by audience type (HCP vs. PATIENT)
- Segment preview showing criteria and recent refresh date

**Technical Functionality:**
- **Data Cloud Connection:**
  - Salesforce Data Cloud API integration
  - Real-time segment sync (<15 min latency)
  - Bi-directional data flow (attributes and events)

**Data Cloud Segment Definition:**
```typescript
interface Segment {
  id: string;
  name: string;
  description: string;
  query: Record<string, unknown>;  // Data Cloud segment query JSON
  segmentType: 'DEMOGRAPHIC' | 'INSTITUTIONAL' | 'BEHAVIOURAL';
  estimatedCount: number;          // Refreshed daily
  createdBy: string;
  lastRefreshed: Date;
}
```

**Segment Types:**

**A. Demographic Segments (HCP):**
- Retina Specialists - High Volume (1,245)
- Comprehensive Ophthalmologists (5,680)
- DME-Focused Specialists (892)
- Optometrists - Referral Partners (12,450)

**B. Institutional Segments:**
- Academic Medical Centers - Tier 1 (87)
- Community Hospitals with Ophthalmology (450)

**C. Behavioral Segments:**
- Recent Wet AMD Prescribers (3,420)
- Email Engaged HCPs (2,100)

**D. Patient Segments:**
- Wet AMD Patients - Newly Diagnosed (8,420)
- DME Patients - Active Treatment (15,680)
- Treatment Non-Adherent Patients (4,230)

**Segment Activation Flow:**
1. Marketer selects segment in Journey Canvas
2. Journey activation triggers audience export from Data Cloud
3. Customer IDs materialized to execution systems
4. Audience enters journey at entry point
5. Real-time identity resolution links events back to customer profile

---

#### 2.2 Hierarchical Filtering System

**Business Functionality:**
- Cascading filters guide user to appropriate audience
- Prevents misalignment (e.g., HCP content to patient segment)
- Taxonomy enforcement ensures reporting consistency

**Product Functionality:**
- **Level 1:** Brand Selection (Eylea, Lucentis, Beovu)
- **Level 2:** Audience Type (HCP, PATIENT)
- **Level 3:** Segment Selection (filtered by audience type)
- **Level 4:** Optional Campaign Label (Q4 Launch, etc.)

**Technical Functionality:**
```typescript
const filteredSegments = useMemo(() => {
  let segments = mockSegments;

  if (selectedAudienceType) {
    segments = segments.filter((seg) => {
      if (selectedAudienceType === 'HCP') {
        return seg.name.toLowerCase().includes('hcp') ||
               seg.segmentType !== 'BEHAVIOURAL';
      }
      return true;
    });
  }

  return segments;
}, [selectedAudienceType]);
```

**Downstream Filter Reset:**
```typescript
// Reset segment when audience type changes
useEffect(() => {
  if (selectedAudienceType) {
    setSelectedSegment('');  // Clear downstream selection
  }
}, [selectedAudienceType]);
```

---

### 3. JOURNEY TEMPLATES

**Business Functionality:**
- Pre-built best practice journeys accelerate campaign creation
- Proven journey structures reduce time-to-market
- Templates include content mapping and audience configuration

**Product Functionality:**
- Template selection dialog with preview
- Load template populates entire canvas (nodes + edges + settings)
- Templates organized by therapeutic area and campaign type

**Available Templates:**

**Template 1: Wet AMD New Product Launch (HCP)**
- **Audience:** Retina Specialists - High Volume
- **Channels:** EMAIL → PAID_SOCIAL → PRINT
- **Structure:**
  - Entry → HAWK Study Email → Wait 48h → Decision (Opened?) →
    - Yes → LinkedIn Thought Leadership → Retina Times Ad → Attribution
    - No → Email Resend → Retina Times Ad → Attribution
- **Content:** 7 pre-mapped assets

**Template 2: Patient Treatment Adherence (Patient)**
- **Audience:** DME Patients - Active Treatment
- **Channels:** EMAIL → WEB → MOBILE
- **Structure:**
  - Entry → Welcome Email → Wait 3 Days → Patient Portal →
    Wait 1 Week → Appointment Reminder → Attribution
- **Content:** 4 pre-mapped assets

**Template 3: Patient DTC AMD Awareness**
- **Audience:** Newly Diagnosed Wet AMD Patients
- **Channels:** EMAIL → PAID_DISPLAY → WEB
- **Structure:**
  - Entry → Suppression → Educational Email → Display Retargeting →
    AMD Article → Financial Assistance
- **Content:** 4 pre-mapped assets

**Template 4: HCP CME & Education**
- **Audience:** Comprehensive Ophthalmologists
- **Channels:** EMAIL → WEB → PAID_SOCIAL
- **Structure:**
  - Entry → CME Invitation → Decision (Opened?) →
    - Yes → CME Module → Completed Attribution
    - No → LinkedIn Retargeting → Resend Email
- **Content:** 4 pre-mapped assets

**Technical Implementation:**
```typescript
interface JourneyTemplate {
  id: string;
  name: string;
  description: string;
  brand: string;
  audienceType: 'HCP' | 'PATIENT';
  segment: string;
  label: string;
  nodes: Node[];        // Pre-positioned nodes
  edges: Edge[];        // Pre-connected edges
}

const loadJourneyTemplate = (template: JourneyTemplate) => {
  setSelectedBrand(template.brand);
  setSelectedAudienceType(template.audienceType);
  setSelectedSegment(template.segment);
  setCampaignLabel(template.label);
  setNodes(template.nodes);
  setEdges(template.edges);
};
```

---

### 4. PERFORMANCE TRACKING & ANALYTICS

#### 4.1 Node-Level Metrics

**Business Functionality:**
- Real-time visibility into campaign performance
- Identify bottlenecks and drop-off points
- Optimize journey based on actual behavior

**Product Functionality:**
- Metrics overlay on each node in analytics mode
- Color-coded performance indicators
- Drill-down to detailed metrics

**Metrics by Node Type:**

**Email/Mobile/Paid Media Nodes:**
- `sent`: Total messages/ads delivered
- `delivered`: Successfully delivered (email only)
- `opened`: Unique opens
- `clicked`: Unique clicks
- `converted`: Conversion events attributed

**Example Display:**
```
Email Node (Sequence #2)
Sent: 1,247
Opened: 892 (71.5%)
Clicked: 234 (18.8%)
Converted: 45 (3.6%)
```

**Wait Nodes:**
- `entered`: Customers who reached wait
- `completed`: Customers who finished wait
- `inProgress`: Currently waiting
- `averageTimeSpent`: Average wait duration

**Decision Nodes:**
- `entered`: Customers evaluated
- `path_0`: Count taking first path
- `path_1`: Count taking second path
- `path_distribution`: Percentage breakdown

**Technical Data Model:**
```typescript
interface JourneyNodeMetrics {
  nodeId: string;
  entered: number;
  completed: number;
  inProgress: number;
  dropped: number;
  sent?: number;              // Email/Mobile/Paid
  delivered?: number;         // Email only
  opened?: number;            // Email/Mobile
  clicked?: number;           // All channels
  converted?: number;         // Attribution events
  averageTimeSpent?: number;  // Wait nodes (seconds)
}
```

---

#### 4.2 Edge Flow Visualization

**Business Functionality:**
- Visualize customer flow between touchpoints
- Identify high-drop-off transitions
- Understand journey momentum

**Product Functionality:**
- Animated edges in analytics mode
- Edge labels show flow volume
- Thickness proportional to volume

**Technical Implementation:**
```typescript
useEffect(() => {
  if (viewMode === 'analytics') {
    setEdges((eds) =>
      eds.map((edge) => {
        const targetMetrics = mockNodeMetrics[edge.target];
        if (targetMetrics?.entered) {
          return {
            ...edge,
            label: `${targetMetrics.entered.toLocaleString()} →`,
            animated: true,
          };
        }
        return edge;
      })
    );
  } else {
    // Remove labels in design mode
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        label: '',
        animated: false,
      }))
    );
  }
}, [viewMode, mockNodeMetrics]);
```

---

#### 4.3 Sequence Dashboard (Coming Feature)

**Business Functionality:**
- Aggregate view of all sequences in journey
- Compare sequence performance
- Identify optimal content by position

**Product Functionality:**
- Toggle to switch between canvas and dashboard view
- Table view with sequence-level KPIs
- Sortable by conversion rate, engagement, etc.

**Dashboard Columns:**
- Sequence # | Node Type | Content | Entered | Completed | Drop-off % | Open Rate | Click Rate | CVR

**Example:**
| Seq | Type | Content | Entered | Completed | Drop % | Open | Click | CVR |
|-----|------|---------|---------|-----------|--------|------|-------|-----|
| 1 | Entry | Journey Start | 1,500 | 1,247 | 16.9% | - | - | - |
| 2 | Email | HAWK Study | 1,247 | 892 | 28.5% | 71.5% | 18.8% | 3.6% |
| 3 | Wait | 48 hours | 892 | 623 | 30.2% | - | - | - |
| 4 | Decision | Opened? | 623 | 445 | 28.6% | - | - | - |

---

## Third-Party Paid Media Architecture

### Overview
The Journey Canvas must bridge **internal campaign design** with **external agency execution** while maintaining control, compliance, and measurement.

### Agency Model: CMI Media as Orchestrator

**Business Model:**
- Pharmaceutical brand (Regeneron) → CMI Media Agency → Vendor Platforms
- CMI Media acts as managed service layer
- Brand retains creative control and measurement ownership
- Agency handles platform execution and optimization

**Vendor Ecosystem:**
1. **Pulsepoint** - HCP programmatic display advertising
2. **Medscape** - Medical professional content network
3. **Epocrates** - Point-of-care mobile advertising
4. **Doximity** - Physician social network advertising

---

### Architecture Pattern: S3 File Drop System

**Why S3 File Drop?**
- **Decoupling:** Journey Canvas doesn't need direct API integration with 4+ vendor platforms
- **Security:** Agency receives sanitized file drops, not direct system access
- **Compliance:** File-based audit trail for regulatory review
- **Scalability:** Add new vendors without code changes
- **Standardization:** All vendors consume same file structure

**Flow Diagram:**
```
Journey Canvas (Design)
  ↓
Activation Trigger
  ↓
Export Service → S3 Bucket (Brand-Controlled)
  ↓
CMI Media Ingestion System (Polling/Event-Driven)
  ↓
CMI Media Campaign Management Platform
  ↓
Vendor Platform APIs (Pulsepoint, Medscape, Epocrates, Doximity)
  ↓
Execution → Impressions → Clicks → Conversions
  ↓
Vendor Reporting APIs
  ↓
CMI Media Aggregation
  ↓
S3 Bucket (Performance Files)
  ↓
Data Warehouse Ingestion
  ↓
Journey Canvas Analytics (Measurement Closes Loop)
```

---

### S3 Bucket Structure

**Outbound (Brand → Agency):**
```
s3://brandguard-cmi-outbound/
  ├── campaigns/
  │   └── {campaign_id}/
  │       ├── manifest.json
  │       ├── audience/
  │       │   ├── segment_export.csv
  │       │   └── suppression_list.csv
  │       ├── creative/
  │       │   ├── {content_id}_display_300x250.png
  │       │   ├── {content_id}_display_728x90.png
  │       │   └── {content_id}_metadata.json
  │       ├── targeting/
  │       │   └── targeting_rules.json
  │       └── tracking/
  │           └── tracking_parameters.json
```

**Inbound (Agency → Brand):**
```
s3://brandguard-cmi-inbound/
  ├── performance/
  │   └── {campaign_id}/
  │       ├── daily/
  │       │   └── {YYYY-MM-DD}/
  │       │       ├── pulsepoint_performance.csv
  │       │       ├── medscape_performance.csv
  │       │       ├── epocrates_performance.csv
  │       │       └── doximity_performance.csv
  │       └── events/
  │           └── {YYYY-MM-DD}/
  │               └── click_stream_{timestamp}.ndjson
```

---

### File Formats & Schemas

#### manifest.json (Campaign Metadata)
```json
{
  "campaign_id": "CMP-2024-001",
  "campaign_name": "Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch",
  "brand": "Eylea",
  "brand_id": "1",
  "audience_type": "HCP",
  "segment_id": "1",
  "segment_name": "Retina Specialists - High Volume",
  "start_date": "2024-11-15",
  "end_date": "2024-12-31",
  "budget": {
    "total_usd": 250000,
    "daily_cap_usd": 5000,
    "allocation": {
      "pulsepoint": 0.40,
      "medscape": 0.30,
      "epocrates": 0.20,
      "doximity": 0.10
    }
  },
  "sequences": [
    {
      "sequence_number": 5,
      "node_type": "paid-social",
      "content_id": "CNT-2024-0011",
      "content_title": "Eylea LinkedIn: Thought Leadership",
      "vendor": "doximity",
      "channel": "PAID_MEDIA",
      "asset_type": "PAID_SOCIAL_AD"
    },
    {
      "sequence_number": 7,
      "node_type": "paid-display",
      "content_id": "CNT-2024-0030",
      "content_title": "Eylea Medscape Banner: AMD Clinical Update",
      "vendor": "medscape",
      "channel": "PAID_MEDIA",
      "asset_type": "PAID_DISPLAY_AD"
    }
  ],
  "compliance": {
    "mlr_case_id": "MLR-2024-045",
    "approved_date": "2024-11-01",
    "approved_by": "Dr. Sarah Johnson",
    "claims_referenced": ["CLM-001", "CLM-002"],
    "indication": "Wet AMD"
  },
  "tracking": {
    "utm_source": "cmi_media",
    "utm_medium": "paid_display",
    "utm_campaign": "eylea_hcp_retina_q4_amd",
    "composite_key_template": "Eylea HCP Retina Q4/SEQ-{sequence}/{content_id}"
  }
}
```

#### segment_export.csv (Audience File)
**Format:** Hashed identifiers for HIPAA compliance
```csv
customer_id,email_hash,npi_number,specialty,institution_id,score,consent_email,consent_display
C-0001,a3f2e9...,1234567890,Retina,INST-001,85,true,true
C-0002,b8c4d1...,0987654321,Retina,INST-002,92,true,true
...
```

**HIPAA Compliance:**
- Email addresses hashed (SHA-256)
- No PHI (Protected Health Information)
- NPI numbers allowed (public registry)
- Consent flags included

#### targeting_rules.json
```json
{
  "geographic": {
    "countries": ["US"],
    "states": ["CA", "NY", "TX", "FL"],
    "dma_codes": ["501", "803"]
  },
  "demographic": {
    "specialties": ["Retina", "Comprehensive Ophthalmology"],
    "years_in_practice_min": 5,
    "practice_settings": ["Academic Medical Center", "Private Practice"]
  },
  "behavioral": {
    "recent_prescriber": true,
    "engagement_score_min": 70
  },
  "exclusions": {
    "suppress_if_clicked_last_30_days": true,
    "frequency_cap_per_day": 3,
    "frequency_cap_per_week": 10
  },
  "contextual": {
    "keywords_include": ["retina", "AMD", "macular degeneration"],
    "keywords_exclude": ["competitor_brand_1", "competitor_brand_2"],
    "brand_safety": "pharmaceutical_approved_publishers_only"
  }
}
```

#### tracking_parameters.json
```json
{
  "tracking_pixels": {
    "impression_pixel": "https://track.brandguard.com/imp?cid={campaign_id}&seq={sequence}&content={content_id}&vendor={vendor}",
    "click_pixel": "https://track.brandguard.com/click?cid={campaign_id}&seq={sequence}&content={content_id}&vendor={vendor}"
  },
  "utm_parameters": {
    "utm_source": "cmi_media",
    "utm_medium": "paid_display",
    "utm_campaign": "eylea_hcp_retina_q4_amd",
    "utm_content": "{content_id}",
    "utm_term": "SEQ-{sequence}"
  },
  "destination_urls": {
    "primary": "https://eylea-hcp.com/hawk-study?utm_source=cmi_media&utm_campaign=eylea_hcp_retina_q4_amd&utm_content={content_id}&utm_term=SEQ-{sequence}",
    "fallback": "https://eylea-hcp.com/"
  },
  "conversion_tracking": {
    "events": ["page_view", "form_submit", "video_play", "pdf_download"],
    "attribution_window_days": 30
  }
}
```

---

### Performance Data Return Format

#### pulsepoint_performance.csv
```csv
date,campaign_id,sequence,content_id,impressions,clicks,ctr,conversions,spend_usd,cpm,cpc,cpa
2024-11-15,CMP-2024-001,7,CNT-2024-0030,125000,892,0.71%,45,4250.00,34.00,4.76,94.44
2024-11-16,CMP-2024-001,7,CNT-2024-0030,118000,823,0.70%,41,4010.00,33.98,4.87,97.80
```

#### click_stream.ndjson (Event-Level Data)
```json
{"event_id":"evt_001","timestamp":"2024-11-15T14:23:45Z","campaign_id":"CMP-2024-001","sequence":7,"content_id":"CNT-2024-0030","vendor":"pulsepoint","event_type":"impression","customer_id_hash":"a3f2e9...","device_type":"desktop","ip_address":"192.0.2.1"}
{"event_id":"evt_002","timestamp":"2024-11-15T14:24:12Z","campaign_id":"CMP-2024-001","sequence":7,"content_id":"CNT-2024-0030","vendor":"pulsepoint","event_type":"click","customer_id_hash":"a3f2e9...","device_type":"desktop","landing_page":"https://eylea-hcp.com/hawk-study"}
```

---

### CMI Media Workflow (Agency Perspective)

**Step 1: Ingestion (Automated)**
- S3 event trigger or hourly polling
- Parse manifest.json
- Validate audience file (hash format, consent flags)
- Load creative assets
- Validate targeting rules

**Step 2: Campaign Setup**
- Map to vendor platforms:
  - Pulsepoint → DSP campaign creation
  - Medscape → Content network insertion order
  - Epocrates → Mobile ad campaign
  - Doximity → Social ad campaign
- Apply budget allocation from manifest
- Configure tracking pixels and UTMs
- Set frequency caps and brand safety rules

**Step 3: Audience Sync**
- Upload hashed audience to vendor match systems
- Vendors match hashes to their user graphs
- Match rates reported back (typically 40-70%)

**Step 4: Creative Upload**
- Upload display banners, native ads, video
- Associate creative with targeting rules
- A/B test variants if specified

**Step 5: Launch**
- Activate campaigns on start_date
- Monitor pacing against daily budget caps
- Real-time bid optimization

**Step 6: Performance Reporting**
- Daily aggregated files to S3 inbound bucket
- Real-time click stream to event pipeline
- Weekly summary reports

---

### Integration with Journey Canvas

**Export Trigger:**
```typescript
const activateJourney = async () => {
  // Mark journey as active
  setJourneyStatus('ACTIVE');

  // Generate campaign export for CMI Media
  const exportPayload = {
    campaign_id: journeyId,
    campaign_name: campaignName,
    brand: selectedBrand,
    audience_type: selectedAudienceType,
    segment_id: selectedSegment,
    nodes: enrichedNodes.filter(n =>
      ['paid-social', 'paid-search', 'paid-display', 'print', 'tv-radio', 'ooh']
        .includes(n.data.nodeType)
    ),
    // ... other metadata
  };

  // Call export service
  await fetch('/api/campaigns/export-to-s3', {
    method: 'POST',
    body: JSON.stringify(exportPayload),
  });
};
```

**Performance Ingestion:**
```typescript
// Scheduled job (runs hourly)
async function ingestCMIPerformance() {
  // List new files in S3 inbound bucket
  const newFiles = await s3.listObjects({
    Bucket: 'brandguard-cmi-inbound',
    Prefix: 'performance/',
  });

  for (const file of newFiles) {
    const data = await s3.getObject(file.Key);
    const records = parseCSV(data);

    // Upsert to data warehouse
    await warehouse.bulkInsert('paid_media_performance', records);
  }

  // Update journey canvas metrics cache
  await refreshJourneyMetrics();
}
```

---

## Sequence-Level Tracking Framework

### Business Rationale
Traditional campaign tracking measures overall performance but obscures **positional effects**. The same content may perform differently at sequence #2 vs. sequence #7. Sequence-level tracking enables:

1. **Position Optimization:** Determine ideal placement for each content type
2. **Journey Refinement:** Identify which sequences drive conversion
3. **Content Testing:** A/B test content at specific journey positions
4. **Attribution Accuracy:** Credit touchpoints based on journey contribution

---

### Composite Key Architecture

**Key Structure:**
```
{CampaignName}/SEQ-{SequenceNumber}/{ContentID}/{ContentVersion}
```

**Example:**
```
Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch/SEQ-3/CNT-2024-0011/v2
```

**Component Breakdown:**

| Component | Example | Purpose |
|-----------|---------|---------|
| CampaignName | Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch | Campaign context |
| SequenceNumber | 3 | Position in journey |
| ContentID | CNT-2024-0011 | Unique content identifier |
| ContentVersion | v2 | Version control for A/B tests |

**Why This Structure?**
- **Hierarchical:** Enables rollup reporting at campaign, sequence, or content level
- **Unique:** No collisions across journeys
- **Parseable:** Easy to extract components for analysis
- **Human-Readable:** Debugging and troubleshooting friendly

---

### Event Schema with Composite Key

**Base Event Structure:**
```json
{
  "event_id": "evt_a3f2e9d4c1b8",
  "event_type": "email_click",
  "timestamp": "2024-11-15T14:23:45.123Z",
  "customer_id": "C-123456",

  "journey_context": {
    "campaign_id": "CMP-2024-001",
    "campaign_name": "Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch",
    "sequence_number": 3,
    "content_id": "CNT-2024-0011",
    "content_version": "v2",
    "composite_key": "Eylea HCP Retina Q4/SEQ-3/CNT-2024-0011/v2"
  },

  "content_metadata": {
    "title": "Eylea LinkedIn: Thought Leadership",
    "asset_type": "PAID_SOCIAL_AD",
    "channel": "PAID_MEDIA",
    "brand": "Eylea",
    "audience_type": "HCP",
    "claims_referenced": ["CLM-001", "CLM-002"]
  },

  "customer_attributes": {
    "segment": "Retina Specialists - High Volume",
    "specialty": "Retina",
    "institution_type": "Academic Medical Center",
    "engagement_score": 85
  },

  "device_context": {
    "device_type": "desktop",
    "browser": "Chrome",
    "os": "Windows",
    "ip_address": "192.0.2.1",
    "user_agent": "Mozilla/5.0..."
  },

  "utm_parameters": {
    "utm_source": "cmi_media",
    "utm_medium": "paid_social",
    "utm_campaign": "eylea_hcp_retina_q4_amd",
    "utm_content": "CNT-2024-0011",
    "utm_term": "SEQ-3"
  }
}
```

---

### Sequence Tracking Table Schema (Data Warehouse)

**Table: `journey_sequence_performance`**
```sql
CREATE TABLE journey_sequence_performance (
  -- Composite key components
  campaign_id VARCHAR(50),
  campaign_name VARCHAR(500),
  sequence_number INTEGER,
  content_id VARCHAR(50),
  content_version VARCHAR(10),

  -- Date partition
  date DATE,

  -- Funnel metrics
  entered INTEGER,              -- Customers who reached this sequence
  completed INTEGER,            -- Customers who finished this sequence
  in_progress INTEGER,          -- Currently in sequence
  dropped INTEGER,              -- Exited without completing

  -- Channel-specific metrics
  sent INTEGER,                 -- Email/Mobile/Paid
  delivered INTEGER,            -- Email only
  opened INTEGER,               -- Email/Mobile
  clicked INTEGER,              -- All channels
  converted INTEGER,            -- Attribution events

  -- Engagement metrics
  avg_time_to_complete_sec INTEGER,
  bounce_rate DECIMAL(5,2),
  engagement_rate DECIMAL(5,2),

  -- Paid media metrics
  impressions BIGINT,
  spend_usd DECIMAL(12,2),
  cpm DECIMAL(8,2),
  cpc DECIMAL(8,2),
  cpa DECIMAL(8,2),

  -- Content metadata (denormalized for query performance)
  content_title VARCHAR(500),
  asset_type VARCHAR(50),
  channel VARCHAR(50),
  brand VARCHAR(100),
  audience_type VARCHAR(20),

  -- Timestamps
  updated_at TIMESTAMP,

  PRIMARY KEY (campaign_id, sequence_number, content_id, date)
);

-- Indexes for common query patterns
CREATE INDEX idx_campaign_date ON journey_sequence_performance(campaign_id, date);
CREATE INDEX idx_content_performance ON journey_sequence_performance(content_id, date);
CREATE INDEX idx_sequence_comparison ON journey_sequence_performance(sequence_number, channel, date);
```

---

### Query Patterns for Sequence Analysis

**Query 1: Sequence-Level Drop-Off Analysis**
```sql
-- Identify where customers drop out of journey
SELECT
  sequence_number,
  content_title,
  entered,
  completed,
  dropped,
  ROUND(100.0 * dropped / entered, 2) AS drop_off_rate,
  ROUND(100.0 * completed / LAG(completed) OVER (ORDER BY sequence_number), 2) AS retention_rate
FROM journey_sequence_performance
WHERE campaign_id = 'CMP-2024-001'
  AND date = CURRENT_DATE
ORDER BY sequence_number;
```

**Expected Output:**
| Seq | Content | Entered | Completed | Dropped | Drop % | Retention % |
|-----|---------|---------|-----------|---------|--------|-------------|
| 1 | Journey Start | 1,500 | 1,247 | 253 | 16.9% | - |
| 2 | HAWK Email | 1,247 | 892 | 355 | 28.5% | 71.5% |
| 3 | Wait 48h | 892 | 623 | 269 | 30.2% | 69.8% |
| 4 | Decision | 623 | 445 | 178 | 28.6% | 71.4% |
| 5 | LinkedIn Ad | 268 | 189 | 79 | 29.5% | 70.5% |

**Query 2: Content Performance by Position**
```sql
-- Compare same content at different sequence positions
SELECT
  sequence_number,
  campaign_name,
  content_title,
  clicked,
  entered,
  ROUND(100.0 * clicked / entered, 2) AS click_through_rate,
  ROUND(100.0 * converted / entered, 2) AS conversion_rate
FROM journey_sequence_performance
WHERE content_id = 'CNT-2024-0011'  -- LinkedIn Thought Leadership
  AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY sequence_number, campaign_name, content_title, clicked, entered, converted
ORDER BY conversion_rate DESC;
```

**Insight:** Discover if content performs better early (seq 2-3) vs. late (seq 7-8) in journey.

**Query 3: Optimal Sequence Structure**
```sql
-- Identify highest-performing sequence structures
WITH sequence_patterns AS (
  SELECT
    campaign_id,
    sequence_number,
    channel,
    LAG(channel) OVER (PARTITION BY campaign_id ORDER BY sequence_number) AS prev_channel,
    LEAD(channel) OVER (PARTITION BY campaign_id ORDER BY sequence_number) AS next_channel,
    ROUND(100.0 * converted / entered, 2) AS cvr
  FROM journey_sequence_performance
  WHERE date >= CURRENT_DATE - INTERVAL '90 days'
)
SELECT
  CONCAT(prev_channel, ' → ', channel, ' → ', next_channel) AS sequence_pattern,
  COUNT(*) AS occurrences,
  AVG(cvr) AS avg_conversion_rate,
  MAX(cvr) AS best_conversion_rate
FROM sequence_patterns
WHERE prev_channel IS NOT NULL
  AND next_channel IS NOT NULL
GROUP BY sequence_pattern
HAVING COUNT(*) >= 5
ORDER BY avg_conversion_rate DESC
LIMIT 10;
```

**Expected Output:**
| Pattern | Occurrences | Avg CVR | Best CVR |
|---------|-------------|---------|----------|
| EMAIL → PAID_SOCIAL → WEB | 12 | 8.5% | 12.3% |
| EMAIL → WAIT → EMAIL | 8 | 7.2% | 9.8% |
| PAID_DISPLAY → EMAIL → WEB | 6 | 6.9% | 8.1% |

---

### Sequence Assignment Algorithm (Revisited)

**Challenge:** Decision splits create multiple paths. How to assign sequences?

**Solution:** Breadth-First Search (BFS) from entry node

```typescript
// Sequence assignment with BFS
const nodeSequences = useMemo(() => {
  const sequences = new Map<string, number>();
  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; sequence: number }> = [];

  // Find entry node
  const entryNode = nodes.find((n) => n.data.nodeType === 'entry');
  if (entryNode) {
    queue.push({ nodeId: entryNode.id, sequence: 1 });
    visited.add(entryNode.id);
  }

  // BFS traversal
  while (queue.length > 0) {
    const { nodeId, sequence } = queue.shift()!;
    sequences.set(nodeId, sequence);

    // Find all outgoing edges
    const outgoingEdges = edges.filter((e) => e.source === nodeId);
    outgoingEdges.forEach((edge) => {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push({ nodeId: edge.target, sequence: sequence + 1 });
      }
    });
  }

  return sequences;
}, [nodes, edges]);
```

**Example Journey with Decision Split:**
```
SEQ-1: Entry
SEQ-2: Email (HAWK Study)
SEQ-3: Wait (48 hours)
SEQ-4: Decision (Email Opened?)
  ├─ Path A (Yes):
  │   SEQ-5: LinkedIn Ad
  │   SEQ-6: Retina Times Print Ad
  │   SEQ-7: Attribution Point
  └─ Path B (No):
      SEQ-5: Email Resend (same sequence number as LinkedIn!)
      SEQ-6: Retina Times Print Ad (same sequence number!)
      SEQ-7: Attribution Point (same sequence number!)
```

**Note:** Parallel paths have same sequence numbers. This is correct! Sequence represents "distance from entry" not absolute position.

---

### Event Tagging Implementation

**Client-Side (Web/Mobile):**
```javascript
// Injected by server-side rendering
const JOURNEY_CONTEXT = {
  campaign_id: 'CMP-2024-001',
  campaign_name: 'Eylea HCP Retina Q4',
  sequence_number: 5,
  content_id: 'CNT-2024-0030',
  content_version: 'v1',
  composite_key: 'Eylea HCP Retina Q4/SEQ-5/CNT-2024-0030/v1'
};

// Track page view
analytics.track('page_view', {
  ...JOURNEY_CONTEXT,
  page_url: window.location.href,
  referrer: document.referrer,
});

// Track button click
document.getElementById('cta-button').addEventListener('click', () => {
  analytics.track('cta_click', {
    ...JOURNEY_CONTEXT,
    cta_text: 'Download HAWK Study',
  });
});
```

**Email (Tracking Pixel):**
```html
<!-- Embedded in email HTML -->
<img src="https://track.brandguard.com/open?composite_key=Eylea HCP Retina Q4/SEQ-2/CNT-2024-0001/v1&customer_id={{customer_id}}" width="1" height="1" />

<!-- Link tracking -->
<a href="https://track.brandguard.com/click?composite_key=Eylea HCP Retina Q4/SEQ-2/CNT-2024-0001/v1&customer_id={{customer_id}}&destination=https://eylea-hcp.com/hawk-study">
  Read HAWK Study Results →
</a>
```

**Paid Media (UTM Parameters):**
```
Destination URL:
https://eylea-hcp.com/hawk-study?
  utm_source=cmi_media&
  utm_medium=paid_display&
  utm_campaign=eylea_hcp_retina_q4_amd&
  utm_content=CNT-2024-0030&
  utm_term=SEQ-7
```

**Server-Side Enrichment:**
```python
def enrich_event(raw_event):
    """Enrich event with journey context"""

    # Parse composite key from UTM or tracking param
    composite_key = raw_event.get('utm_term') or raw_event.get('composite_key')

    if composite_key:
        parts = composite_key.split('/')
        campaign_name = parts[0]
        sequence = int(parts[1].replace('SEQ-', ''))
        content_id = parts[2]
        version = parts[3] if len(parts) > 3 else 'v1'

    # Lookup campaign metadata
    campaign = db.query('campaigns').where('name', campaign_name).first()

    # Lookup content metadata
    content = db.query('content_assets').where('id', content_id).first()

    # Enrich event
    enriched = {
        **raw_event,
        'journey_context': {
            'campaign_id': campaign['id'],
            'campaign_name': campaign_name,
            'sequence_number': sequence,
            'content_id': content_id,
            'content_version': version,
            'composite_key': composite_key,
        },
        'content_metadata': {
            'title': content['title'],
            'asset_type': content['asset_type'],
            'channel': content['channel'],
            'claims_referenced': content['linked_claim_ids'],
        },
        'campaign_metadata': {
            'brand': campaign['brand'],
            'audience_type': campaign['audience_type'],
            'segment': campaign['segment'],
        }
    }

    return enriched
```

---

## Data Cloud Segmentation Integration

### Data Cloud Architecture

**Purpose:** Salesforce Data Cloud serves as the **Customer Data Platform (CDP)** unifying customer identities, attributes, and behaviors across all touchpoints.

**Core Capabilities:**
1. **Identity Resolution:** Link fragmented customer records into unified profiles
2. **Real-Time Activation:** Segment audiences and activate to execution systems
3. **Behavioral Tracking:** Capture and store event stream (web, email, mobile, CRM)
4. **Calculated Insights:** Derive engagement scores, propensity models, RFM analysis

---

### Identity Resolution Flow

**Data Sources:**
- Salesforce Sales Cloud (CRM records)
- Marketing Cloud (email engagement)
- Web Analytics (Google Analytics, Adobe)
- Mobile Apps (Braze SDK)
- Paid Media Platforms (click stream from CMI Media)
- Data Warehouse (historical interactions)

**Matching Strategy:**

**Tier 1: Deterministic Matching (100% Precision)**
- Email address (exact match)
- NPI number (HCP only)
- Customer ID (known customers)
- Phone number (mobile opt-in)

**Tier 2: Probabilistic Matching (90%+ Precision)**
- Name + ZIP + Specialty (HCP)
- Name + Address + DOB (Patient - HIPAA compliant)
- Device fingerprint + behavioral signals

**Identity Graph Structure:**
```
Unified Customer Profile: C-123456
├── Identifiers:
│   ├── Email: john.doe@example.com
│   ├── Email Hash: a3f2e9d4c1b8...
│   ├── NPI: 1234567890
│   ├── Phone: +1-555-123-4567
│   ├── Customer ID: C-123456
│   └── Device IDs: [device_abc, device_xyz]
├── Attributes:
│   ├── Name: Dr. John Doe
│   ├── Specialty: Retina
│   ├── Institution: University Hospital
│   ├── Years in Practice: 15
│   ├── State: CA
│   └── Engagement Score: 85
└── Behaviors:
    ├── Last Email Open: 2024-11-14
    ├── Website Visits (30d): 5
    ├── Content Downloads: 3
    ├── Webinar Attendance: 2
    └── Prescription Volume: High
```

---

### Segment Definition in Data Cloud

**Segment Builder UI:**
- Drag-and-drop interface for business users
- Real-time size estimation
- Export to activation targets (Marketing Cloud, journey Canvas, paid media)

**Example Segment: "High-Engagement Retina Specialists"**

**SQL Translation:**
```sql
SELECT DISTINCT customer_id
FROM unified_customer_profile
WHERE
  -- Demographic criteria
  specialty = 'Retina'
  AND years_in_practice >= 5
  AND state IN ('CA', 'NY', 'TX', 'FL', 'IL')

  -- Behavioral criteria (last 90 days)
  AND (
    SELECT COUNT(*)
    FROM email_events
    WHERE customer_id = unified_customer_profile.customer_id
      AND event_type = 'email_open'
      AND timestamp >= CURRENT_DATE - INTERVAL '90 days'
  ) >= 3

  -- Engagement score threshold
  AND engagement_score >= 70

  -- Consent check
  AND consent_email = TRUE
  AND opt_out_date IS NULL

  -- Exclusions
  AND customer_id NOT IN (
    SELECT customer_id
    FROM campaign_history
    WHERE campaign_id = 'CMP-2024-001'  -- Exclude already targeted
  )
```

**Segment Metadata:**
- **Name:** High-Engagement Retina Specialists
- **Type:** BEHAVIORAL
- **Estimated Count:** 1,245
- **Last Refreshed:** 2024-11-15 08:00 UTC
- **Refresh Frequency:** Daily at 06:00 UTC
- **Data Sources:** Salesforce CRM + Email Engagement + Web Analytics

---

### Segment Activation to Journey Canvas

**Activation Flow:**
```
Data Cloud Segment
  ↓ (API Export)
Segment Materialization Service
  ↓ (Customer ID List)
Journey Orchestration Engine
  ↓ (Entry Trigger)
Journey Canvas Execution
  ↓ (Touchpoint Delivery)
Customer Receives Content
  ↓ (Event Tracking)
Data Cloud Event Ingestion
  ↓ (Profile Update)
Segment Re-Evaluation (Real-Time)
```

**API Integration:**
```typescript
// Journey Canvas calls Data Cloud API on activation
async function activateJourneyWithSegment(journeyId: string, segmentId: string) {
  // 1. Export segment from Data Cloud
  const segmentExport = await dataCloudAPI.exportSegment({
    segment_id: segmentId,
    format: 'csv',
    fields: ['customer_id', 'email', 'npi', 'engagement_score'],
    include_consent_flags: true,
  });

  // 2. Upload to journey orchestration engine
  const audienceUpload = await orchestrationEngine.uploadAudience({
    journey_id: journeyId,
    audience_file: segmentExport.download_url,
    entry_trigger: 'immediate',
  });

  // 3. Start journey execution
  await orchestrationEngine.activateJourney({
    journey_id: journeyId,
    audience_id: audienceUpload.audience_id,
  });

  return {
    status: 'activated',
    audience_size: audienceUpload.total_records,
    estimated_completion: audienceUpload.estimated_completion_date,
  };
}
```

---

### Real-Time Segment Updates

**Challenge:** Customer behavior changes during journey execution. Should segment membership update in real-time?

**Solution: Hybrid Approach**

**Entry Snapshot (Static):**
- When journey activates, segment membership is captured as snapshot
- Customers who enter journey continue even if they exit segment
- Ensures consistent journey experience

**Re-Qualification (Dynamic):**
- Optional "re-qualification gates" at decision points
- Example: "Only continue if engagement score > 80"
- Allows dynamic routing based on real-time behavior

**Implementation:**
```typescript
// Decision node with real-time segment check
interface DecisionConfig {
  criterion: 'segment_membership_check';
  segment_id: string;
  paths: [
    { label: 'In Segment', value: 'yes' },
    { label: 'Not in Segment', value: 'no' }
  ];
}

// At decision evaluation time
async function evaluateDecision(customerId: string, config: DecisionConfig) {
  const currentSegments = await dataCloudAPI.getCustomerSegments(customerId);
  const isInSegment = currentSegments.includes(config.segment_id);

  return isInSegment ? 'yes' : 'no';
}
```

---

## S3 File Drop Architecture (4C Framework)

### Overview
The S3 file drop system enables seamless handoff between internal Campaign OS and external agency partners while maintaining compliance audit trails.

### 4C Framework: Customer, Channel, Content, Cadence

**Philosophy:** Every file drop contains the four essential dimensions for campaign execution.

---

### 4C Metadata Structure

#### 1. CUSTOMER (Audience)
**What:** Who should receive this campaign?

**File:** `customer_export.csv`
```csv
customer_id,email_hash,npi,specialty,institution,state,engagement_score,consent_email,consent_display,consent_mobile
C-0001,hash1,1234567890,Retina,Academic Med Ctr,CA,85,true,true,false
C-0002,hash2,0987654321,Retina,Private Practice,NY,92,true,true,true
```

**Metadata Fields:**
- `customer_id`: Internal unique identifier
- `email_hash`: SHA-256 hashed email (HIPAA compliance)
- `npi`: National Provider Identifier (HCP only)
- `specialty`: Medical specialty
- `institution`: Practice/hospital affiliation
- `state`: Geographic location
- `engagement_score`: Behavioral score (0-100)
- `consent_*`: Channel-specific consent flags

**HIPAA Compliance:**
- No plaintext emails or PHI in files
- Hashed identifiers for matching
- Consent flags prevent unauthorized contact

---

#### 2. CHANNEL (Where to Execute)
**What:** Which platforms should execute this campaign?

**File:** `channel_config.json`
```json
{
  "channels": [
    {
      "channel_type": "PAID_DISPLAY",
      "vendor": "pulsepoint",
      "enabled": true,
      "budget_allocation_pct": 40,
      "priority": 1,
      "configuration": {
        "ad_formats": ["300x250", "728x90", "160x600"],
        "placement_types": ["desktop_web", "mobile_web"],
        "targeting_strategy": "contextual_and_behavioral"
      }
    },
    {
      "channel_type": "PAID_DISPLAY",
      "vendor": "medscape",
      "enabled": true,
      "budget_allocation_pct": 30,
      "priority": 2,
      "configuration": {
        "content_types": ["native_article", "display_banner"],
        "sections": ["ophthalmology", "retina"],
        "device_targeting": ["all"]
      }
    },
    {
      "channel_type": "PAID_SOCIAL",
      "vendor": "doximity",
      "enabled": true,
      "budget_allocation_pct": 20,
      "priority": 3,
      "configuration": {
        "ad_types": ["sponsored_post", "carousel"],
        "feed_placement": true,
        "messaging_placement": false
      }
    },
    {
      "channel_type": "PAID_MOBILE",
      "vendor": "epocrates",
      "enabled": true,
      "budget_allocation_pct": 10,
      "priority": 4,
      "configuration": {
        "placement": "drug_search_results",
        "ad_format": "interstitial",
        "frequency_cap_per_day": 2
      }
    }
  ],
  "cross_channel_rules": {
    "frequency_cap_total_per_week": 15,
    "minimum_hours_between_impressions": 12,
    "suppress_if_clicked_any_channel_last_7_days": true
  }
}
```

---

#### 3. CONTENT (What to Show)
**What:** Creative assets and messaging for each touchpoint

**File Structure:**
```
content/
├── sequence_2_email/
│   ├── creative.html
│   ├── subject_line.txt
│   ├── preheader.txt
│   └── metadata.json
├── sequence_5_paid_social/
│   ├── image_1200x628.png
│   ├── carousel_slide_1.png
│   ├── carousel_slide_2.png
│   ├── carousel_slide_3.png
│   ├── ad_copy.txt
│   └── metadata.json
├── sequence_7_paid_display/
│   ├── banner_300x250.png
│   ├── banner_728x90.png
│   ├── banner_160x600.png
│   ├── banner_300x600.png
│   └── metadata.json
└── sequence_9_mobile/
    ├── interstitial_320x480.png
    ├── interstitial_768x1024.png
    └── metadata.json
```

**Content Metadata (`metadata.json`):**
```json
{
  "content_id": "CNT-2024-0030",
  "content_title": "Eylea Medscape Banner: AMD Clinical Update",
  "asset_type": "PAID_DISPLAY_AD",
  "channel": "PAID_MEDIA",
  "sequence_number": 7,
  "brand": "Eylea",
  "indication": "Wet AMD",
  "claims_referenced": ["CLM-001", "CLM-002"],
  "mlr_approval": {
    "case_id": "MLR-2024-045",
    "approved_date": "2024-11-01",
    "approved_by": "Dr. Sarah Johnson",
    "expiry_date": "2025-11-01"
  },
  "creative_specs": {
    "formats": [
      {"size": "300x250", "file": "banner_300x250.png", "weight_kb": 45},
      {"size": "728x90", "file": "banner_728x90.png", "weight_kb": 32},
      {"size": "160x600", "file": "banner_160x600.png", "weight_kb": 50}
    ],
    "file_types_allowed": ["png", "jpg", "gif"],
    "max_file_size_kb": 150,
    "animation_allowed": false
  },
  "messaging": {
    "headline": "HAWK Study: Proven Efficacy in Wet AMD",
    "body": "Eylea demonstrated superior visual acuity outcomes in the HAWK trial. Learn more about the latest clinical data.",
    "cta_text": "Read Study Results",
    "cta_url": "https://eylea-hcp.com/hawk-study"
  },
  "tracking": {
    "composite_key": "Eylea HCP Retina Q4/SEQ-7/CNT-2024-0030/v1",
    "utm_source": "cmi_media",
    "utm_medium": "paid_display",
    "utm_campaign": "eylea_hcp_retina_q4_amd",
    "utm_content": "CNT-2024-0030",
    "utm_term": "SEQ-7",
    "impression_pixel": "https://track.brandguard.com/imp?composite_key=Eylea HCP Retina Q4/SEQ-7/CNT-2024-0030/v1",
    "click_redirect": "https://track.brandguard.com/click?composite_key=Eylea HCP Retina Q4/SEQ-7/CNT-2024-0030/v1&dest="
  }
}
```

---

#### 4. CADENCE (When to Execute)
**What:** Timing, pacing, and scheduling rules

**File:** `cadence_config.json`
```json
{
  "journey_timing": {
    "start_date": "2024-11-15",
    "end_date": "2024-12-31",
    "timezone": "America/New_York",
    "immediate_activation": false,
    "warm_up_period_days": 3
  },

  "sequence_timing": [
    {
      "sequence_number": 1,
      "node_type": "entry",
      "execution_timing": "immediate"
    },
    {
      "sequence_number": 2,
      "node_type": "email",
      "execution_timing": "immediate_after_entry",
      "send_window": {
        "days_of_week": ["monday", "tuesday", "wednesday", "thursday"],
        "hours_utc": [13, 14, 15, 16, 17],  // 8am-12pm EST
        "exclude_holidays": true
      }
    },
    {
      "sequence_number": 3,
      "node_type": "wait",
      "wait_config": {
        "type": "time",
        "duration": 48,
        "duration_unit": "hours"
      }
    },
    {
      "sequence_number": 4,
      "node_type": "decision",
      "evaluation_timing": "real_time",
      "criterion": "email_opened"
    },
    {
      "sequence_number": 5,
      "node_type": "paid-social",
      "execution_timing": "continuous",
      "duration_days": 14,
      "pacing_strategy": "even",
      "dayparting": {
        "enabled": true,
        "hours_utc": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],  // Business hours + evening
        "bid_multipliers": {
          "peak_hours": [14, 15, 16, 17],  // 9am-12pm EST
          "multiplier": 1.2
        }
      }
    },
    {
      "sequence_number": 7,
      "node_type": "paid-display",
      "execution_timing": "continuous",
      "duration_days": 21,
      "pacing_strategy": "accelerated_then_even",
      "budget_pacing": {
        "week_1_pct": 40,
        "week_2_pct": 35,
        "week_3_pct": 25
      }
    }
  ],

  "frequency_management": {
    "global_cap_per_customer": {
      "impressions_per_day": 5,
      "impressions_per_week": 15,
      "impressions_per_month": 40
    },
    "channel_specific_caps": {
      "email": {
        "sends_per_week": 2,
        "sends_per_month": 6
      },
      "paid_display": {
        "impressions_per_day": 3,
        "impressions_per_week": 10
      },
      "paid_social": {
        "impressions_per_day": 2,
        "impressions_per_week": 8
      }
    },
    "cross_channel_rules": {
      "minimum_hours_between_any_touchpoint": 12,
      "suppress_all_if_converted": true,
      "suppress_duration_after_conversion_days": 30
    }
  },

  "budget_pacing": {
    "total_budget_usd": 250000,
    "daily_budget_cap_usd": 5000,
    "pacing_algorithm": "even_with_optimization",
    "allow_overspend_pct": 10,
    "pause_if_underspending_by_pct": 30
  }
}
```

---

### Complete S3 Drop Package Structure

**Root Directory:**
```
s3://brandguard-cmi-outbound/campaigns/CMP-2024-001/drop_2024-11-15_v1/
│
├── manifest.json                    # Package manifest and validation
├── README.md                        # Human-readable instructions
│
├── 1_CUSTOMER/
│   ├── customer_export.csv          # Audience list with consent
│   ├── suppression_list.csv         # Global suppression
│   └── customer_metadata.json       # Segment definition
│
├── 2_CHANNEL/
│   ├── channel_config.json          # Vendor and platform configuration
│   └── targeting_rules.json         # Contextual and behavioral targeting
│
├── 3_CONTENT/
│   ├── sequence_2_email/
│   ├── sequence_5_paid_social/
│   ├── sequence_7_paid_display/
│   ├── sequence_9_mobile/
│   └── global_assets/
│       ├── logo.png
│       ├── brand_guidelines.pdf
│       └── legal_disclaimers.txt
│
├── 4_CADENCE/
│   ├── cadence_config.json          # Timing and pacing rules
│   ├── send_schedule.json           # Sequence execution schedule
│   └── frequency_caps.json          # Cross-channel frequency management
│
└── COMPLIANCE/
    ├── mlr_approval_certificates/
    │   ├── MLR-2024-045.pdf
    │   └── approval_signatures.json
    ├── claim_substantiation/
    │   ├── CLM-001_evidence.pdf
    │   └── CLM-002_evidence.pdf
    └── regulatory_checklist.json
```

---

### Manifest File Structure

**`manifest.json` (Package Index):**
```json
{
  "package_metadata": {
    "package_id": "PKG-2024-001-v1",
    "created_date": "2024-11-15T10:00:00Z",
    "created_by": "system@brandguard.com",
    "campaign_id": "CMP-2024-001",
    "campaign_name": "Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch",
    "version": "1.0",
    "expiry_date": "2025-01-15",
    "package_status": "ready_for_ingestion"
  },

  "4c_summary": {
    "customer": {
      "total_records": 1245,
      "file": "1_CUSTOMER/customer_export.csv",
      "checksum_sha256": "a3f2e9d4c1b8...",
      "consent_validated": true,
      "suppression_applied": true
    },
    "channel": {
      "vendors": ["pulsepoint", "medscape", "epocrates", "doximity"],
      "file": "2_CHANNEL/channel_config.json",
      "checksum_sha256": "b8c4d1f5a2e9..."
    },
    "content": {
      "total_sequences": 4,
      "total_assets": 23,
      "directory": "3_CONTENT/",
      "mlr_approved": true,
      "expiry_date": "2025-11-01"
    },
    "cadence": {
      "start_date": "2024-11-15",
      "end_date": "2024-12-31",
      "file": "4_CADENCE/cadence_config.json",
      "checksum_sha256": "c7d2e8f3a1b9..."
    }
  },

  "validation": {
    "schema_version": "2.0",
    "validation_timestamp": "2024-11-15T09:55:00Z",
    "validation_status": "passed",
    "errors": [],
    "warnings": [
      "customer_export.csv: 12 records excluded due to missing consent"
    ]
  },

  "ingestion_instructions": {
    "ingestion_deadline": "2024-11-16T00:00:00Z",
    "priority": "high",
    "notification_email": "ops@cmi-media.com",
    "approval_required_before_activation": true
  }
}
```

---

### CMI Media Ingestion Workflow

**Step 1: Package Discovery**
```python
# S3 Event-Driven Ingestion (Lambda/Cloud Function)
import boto3
import json

s3 = boto3.client('s3')

def lambda_handler(event, context):
    """Triggered when new package uploaded to S3"""

    # Parse S3 event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    # Download manifest
    manifest_obj = s3.get_object(Bucket=bucket, Key=f"{key}/manifest.json")
    manifest = json.loads(manifest_obj['Body'].read())

    # Validate package
    validation_result = validate_package(manifest, bucket, key)

    if validation_result['status'] == 'valid':
        # Queue for ingestion
        send_to_ingestion_queue(manifest, bucket, key)
        notify_ops_team('New package ready', manifest['package_metadata'])
    else:
        # Reject and notify
        reject_package(validation_result['errors'])
        notify_brand_team('Package validation failed', validation_result)
```

**Step 2: 4C Ingestion**
```python
def ingest_package(bucket, package_path, manifest):
    """Ingest 4C components into campaign management system"""

    # 1. CUSTOMER: Load audience
    customer_file = download_s3_file(bucket, f"{package_path}/1_CUSTOMER/customer_export.csv")
    audience_id = upload_audience_to_dsp(
        customer_file,
        consent_validated=manifest['4c_summary']['customer']['consent_validated']
    )

    # 2. CHANNEL: Configure vendor platforms
    channel_config = download_json(bucket, f"{package_path}/2_CHANNEL/channel_config.json")
    platform_configs = {}

    for channel in channel_config['channels']:
        if channel['vendor'] == 'pulsepoint':
            platform_configs['pulsepoint'] = create_pulsepoint_campaign(
                audience_id, channel['configuration']
            )
        elif channel['vendor'] == 'medscape':
            platform_configs['medscape'] = create_medscape_insertion_order(
                audience_id, channel['configuration']
            )
        # ... other vendors

    # 3. CONTENT: Upload creative assets
    content_dir = f"{package_path}/3_CONTENT/"
    creative_ids = {}

    for sequence_folder in list_s3_folders(bucket, content_dir):
        metadata = download_json(bucket, f"{sequence_folder}/metadata.json")
        creatives = download_creative_files(bucket, sequence_folder)

        creative_ids[metadata['sequence_number']] = upload_creatives_to_vendors(
            creatives, platform_configs, metadata['tracking']
        )

    # 4. CADENCE: Configure scheduling
    cadence_config = download_json(bucket, f"{package_path}/4_CADENCE/cadence_config.json")

    for sequence in cadence_config['sequence_timing']:
        platform = platform_configs[get_vendor_for_sequence(sequence)]
        configure_sequence_timing(platform, sequence, cadence_config['frequency_management'])

    return {
        'audience_id': audience_id,
        'platform_configs': platform_configs,
        'creative_ids': creative_ids,
        'ingestion_status': 'complete',
        'ready_for_activation': True
    }
```

**Step 3: Activation Approval**
```python
def request_activation_approval(campaign_data):
    """Require human approval before launch"""

    # Generate preview dashboard
    preview_url = generate_campaign_preview(campaign_data)

    # Send approval request
    send_email(
        to='ops-manager@cmi-media.com',
        subject=f"Approval Required: {campaign_data['campaign_name']}",
        body=f"""
        Campaign ready for activation:

        Campaign: {campaign_data['campaign_name']}
        Audience Size: {campaign_data['audience_size']:,}
        Budget: ${campaign_data['total_budget']:,}
        Start Date: {campaign_data['start_date']}

        Vendors: {', '.join(campaign_data['vendors'])}

        Preview: {preview_url}

        Click to approve: {approval_link}
        """,
    )

    # Wait for approval (async)
    approval_status = await_approval(campaign_data['campaign_id'], timeout_hours=24)

    if approval_status == 'approved':
        activate_campaign(campaign_data)
    else:
        notify_brand_team('Activation rejected', approval_status['reason'])
```

---

## Content Tracking Across Sequences

### Multi-Sequence Tracking Challenge

**Scenario:** Customer encounters same content at multiple positions in journey. How to attribute impact?

**Example Journey:**
- SEQ-2: Email (HAWK Study) → Customer ignores
- SEQ-5: LinkedIn Ad (HAWK Study) → Customer clicks
- SEQ-8: Email Resend (HAWK Study) → Customer converts

**Question:** Which touchpoint gets credit for conversion?

---

### Attribution Models

**1. Last-Touch Attribution**
- SEQ-8 (Email Resend) gets 100% credit
- **Pro:** Simple, clear accountability
- **Con:** Ignores influence of earlier touches

**2. First-Touch Attribution**
- SEQ-2 (Initial Email) gets 100% credit
- **Pro:** Values top-of-funnel awareness
- **Con:** Doesn't reflect nurturing impact

**3. Linear Attribution**
- SEQ-2: 33.3%, SEQ-5: 33.3%, SEQ-8: 33.3%
- **Pro:** Recognizes all touchpoints
- **Con:** Doesn't differentiate impact

**4. Time-Decay Attribution**
- SEQ-2: 20%, SEQ-5: 30%, SEQ-8: 50%
- **Pro:** Values recency while acknowledging earlier touches
- **Con:** Arbitrary decay function

**5. Data-Driven Attribution (Recommended)**
- ML model learns contribution of each position
- SEQ-2: 15% (awareness), SEQ-5: 45% (consideration), SEQ-8: 40% (conversion)
- **Pro:** Reflects actual behavior patterns
- **Con:** Requires significant data volume

---

### Event-Level Tracking with Sequence Context

**Event Schema (Extended):**
```json
{
  "event_id": "evt_abc123",
  "event_type": "conversion",
  "timestamp": "2024-11-20T15:45:00Z",
  "customer_id": "C-123456",

  "current_touchpoint": {
    "campaign_id": "CMP-2024-001",
    "sequence_number": 8,
    "content_id": "CNT-2024-0001",
    "content_version": "v2",
    "node_type": "email",
    "composite_key": "Eylea HCP Retina Q4/SEQ-8/CNT-2024-0001/v2"
  },

  "journey_history": [
    {
      "sequence_number": 2,
      "content_id": "CNT-2024-0001",
      "content_version": "v1",
      "timestamp": "2024-11-15T10:00:00Z",
      "event_type": "email_sent",
      "engaged": false
    },
    {
      "sequence_number": 5,
      "content_id": "CNT-2024-0011",
      "content_version": "v1",
      "timestamp": "2024-11-18T14:30:00Z",
      "event_type": "ad_click",
      "engaged": true
    },
    {
      "sequence_number": 8,
      "content_id": "CNT-2024-0001",
      "content_version": "v2",
      "timestamp": "2024-11-20T15:30:00Z",
      "event_type": "email_click",
      "engaged": true
    }
  ],

  "attribution": {
    "model": "data_driven",
    "contributions": [
      {"sequence": 2, "content": "CNT-2024-0001", "credit_pct": 15},
      {"sequence": 5, "content": "CNT-2024-0011", "credit_pct": 45},
      {"sequence": 8, "content": "CNT-2024-0001", "credit_pct": 40}
    ]
  }
}
```

---

### Sequence Interaction Matrix

**Purpose:** Understand how sequences influence each other

**Table: `sequence_interaction_matrix`**
```sql
CREATE TABLE sequence_interaction_matrix (
  campaign_id VARCHAR(50),
  sequence_a INTEGER,            -- Earlier sequence
  sequence_b INTEGER,            -- Later sequence
  interaction_count INTEGER,     -- Customers who saw both
  conversion_rate_both DECIMAL(5,2),
  conversion_rate_a_only DECIMAL(5,2),
  conversion_rate_b_only DECIMAL(5,2),
  lift DECIMAL(5,2),             -- Incremental impact of B given A
  date DATE,
  PRIMARY KEY (campaign_id, sequence_a, sequence_b, date)
);
```

**Query: Sequence Lift Analysis**
```sql
-- Calculate incremental lift of sequence B given prior exposure to A
SELECT
  sequence_a,
  sequence_b,
  interaction_count,
  conversion_rate_both,
  conversion_rate_b_only,
  ROUND(100.0 * (conversion_rate_both - conversion_rate_b_only) / conversion_rate_b_only, 2) AS lift_pct
FROM sequence_interaction_matrix
WHERE campaign_id = 'CMP-2024-001'
  AND date = CURRENT_DATE
ORDER BY lift_pct DESC;
```

**Example Output:**
| Seq A | Seq B | Interactions | CVR Both | CVR B Only | Lift % |
|-------|-------|--------------|----------|------------|--------|
| 2 | 5 | 892 | 8.2% | 4.5% | +82% |
| 5 | 8 | 445 | 12.1% | 6.3% | +92% |
| 2 | 8 | 623 | 6.8% | 5.1% | +33% |

**Insight:** SEQ-5 (LinkedIn Ad) provides +82% lift when customer previously saw SEQ-2 (Email). Strong synergy!

---

### Content Version Tracking

**Challenge:** Same content evolves over time. How to track version performance?

**Versioning Strategy:**
- **Major Version:** Substantial change requiring MLR re-review (v1 → v2)
- **Minor Version:** Cosmetic/copy tweaks, no MLR required (v2.0 → v2.1)

**Event Tracking with Version:**
```typescript
interface ContentTracking {
  content_id: string;           // CNT-2024-0001 (immutable)
  content_version: string;      // v2.1 (changes over time)
  mlr_case_id: string;          // MLR-2024-045 (major version only)
  effective_from: Date;         // Version activation date
  effective_to?: Date;          // Version expiry (if replaced)
}
```

**Version Comparison Query:**
```sql
-- Compare performance of content versions at same sequence position
SELECT
  content_id,
  content_version,
  sequence_number,
  SUM(entered) AS total_entered,
  SUM(clicked) AS total_clicked,
  ROUND(100.0 * SUM(clicked) / SUM(entered), 2) AS ctr,
  ROUND(100.0 * SUM(converted) / SUM(entered), 2) AS cvr,
  AVG(spend_usd) AS avg_spend
FROM journey_sequence_performance
WHERE content_id = 'CNT-2024-0001'
  AND sequence_number = 2
GROUP BY content_id, content_version, sequence_number
ORDER BY cvr DESC;
```

**Example Output:**
| Content | Version | Seq | Entered | Clicked | CTR | CVR | Spend |
|---------|---------|-----|---------|---------|-----|-----|-------|
| CNT-2024-0001 | v2.1 | 2 | 1,500 | 892 | 59.5% | 8.2% | $1,250 |
| CNT-2024-0001 | v2.0 | 2 | 1,200 | 623 | 51.9% | 6.1% | $1,100 |
| CNT-2024-0001 | v1.0 | 2 | 1,000 | 445 | 44.5% | 4.8% | $1,050 |

**Insight:** v2.1 delivers +33% higher CVR than v2.0 at SEQ-2. Promote v2.1 to other campaigns!

---

## Technical Implementation Guide

### Backend Services Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Journey Canvas UI (React)                 │
│  - Visual journey builder                                    │
│  - Content library browser                                   │
│  - Analytics dashboards                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway (GraphQL/REST)                  │
│  - Authentication (OAuth 2.0)                                │
│  - Rate limiting                                             │
│  - Request validation                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
       ┌─────────┴──────────┬──────────────┬─────────────┐
       ▼                    ▼              ▼             ▼
┌──────────────┐  ┌──────────────┐  ┌───────────┐  ┌────────────┐
│ Journey Mgmt │  │ Content Svc  │  │ Segment   │  │ Analytics  │
│ Service      │  │              │  │ Service   │  │ Service    │
│              │  │              │  │           │  │            │
│ - CRUD ops   │  │ - MLR check  │  │ - Data    │  │ - Metrics  │
│ - Validation │  │ - Expiry     │  │   Cloud   │  │ - Reports  │
│ - Versioning │  │ - ClaimID    │  │   API     │  │ - Export   │
└──────┬───────┘  └──────┬───────┘  └─────┬─────┘  └──────┬─────┘
       │                  │                │                │
       └──────────────────┴────────────────┴────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Data Warehouse      │
              │   (Snowflake/BigQuery)│
              │                       │
              │   - campaigns         │
              │   - journey_sequences │
              │   - content_assets    │
              │   - events            │
              └───────────────────────┘
```

---

### Database Schema (Relational)

**Table: `campaigns`**
```sql
CREATE TABLE campaigns (
  campaign_id VARCHAR(50) PRIMARY KEY,
  campaign_name VARCHAR(500) NOT NULL,
  brand_id VARCHAR(50) NOT NULL,
  brand_name VARCHAR(100),
  audience_type VARCHAR(20),          -- HCP, PATIENT
  segment_id VARCHAR(50),
  segment_name VARCHAR(500),
  campaign_label VARCHAR(200),
  status VARCHAR(20),                 -- DESIGN, REVIEW, APPROVED, ACTIVE, PAUSED, COMPLETE
  start_date DATE,
  end_date DATE,
  created_by VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,

  CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
  CONSTRAINT fk_segment FOREIGN KEY (segment_id) REFERENCES segments(segment_id)
);

CREATE INDEX idx_campaign_status ON campaigns(status, start_date);
CREATE INDEX idx_campaign_brand ON campaigns(brand_id, audience_type);
```

**Table: `journey_nodes`**
```sql
CREATE TABLE journey_nodes (
  node_id VARCHAR(50) PRIMARY KEY,
  campaign_id VARCHAR(50) NOT NULL,
  sequence_number INTEGER,
  node_type VARCHAR(50) NOT NULL,     -- email, paid-social, wait, decision, etc.
  node_label VARCHAR(200),
  content_id VARCHAR(50),
  content_version VARCHAR(10),
  position_x DECIMAL(10,2),
  position_y DECIMAL(10,2),
  config_json JSONB,                  -- Node-specific configuration
  created_at TIMESTAMP,

  CONSTRAINT fk_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  CONSTRAINT fk_content FOREIGN KEY (content_id) REFERENCES content_assets(content_id)
);

CREATE INDEX idx_node_campaign ON journey_nodes(campaign_id, sequence_number);
CREATE INDEX idx_node_content ON journey_nodes(content_id);
```

**Table: `journey_edges`**
```sql
CREATE TABLE journey_edges (
  edge_id VARCHAR(50) PRIMARY KEY,
  campaign_id VARCHAR(50) NOT NULL,
  source_node_id VARCHAR(50) NOT NULL,
  target_node_id VARCHAR(50) NOT NULL,
  edge_type VARCHAR(50),              -- default, conditional
  condition_json JSONB,               -- For decision paths
  created_at TIMESTAMP,

  CONSTRAINT fk_edge_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  CONSTRAINT fk_source FOREIGN KEY (source_node_id) REFERENCES journey_nodes(node_id) ON DELETE CASCADE,
  CONSTRAINT fk_target FOREIGN KEY (target_node_id) REFERENCES journey_nodes(node_id) ON DELETE CASCADE
);

CREATE INDEX idx_edge_campaign ON journey_edges(campaign_id);
CREATE INDEX idx_edge_source ON journey_edges(source_node_id);
```

**Table: `content_assets`**
```sql
CREATE TABLE content_assets (
  content_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  asset_type VARCHAR(50) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  brand_id VARCHAR(50) NOT NULL,
  audience_type VARCHAR(20) NOT NULL,
  mlr_status VARCHAR(20) NOT NULL,
  mlr_case_id VARCHAR(50),
  version INTEGER DEFAULT 1,
  effective_from DATE,
  effective_to DATE,
  file_url VARCHAR(1000),
  thumbnail_url VARCHAR(1000),
  created_by VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,

  CONSTRAINT fk_content_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

CREATE INDEX idx_content_brand_channel ON content_assets(brand_id, channel, mlr_status);
CREATE INDEX idx_content_expiry ON content_assets(effective_to) WHERE effective_to IS NOT NULL;
```

**Table: `content_claims`**
```sql
CREATE TABLE content_claims (
  content_id VARCHAR(50),
  claim_id VARCHAR(50),
  PRIMARY KEY (content_id, claim_id),

  CONSTRAINT fk_content FOREIGN KEY (content_id) REFERENCES content_assets(content_id),
  CONSTRAINT fk_claim FOREIGN KEY (claim_id) REFERENCES claims(claim_id)
);
```

---

### Event Ingestion Pipeline

**Architecture:**
```
Event Sources (Web, Email, Mobile, Paid Media)
  ↓
Event Collection API (REST endpoint)
  ↓
Message Queue (Kafka/Kinesis/Pub/Sub)
  ↓
Stream Processing (Enrichment, Validation)
  ↓
Data Warehouse (Batch insert every 5 minutes)
  ↓
Analytics Tables (journey_sequence_performance, etc.)
```

**Event Collection API:**
```typescript
// POST /api/events
interface EventPayload {
  event_type: string;
  timestamp: string;
  customer_id?: string;
  email_hash?: string;
  npi?: string;
  composite_key: string;         // Journey tracking key
  properties: Record<string, any>;
}

app.post('/api/events', async (req, res) => {
  const event = req.body as EventPayload;

  // Validate schema
  if (!validateEventSchema(event)) {
    return res.status(400).json({ error: 'Invalid event schema' });
  }

  // Enrich with journey context
  const enriched = await enrichEventWithJourneyContext(event);

  // Publish to message queue
  await publishToKafka('events', enriched);

  res.status(202).json({ status: 'accepted', event_id: enriched.event_id });
});
```

**Stream Processing (Enrichment):**
```python
# Kafka consumer with enrichment
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer('events',
                         value_deserializer=lambda m: json.loads(m.decode('utf-8')))

def enrich_event(raw_event):
    """Enrich event with campaign and customer context"""

    # Parse composite key
    composite_key = raw_event['composite_key']
    parts = composite_key.split('/')
    campaign_name = parts[0]
    sequence = int(parts[1].replace('SEQ-', ''))
    content_id = parts[2]

    # Lookup campaign metadata
    campaign = db.query(f"SELECT * FROM campaigns WHERE campaign_name = '{campaign_name}'").first()

    # Lookup customer attributes
    customer = None
    if raw_event.get('customer_id'):
        customer = db.query(f"SELECT * FROM customers WHERE customer_id = '{raw_event['customer_id']}'").first()
    elif raw_event.get('email_hash'):
        customer = db.query(f"SELECT * FROM customers WHERE email_hash = '{raw_event['email_hash']}'").first()

    # Enrich
    enriched = {
        **raw_event,
        'campaign_id': campaign['campaign_id'],
        'brand_id': campaign['brand_id'],
        'segment_id': campaign['segment_id'],
        'sequence_number': sequence,
        'content_id': content_id,
    }

    if customer:
        enriched['customer_attributes'] = {
            'customer_id': customer['customer_id'],
            'specialty': customer['specialty'],
            'engagement_score': customer['engagement_score'],
        }

    return enriched

for message in consumer:
    raw_event = message.value
    enriched_event = enrich_event(raw_event)

    # Write to data warehouse
    insert_to_warehouse(enriched_event)
```

---

## Recommendations & Optimizations

### 1. Third-Party Paid Media Optimization

**Current State:**
- S3 file drop with daily performance files
- Manual reconciliation between internal and agency data

**Recommended Enhancements:**

**A. Real-Time Event Streaming from Vendors**
```
Vendor Platform (Pulsepoint, Medscape, etc.)
  ↓ (Webhook on impression/click/conversion)
Event Gateway (API)
  ↓
Kafka Stream
  ↓
Data Warehouse (Real-time insert)
  ↓
Journey Canvas Analytics (< 5 min latency)
```

**Benefits:**
- Reduce measurement latency from 24 hours → 5 minutes
- Enable real-time optimization and budget pacing
- Faster identification of underperforming content

**Implementation:**
- Negotiate webhook access with CMI Media vendors
- Build event gateway to normalize vendor payloads
- Implement duplicate detection (vendor retries)

---

**B. Unified Audience Matching Service**
```
Brand Customer ID
  ↓
Hashing Service (SHA-256)
  ↓
Multi-Vendor Match Table
  ├─ Pulsepoint User ID
  ├─ Medscape Cookie ID
  ├─ Epocrates Device ID
  └─ Doximity Member ID
```

**Benefits:**
- Single source of truth for customer-to-vendor ID mapping
- Cross-vendor frequency capping (prevent overexposure)
- Unified attribution across vendors

**Implementation:**
- Build match table in Data Cloud or data warehouse
- Receive match results from CMI Media after audience upload
- Update match table daily with new linkages

---

**C. Automated Creative Optimization**
```
Journey Canvas
  ↓ (A/B test 3 creative variants)
S3 Export (all 3 variants)
  ↓
CMI Media (launch all variants with even split)
  ↓ (24 hours)
Performance Data (variant-level CTR/CVR)
  ↓
Optimization Service (identify winner)
  ↓
API call to CMI Media (shift 100% traffic to winner)
```

**Benefits:**
- Automated creative testing at scale
- 20-30% improvement in CTR from optimization
- Faster learning cycles (24-48 hours vs. weeks)

---

### 2. Sequence-Level Tracking Enhancements

**A. Machine Learning Attribution Model**
- Train model on historical journey data
- Predict contribution of each sequence position
- Update attribution weights weekly

**Model Features:**
- Sequence number
- Content type (email, paid social, display, etc.)
- Time since prior touchpoint
- Customer engagement score
- Content version
- Day of week / time of day

**Output:**
- Attribution weight for each touchpoint (sums to 100%)
- Confidence interval for attribution

---

**B. Sequence Recommendation Engine**
- Analyze historical journey performance
- Recommend optimal sequence structure for new campaigns
- Suggest content placement based on patterns

**Example Output:**
```
Recommended Journey Structure for HCP Wet AMD Campaign:
  SEQ-1: Entry
  SEQ-2: Email (Clinical Data) - Expected CVR: 6.2%
  SEQ-3: Wait 48 hours
  SEQ-4: Decision (Opened?)
    Yes → SEQ-5: Paid Social (Thought Leadership) - Expected CVR: 9.8%
    No  → SEQ-5: Email Resend - Expected CVR: 4.1%
  SEQ-6: Paid Display (Brand Reinforcement) - Expected CVR: 11.2%

  Predicted Overall Journey CVR: 8.7% ± 1.2%
  Confidence: High (based on 12 similar campaigns)
```

---

**C. Dynamic Sequence Insertion**
- Real-time decision to insert additional sequences based on behavior
- Example: If customer highly engaged (3+ clicks), insert "Schedule Rep Meeting" sequence
- Enables personalized journey paths without pre-planning every scenario

---

### 3. Data Cloud Segmentation Enhancements

**A. Real-Time Behavioral Triggers**
```
Customer Action (e.g., downloads HAWK study PDF)
  ↓ (Event captured)
Data Cloud Real-Time Segment Evaluation
  ↓ (Customer enters "High Intent" segment)
Journey Canvas Trigger API
  ↓ (Initiate "High Intent Follow-Up" journey)
Email sent within 15 minutes
```

**Benefits:**
- Strike while iron is hot (engagement within minutes vs. days)
- Higher conversion rates from timely outreach

---

**B. Propensity Modeling**
- Build ML models predicting likelihood of action
- Integrate predictions as Data Cloud attributes
- Use in segment criteria

**Example Segments:**
- High Propensity to Prescribe (score > 80)
- At Risk of Churn (score > 60)
- Likely to Attend Webinar (score > 70)

---

### 4. S3 File Drop Optimization

**A. Schema Validation Service**
- Automated validation of file drops before CMI ingestion
- Prevents errors and rejections

**Checks:**
- CSV format validation
- Required columns present
- Data type validation
- Checksum verification
- Consent flags validated

---

**B. Incremental Updates (Delta Files)**
- Instead of full audience export daily, send only changes
- Reduces file size and processing time

**Delta File Format:**
```csv
customer_id,action,timestamp
C-0001,add,2024-11-15T10:00:00Z
C-0002,update,2024-11-15T10:05:00Z
C-0003,remove,2024-11-15T10:10:00Z
```

---

**C. Bidirectional S3 Sync**
- Automated S3-to-S3 replication for performance files
- CMI Media writes to brand-controlled bucket (no polling needed)
- Event-driven ingestion (Lambda triggered on file arrival)

---

## Summary: Complete Feature Map

### Journey Canvas Features (35 Total)

**Design & Orchestration (12 features):**
1. Visual journey builder with drag-and-drop
2. Node palette (16 node types)
3. Hierarchy filters (Brand → Audience → Segment → Label)
4. Auto-generated campaign naming
5. Sequence numbering (BFS algorithm)
6. Content library integration with smart filtering
7. Journey templates (4 pre-built)
8. Journey status lifecycle (6 states)
9. Design vs. Analytics view mode toggle
10. Node configuration dialogs (wait, decision)
11. Canvas export/import (JSON)
12. Version control and history

**Content & Compliance (8 features):**
13. Content-to-node attachment (drag-and-drop)
14. MLR approval validation
15. ClaimID verification
16. Content expiry enforcement
17. Content version tracking
18. Evidence document linking
19. Indication alignment check
20. Suppression list management

**Segmentation & Audience (5 features):**
21. Data Cloud segment integration
22. Real-time size estimation
23. Consent verification
24. Audience export (CSV with hashing)
25. Segment re-qualification gates

**Analytics & Measurement (10 features):**
26. Node-level metrics overlay
27. Edge flow visualization
28. Sequence dashboard
29. Composite key tracking
30. Attribution modeling
31. Sequence interaction matrix
32. Content version comparison
33. Drop-off analysis
34. Channel effectiveness comparison
35. Real-time performance updates (<15 min)

---

**Total Features: 35**
**Business Value:** Unified campaign orchestration with regulatory compliance
**Technical Complexity:** High (multi-system integration, real-time data, ML attribution)
**Alignment:** ✅ Third-party media | ✅ Sequence tracking | ✅ Data Cloud segmentation

---

## Next Steps

1. **Prioritize Integration Points:**
   - Data Cloud API integration (highest priority)
   - S3 file drop implementation
   - Event tracking infrastructure
   - CMI Media vendor onboarding

2. **Build MVP Components:**
   - Journey Canvas UI (React Flow)
   - Campaign export service (S3 drops)
   - Event ingestion pipeline (Kafka)
   - Analytics dashboard (BI tool)

3. **Pilot Campaign:**
   - Select one therapeutic area (Ophthalmology)
   - Design 2-3 journeys
   - Execute via CMI Media → Medscape + Doximity
   - Measure sequence-level performance
   - Iterate based on learnings

4. **Scale & Optimize:**
   - Add more vendors (Pulsepoint, Epocrates)
   - Implement ML attribution model
   - Build sequence recommendation engine
   - Automate creative optimization

---

**Document End**
