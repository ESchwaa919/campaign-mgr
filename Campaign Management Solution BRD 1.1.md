
# Document Information & History {#document-information-&-history}

### Document Information {#document-information}

| Document Name | Business Requirements Document |
| :---- | :---- |
| **Opportunity Name** | Regeneron – Campaign Management |
| **Client** | Regeneron |
| **Document Author** | Catalyst IQ |
| **Version** | 1.1 |
| **Date** | 11-13-2025 |
| **Status** | In Review |

### Document History {#document-history}

| \# | Date | Author | Revision Description |
| :---- | :---- | :---- | :---- |
| 1.0 | 2025-10-27 | David Mondgock | Initial Draft Version |
| 1.1 | 2025-11-13 | Erik Schwartz | Full integrated view, requirements alignment |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

# Final Document Distribution & Approval {#final-document-distribution-&-approval}

### Final Document Distribution {#final-document-distribution}

This document is the Business Requirements Document for Regeneron.

The following people are designated recipients of the final version of this document:

| Name | Role | Organization |
| :---- | :---- | :---- |
| Slobodan Mileta | Associate Director | Commercial IT |
| Anand Ramachandran | Sr. Director | Commercial IT |
| Matthias Koenig | Director | Commercial Insights & Analytics |
| Rodney Spady | Director | Omnichannel Operations |
| Martin Boyle | Sr. Director | Field & Marketing Operations |
| Brian McNamee | Sr. Director | Marketing |
| Jason Justiniano | Sr. Director | Marketing |
| Robert Kearns | Sr. Product Manager | Commercial IT-PromoMats |

### Final Document Approval {#final-document-approval}

Electronic approvals will be stored to confirm that this document will serve as the Business Requirements Document.

| CIQ Name | David Mondgock | Matthias Siebert |
| :---- | :---- | :---- |
| **Role** | Account Lead | Change Management Lead |
| **Signature** |  |  |
| **Date** |  |  |

| Client Name | Rodney  Spady | Brian McNamee | Matthias Koenig | Robert Kearns | Slobodan Mileta |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Role** | Omnichannel Operations  | Marketing |  Insights & analytics Director | Commercial IT-PromoMats | Commercial IT |
| **Signature** |  |  |  |  |  |
| **Date** |  |  |  |  |  |

**TABLE OF CONTENTS**

