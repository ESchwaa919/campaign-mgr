# Journey Canvas: Business Requirements Document

**Version**: 1.0
**Date**: November 2024
**Product**: BrandGuard OS - Journey Canvas Module
**Target Users**: Pharmaceutical Marketing Operations Teams

---

## Executive Summary

The **Journey Canvas** is a visual journey orchestration platform that enables pharmaceutical marketers to design, execute, and monitor multi-channel customer journeys for HCP and patient engagement. It provides real-time visibility into campaign performance while maintaining compliance with regulatory requirements.

**Key Value**: Transform complex, multi-touchpoint marketing campaigns into visual workflows with built-in compliance, real-time analytics, and automated orchestration across email, web, mobile, and social channels.

---

## Business Objectives

### Primary Goals
1. **Reduce Campaign Launch Time**: Cut time-to-market by 40% through visual workflow design vs. manual coordination
2. **Improve Engagement Rates**: Increase HCP engagement by 25% via personalized, behavior-driven journeys
3. **Ensure Compliance**: 100% MLR-approved content, ClaimID linkage, and consent management throughout journey execution
4. **Enable Data-Driven Optimization**: Real-time performance metrics to identify drop-off points and optimize touchpoints

### Success Metrics
- **Time Savings**: Reduce campaign setup from 2 weeks to 3 days
- **Engagement**: Increase email open rates from 35% to 45% via smart timing and personalization
- **Attribution**: Track multi-touch attribution across 4+ channels (email, web, mobile, social)
- **Compliance**: Zero regulatory violations through automated content approval checks

---

## Core Capabilities

### 1. Visual Journey Design
**What**: Drag-and-drop canvas for building multi-channel customer journeys

**Key Features**:
- **Campaign Targeting**: Brand → Audience Type (HCP/Patient) → Segment → Auto-generated campaign name
- **Touchpoint Nodes**: Email, Web, Mobile, Social media content delivery
- **Flow Control**: Wait conditions (time-based or event-triggered), Decision splits (engagement, demographics, behavior)
- **Advanced Analytics**: A/B testing, attribution points, behavioral scoring

**Business Value**: Marketers design campaigns visually without IT support, accelerating time-to-market

**Example Use Case**:
```
Campaign: "Eylea HCP High-Value Oncologists EMAIL SOCIAL Q4 Launch"

Journey Flow:
1. Email: New clinical data announcement
2. Wait: 48 hours OR email opened (whichever first)
3. Decision: Did HCP open email?
   → Opened: Social media thought leadership post
   → Not Opened: Resend email with different subject line
4. Attribution: Track rep meeting scheduled
```

---

### 2. Content-First Workflow
**What**: Attach MLR-approved content to journey touchpoints

**Key Features**:
- **Content Library Integration**: Filters to brand, audience, and active channels
- **Smart Content Matching**: Only show content eligible for selected segment and channels
- **Drag-to-Attach**: Drag content from library onto touchpoint nodes
- **Version Control**: Track content versions and approval status

**Business Value**: Ensures only compliant content is used; reduces risk of off-label promotion

**Compliance Controls**:
- Only MLR-approved content can be attached to active journeys
- Content must link to valid ClaimIDs with substantiation evidence
- Expired content automatically prevented from new campaigns

---

### 3. Smart Wait & Decision Logic
**What**: Sophisticated timing and branching based on HCP behavior

**Wait Conditions**:
- **Time-Based**: "Wait 24 hours" before next touchpoint
- **Event-Based**: "Wait until email opened" to progress engaged HCPs faster
- **Hybrid**: "Wait 72 hours OR email clicked" (whichever comes first)

**Decision Criteria**:
- **Engagement**: Email opened? Clicked? Engagement score (High/Medium/Low)
- **Demographics**: HCP specialty, Account tier, Consent status
- **Behavioral**: Previous campaign response, Content preference, Channel preference
- **Segmentation**: High-value segment? Early adopter? Specialty focus

