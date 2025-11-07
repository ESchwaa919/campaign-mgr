import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  ReactFlowInstance,
  useReactFlow,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Download, Upload, Plus, Play, Pause, BarChart3 } from 'lucide-react';
import { JourneyNode } from '@/components/JourneyNode';
import { ContentLibrary } from '@/components/ContentLibrary';
import { ContentDetailsPanel } from '@/components/ContentDetailsPanel';
import { NodeConfigDialog, WaitConfig, DecisionConfig } from '@/components/NodeConfigDialog';
import { mockSegments, mockCampaigns, mockContentLibrary } from '@/lib/mockData';
import type { ContentAsset, ContentChannel, Segment, JourneyStatus, JourneyNodeMetrics } from '@/types';

// Node types for React Flow
const nodeTypes: NodeTypes = {
  journey: JourneyNode,
};

// Node type configurations (full set for content library)
const nodeTypeConfigs = [
  { id: 'entry', label: 'Entry Point', nodeType: 'entry', channel: null },
  { id: 'email', label: 'Email', nodeType: 'email', channel: 'EMAIL' as ContentChannel },
  { id: 'web', label: 'Web Content', nodeType: 'web', channel: 'WEB' as ContentChannel },
  { id: 'mobile', label: 'Mobile Push', nodeType: 'mobile', channel: 'MOBILE' as ContentChannel },
  { id: 'segment', label: 'Audience Filter', nodeType: 'segment', channel: null },
  { id: 'wait', label: 'Wait', nodeType: 'wait', channel: null },
  { id: 'decision', label: 'Decision Split', nodeType: 'decision', channel: null },
];

// Simplified palette - only structural nodes (content comes from library)
const paletteNodes = [
  { id: 'wait', label: 'Wait', nodeType: 'wait', channel: null },
  { id: 'decision', label: 'Decision Split', nodeType: 'decision', channel: null },
];

// Mock data
const brands = [
  { id: '1', name: 'Eylea' },
  { id: '2', name: 'Dupixent' },
  { id: '3', name: 'Libtayo' },
];

