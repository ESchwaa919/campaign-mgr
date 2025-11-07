# Journey Canvas: Wait & Decision Node Configuration Guide

## Overview

Wait and Decision Split nodes now include pharmaceutical marketing-specific configuration options that demonstrate realistic campaign logic and journey orchestration.

## Wait Node Configuration

When you add a Wait node to the canvas, a configuration dialog appears with three wait types:

### 1. Fixed Time Duration
**Use Case**: Standard time-based wait periods between touchpoints

**Options**:
- Duration: Any number (1, 24, 72, etc.)
- Unit: Hours, Days, or Weeks

**Examples**:
- "Wait 24 hours" - Standard follow-up delay
- "Wait 3 days" - Allow time for content absorption
- "Wait 2 weeks" - Longer nurture cycle

**Pharmaceutical Application**:
- Wait 48 hours after initial email before follow-up
- Wait 1 week between educational touchpoints
- Wait 2 weeks before rep outreach

---

### 2. Wait for Event
**Use Case**: Progression triggered by specific user actions

**Event Options**:
- **Email Opened** - HCP opened the email
- **Email Clicked** - HCP clicked a link in email
- **Link Clicked** - Specific link clicked
- **Web Page Visited** - Visited specific content page
- **Form Submitted** - Downloaded whitepaper, requested info
- **Content Downloaded** - Downloaded clinical study, evidence document
- **Rep Visit Completed** - Field rep completed visit
- **Webinar Attended** - Attended virtual event

**Examples**:
- "Wait until email opened" - Progress only engaged HCPs
- "Wait until content downloaded" - High-intent signal
- "Wait until rep visit completed" - Coordinate digital + field

**Pharmaceutical Application**:
- Wait for clinical data download before sending detailed efficacy info
- Wait for webinar attendance before follow-up
- Coordinate rep visits with digital touchpoints

---

### 3. Time or Event (Whichever Comes First)
**Use Case**: Set maximum wait time but progress early if event occurs

**Configuration**:
- Duration: Number + Unit (e.g., 72 hours)
- Event: Any of the event options above
- Max Wait: Automatic (uses duration as max)

**Examples**:
- "Wait 72 hours or email opened" - Max 3 days, but progress if opened earlier
- "Wait 1 week or form submitted" - Don't wait forever for action
- "Wait 48 hours or link clicked" - Quick response to high engagement

**Pharmaceutical Application**:
- "Wait 48 hours or email opened" - Follow up with engaged HCPs sooner
- "Wait 1 week or content downloaded" - Prioritize high-intent HCPs
- "Wait 3 days or webinar registered" - Faster path for engaged audience

---

## Decision Split Configuration

When you add a Decision Split node, choose from five decision types:

### 1. Engagement Behavior
**Use Case**: Split based on how HCP engaged with previous touchpoint

**Criteria**:

**Email Opened?**
- Path A: Opened (engaged)
- Path B: Not Opened (need different approach)

**Email Clicked?**
- Path A: Clicked (high engagement)
- Path B: Not Clicked (lower engagement)

**Engagement Score**
- Path A: High Engagement (>70)
- Path B: Medium Engagement (30-70)
- Path C: Low Engagement (<30)

**Pharmaceutical Application**:
```
[Email: New Clinical Data] → [Decision: Email Opened?]
    ├─ Opened → [Web: Detailed Efficacy Data]
    └─ Not Opened → [Email: Different Subject Line Approach]
```

---

### 2. Demographic Attribute
**Use Case**: Split based on HCP or account characteristics

**Criteria**:

**HCP Specialty**
- Path A: Oncology
- Path B: Ophthalmology
- Path C: Dermatology
- Path D: Other

**Account Tier**
- Path A: Tier 1 (High Value)
- Path B: Tier 2 (Medium Value)
- Path C: Tier 3 (Low Value)

**Consent Status**
- Path A: Full Consent (email + phone)
- Path B: Email Only
- Path C: No Consent (exclude from journey)

**Pharmaceutical Application**:
```
[Email: Product Launch] → [Decision: HCP Specialty]
    ├─ Oncology → [Email: Cancer Treatment Applications]
    ├─ Ophthalmology → [Email: Vision Care Benefits]
    └─ Dermatology → [Email: Dermatology Use Cases]
```

---

### 3. Behavioral History
**Use Case**: Split based on past engagement or preferences

**Criteria**:

**Previous Campaign Response**
- Path A: Responded to Previous Campaign
- Path B: No Previous Response

**Content Preference**
- Based on which content types HCP engages with

**Channel Preference**
- Email vs Web vs Mobile engagement patterns

**Pharmaceutical Application**:
```
[Email Invitation] → [Decision: Previous Response]
    ├─ Responded → [Email: VIP Webinar Invitation]
    └─ No Response → [Email: General Educational Content]
```

---

### 4. Segment Membership
**Use Case**: Split based on segment classification

**Criteria**:

**High Value Segment?**
- Path A: In High Value Segment
- Path B: Not in High Value Segment

**Early Adopter?**
- Path A: Early Adopter (quick to prescribe new therapies)
- Path B: Conservative (needs more evidence)