**Business Value**: Prioritize engaged HCPs with faster follow-up; re-engage unresponsive HCPs with different tactics

---

### 4. Real-Time Execution Monitoring
**What**: Live dashboard showing journey performance as it executes

**Metrics Per Touchpoint**:
- **Email**: Sent, Delivered, Opened (%), Clicked (%), Converted (%)
- **Web**: Page visits, Time on page, Downloads, Form submissions
- **Mobile**: Push sent, Opened (%), Clicked (%)
- **Social**: Post impressions, Engagement, Click-through

**Journey-Level Metrics**:
- **Progression**: How many HCPs moved through each stage
- **Drop-Off Analysis**: Where are HCPs exiting the journey?
- **Decision Splits**: % taking each path (e.g., 68% opened email, 32% did not)
- **Attribution**: Conversion events (rep meeting, prescription, formulary add)

**Business Value**: Identify underperforming touchpoints in real-time; optimize mid-campaign vs. waiting for post-campaign report

---

### 5. Advanced Analytics & Optimization
**What**: Sophisticated testing and measurement capabilities

**A/B Testing**:
- Test subject lines, content variants, messaging approaches
- Automatic traffic splitting
- Statistical significance tracking

**Attribution Points**:
- Mark conversion events (rep visit scheduled, prescription written, formulary approval)
- Multi-touch attribution across digital and field channels
- Journey ROI calculation

**Behavioral Scoring**:
- Dynamic engagement scoring (+10 for email open, +25 for content download)
- Automatic segment updates based on behavior
- Prioritization for sales rep outreach

**Business Value**: Continuous improvement via A/B testing; prove marketing ROI through attribution

---

## User Workflows

### Workflow 1: Campaign Design (Marketing Operations Manager)
1. Select targeting: Brand (Eylea) → Audience (HCP) → Segment (High-Value Oncologists)
2. Build journey structure: Email → Wait → Decision → Email/Social paths
3. Configure nodes: "Wait 48 hours or email opened", "Decision: Email Opened?"
4. Attach content: Drag MLR-approved content to each touchpoint
5. Review: Auto-generated campaign name shows full targeting

**Time**: 30 minutes (vs. 4 hours manual coordination)

---

### Workflow 2: Journey Activation & Monitoring (Campaign Manager)
1. Click "Activate Journey" → Status changes to ACTIVE, switches to Analytics view
2. Monitor real-time metrics: 1,247 emails sent → 892 opened (71%) → 234 clicked (19%)
3. Observe decision split: 892 HCPs progressed to "Opened" path, 355 to "Not Opened" path
4. Identify optimization: "Not Opened" path has low recovery (30%), adjust follow-up content
5. Track attribution: 45 rep meetings scheduled from email clicks

**Time**: 15 minutes daily monitoring (vs. 2 hours compiling reports)

---

### Workflow 3: Multi-Channel Coordination (Digital Marketing Manager)
1. Design omnichannel journey: Email → Web → Social → Rep Outreach
2. Set smart waits: "Wait until web page visited" before sending social post
3. Coordinate with field: "Wait until rep visit completed" before digital follow-up
4. Monitor channel performance: Email (71% open) → Web (62% visit) → Social (45% engage)
5. Optimize mix: Increase web investment, reduce social based on data

**Time**: 1 hour to design (vs. 1 week coordinating across teams)

---

## Pharmaceutical-Specific Requirements

### Compliance & Governance
- **MLR Integration**: Only approved content available in library
- **ClaimID Enforcement**: All content must link to substantiation evidence
- **Consent Management**: Decision splits on consent status (Full/Email-only/None)
- **Audit Trail**: Track what content was sent to which HCPs when
- **Off-Label Prevention**: Content filtered by approved indications