const audienceTypes = ['HCP', 'PATIENT'];

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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Journey state
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [campaignLabel, setCampaignLabel] = useState('');
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  // Hierarchy filters (reduced set)
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedAudienceType, setSelectedAudienceType] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');

  // Content state
  const [selectedContent, setSelectedContent] = useState<ContentAsset | null>(null);

  // Journey lifecycle and tracking
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>('DESIGN');
  const [viewMode, setViewMode] = useState<'design' | 'analytics'>('design');

  // Node configuration dialog
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [configNodeType, setConfigNodeType] = useState<'wait' | 'decision'>('wait');
  const [pendingNodeConfig, setPendingNodeConfig] = useState<typeof nodeTypeConfigs[number] | null>(null);
  const [pendingNodePosition, setPendingNodePosition] = useState<{ x: number; y: number } | null>(null);

  // Mock metrics data (simulates live execution data)
  const mockNodeMetrics: Record<string, JourneyNodeMetrics> = useMemo(() => ({
    '1': {
      nodeId: '1',
      entered: 1500,
      completed: 1247,
      inProgress: 0,
      dropped: 253,
      sent: 1247,
      delivered: 1235,
    },
    'node-1': {
      nodeId: 'node-1',
      entered: 1247,
      completed: 892,
      inProgress: 123,
      dropped: 232,
      sent: 1247,
      delivered: 1235,
      opened: 892,
      clicked: 234,
      converted: 45,
    },
    'node-2': {
      nodeId: 'node-2',
      entered: 892,
      completed: 623,
      inProgress: 89,
      dropped: 180,
      averageTimeSpent: 86400, // 24 hours
    },
    'node-3': {
      nodeId: 'node-3',
      entered: 623,
      completed: 445,
      inProgress: 67,
      dropped: 111,
      sent: 623,
      delivered: 615,
      opened: 445,
      clicked: 167,
      converted: 89,
    },
  }), []);

  // Track active channels from nodes on canvas
  const activeChannels = useMemo(() => {
    const channels = new Set<ContentChannel>();

    nodes.forEach((node) => {
      const config = nodeTypeConfigs.find((c) => c.nodeType === node.data.nodeType);
      if (config?.channel) {
        channels.add(config.channel);
      }
    });

    return Array.from(channels);
  }, [nodes]);

  // Auto-generate campaign name
  const campaignName = useMemo(() => {
    const parts: string[] = [];

    // Add brand
    if (selectedBrand) {
      const brand = brands.find((b) => b.id === selectedBrand);
      if (brand) parts.push(brand.name);
    }

    // Add audience type
    if (selectedAudienceType) {
      parts.push(selectedAudienceType);
    }

    // Add channels (sorted alphabetically)
    if (activeChannels.length > 0) {
      const sortedChannels = [...activeChannels].sort();
      parts.push(...sortedChannels);
    }

    // Add custom label
    if (campaignLabel.trim()) {
      parts.push(campaignLabel.trim());
    }

    return parts.length > 0 ? parts.join(' ') : 'Untitled Journey';
  }, [selectedBrand, selectedAudienceType, activeChannels, campaignLabel]);

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
            label: '', // Will be updated based on view mode
            labelStyle: { fontSize: 11, fontWeight: 600 },
            labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
          },
          eds
        )
      ),
    []
  );

  // Handle canvas drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');

      if (!data || !reactFlowBounds || !reactFlowInstance) {
        console.log('Drop failed:', { data, reactFlowBounds, reactFlowInstance });
        return;
      }

      try {
        const { nodeConfig, contentAsset } = JSON.parse(data);

        // Convert screen coordinates to flow coordinates
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        console.log('Dropping at position:', position, 'from mouse:', {
          x: event.clientX,
          y: event.clientY
        });

        // For wait and decision nodes, show configuration dialog first
        if (nodeConfig.nodeType === 'wait' || nodeConfig.nodeType === 'decision') {
          setPendingNodeConfig(nodeConfig);
          setPendingNodePosition(position);
          setConfigNodeType(nodeConfig.nodeType);
          setConfigDialogOpen(true);
          return;
        }

        // For content nodes and other nodes, add immediately
        const newNode: Node = {
          id: `node-${nodeIdCounter}`,
          type: 'journey',
          data: {
            label: nodeConfig.label,
            nodeType: nodeConfig.nodeType,
            contentAsset: contentAsset || undefined,
            viewMode,
            metrics: mockNodeMetrics[`node-${nodeIdCounter}`],
          },
          position,
        };

        setNodes((nds) => [...nds, newNode]);
        setNodeIdCounter((c) => c + 1);
      } catch (error) {
        console.error('Error parsing drop data:', error);
      }
    },
    [reactFlowInstance, nodeIdCounter]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Filtered segments based on audience type
  const filteredSegments = useMemo(() => {
    let segments = mockSegments;

    if (selectedAudienceType) {
      segments = segments.filter((seg) => {
        if (selectedAudienceType === 'HCP') {
          return seg.name.toLowerCase().includes('hcp') || seg.segmentType !== 'BEHAVIOURAL';
        }
        return true;
      });
    }

    return segments;
  }, [selectedAudienceType]);

  // Smart filtered content - uses brand, audience, and ACTIVE CHANNELS from canvas
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

    // Filter by active channels on canvas
    if (activeChannels.length > 0) {
      content = content.filter((c) => activeChannels.includes(c.channel));
    }

    return content;
  }, [selectedBrand, selectedAudienceType, activeChannels]);

  // Reset downstream filters when upstream changes
  useEffect(() => {
    if (selectedAudienceType) {
      setSelectedSegment('');
    }
  }, [selectedAudienceType]);

  // Update node data when view mode changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          viewMode,
          metrics: mockNodeMetrics[node.id],
        },
      }))
    );
  }, [viewMode, mockNodeMetrics]);

  // Update edge labels when view mode changes
  useEffect(() => {
    if (viewMode === 'analytics') {
      setEdges((eds) =>
        eds.map((edge) => {
          // Get metrics for target node to show how many entered it
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

  // Add node to canvas from palette
  const addNodeFromPalette = (nodeConfig: typeof nodeTypeConfigs[number]) => {
    // For wait and decision nodes, show configuration dialog first
    if (nodeConfig.nodeType === 'wait' || nodeConfig.nodeType === 'decision') {
      setPendingNodeConfig(nodeConfig);
      setPendingNodePosition({
        x: 300 + Math.random() * 200,
        y: 200 + Math.random() * 200,
      });
      setConfigNodeType(nodeConfig.nodeType);
      setConfigDialogOpen(true);
      return;
    }

    // For other nodes, add immediately
    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type: 'journey',
      data: {
        label: nodeConfig.label,
        nodeType: nodeConfig.nodeType,
      },
      position: {
        x: 300 + Math.random() * 200,
        y: 200 + Math.random() * 200,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
  };

  // Handle node configuration save
  const handleNodeConfigSave = (config: WaitConfig | DecisionConfig) => {
    if (!pendingNodeConfig || !pendingNodePosition) return;

    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type: 'journey',
      data: {
        label: pendingNodeConfig.label,
        nodeType: pendingNodeConfig.nodeType,
        viewMode,
        metrics: mockNodeMetrics[`node-${nodeIdCounter}`],
        ...(configNodeType === 'wait' ? { waitConfig: config as WaitConfig } : {}),
        ...(configNodeType === 'decision' ? { decisionConfig: config as DecisionConfig } : {}),
      },
      position: pendingNodePosition,
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);

    // Clear pending state
    setPendingNodeConfig(null);
    setPendingNodePosition(null);
  };

  // Add node with content from details panel
  const addContentToCanvas = (content: ContentAsset) => {
    const channelToNodeType: Record<string, string> = {
      EMAIL: 'email',
      WEB: 'web',
      MOBILE: 'mobile',
    };

    const nodeType = channelToNodeType[content.channel] || 'email';
    const nodeConfig = nodeTypeConfigs.find((n) => n.nodeType === nodeType)!;

    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type: 'journey',
      data: {
        label: nodeConfig.label,
        nodeType: nodeConfig.nodeType,
        contentAsset: content,
      },
      position: {
        x: 300 + Math.random() * 200,
        y: 200 + Math.random() * 200,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
    setSelectedContent(null);
  };

  // Handle content drag start
  const handleContentDragStart = (content: ContentAsset) => {
    const channelToNodeType: Record<string, string> = {
      EMAIL: 'email',
      WEB: 'web',
      MOBILE: 'mobile',
    };

    const nodeType = channelToNodeType[content.channel] || 'email';
    const nodeConfig = nodeTypeConfigs.find((n) => n.nodeType === nodeType)!;

    return { nodeConfig, contentAsset: content };
  };

  // Handle node palette drag start
  const handleNodeDragStart = (event: React.DragEvent, nodeConfig: typeof nodeTypeConfigs[number]) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeConfig, contentAsset: null })
    );
  };

  // Save/load journey
  const saveJourney = () => {
    const journey = {
      name: campaignName,
      brand: selectedBrand,
      audienceType: selectedAudienceType,
      segment: selectedSegment,
      label: campaignLabel,
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
      setSelectedBrand(journey.brand || '');
      setSelectedAudienceType(journey.audienceType || '');
      setSelectedSegment(journey.segment || '');
      setCampaignLabel(journey.label || '');
      setNodes(journey.nodes);
      setEdges(journey.edges);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Journey Canvas</h1>
              <p className="text-sm text-muted-foreground">
                {viewMode === 'design'
                  ? 'Select filters → Drag content → Build journey'
                  : 'Live execution tracking and performance metrics'}
              </p>
            </div>
            {/* Journey Status Badge */}
            <Badge
              variant={journeyStatus === 'ACTIVE' ? 'default' : 'secondary'}
              className="h-6 text-xs"
            >
              {journeyStatus === 'DESIGN' && '🎨 Design'}
              {journeyStatus === 'REVIEW' && '🔍 In Review'}
              {journeyStatus === 'APPROVED' && '✅ Approved'}
              {journeyStatus === 'ACTIVE' && '▶️ Active'}
              {journeyStatus === 'COMPLETE' && '📊 Complete'}
              {journeyStatus === 'PAUSED' && '⏸️ Paused'}
            </Badge>
          </div>
          <div className="flex gap-3 items-center">
            {/* View Mode Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'design' | 'analytics')}>
              <TabsList className="h-9">
                <TabsTrigger value="design" className="text-xs">
                  Design
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs" disabled={journeyStatus === 'DESIGN'}>
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Journey Actions */}
            {journeyStatus === 'DESIGN' && (
              <Button
                size="sm"
                variant="default"
                onClick={() => setJourneyStatus('ACTIVE')}
              >
                <Play className="h-4 w-4 mr-2" />
                Activate Journey
              </Button>
            )}
            {journeyStatus === 'ACTIVE' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setJourneyStatus('PAUSED')}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={loadJourney}>
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            <Button variant="outline" size="sm" onClick={saveJourney}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Simplified 3-Level Hierarchy + Campaign Name + Channels Display */}
        <div className="space-y-3">
          {/* Row 1: Core Filters */}
          <div className="grid grid-cols-4 gap-3">
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

            {/* Optional Campaign Label */}
            <div className="space-y-1">
              <Label htmlFor="campaign-label" className="text-xs">
                Optional Label
              </Label>
              <Input
                id="campaign-label"
                placeholder="e.g., Q4 Launch"
                value={campaignLabel}
                onChange={(e) => setCampaignLabel(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Row 2: Auto-Generated Campaign Name & Active Channels */}
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="grid grid-cols-2 gap-4">
              {/* Auto-Generated Campaign Name */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Campaign Name (Auto-Generated)
                </p>
                <p className="text-sm font-semibold">{campaignName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Format: Brand + Audience + Channels + Label
                </p>
              </div>

              {/* Active Channels (from canvas nodes) */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Active Channels (from canvas)
                </p>
                {activeChannels.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {activeChannels.map((channel) => (
                      <Badge key={channel} variant="default" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Drag Email/Web/Mobile nodes to canvas to activate channels
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Simplified Node Palette - Only Structural Nodes */}
        <Card className="w-40 m-4 mr-0 rounded-r-none border-r-0 flex flex-col">
          <CardContent className="p-3 space-y-2 flex-1 overflow-auto">
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground">Flow Control</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Content → drag from right
              </p>
            </div>
            {paletteNodes.map((config) => (
              <div
                key={config.id}
                draggable
                onDragStart={(e) => handleNodeDragStart(e, config)}
                onClick={() => addNodeFromPalette(config)}
                className="cursor-move"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-8 text-xs pointer-events-none"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {config.label}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <div
          ref={reactFlowWrapper}
          className="flex-1 m-4 ml-0 border rounded-lg bg-background"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
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
            onContentDrag={(content) => {
              const dragData = handleContentDragStart(content);
              // This is called on drag start, actual drag is handled by the component
            }}
            selectedContentId={selectedContent?.id}
          />
        </div>

        {/* Content Details Panel */}
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

      {/* Node Configuration Dialog */}
      <NodeConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        nodeType={configNodeType}
        onSave={handleNodeConfigSave}
      />
    </div>
  );
}
