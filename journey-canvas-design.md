# Journey Canvas Design: Node Types vs Content Libraries

## Current State Analysis

### Node Types Available
1. **Entry Point** - Journey start (structural, no content)
2. **Email** - Email touchpoint (has content: EMAIL channel)
3. **Web Content** - Website touchpoint (has content: WEB channel)
4. **Mobile Push** - Mobile touchpoint (has content: MOBILE channel)
5. **Audience Filter** - Segmentation logic (structural, no content)
6. **Wait** - Time delay (structural, no content)
7. **Decision Split** - Conditional branching (structural, no content)

### Content Channels Available
1. ✅ **EMAIL** - Has node type (Email)
2. ✅ **WEB** - Has node type (Web Content)
3. ✅ **MOBILE** - Has node type (Mobile Push)
4. ❌ **PAID_MEDIA** - NO node type (missing!)
5. ❌ **FIELD_SALES** - NO node type (missing!)

## The Problem

**Gap:** Content library has PAID_MEDIA and FIELD_SALES content, but no corresponding node types to use them.

**Question:** Should we add node types for these channels, or remove them from content library?

## Recommended Solution

### Option A: Add Missing Node Types (Recommended)

Add two new node types to palette:

**Paid Media Node**
- Icon: DollarSign or TrendingUp
- Channel: PAID_MEDIA
- Can attach paid media content (display ads, social ads, programmatic)
- Color: Green

**Field Sales Node**
- Icon: Briefcase or Users
- Channel: FIELD_SALES  
- Can attach field content (rep presentations, detailing aids, samples)
- Color: Indigo

**Benefits:**
- Complete coverage of all content types
- Matches pharmaceutical marketing reality (field sales is huge)
- Paid media is increasingly important in pharma

### Option B: Remove Unused Content

Remove PAID_MEDIA and FIELD_SALES content from library since no nodes use them.

**Drawbacks:**
- Limits platform capabilities
- Field sales is critical in pharma

## Node Type Categories

### Content-Bearing Nodes (Can Have Assets)
- Email → EMAIL content
- Web Content → WEB content
- Mobile Push → MOBILE content
- **[Proposed] Paid Media** → PAID_MEDIA content
- **[Proposed] Field Sales** → FIELD_SALES content

### Structural Nodes (No Content)
- Entry Point - Journey trigger/start
- Audience Filter - Segmentation/targeting logic
- Wait - Time delays between touchpoints
- Decision Split - Conditional branching (A/B testing, behavior-based)

## Content Attachment Rules

1. **Only content-bearing nodes can have content attached**
2. **Content channel must match node type:**
   - Email node → Can only have EMAIL content
   - Web node → Can only have WEB content
   - Etc.
3. **Content must be MLR approved** to attach to journey
4. **Content must match campaign's brand and audience**

## Visual Design

### Content-Bearing Nodes
- Show content ID badge when attached: `CNT-2024-0042`
- Show content thumbnail on hover
- Glow/highlight when content attached
- Allow drag-drop from content library

### Structural Nodes
- No content indicator
- Different visual style (dashed border?)
- Cannot receive content drops

## Implementation Priority

**P0 (Current):**
- Email, Web, Mobile nodes ✅
- Entry, Wait, Decision, Segment nodes ✅

**P1 (Next):**
- Paid Media node
- Field Sales node
- Visual distinction between content vs structural nodes

**P2 (Future):**
- Event node (webinar, conference)
- SMS/WhatsApp node
- Print node (rare in modern pharma)

## User Experience Flow

1. **Select filters**: Brand → Audience → Segment
2. **Drag structural nodes**: Entry → Wait → Decision
3. **Drag content nodes**: Email → Web → Mobile
4. **Active channels appear**: [EMAIL] [WEB] [MOBILE]
5. **Content library filters** to show only EMAIL, WEB, MOBILE assets
6. **Drag content** from library to Email/Web/Mobile nodes
7. **Campaign name updates**: "Eylea HCP EMAIL WEB Q4 Launch"

## Recommendations

1. ✅ Add Paid Media and Field Sales node types
2. ✅ Visually distinguish content vs structural nodes
3. ✅ Show which nodes can receive content (glow on hover)
4. ✅ Prevent content drop on structural nodes
5. ✅ Show content preview thumbnail in node when attached

---

**Decision Needed:** Should we implement Option A (add nodes) or Option B (remove content)?

**My Recommendation:** Option A - Pharma marketing needs both paid media and field sales channels.
