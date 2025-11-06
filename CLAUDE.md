# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains **BrandGuard OS** (located in `brand-guard-os/`), a pharmaceutical marketing compliance and operations platform built with React, TypeScript, Vite, and shadcn/ui. The application implements **Phase 1 foundation requirements** from a comprehensive pharmaceutical marketing technology specification designed for companies like Regeneron.

### Current Focus: Phase 1 Foundation (Months 1-3)

The primary implementation target is **Phase 1** with 113 Priority Zero (P0) requirements detailed in `Phase-1-Foundation-Requirements.md`. This establishes the foundational infrastructure for all subsequent phases.

**Key deliverables:**
- Salesforce platform configuration with Data Cloud
- Claravine taxonomy validation gateway
- ClaimID registry with substantiation evidence management
- Medical Legal Review (MLR) workflow orchestration
- Email execution platform integration
- Event collection and measurement infrastructure
- Campaign performance dashboards

The complete roadmap (335 requirements across 5 phases) is documented in `regeneron requirements.md`, but **Phase 1 is the current implementation priority**.

## Key Architecture Concepts

### Compliance-First Design
This platform is built around pharmaceutical regulatory requirements:
- **ClaimID Framework**: Every marketing claim must be linked to clinical evidence and approved indications
- **MLR Workflow**: Multi-stage approval process (Medical, Legal, Regulatory review) before content can be used
- **Taxonomy Governance**: Campaign naming and metadata must follow strict conventions (enforced via Claravine-like validation)
- **Audit Trails**: All changes to campaigns, claims, and content must be versioned and traceable

### Six Operational Swimlanes
The application organizes marketing operations into six domains (see `Phase-1-Foundation-Requirements.md`):
1. **Govern**: Data quality, taxonomy, claims, consent management
2. **Segment**: Demographic, institutional, and behavioral audience targeting
3. **Create**: Content planning, MLR workflow, version control
4. **Orchestrate**: Multi-channel journey coordination
5. **Execute**: Email, web, paid media, field sales channels
6. **Measure & Learn**: Event collection, attribution, analytics

### TypeScript Type System
Core types are defined in `brand-guard-os/src/types/index.ts`:
- **Campaign**: Marketing campaigns with taxonomy, status, linked claims
- **Claim**: Product claims with evidence documents and approval status
- **MLRCase**: Medical Legal Review workflow instances
- **Segment**: Audience definitions (demographic/institutional/behavioral)
- **User**: System users with roles (ADMIN, REVIEWER, MARKETER, STEWARD, ANALYST)

## Development Commands

### Working in the React Application (`brand-guard-os/`)