**Specialty Focus**
- Based on therapeutic area alignment

**Pharmaceutical Application**:
```
[Web Content] → [Decision: Early Adopter?]
    ├─ Early Adopter → [Email: New Treatment Option]
    └─ Conservative → [Email: Extensive Clinical Evidence]
```

---

### 5. Custom Criteria
**Use Case**: Advanced custom expressions for complex logic

**Examples**:
- Multiple condition combinations
- Custom calculated scores
- Complex attribute logic

---

## Node Display

### Design Mode
**Wait Nodes Show**:
- "24 hours"
- "email opened"
- "72 hours or link clicked"

**Decision Nodes Show**:
- "email opened"
- "2 paths" (or 3, 4 paths)

### Analytics Mode
**Wait Nodes Show**:
- Avg Wait: 24h
- 89 in progress

**Decision Nodes Show**:
- Actual split percentages on outgoing edges
- Path A: 623 (69.8%)
- Path B: 269 (30.2%)

---

## Example Journey Flows

### Example 1: Engagement-Based Follow-Up
```
[Entry: Eylea HCP Segment]
    ↓
[Email: New Clinical Data Announcement]
    ↓
[Wait: 48 hours or email opened]
    ↓
[Decision: Email Opened?]
    ├─ Opened → [Web: Detailed Efficacy Landing Page]
    │              ↓
    │          [Wait: 3 days]
    │              ↓
    │          [Email: Request Rep Visit]
    │
    └─ Not Opened → [Email: Different Subject Line]
                       ↓
                   [Wait: 48 hours or email opened]
                       ↓
                   [Decision: Email Opened?]
                       ├─ Opened → [Web: Landing Page]
                       └─ Not Opened → [Exit Journey]
```

### Example 2: Specialty-Targeted Content
```
[Entry: Dupixent Launch Segment]
    ↓
[Email: General Product Introduction]
    ↓
[Wait: 24 hours]
    ↓
[Decision: HCP Specialty]
    ├─ Dermatology → [Email: Atopic Dermatitis Data]
    │                   ↓
    │               [Web: Derm-Specific Landing Page]
    │
    ├─ Respiratory → [Email: Asthma Treatment Data]
    │                   ↓
    │               [Web: Respiratory Landing Page]
    │
    └─ Allergy → [Email: Allergic Rhinitis Data]
                    ↓
                [Web: Allergy Landing Page]
```

### Example 3: Coordinated Digital + Field
```
[Entry: High-Value Account Segment]
    ↓
[Email: Introduction + Pre-Call Content]
    ↓
[Wait: until rep visit completed]
    ↓
[Email: Post-Visit Follow-Up with Resources]
    ↓
[Wait: 1 week]
    ↓
[Decision: Downloaded Post-Visit Content?]
    ├─ Yes → [Email: Advanced Training Invitation]
    └─ No → [Email: Simple Resource Summary]
```

---

## How to Use

### Adding a Wait Node:
1. Drag "Wait" from left palette OR click it
2. Configuration dialog opens automatically
3. Choose wait type:
   - Time: Enter duration + select unit
   - Event: Select event from dropdown
   - Time or Event: Enter max duration + select event
4. Click "Save Configuration"
5. Node appears with config label

### Adding a Decision Split Node:
1. Drag "Decision Split" from left palette OR click it
2. Configuration dialog opens automatically
3. Select decision type (engagement / demographic / behavioral / etc)
4. Choose specific criterion from dropdown
5. Preview resulting paths in dialog
6. Click "Save Configuration"
7. Node appears with criterion label

### Editing Configuration (Future):
- Right-click node → "Edit Configuration"
- Opens dialog with current settings
- Make changes and save

---

## Best Practices

**Wait Nodes:**
- Use time-based waits for standard nurture cadence
- Use event-based waits to progress engaged HCPs faster
- Use time-or-event for balance (don't wait forever, but prioritize engaged)

**Decision Splits:**
- Keep paths simple (2-3 paths ideal)
- Use engagement splits after content touchpoints
- Use demographic splits for personalized content
- Use behavioral splits for segmentation

**Journey Design:**
- Alternate content → wait → decision for natural flow
- Don't create "dead ends" - always provide a path forward
- Coordinate digital and field with event-based waits
- Use analytics mode to validate split distributions

---

## Pharmaceutical Marketing Applications

**Launch Campaigns:**
- Initial awareness email → Wait for engagement → Specialty-specific follow-up

**Educational Series:**
- Content 1 → Wait (time) → Content 2 → Wait (time) → Content 3

**Event Promotion:**
- Invitation → Wait (time or registration) → Reminder → Wait (time) → Post-event

**Rep Coordination:**
- Pre-call digital → Wait (rep visit) → Post-call reinforcement

**High-Intent Nurture:**
- Content → Wait (download) → Advanced content → Wait (engagement) → Rep outreach

**Consent Management:**
- Split by consent status → Email-only path vs Multi-channel path

This demonstrates sophisticated pharmaceutical marketing orchestration with
realistic wait conditions and decision logic that coordinate digital and
field activities while respecting compliance requirements.
