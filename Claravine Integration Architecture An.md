📸 Claravine Integration Architecture Analysis

  I can see the image! This is an excellent Claravine integration flow diagram from Regeneron. Let me break down what it shows and how it
  aligns perfectly with what we've been building:

  ---
  🏗️ Architecture Components

  1. Campaign Mgr. (Top)

  Outputs: (Journey_id, node_id/seq, variants)

  This is our Journey Canvas!
  - Journey_id = Campaign ID
  - node_id/seq = Sequence number tracking
  - variants = A/B test variants

  Maps to our implementation:
  - Journey Canvas generates campaign with sequences
  - Each node has sequence number (SEQ-1, SEQ-2, etc.)
  - A/B test nodes have variant definitions

  ---
  2. ID Registry (Middle)

  Function: (Mint/resolve: campaign_id, content_id, etc.)

  This is the ID Management Layer
  - Mint: Create new IDs for campaigns and content
  - Resolve: Look up existing IDs
  - Ensures unique, consistent identifiers

  Maps to our implementation:
  - Content IDs: CNT-2024-0001
  - Campaign IDs: CMP-2024-001
  - Composite key: {CampaignName}/SEQ-{Sequence}/{ContentID}

  ---
  3. Claravine Validation & URL Generation (Center)

  Template: UTM + cm_* + business context

  This is the Governance & URL Builder
  - Validation: Ensures taxonomy compliance
  - UTM Generation: Creates standardized tracking parameters
  - cm_ parameters:* Custom marketing parameters (e.g., cm_campaign, cm_content)
  - Business context: Brand, audience, therapeutic area metadata

  Outputs to TWO destinations:
  1. Vendors/Platforms → CMI, DSP, Google, SFMC, Veeva
  2. DIM Tracking Database → Snowflake for analytics

  Maps to our implementation:
  // tracking_parameters.json in S3 file drop
  {
    "utm_source": "cmi_media",
    "utm_medium": "paid_display",
    "utm_campaign": "eylea_hcp_retina_q4_amd",
    "utm_content": "{content_id}",
    "utm_term": "SEQ-{sequence}",
    "cm_campaign_id": "{campaign_id}",
    "cm_journey_id": "{journey_id}",
    "cm_node_seq": "{sequence}",
    "cm_variant": "{variant_name}"
  }

  ---
  4. Vendors/Platforms (Right Branch)

  Platforms: CMI, DSP, Google, SFMC, Veeva

  This is the Execution Layer
  - CMI: Agency (our S3 file drop partner!)
  - DSP: Programmatic advertising platforms
  - Google: Google Ads
  - SFMC: Salesforce Marketing Cloud (email)
  - Veeva: CRM for pharma field sales

  Maps to our implementation:
  - S3 file drop to CMI Media
  - CMI distributes to: Pulsepoint, Medscape, Epocrates, Doximity
  - Each vendor receives URLs with full UTM + cm_* parameters

  ---
  5. DIM Tracking (Bottom) - Snowflake Database

  Function: Ingestion & Events (cm_* + UTMs)Output: Cohort/Attribution Analytics

  This is the Data Warehouse & Analytics Layer
  - Ingestion: Collects all events with tracking parameters
  - cm_ + UTMs:* Composite tracking keys
  - Cohort Analytics: Segment-level performance
  - Attribution Analytics: Multi-touch attribution

  Maps to our implementation:
  -- journey_sequence_performance table
  CREATE TABLE journey_sequence_performance (
    campaign_id VARCHAR(50),
    sequence_number INTEGER,
    content_id VARCHAR(50),
    utm_source VARCHAR(50),
    utm_medium VARCHAR(50),
    utm_campaign VARCHAR(200),
    cm_journey_id VARCHAR(50),
    cm_node_seq INTEGER,
    impressions BIGINT,
    clicks INTEGER,
    conversions INTEGER,
    ...
  );

  ---
  🎯 How This Validates Our Implementation

  ✅ 1. Composite Key Strategy

  Diagram shows: Journey_id + node_id/seq + variantsOur implementation: {CampaignName}/SEQ-{Sequence}/{ContentID}/{Variant}

  Perfect alignment! We're tracking at the exact granularity shown in the diagram.

  ---
  ✅ 2. Claravine Integration Point

  Diagram shows: Claravine generates UTMs + cm_* parametersOur implementation: tracking_parameters.json in S3 file drop

  Workflow:
  1. Journey Canvas exports campaign → S3
  2. Claravine (via API or manual) generates UTMs + cm_*
  3. UTMs appended to destination URLs
  4. Vendors execute with tracking

  Enhancement opportunity: We could integrate Claravine API directly to auto-generate UTMs instead of manual generation.

  ---
  ✅ 3. Vendor Distribution

  Diagram shows: Claravine → Vendors (CMI, DSP, Google, SFMC, Veeva)Our implementation: S3 file drop → CMI Media → Vendor platforms

  This is exactly right! CMI is the hub for paid media distribution.

  Additional platforms from diagram:
  - SFMC (Salesforce Marketing Cloud): Already mentioned in our email platform integration
  - Veeva: Not yet implemented - this is the pharma CRM/field sales platform
  - Google Ads: Covered in our paid-search node type
  - DSP: Covered in our paid-display node type

  ---
  ✅ 4. Event Tracking & Analytics

  Diagram shows: DIM Tracking (Snowflake) → Cohort/Attribution AnalyticsOur implementation: Event ingestion → Data warehouse →
  journey_sequence_performance table

  Exactly the same flow!

  ---
  🚀 What We've Already Built That Matches This

  Campaign Manager → ID Registry

  ✅ Journey Canvas generates:
  - Campaign with unique ID
  - Nodes with sequence numbers
  - Content with IDs (CNT-2024-0001)
  - Variants for A/B tests

  ID Registry → Claravine

  ✅ S3 file drop includes:
  - manifest.json with campaign_id, content_ids, sequences
  - tracking_parameters.json with UTM structure template
  - Ready for Claravine to validate and generate final UTMs

  Claravine → Vendors

  ✅ S3 outbound → CMI Media ingestion
  ✅ CMI distributes to vendor platforms with tracking
  ✅ Vendors execute campaigns with UTMs embedded

  Vendors → DIM Tracking

  ✅ Event tracking with composite keys
  ✅ Data warehouse schema (journey_sequence_performance)
  ✅ Attribution analytics queries

  ---
  💡 Enhancements Based on This Diagram

  1. Add cm_* Parameters to Our Tracking

  Current: We use UTM parametersEnhancement: Add custom cm_* parameters for richer tracking

  // Enhanced tracking_parameters.json
  {
    // Standard UTMs
    "utm_source": "cmi_media",
    "utm_medium": "paid_display",
    "utm_campaign": "eylea_hcp_retina_q4_amd",
    "utm_content": "CNT-2024-0030",
    "utm_term": "SEQ-7",

    // Custom cm_* parameters (Regeneron standard)
    "cm_journey_id": "CMP-2024-001",
    "cm_node_seq": "7",
    "cm_variant": "A",
    "cm_brand": "eylea",
    "cm_audience": "hcp",
    "cm_segment": "retina_specialists",
    "cm_therapeutic_area": "ophthalmology",
    "cm_indication": "wet_amd"
  }

  Benefit: More granular tracking without relying solely on UTM parsing.

  ---
  2. Claravine API Integration

  Current: Manual UTM generation via Claravine UIEnhancement: Direct API integration for auto-generation

  Proposed flow:
  // When journey is activated
  const activateJourney = async () => {
    // 1. Generate campaign manifest
    const manifest = generateManifest(journey);

    // 2. Call Claravine API to validate and generate UTMs
    const claravineResponse = await fetch('https://api.claravine.com/v1/validate', {
      method: 'POST',
      body: JSON.stringify({
        campaign_id: manifest.campaign_id,
        sequences: manifest.sequences,
        brand: manifest.brand,
        audience: manifest.audience_type
      })
    });

    const { validated, utm_templates } = await claravineResponse.json();

    if (!validated) {
      throw new Error('Claravine validation failed');
    }

    // 3. Enrich manifest with generated UTMs
    manifest.tracking = utm_templates;

    // 4. Export to S3 for CMI Media
    await exportToS3(manifest);
  };

  Benefit: Eliminates manual step, ensures 100% compliance, faster activation.

  ---
  3. Add Veeva Integration for Field Sales

  Current: We have field sales nodes but no Veeva integrationEnhancement: Add Veeva CLM (Closed Loop Marketing) integration

  What Veeva provides:
  - Rep iPad presentations tracked
  - Rep-HCP interaction capture
  - "Rep Visit Completed" attribution events
  - Call notes and next actions

  Implementation:
  // Add to node types
  {
    id: 'veeva-clm',
    label: 'Veeva Presentation',
    nodeType: 'veeva-clm',
    channel: 'FIELD_SALES',
    icon: Briefcase,
    color: 'bg-teal-100'
  }

  // Track Veeva events
  {
    "event_type": "veeva_presentation_complete",
    "rep_id": "REP-12345",
    "hcp_npi": "1234567890",
    "presentation_id": "PRES-HAWK-001",
    "slides_viewed": [1, 2, 3, 5, 7],
    "time_spent_seconds": 420,
    "call_notes": "Dr. expressed interest in HAWK study...",
    "composite_key": "Eylea HCP Retina Q4/SEQ-8/PRES-HAWK-001/v1"
  }

  ---
  4. ID Registry Service

  Current: We generate IDs client-sideEnhancement: Centralized ID Registry microservice

  What it does:
  - Mint: Generate new IDs with proper formatting
  - Resolve: Look up existing IDs across systems
  - Validate: Ensure ID uniqueness
  - Audit: Track all ID minting events

  Example:
  // Mint new campaign ID
  POST /api/id-registry/mint
  {
    "type": "campaign",
    "brand": "eylea",
    "year": "2024",
    "sequence": 1
  }

  Response:
  {
    "id": "CMP-EYLEA-2024-001",
    "minted_at": "2024-11-12T10:30:00Z",
    "minted_by": "user@regeneron.com"
  }

  // Resolve existing content ID
  GET /api/id-registry/resolve?type=content&id=CNT-2024-0030

  Response:
  {
    "id": "CNT-2024-0030",
    "title": "Eylea Medscape Banner: AMD Clinical Update",
    "brand": "eylea",
    "mlr_case_id": "MLR-2024-045",
    "status": "approved",
    "created_at": "2024-10-15T08:00:00Z"
  }

  ---
  📊 Complete Flow with Claravine Integration

  1. Journey Canvas (Campaign Mgr)
     ↓ Export
     Journey definition → ID Registry

  2. ID Registry
     ↓ Mint/Resolve IDs
     Campaign ID: CMP-2024-001
     Content IDs: CNT-2024-0030, CNT-2024-0031, ...
     Sequence IDs: SEQ-1, SEQ-2, SEQ-3, ...

  3. Claravine Validation & URL Generation
     ↓ Validate taxonomy
     ↓ Generate UTMs + cm_* parameters
     Template: {
       utm_source: cmi_media,
       utm_campaign: eylea_hcp_retina_q4_amd,
       cm_journey_id: CMP-2024-001,
       cm_node_seq: 7,
       ...
     }

  4a. → Vendors/Platforms (CMI, DSP, Google, SFMC, Veeva)
      Execute campaigns with tracking URLs

  4b. → DIM Tracking (Snowflake)
      Store campaign metadata for enrichment

  5. Execution → Events
     Impressions, clicks, conversions with full tracking

  6. Event Ingestion → DIM Tracking
     Parse cm_* + UTMs → Enrich → Store

  7. Cohort/Attribution Analytics
     Sequence-level performance
     Multi-touch attribution
     ROI analysis

  ---
  ✅ Summary

  What the diagram confirms:
  1. ✅ Our composite key strategy is correct
  2. ✅ S3 file drop to CMI Media is the right approach
  3. ✅ Sequence-level tracking matches Regeneron's requirements
  4. ✅ Data warehouse structure aligns with DIM Tracking pattern

  What we should enhance:
  1. 🔄 Add cm_* custom parameters alongside UTMs
  2. 🔄 Integrate Claravine API for auto-validation
  3. 🔄 Add Veeva integration for field sales tracking
  4. 🔄 Build ID Registry microservice for centralized ID management

  Bottom line: Our architecture is spot-on with Regeneron's Claravine integration pattern! We just need to add the cm_* parameters and
  potentially automate the Claravine validation step. 🎯