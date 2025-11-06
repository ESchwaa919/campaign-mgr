import { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
  MarkerType,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Download, Upload, Plus } from 'lucide-react';
import { JourneyNode } from '@/components/JourneyNode';
import { ContentLibrary } from '@/components/ContentLibrary';
import { ContentDetailsPanel } from '@/components/ContentDetailsPanel';
import { mockSegments, mockCampaigns, mockContentLibrary } from '@/lib/mockData';
import type { ContentAsset, ContentChannel, Segment } from '@/types';

// Node types for React Flow
const nodeTypes: NodeTypes = {
  journey: JourneyNode,
};

// Node type configurations
const nodeTypeConfigs = [
  { id: 'entry', label: 'Entry Point', nodeType: 'entry' },
  { id: 'email', label: 'Email', nodeType: 'email' },
  { id: 'web', label: 'Web Content', nodeType: 'web' },
  { id: 'mobile', label: 'Mobile Push', nodeType: 'mobile' },
  { id: 'segment', label: 'Audience Filter', nodeType: 'segment' },
  { id: 'wait', label: 'Wait', nodeType: 'wait' },
  { id: 'decision', label: 'Decision Split', nodeType: 'decision' },
];

// Mock data
const brands = [
  { id: '1', name: 'Eylea' },
  { id: '2', name: 'Dupixent' },
  { id: '3', name: 'Libtayo' },
];

const audienceTypes = ['HCP', 'PATIENT'];
const channels: ContentChannel[] = ['EMAIL', 'WEB', 'MOBILE', 'PAID_MEDIA', 'FIELD_SALES'];

// Initial node for canvas
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'journey',
    data: { label: 'Journey Start', nodeType: 'entry' },
    position: { x: 250, y: 100 },
  },
];

const initialEdges: Edge[] = [];