```bash
cd brand-guard-os

# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Code Architecture

### Page-Based Routing
The app uses React Router with these main routes (see `src/App.tsx`):
- `/` - Dashboard with key metrics and recent activity
- `/campaigns` - Campaign management interface
- `/claims` - ClaimID registry and evidence management
- `/mlr` - Medical Legal Review queue and workflows
- `/segments` - Audience segmentation builder
- `/email` - Email campaign execution
- `/events` - Event tracking and analytics
- `/admin` - System administration

### Component Structure
- `src/pages/`: Page-level components for each route
- `src/components/`: Shared components (Layout, StatusBadge)
- `src/components/ui/`: shadcn/ui components (card, button, dialog, etc.)
- `src/lib/mockData.ts`: Mock data for development/prototyping
- `src/hooks/`: React hooks (use-toast, use-mobile)

### State Management
- Uses `@tanstack/react-query` for data fetching and caching
- Currently uses mock data from `src/lib/mockData.ts`
- Production implementation would integrate with Salesforce APIs and data warehouse

### Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI primitives
- Dark mode support via `next-themes`
- Responsive design patterns throughout

## Important Requirements Context

### Phase 1 Foundation Requirements (CURRENT PRIORITY)
The `Phase-1-Foundation-Requirements.md` document defines **113 Priority Zero requirements** that this application implements. This is the **primary reference** for current development work.

**Swimlane breakdown:**
- **Govern** (35 requirements): Data quality, taxonomy, claims, consent
- **Segment** (12 requirements): Demographic and behavioral targeting
- **Create** (21 requirements): Content planning, MLR workflow, version control
- **Orchestrate** (6 requirements): Basic multi-channel coordination
- **Execute** (20 requirements): Email, web, paid media execution
- **Measure & Learn** (19 requirements): Event collection, dashboards

### Master Requirements (FUTURE PHASES)
The `regeneron requirements.md` file (600KB) contains the complete **335-requirement specification across all 5 phases**:
- **Phase 1** (Months 1-3): 113 P0 requirements - Foundation infrastructure ← **WE ARE HERE**
- **Phase 2** (Months 4-9): 112 P1 requirements - Strategic capabilities
- **Phase 3** (Months 10-12): 43 requirements - Optimization
- **Phase 4** (Months 13-18): 17 requirements - Advanced analytics
- **Phase 5** (Months 19-24): 44 requirements - Portfolio intelligence

When implementing features:
1. **Always check Phase 1 requirements first** - these are the foundation
2. Reference the swimlane structure (Govern/Segment/Create/Orchestrate/Execute/Measure)
3. Follow compliance-by-design principles
4. Maintain audit trails and version control
5. Link all claims to substantiation evidence

## Alternative Design Prototypes

The repository includes two standalone React prototypes showcasing alternative UI/UX approaches for various widgets and visualizations:

### `pharma_dashboard.jsx`
A comprehensive dashboard prototype with alternative designs for:
- **Swimlane flow visualization**: Visual representation of campaigns moving through the 6 operational swimlanes
- **Pipeline progression charts**: Multi-stage funnel analytics (MQL → SQL → Opportunity → Closed)
- **Channel performance visualization**: ROI comparison and spend distribution charts
- **Content performance tracking**: Engagement scoring and persona-based analytics
- **Journey flow analysis**: Drop-off visualization and conversion funnel
- **Governance compliance cards**: Real-time validation status and metrics

**Key features:**
- Animated metrics on load
- Real-time data simulation
- Recharts library for visualizations
- Tab-based navigation (Overview, Campaigns, Journeys, Content, Governance)

### `pharma-campaign-manager.jsx`
An alternative campaign management interface with different widget designs for:
- **Campaign creation workflow**: Step-by-step wizard with claim selection
- **MLR review queue**: Priority-based task management with progress tracking
- **Segment builder interface**: Visual audience definition with filter selection
- **Channel execution dashboard**: Real-time metrics per channel (Email, Paid, Web)
- **Governance cards**: Claravine validation status, consent management metrics
- **Data quality monitoring**: Event collection completeness tracking

**Key features:**
- Six-tab swimlane navigation (Dashboard, Govern, Segment, Create, Execute, Measure)
- Modal-based campaign creation
- Lucide React icons throughout
- Gradient backgrounds and modern card layouts

**Usage:** These prototypes can be referenced when implementing similar features in `brand-guard-os/`. Copy widget designs, chart configurations, or layout patterns as needed, but ensure they're adapted to the TypeScript/shadcn/ui architecture.

## Testing Considerations

When implementing new features:
- Ensure all campaign actions validate through taxonomy rules
- Verify ClaimID linkages prevent off-label promotion
- Test MLR workflow state transitions
- Validate consent enforcement for all communication channels
- Confirm audit trails capture who/what/when/why metadata

## Data Model Key Concepts

### Campaign Lifecycle
1. **DRAFT**: Campaign being configured
2. **READY**: Taxonomy validated, awaiting MLR approval
3. **ACTIVE**: Approved and executing
4. **PAUSED**: Temporarily stopped
5. **ARCHIVED**: Completed

### MLR Workflow States
1. **DRAFT**: Not yet submitted
2. **SUBMITTED**: Awaiting assignment
3. **IN_REVIEW**: Active review in progress
4. **CHANGES_REQUESTED**: Returned to submitter
5. **APPROVED**: Ready for execution
6. **REJECTED**: Cannot proceed

### Claim Management
- Every claim must have `effectiveFrom` and optional `effectiveTo` dates
- Claims link to `EvidenceDocument` records with checksums for integrity
- Claims must map to approved indications (off-label detection)
- Version history tracks all changes

## Integration Points

The platform is designed to integrate with:
- **Salesforce Sales Cloud**: Master customer data and account hierarchies
- **Salesforce Data Cloud**: Identity resolution across channels
- **Claravine**: Campaign taxonomy validation gateway
- **Marketing Cloud/Braze**: Email and mobile execution
- **Snowflake/BigQuery**: Data warehouse for analytics
- **Paid media platforms**: Google Ads, Meta, programmatic DSPs

## Path Alias

The project uses `@/` as an alias for `src/`, configured in `vite.config.ts`:
```typescript
import { Component } from '@/components/Component'
import { helper } from '@/lib/utils'
```
