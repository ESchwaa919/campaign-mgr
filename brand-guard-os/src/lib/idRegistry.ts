import { Node, Edge } from 'reactflow';
import type {
  IDRegistryEntry,
  UTMParameters,
  CMParameters,
  JourneyActivationResult,
  Microsegment,
  Brand,
} from '@/types';

/**
 * ID Registry Service
 * Handles ID minting, UTM generation, and journey activation
 * Aligned with Claravine integration architecture
 */

// Helper: Sanitize string for UTM/URL usage
function sanitizeForUTM(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Helper: Sanitize string for cm_* parameters
function sanitizeForCM(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Helper: Get channel/medium for node type
function getChannelForNode(nodeType: string): string {
  const channelMap: Record<string, string> = {
    email: 'email',
    web: 'web',
    mobile: 'mobile_push',
    social: 'social',
    'paid-social': 'paid_social',
    'paid-search': 'paid_search',
    'paid-display': 'paid_display',
    print: 'print',
    'tv-radio': 'tv_radio',
    ooh: 'out_of_home',
    wait: 'wait',
    decision: 'decision',
    abtest: 'abtest',
    attribution: 'attribution',
    score: 'score',
    suppression: 'suppression',
  };
  return channelMap[nodeType] || 'unknown';
}

// Helper: Build query string from parameters
function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

// Calculate sequence numbers using BFS from entry node
export function calculateSequenceNumbers(nodes: Node[], edges: Edge[]): Map<string, number> {
  const sequenceMap = new Map<string, number>();

  // Find entry node
  const entryNode = nodes.find((n) => n.data.nodeType === 'entry' || n.id === '1');
  if (!entryNode) return sequenceMap;

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  // BFS to assign sequence numbers
  const queue: Array<{ nodeId: string; sequence: number }> = [{ nodeId: entryNode.id, sequence: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { nodeId, sequence } = queue.shift()!;

    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    sequenceMap.set(nodeId, sequence);

    // Add children to queue
    const children = adjacency.get(nodeId) || [];
    children.forEach((childId) => {
      if (!visited.has(childId)) {
        queue.push({ nodeId: childId, sequence: sequence + 1 });
      }
    });
  }

  return sequenceMap;
}

interface MintIDsParams {
  campaignName: string;
  nodes: Node[];
  edges: Edge[];
  microsegments: Microsegment[];
  brand: string;
  audienceType: 'HCP' | 'PATIENT';
  segment: string;
  therapeuticArea: string;
  indication?: string;
}

/**
 * Mint IDs and activate journey
 * This is the main function that orchestrates the entire activation process
 */
export async function mintIDsAndActivate(params: MintIDsParams): Promise<JourneyActivationResult> {
  const {
    campaignName,
    nodes,
    edges,
    microsegments,
    brand,
    audienceType,
    segment,
    therapeuticArea,
    indication,
  } = params;

  const registry: IDRegistryEntry[] = [];
  const trackingURLs: Record<string, string> = {};
  const currentUser = 'sarah.johnson@pharma.com'; // TODO: Get from auth context

  // Step 1: Mint Campaign ID
  const campaignId = mintCampaignID(brand);
  const campaignUTMs = generateCampaignUTMs(campaignName);
  const campaignCMParams = generateCampaignCMParams({
    campaignId,
    brand,
    audienceType,
    segment,
    therapeuticArea,
    indication,
  });

  registry.push({
    id: `IDR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'CAMPAIGN',
    compositeKey: campaignId,
    campaignId,
    utmParameters: campaignUTMs,
    cmParameters: campaignCMParams,
    mintedAt: new Date(),
    mintedBy: currentUser,
    status: 'MINTED',
  });

  // Step 2: Calculate sequence numbers
  const nodeSequences = calculateSequenceNumbers(nodes, edges);

  // Step 3: Mint Sequence IDs for each node
  nodeSequences.forEach((sequenceNum, nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || node.data.nodeType === 'entry') return; // Skip entry node

    const sequenceKey = `${campaignId}/SEQ-${sequenceNum}`;
    const medium = getChannelForNode(node.data.nodeType);

    registry.push({
      id: `IDR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'SEQUENCE',
      compositeKey: sequenceKey,
      campaignId,
      sequenceNumber: sequenceNum,
      utmParameters: {
        utm_source: 'cmi_media',
        utm_medium: medium,
        utm_campaign: sanitizeForUTM(campaignName),
        utm_term: `SEQ-${sequenceNum}`,
      },
      cmParameters: {
        cm_journey_id: campaignId,
        cm_node_seq: String(sequenceNum),
        cm_brand: sanitizeForCM(brand),
        cm_audience: audienceType.toLowerCase(),
        cm_segment: sanitizeForCM(segment),
        cm_therapeutic_area: sanitizeForCM(therapeuticArea),
        cm_indication: indication ? sanitizeForCM(indication) : undefined,
      },
      mintedAt: new Date(),
      mintedBy: currentUser,
      status: 'MINTED',
    });

    // Step 4: Mint Content IDs if content is attached
    if (node.data.contentAsset) {
      const contentAsset = node.data.contentAsset;

      // Create a content ID for each microsegment
      microsegments.forEach((microseg) => {
        const contentKey = `${sequenceKey}/${contentAsset.id}`;

        const utmParams: UTMParameters = {
          utm_source: 'cmi_media',
          utm_medium: medium,
          utm_campaign: sanitizeForUTM(campaignName),
          utm_content: contentAsset.id,
          utm_term: `SEQ-${sequenceNum}`,
        };

        const cmParams: CMParameters = {
          cm_journey_id: campaignId,
          cm_node_seq: String(sequenceNum),
          cm_microsegment_id: sanitizeForCM(microseg.name),
          cm_brand: sanitizeForCM(brand),
          cm_audience: audienceType.toLowerCase(),
          cm_segment: sanitizeForCM(segment),
          cm_therapeutic_area: sanitizeForCM(therapeuticArea),
          cm_indication: indication ? sanitizeForCM(indication) : undefined,
        };

        registry.push({
          id: `IDR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'CONTENT',
          compositeKey: contentKey,
          campaignId,
          sequenceNumber: sequenceNum,
          contentId: contentAsset.id,
          microsegmentId: microseg.id,
          utmParameters: utmParams,
          cmParameters: cmParams,
          mintedAt: new Date(),
          mintedBy: currentUser,
          status: 'MINTED',
        });

        // Generate tracking URL
        const baseURL = contentAsset.fileUrl || `https://example.com/content/${contentAsset.id}`;
        const queryParams = { ...utmParams, ...cmParams };
        trackingURLs[`${nodeId}-${microseg.id}`] = `${baseURL}?${buildQueryString(queryParams as any)}`;
      });
    }
  });

  // Step 5: Mock Claravine validation (simulate API call)
  const claravineValidated = await mockClaravineValidation(registry);

  // Step 6: Mock S3 export (simulate file drop)
  const s3Path = await mockS3Export({
    campaignId,
    campaignName,
    brand,
    audienceType,
    segment,
    microsegments,
    nodes,
    nodeSequences,
    registry,
  });

  // Step 7: Mark all entries as ACTIVE
  registry.forEach((entry) => {
    entry.status = 'ACTIVE';
  });

  return {
    campaignId,
    activatedAt: new Date(),
    idRegistryEntries: registry,
    claravineValidated,
    s3ExportPath: s3Path,
    sequenceCount: nodeSequences.size,
    microsegmentCount: microsegments.length,
    trackingURLs,
  };
}

// Mint Campaign ID with format: CMP-{BRAND}-{YEAR}-{COUNTER}
function mintCampaignID(brand: string): string {
  const year = new Date().getFullYear();
  const counter = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `CMP-${brand.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${year}-${counter}`;
}

// Generate UTM parameters for campaign level
function generateCampaignUTMs(campaignName: string): UTMParameters {
  return {
    utm_source: 'cmi_media',
    utm_medium: 'multi',
    utm_campaign: sanitizeForUTM(campaignName),
  };
}

// Generate cm_* parameters for campaign level
function generateCampaignCMParams(params: {
  campaignId: string;
  brand: string;
  audienceType: string;
  segment: string;
  therapeuticArea: string;
  indication?: string;
}): CMParameters {
  return {
    cm_journey_id: params.campaignId,
    cm_node_seq: '-',
    cm_brand: sanitizeForCM(params.brand),
    cm_audience: params.audienceType.toLowerCase(),
    cm_segment: sanitizeForCM(params.segment),
    cm_therapeutic_area: sanitizeForCM(params.therapeuticArea),
    cm_indication: params.indication ? sanitizeForCM(params.indication) : undefined,
  };
}

// Mock Claravine validation (simulates API call with delay)
async function mockClaravineValidation(registry: IDRegistryEntry[]): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validate all entries
  const allValid = registry.every((entry) => {
    // Check required fields
    return (
      entry.campaignId &&
      entry.utmParameters.utm_source &&
      entry.utmParameters.utm_campaign &&
      entry.cmParameters.cm_journey_id &&
      entry.cmParameters.cm_brand
    );
  });

  return allValid;
}

// Mock S3 export (simulates file drop with delay)
async function mockS3Export(data: any): Promise<string> {
  // Simulate file generation delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate mock S3 path
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const s3Path = `s3://brandguard-campaigns/outbound/${data.campaignId}/${timestamp}/`;

  // In a real implementation, this would:
  // 1. Generate manifest.json
  // 2. Generate tracking_parameters.json
  // 3. Generate sequences.json
  // 4. Upload to S3 bucket
  // 5. Notify CMI Media of new file drop

  return s3Path;
}
