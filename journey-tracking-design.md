# Journey Canvas: Design Mode + Live Execution Tracking

## Overview

The Journey Canvas now operates in **two modes** to demonstrate the complete lifecycle from campaign design through live execution and performance tracking.

## Two-Mode System

### 1. Design Mode (Default)
**Purpose**: Build and configure the customer journey

**Features**:
- Simplified left palette with only **Wait** and **Decision** nodes
- Content nodes (Email, Web, Mobile) come from **Content Library** (right panel)
- Drag content from library → auto-creates node with content attached
- Campaign name auto-generates: `[Brand] [Audience] [Channels] [Label]`
- Active channels populate from nodes on canvas
- Content-first workflow: "Use this email → then this web page"

**Visual**:
```
[Wait/Decision palette] → [Canvas for building] → [Content Library]
                           ↓
                    Campaign: "Eylea HCP EMAIL WEB Launch"
```

### 2. Analytics Mode (After Activation)
**Purpose**: Monitor live execution and performance

**Features**:
- Same journey structure, but nodes show **live metrics**
- Edges show **progression counts** with animation
- Real-time tracking of sent/opened/clicked/converted
- Drop-off analysis visible between nodes
- Content performance per touchpoint

**Visual**:
```
[Email Node]          [Wait 24h]          [Web Node]
1,247 sent     →  892 continued  →   623 reached
892 opened (71%)    (waiting)          445 opened (71%)
234 clicked (19%)                      167 clicked (27%)
45 converted (4%)                      89 converted (14%)
```

## Journey Lifecycle States

| State | Description | Mode Available |
|-------|-------------|----------------|
| 🎨 **DESIGN** | Building the journey | Design only |
| 🔍 **REVIEW** | MLR approval pending | Design only |
| ✅ **APPROVED** | Ready to activate | Design only |
| ▶️ **ACTIVE** | Currently running | Design + Analytics |
| ⏸️ **PAUSED** | Temporarily stopped | Design + Analytics |
| 📊 **COMPLETE** | Finished campaign | Analytics only |

## Node-Level Metrics

### Content Touchpoints (Email/Web/Mobile)
Shows when **Analytics mode** is active:
- **Sent**: Total recipients
- **Opened**: Count + percentage
- **Clicked**: Count + percentage
- **Converted**: Count + percentage (highlighted green)
- **In Progress**: Currently active users

### Structural Nodes
**Wait Node**:
- Avg Wait Time: Duration in hours
- In Progress: Users currently waiting

**Decision Node**:
- Path A/B counts shown on edges
- Split percentages calculated

## Edge/Connection Metrics

In **Analytics mode**, edges show:
- **Animated flow** indicating live execution
- **Count labels**: "892 continued →"
- Visual indication of drop-off (fewer continuing than started)

## User Workflow

### Phase 1: Design Journey
1. Select Brand → Audience → Segment → Optional Label
2. Drag content from Content Library → creates Email/Web/Mobile nodes
3. Add Wait/Decision nodes from left palette as needed
4. Connect nodes with flow arrows
5. Campaign name auto-updates: "Eylea HCP EMAIL WEB Q4 Launch"

### Phase 2: Activate & Track
1. Click **"Activate Journey"** button → Status changes to ▶️ ACTIVE
2. **Analytics tab** becomes enabled
3. Switch to Analytics view → Nodes show live metrics
4. Edges animate with progression counts
5. Monitor performance in real-time

### Phase 3: Analyze Results
1. After campaign completes → Status: 📊 COMPLETE
2. Review metrics per touchpoint
3. Identify drop-off points
4. Compare content performance

## Integration Points

### Data Sources (Production)
- **Salesforce Data Cloud**: Audience progression, journey events
- **Marketing Cloud/Braze**: Email/mobile send metrics (opens, clicks)
- **Google Analytics**: Web page engagement
- **Data Warehouse**: Consolidated journey analytics

### Event Tracking
Journey execution generates events captured on **Events page**:
- `journey.node_entered` - User reached a node
- `journey.node_completed` - User finished interaction
- `journey.edge_transitioned` - User progressed to next node
- `email.sent` / `email.opened` / `email.clicked`
- `web.page_viewed` / `web.conversion`

## Benefits for Pharmaceutical Marketing

### Compliance Tracking
- Every touchpoint links to MLR-approved content
- Content IDs visible in both design and analytics modes
- ClaimID linkages maintained throughout journey
- Audit trail shows which content reached which HCPs

### Performance Visibility
- **Channel comparison**: Email vs Web vs Mobile effectiveness
- **Content performance**: Which assets drive engagement
- **Drop-off analysis**: Where are HCPs leaving the journey?
- **Conversion attribution**: Which touchpoints drive outcomes

### Operational Efficiency
- **Unified view**: Design and execution in same interface
- **Real-time feedback**: No waiting for batch reports
- **Quick iteration**: See what's working, adjust quickly
- **Simplified workflow**: Content-first approach matches marketer thinking

## Technical Implementation

### Types Added (`src/types/index.ts`)
```typescript
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
  averageTimeSpent?: number; // seconds
}

export interface JourneyEdgeMetrics {
  sourceNodeId: string;
  targetNodeId: string;
  transitioned: number;
  transitionRate: number; // percentage
}
```

### State Management (`src/pages/Journey.tsx`)
```typescript
const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>('DESIGN');
const [viewMode, setViewMode] = useState<'design' | 'analytics'>('design');
const mockNodeMetrics: Record<string, JourneyNodeMetrics> = { /* ... */ };
```

### Node Display (`src/components/JourneyNode.tsx`)
```typescript
interface JourneyNodeData {
  label: string;
  nodeType: 'entry' | 'email' | 'web' | 'mobile' | 'wait' | 'decision';
  contentAsset?: ContentAsset;
  viewMode?: 'design' | 'analytics';
  metrics?: JourneyNodeMetrics;
}

// Conditional rendering based on viewMode
{isAnalyticsMode && metrics && (
  // Show metrics: sent, opened, clicked, converted
)}
```

## Next Steps (Future Enhancements)

**P1 (Priority 1)**:
- Right-click connections → "Insert Wait" or "Insert Decision"
- Drag & drop to reorder nodes
- Copy/paste nodes with content attached
- Export journey as template

**P2 (Priority 2)**:
- A/B testing support (multiple variants)
- Predictive analytics (expected vs actual)
- Benchmark comparisons (vs historical campaigns)
- Alert thresholds (drop-off warnings)

**P3 (Long-term)**:
- Multi-journey orchestration (campaigns with sub-journeys)
- Cross-journey reporting (consolidated performance)
- AI recommendations (suggested next touchpoints)
- Adaptive journeys (change flow based on engagement)

---

**Key Insight**: The dual-mode canvas demonstrates that journey building isn't just design - it's an **operational monitoring tool** that tracks execution from start to finish, providing the visibility pharmaceutical marketers need to prove ROI and maintain compliance.