export default function Journey() {
  // Journey state
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [journeyName, setJourneyName] = useState('');
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  // Hierarchy filters
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedAudienceType, setSelectedAudienceType] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<ContentChannel | ''>('');

  // Content state
  const [selectedContent, setSelectedContent] = useState<ContentAsset | null>(null);
  const [draggedContent, setDraggedContent] = useState<ContentAsset | null>(null);

  // React Flow handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );

  // Filtered segments based on brand and audience type
  const filteredSegments = useMemo(() => {
    let segments = mockSegments;

    // Filter by audience type (HCP segments vs Patient segments)
    if (selectedAudienceType) {
      // This is simplified - in production, segments would have explicit audience type
      segments = segments.filter((seg) => {
        if (selectedAudienceType === 'HCP') {
          return seg.name.toLowerCase().includes('hcp') || seg.segmentType !== 'BEHAVIOURAL';
        }
        return true;
      });
    }

    return segments;
  }, [selectedAudienceType]);

  // Filtered campaigns based on brand
  const filteredCampaigns = useMemo(() => {
    if (!selectedBrand) return mockCampaigns;
    return mockCampaigns.filter((campaign) => campaign.productId === selectedBrand);
  }, [selectedBrand]);

  // Smart filtered content with cascading logic
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

    // Filter by channel
    if (selectedChannel) {
      content = content.filter((c) => c.channel === selectedChannel);
    }

    // Filter by campaign (via linked claims)
    if (selectedCampaign) {
      const campaign = mockCampaigns.find((c) => c.id === selectedCampaign);
      if (campaign) {
        content = content.filter((c) =>
          c.linkedClaimIds.some((claimId) => campaign.linkedClaimIds.includes(claimId))
        );
      }
    }

    return content;
  }, [selectedBrand, selectedAudienceType, selectedChannel, selectedCampaign]);

  // Reset downstream filters when upstream changes
  useEffect(() => {
    if (selectedBrand) {
      setSelectedCampaign('');
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedAudienceType) {
      setSelectedSegment('');
    }
  }, [selectedAudienceType]);

  // Add node to canvas
  const addNode = (nodeConfig: typeof nodeTypeConfigs[number], content?: ContentAsset) => {
    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type: 'journey',
      data: {
        label: nodeConfig.label,
        nodeType: nodeConfig.nodeType,
        contentAsset: content,
      },
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 200,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
  };

  // Add node with content from details panel
  const addContentToCanvas = (content: ContentAsset) => {
    // Determine node type based on content channel
    const channelToNodeType: Record<string, string> = {
      EMAIL: 'email',
      WEB: 'web',
      MOBILE: 'mobile',
    };

    const nodeType = channelToNodeType[content.channel] || 'email';
    const nodeConfig = nodeTypeConfigs.find((n) => n.nodeType === nodeType)!;

    addNode(nodeConfig, content);
    setSelectedContent(null);
  };

  // Save/load journey
  const saveJourney = () => {
    const journey = {
      name: journeyName,
      brand: selectedBrand,
      audienceType: selectedAudienceType,
      segment: selectedSegment,
      campaign: selectedCampaign,
      channel: selectedChannel,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('savedJourney', JSON.stringify(journey));
  };

  const loadJourney = () => {
    const saved = localStorage.getItem('savedJourney');
    if (saved) {
      const journey = JSON.parse(saved);
      setJourneyName(journey.name);
      setSelectedBrand(journey.brand || '');
      setSelectedAudienceType(journey.audienceType || '');
      setSelectedSegment(journey.segment || '');
      setSelectedCampaign(journey.campaign || '');
      setSelectedChannel(journey.channel || '');
      setNodes(journey.nodes);
      setEdges(journey.edges);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Journey Canvas</h1>
            <p className="text-sm text-muted-foreground">
              Visual campaign journey builder with smart content filtering
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadJourney}>
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            <Button variant="outline" size="sm" onClick={saveJourney}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Complete 6-Level Hierarchy Filters */}
        <div className="grid grid-cols-6 gap-3">
          {/* 1. Brand */}
          <div className="space-y-1">
            <Label htmlFor="brand" className="text-xs">
              1. Brand
            </Label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger id="brand" className="h-9">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Target Audience */}
          <div className="space-y-1">
            <Label htmlFor="audience-type" className="text-xs">
              2. Target Audience
            </Label>
            <Select value={selectedAudienceType} onValueChange={setSelectedAudienceType}>
              <SelectTrigger id="audience-type" className="h-9">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {audienceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Audience Segment */}
          <div className="space-y-1">
            <Label htmlFor="segment" className="text-xs">
              3. Segment
            </Label>
            <Select
              value={selectedSegment}
              onValueChange={setSelectedSegment}
              disabled={!selectedAudienceType}
            >
              <SelectTrigger id="segment" className="h-9">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                {filteredSegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name} ({segment.estimatedCount.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. Campaign */}
          <div className="space-y-1">
            <Label htmlFor="campaign" className="text-xs">
              4. Campaign
            </Label>
            <Select
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
              disabled={!selectedBrand}
            >
              <SelectTrigger id="campaign" className="h-9">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {filteredCampaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 5. Channel */}
          <div className="space-y-1">
            <Label htmlFor="channel" className="text-xs">
              5. Channel
            </Label>
            <Select value={selectedChannel} onValueChange={(v) => setSelectedChannel(v as ContentChannel | '')}>
              <SelectTrigger id="channel" className="h-9">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 6. Journey Name */}
          <div className="space-y-1">
            <Label htmlFor="journey-name" className="text-xs">
              Journey Name
            </Label>
            <Input
              id="journey-name"
              placeholder="e.g., Q4 HCP Launch"
              value={journeyName}
              onChange={(e) => setJourneyName(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        {/* Filter Context Badges */}
        {(selectedBrand || selectedAudienceType || selectedSegment || selectedCampaign || selectedChannel) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Context:</span>
            {selectedBrand && (
              <Badge variant="outline" className="text-xs">
                {brands.find((b) => b.id === selectedBrand)?.name}
              </Badge>
            )}
            {selectedAudienceType && (
              <Badge variant="outline" className="text-xs">
                {selectedAudienceType}
              </Badge>
            )}
            {selectedSegment && (
              <Badge variant="outline" className="text-xs">
                {filteredSegments.find((s) => s.id === selectedSegment)?.name}
              </Badge>
            )}
            {selectedCampaign && (
              <Badge variant="outline" className="text-xs">
                {filteredCampaigns.find((c) => c.id === selectedCampaign)?.name}
              </Badge>
            )}
            {selectedChannel && (
              <Badge variant="outline" className="text-xs">
                {selectedChannel}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <Card className="w-48 m-4 mr-0 rounded-r-none border-r-0 flex flex-col">
          <CardContent className="p-3 space-y-1 flex-1 overflow-auto">
            <p className="text-xs font-medium text-muted-foreground mb-2">Node Types</p>
            {nodeTypeConfigs.map((config) => (
              <Button
                key={config.id}
                variant="outline"
                size="sm"
                className="w-full justify-start h-8 text-xs"
                onClick={() => addNode(config)}
              >
                <Plus className="h-3 w-3 mr-2" />
                {config.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <div className="flex-1 m-4 ml-0 border rounded-lg bg-background">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        {/* Content Library */}
        <div className="m-4 ml-0">
          <ContentLibrary
            content={filteredContent}
            totalCount={mockContentLibrary.length}
            onContentSelect={setSelectedContent}
            onContentDrag={setDraggedContent}
            selectedContentId={selectedContent?.id}
          />
        </div>

        {/* Content Details Panel (overlays on right when content selected) */}
        {selectedContent && (
          <div className="absolute right-4 top-32 bottom-4 z-10">
            <ContentDetailsPanel
              content={selectedContent}
              onClose={() => setSelectedContent(null)}
              onAddToCanvas={addContentToCanvas}
            />
          </div>
        )}
      </div>
    </div>
  );
}