### Industry Use Cases
- **Product Launch**: Multi-wave HCP education with progressive content deepening
- **Clinical Data Dissemination**: Announce new data → Wait for engagement → Share detailed results
- **Event Promotion**: Webinar invitation → Wait for registration → Send reminder → Post-event follow-up
- **Rep Coordination**: Pre-call digital → Wait for rep visit → Post-call reinforcement
- **Specialty Targeting**: Split by HCP specialty to send relevant clinical applications

---

## Technical Requirements (High-Level)

### Integrations
- **Salesforce Marketing Cloud / Braze**: Email and mobile execution
- **Salesforce Data Cloud**: Audience segmentation and identity resolution
- **Web Analytics**: Page visit tracking, content downloads
- **CRM**: Rep activity tracking (visit completed, samples dropped)

### Performance
- Support journeys with 100K+ HCPs
- Real-time metrics updated every 15 minutes
- Sub-second canvas rendering for complex journeys

### Security & Compliance
- Role-based access control (Marketer, Reviewer, Admin)
- SOC 2 compliant data handling
- GDPR/CCPA consent enforcement
- Audit logging for all changes

---

## Implementation Phases

**Phase 1 (Current)**: Foundation
- Visual journey design with email, web, mobile, social touchpoints
- Wait and decision logic
- Real-time analytics dashboard
- Content library integration

**Phase 2 (Next Quarter)**: Advanced Optimization
- A/B testing with statistical analysis
- Predictive next-best-action recommendations
- Multi-journey orchestration (campaigns with sub-journeys)
- Advanced attribution modeling

**Phase 3 (Future)**: AI-Powered Automation
- Auto-generated journeys from campaign briefs
- Adaptive journeys (change flow based on engagement)
- Anomaly detection (alert on unexpected drop-offs)
- Content performance prediction

---

## Return on Investment (ROI)

**Efficiency Gains**:
- Campaign setup time: **-75%** (2 weeks → 3 days)
- Coordination effort: **-60%** (4 teams → automated workflows)
- Reporting time: **-80%** (manual reports → real-time dashboards)

**Performance Improvements**:
- Email engagement: **+29%** (35% → 45% open rates via smart timing)
- Multi-touch attribution: **+40%** visibility (track across 4+ channels)
- Conversion rates: **+22%** (optimized touchpoints, better timing)

**Risk Reduction**:
- Compliance violations: **-100%** (automated MLR checks)
- Off-label promotion risk: **-95%** (ClaimID enforcement)
- Manual errors: **-85%** (visual workflows vs. spreadsheets)

**Total Value**: $2.4M annually (3-person marketing ops team, 20 campaigns/year)

---

## Success Criteria

**MVP Success** (90 days post-launch):
- ✅ 10 live journeys across 3 brands
- ✅ 50K+ HCPs engaged via Journey Canvas
- ✅ 40% reduction in campaign setup time
- ✅ Zero compliance violations

**6-Month Success**:
- ✅ 25 live journeys across all brands
- ✅ 150K+ HCPs engaged
- ✅ 25% improvement in engagement rates
- ✅ Multi-touch attribution for 80% of campaigns

**12-Month Success**:
- ✅ Journey Canvas is primary campaign execution platform
- ✅ 50 concurrent journeys
- ✅ 500K+ HCPs engaged annually
- ✅ Proven ROI: $2M+ in efficiency gains and performance lift

---

## Appendix: Competitive Differentiation

**vs. Salesforce Journey Builder**:
- ✅ Pharmaceutical compliance built-in (MLR, ClaimID, consent)
- ✅ Rep coordination (digital + field in one journey)
- ✅ Simpler UX (2-hour learning curve vs. 2-day training)

**vs. Adobe Journey Optimizer**:
- ✅ Specialty-specific (HCP segmentation, clinical content)
- ✅ Attribution focused (multi-touch, field + digital)
- ✅ Lower cost (bundled with BrandGuard OS)

**vs. Manual Coordination**:
- ✅ 10x faster campaign setup
- ✅ Real-time visibility (vs. post-campaign reports)
- ✅ Automated compliance (vs. manual checks)