[Document Information & History	1](#document-information-&-history)

[Document Information	1](#document-information)

[Document History	1](#document-history)

[Final Document Distribution & Approval	2](#final-document-distribution-&-approval)

[Final Document Distribution	2](#final-document-distribution)

[Final Document Approval	3](#final-document-approval)

[Executive Summary	5](#executive-summary)

[Purpose and Context	5](#purpose-and-context)

[Personas and Primary User Journeys	6](#personas-and-primary-user-journeys)

[Business Capabilities and Outcomes	6](#primary-personas)

[Operating Model and Governance	8](#heading)

[Business Requirements	9](#business-requirements)

# Executive Summary {#executive-summary}

The Regeneron Campaign Management System establishes a compliant, auditable, and scalable platform for orchestrating omnichannel marketing campaigns across email, paid media, web, mobile, and field sales channels.

This integrated solution connects five core systems:

* Campaign Manager for campaign orchestration and MLR governance  
* Journey Canvas for visual journey design and microsegment targeting  
* Salesforce for customer data and segment management  
* Claravine for taxonomy validation and UTM generation  
* Snowflake for data warehousing and analytics

The system ensures 100% regulatory compliance through mandatory ClaimID linkage, Medical Legal Review (MLR) approval workflows, and audit trails. All campaigns maintain complete lineage tracking from planning through execution via unique identifier registry and standardized taxonomy.

Key business outcomes include: elimination of manual URL creation and tracking errors, real-time campaign performance visibility, microsegment-level attribution, \>98% event-to-campaign join rates, and reduction in campaign activation time from weeks to days.

# Purpose and Context {#purpose-and-context}

This Business Requirements Document defines the functional and technical requirements for the Regeneron Campaign Management System, an integrated platform connecting Campaign Manager, Journey Canvas, Salesforce, Claravine, and Snowflake.

The system addresses critical business challenges:

* Lack of centralized campaign orchestration and governance  
* Manual, error-prone tracking parameter creation  
* Fragmented analytics preventing journey-level attribution  
* Regulatory compliance gaps in claim substantiation and audit trails  
* Inability to activate campaigns rapidly without IT intervention

The platform enables Brand Marketing, Omnichannel Operations, and Insights & Analytics teams to design, approve, execute, and measure compliant omnichannel journeys with full metadata lineage and real-time performance tracking.

# Personas and Primary User Journeys {#personas-and-primary-user-journeys}

### Primary Personas {#primary-personas}

**Brand Marketer**: Creates and publishes omnichannel journeys, monitors campaign performance, ensures regulatory compliance through ClaimID linkage and MLR approval.

**Insights & Analytics**: Measures audience journey paths, analyzes channel mix and sequence effectiveness, optimizes campaigns based on engagement data.

**Commercial Operations**: Manages taxonomy standards, ensures consistent tracking implementation across channels and vendors, maintains data quality.

### User Stories

* As a Brand Marketer, I want to create and publish a full omnichannel journey without IT intervention and monitor campaign performance in real time.  
* As a member of Insights and Analytics, I want to measure the path an audience takes through the planned journey to understand the impact of channel, sequence and content for optimization.  
* As a member of Commercial Operations, I want to see auto-applied tags across all channels and 3rd party media partners to ensure we capture engagement at consistent levels.

### Primary User Journey Flow

1. **Campaign Planning**: Brand Marketer creates campaign in Campaign Manager, selects brand and segments from Salesforce, links approved ClaimIDs, submits for MLR review.  
2. **Journey Design**: Marketer opens Journey Canvas, drags channel nodes (Email, Paid Media, Wait, Decision), configures microsegments with behavioral criteria, assigns content from library.  
3. **ID Minting & Validation**: System mints unique Campaign ID, Content IDs, and Sequence IDs via ID Registry. Claravine validates taxonomy and generates UTM \+ cm\_\* tracking parameters.  
4. **Activation**: System exports campaign manifest, tracking parameters, content files, and segment data to S3. CMI Media distributes to vendor platforms (SFMC, Google Ads, Veeva).  
5. **Execution & Tracking**: Vendors execute campaigns with tracking URLs. User actions generate events sent to S3, auto-ingested into Snowflake.  
6. **Analytics**: Campaign Manager displays real-time metrics from Snowflake. Journey Canvas shows node-level performance. Insights team analyzes multi-touch attribution.

# Business Capabilities and Outcomes

### Core Business Capabilities

**Campaign Orchestration**: Centralized campaign planning with brand, audience, and segment selection. Multi-channel support (Email, Paid Media, Web, Mobile, Field Sales). Campaign lifecycle management (Draft → Active → Paused → Archived).

**Regulatory Compliance**: 100% ClaimID linkage with substantiation evidence. Medical Legal Review (MLR) multi-stage approval workflow. Complete audit trails for regulatory inspection.

**Visual Journey Design**: Drag-and-drop journey builder with 15+ node types. Microsegment generation with behavioral targeting. Real-time journey validation and logic checking.

**Taxonomy & Tracking Governance**: Claravine-enforced naming conventions and taxonomy. Automated UTM \+ cm\_\* parameter generation. ID Registry for deterministic unique identifiers.

**Content Management**: Unified asset library integrated with Campaign Manager. Dynamic field substitution for personalization. Content approval and version control.

**Real-Time Analytics**: Journey-level performance metrics from Snowflake. Sequence and node-level attribution. Multi-touch attribution and cohort analysis.

### Business Outcomes

**Compliance Assurance**: Zero campaigns activated without approved ClaimIDs and MLR approval. Complete regulatory audit readiness with full lineage tracking.

**Operational Efficiency**: Campaign activation time reduced from weeks to days. Elimination of manual tracking parameter creation errors. Self-service campaign publishing without IT dependency.

**Analytics Quality**: \>98% event-to-campaign join rate in Snowflake. Real-time dashboard visibility across all channels. Microsegment-level performance insights.

**Consistency & Governance**: Standardized taxonomy across all marketing entities. Automated tracking parameter enforcement. Predictable vendor integrations via S3 file drops.

# ![][image1] {#heading}

# Operating Model and Governance

### System Architecture

The integrated platform follows a hub-and-spoke architecture:

**Hub**: Campaign Manager serves as the central orchestration layer, managing campaign metadata in Salesforce and coordinating workflows across all systems.

**ID Registry**: Mints deterministic unique identifiers (Campaign ID, Content IDs, Sequence IDs) following ULID or UUID standards. Maintains referential integrity across systems.

**Claravine**: Validates taxonomy and generates tracking parameters. Enforces naming conventions and UTM structure. Disseminates approved tracking data to vendors and analytics.

**Journey Canvas**: Provides visual interface for journey design. Integrates with Salesforce for segment data and content library for asset selection.

**Snowflake**: Data warehouse ingesting events via Snowpipe. Aggregates performance metrics via hourly tasks. Provides analytics API for Campaign Manager dashboards.

### Workflow Orchestration

Campaign Activation Flow:

1. Campaign creation in Campaign Manager with Salesforce segment selection  
2. ClaimID linkage and MLR approval workflow  
3. Journey design in Journey Canvas with microsegment targeting  
4. ID Registry minting of unique identifiers  
5. Claravine validation and UTM generation  
6. Export to S3 with manifest, tracking parameters, content, and segments  
7. CMI Media distribution to vendor platforms  
8. Event tracking and Snowflake ingestion  
9. Real-time performance analytics in Campaign Manager

### Governance Framework

**Taxonomy Governance**: Claravine maintains the master taxonomy for all marketing entities. Campaign Manager enforces taxonomy during campaign creation. Quarterly taxonomy reviews and updates with synchronized versioning.

**Claim Compliance**: All campaigns must link to approved ClaimIDs before activation. ClaimID registry maintained by Medical Affairs with evidence documentation. Automated expiration checks prevent use of expired claims.

**MLR Approval**: 100% Medical Legal Review required before activation. Version control triggers re-review for substantive changes. Complete approval audit trails maintained in Salesforce.

**Data Quality**: Daily automated checks identify orphaned events (\<2% threshold). Monitoring for volume anomalies (\>3 standard deviations). Data quality dashboards for Operations team.

**Vendor Management**: Standardized S3 file drop for all vendor integrations. Claravine-approved URLs only permitted in market. Vendor performance tracking and SLA monitoring.

### Business Requirements {#business-requirements}

### Campaign Manager Requirements

| Req ID | Requirement | Rationale/Value | System | Version Control |
| ----- | ----- | ----- | ----- | ----- |
| CM-001 | Campaign creation wizard with taxonomy-driven fields, brand and segment selection from Salesforce, campaign label generation following Claravine naming conventions | Centralized campaign planning and coordination | Campaign Manager |  |
| CM-002 | ClaimID search and selection from approved registry with display of claim text, indication, approval status, and evidence document access | Regulatory compliance \- prevents off-label promotion | Campaign Manager |  |
| CM-003 | Medical Legal Review (MLR) workflow with multi-stage approval (Medical → Legal → Regulatory), version control, and campaign activation blocking until approval | Ensures all campaigns meet regulatory standards before execution | Campaign Manager |  |
| CM-004 | Real-time campaign performance dashboard displaying metrics from Snowflake: impressions, clicks, conversions, CTR, conversion rate, channel breakdown, and sequence-level tracking | Data-driven optimization and performance visibility | Campaign Manager \+ Snowflake |  |
| CM-005 | Multi-brand portfolio management with brand catalog, therapeutic area mappings, brand-specific claim registries and taxonomy rules | Scalable governance across multiple pharmaceutical brands | Campaign Manager |  |

### Journey Canvas Requirements

| Req ID | Requirement | Rationale/Value | System | Version Control |
| ----- | ----- | ----- | ----- | ----- |
| JC-001 | Visual drag-and-drop journey design with React Flow canvas, node palette with 15+ node types (Email, Paid Media, Web, Mobile, Field Sales, Wait, Decision, A/B Test, Suppression, Attribution), edge connections, and real-time validation | Self-service journey creation without IT dependency | Journey Canvas |  |
| JC-002 | Microsegment integration with AI-powered suggestions, manual criteria builder (demographics, engagement score, institutional, behavioral), microsegment nodes with left-to-right layout and 180px vertical spacing | Precision targeting with behavioral and institutional criteria | Journey Canvas \+ Salesforce |  |
| JC-003 | Content library integration with unified asset view, dynamic field substitution for personalization, content variant management, and channel-appropriate content filtering | Centralized compliant content access and reuse | Journey Canvas |  |
| JC-004 | Sequence and timing configuration with wait times, event-based triggers, decision logic for branching, A/B test variant allocation | Sophisticated journey orchestration | Journey Canvas |  |
| JC-005 | AI resonance scoring for content-segment fit (0-100 score), content recommendations based on segment criteria and past performance | Optimized content selection for target audiences | Journey Canvas \+ Snowflake |  |
| JC-006 | Journey validation and activation with orphan node detection, connection validation, ID Registry minting (Campaign ID, Content IDs, Sequence IDs), Claravine taxonomy validation | Ensures journey completeness and regulatory compliance | Journey Canvas \+ ID Registry \+ Claravine |  |
| JC-007 | Journey analytics mode displaying node-level performance overlays, sequence fallout analysis, channel mix effectiveness, conversion path tracking | In-context performance visualization for optimization | Journey Canvas \+ Snowflake |  |

### Salesforce Integration Requirements

| Req ID | Requirement | Rationale/Value | System | Version Control |
| ----- | ----- | ----- | ----- | ----- |
| SF-001 | Campaign object extension with BrandGuard OS fields: journey\_id, sequence\_count, claravine\_taxonomy\_id, mlr\_status, activation\_timestamp, performance\_metrics\_snapshot | Campaign metadata master in Salesforce | Salesforce |  |
| SF-002 | Segment builder integration with HCP segmentation criteria (specialty, region, years in practice, engagement score, institutional affiliations), patient segmentation (condition, geography, consent status), estimated counts | Customer data and segment management | Salesforce |  |
| SF-003 | Segment export API with CSV generation (NPI, email, specialty, segment criteria), microsegment assignment tracking, HIPAA-compliant data handling | Vendor-ready audience files | Salesforce |  |
| SF-004 | Real-time segment refresh with daily automated sync, Change Data Capture (CDC) for critical fields, segment size alerting for threshold violations | Current audience data for campaign execution | Salesforce |  |
| SF-005 | Salesforce Data Cloud integration for identity resolution across channels, unified HCP/patient profiles, engagement history aggregation | Single view of customer for consistent targeting | Salesforce Data Cloud |  |

### Claravine Integration Requirements

| Req ID | Requirement | Rationale/Value | System | Version Control |
| ----- | ----- | ----- | ----- | ----- |
| CV-001 | Taxonomy master management with campaign naming conventions, channel taxonomy (Email, Paid Social, Paid Search, Paid Display, Print, Web, Mobile, Field Sales), content type taxonomy, segment taxonomy | Standardized taxonomy across all marketing entities | Claravine |  |
| CV-002 | ID Registry integration with Campaign ID, Content ID, Sequence ID pull from ID Registry, composite key validation (journey\_path\_key, content\_lineage\_key) | Consistent unique identifier usage | Claravine \+ ID Registry |  |
| CV-003 | UTM parameter generation with standardized utm\_source, utm\_medium, utm\_campaign, utm\_content, utm\_term following approved templates, custom cm\_\* parameters (cm\_campaign\_id, cm\_sequence\_id, cm\_content\_id, cm\_variant\_id, cm\_microsegment\_id) | Comprehensive tracking lineage | Claravine |  |
| CV-004 | Validation workflow with pre-activation taxonomy validation, malformed parameter blocking, missing ID detection, approval gate preventing campaign activation without complete tracking | Zero unvalidated URLs in market | Claravine |  |
| CV-005 | Tracking data dissemination via API to Campaign Manager, vendor platforms (CMI, SFMC, Google Ads, Veeva), Snowflake dim\_tracking\_plan table | Synchronized tracking data across systems | Claravine |  |
| CV-006 | Taxonomy versioning with quarterly taxonomy updates, synchronized version control across systems, change log and audit trail | Predictable taxonomy evolution | Claravine |  |

### Snowflake Analytics Requirements

| Req ID | Requirement | Rationale/Value | System | Version Control |
| ----- | ----- | ----- | ----- | ----- |
| SW-001 | Snowpipe auto-ingestion from S3 event bucket with continuous loading, JSON event parsing (timestamp, event\_type, channel, campaign\_id, sequence\_id, content\_id, variant\_id, microsegment\_id, utm\_params, cm\_params, hcp\_npi), schema validation | Real-time event capture | Snowflake |  |
| SW-002 | dim\_tracking\_plan dimension table with Claravine taxonomy sync, composite key support (journey\_path\_key, content\_lineage\_key, segment\_key), SCD Type 2 for taxonomy versioning | Foundational tracking metadata | Snowflake |  |
| SW-003 | Event-to-campaign join logic with composite key matching, \>98% join rate target, daily orphaned event reporting (\<2% threshold), data quality alerting | High-fidelity multi-touch attribution | Snowflake |  |
| SW-004 | Journey performance aggregation with hourly Snowflake Tasks, sequence-level metrics (impressions, clicks, conversions, CTR, conversion rate), microsegment performance breakdowns, channel mix analysis | Real-time campaign analytics | Snowflake |  |
| SW-005 | Attribution modeling with multi-touch attribution (first-touch, last-touch, linear, time-decay, position-based), conversion path analysis, channel influence scoring | Understand channel contribution to conversions | Snowflake |  |
| SW-006 | Advanced analytics with cohort retention analysis, engagement scoring, content performance benchmarks, A/B test statistical analysis, predictive modeling for resonance scores | Strategic insights for optimization | Snowflake |  |
| SW-007 | Data quality monitoring with daily volume anomaly detection (\>3 standard deviations), schema drift monitoring, missing parameter alerts, dashboard for Operations team | Proactive data quality management | Snowflake |  |

>