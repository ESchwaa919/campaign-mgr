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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save, Download, Upload, Plus, Play, Pause, BarChart3, RotateCcw, Trash2 } from 'lucide-react';
import { JourneyNode } from '@/components/JourneyNode';
import { ContentLibrary } from '@/components/ContentLibrary';
import { ContentDetailsPanel } from '@/components/ContentDetailsPanel';
import { NodeConfigDialog, type NodeConfig } from '@/components/NodeConfigDialog';
import { SequenceDashboard } from '@/components/SequenceDashboard';
import { mockSegments, mockCampaigns, mockContentLibrary } from '@/lib/mockData';
import type {
  ContentAsset,
  ContentChannel,
  Segment,
  JourneyStatus,
  JourneyNodeMetrics,
  WaitConfig,
  DecisionConfig,
  SuppressionConfig,
  ABTestConfig,
  AttributionConfig,
  ScoreConfig,
} from '@/types';

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
  { id: 'social', label: 'Social Media', nodeType: 'social', channel: 'SOCIAL' as ContentChannel },
  { id: 'paid-social', label: 'Paid Social', nodeType: 'paid-social', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'paid-search', label: 'Paid Search', nodeType: 'paid-search', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'paid-display', label: 'Paid Display', nodeType: 'paid-display', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'print', label: 'Print Media', nodeType: 'print', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'tv-radio', label: 'TV/Radio', nodeType: 'tv-radio', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'ooh', label: 'Out-of-Home', nodeType: 'ooh', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'segment', label: 'Audience Filter', nodeType: 'segment', channel: null },
  { id: 'wait', label: 'Wait', nodeType: 'wait', channel: null },
  { id: 'decision', label: 'Decision Split', nodeType: 'decision', channel: null },
  { id: 'abtest', label: 'A/B Test', nodeType: 'abtest', channel: null },
  { id: 'attribution', label: 'Attribution Point', nodeType: 'attribution', channel: null },
  { id: 'score', label: 'Update Score', nodeType: 'score', channel: null },
  { id: 'suppression', label: 'Suppression', nodeType: 'suppression', channel: null },
];

// Palette nodes - structural + content touchpoints (can add without content, attach later)
const paletteNodes = [
  { id: 'email', label: 'Email', nodeType: 'email', channel: 'EMAIL' as ContentChannel },
  { id: 'web', label: 'Web Content', nodeType: 'web', channel: 'WEB' as ContentChannel },
  { id: 'mobile', label: 'Mobile Push', nodeType: 'mobile', channel: 'MOBILE' as ContentChannel },
  { id: 'social', label: 'Social Media', nodeType: 'social', channel: 'SOCIAL' as ContentChannel },
  { id: 'paid-social', label: 'Paid Social', nodeType: 'paid-social', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'paid-search', label: 'Paid Search', nodeType: 'paid-search', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'paid-display', label: 'Paid Display', nodeType: 'paid-display', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'print', label: 'Print Media', nodeType: 'print', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'tv-radio', label: 'TV/Radio', nodeType: 'tv-radio', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'ooh', label: 'Out-of-Home', nodeType: 'ooh', channel: 'PAID_MEDIA' as ContentChannel },
  { id: 'wait', label: 'Wait', nodeType: 'wait', channel: null },
  { id: 'decision', label: 'Decision Split', nodeType: 'decision', channel: null },
  { id: 'suppression', label: 'Suppression', nodeType: 'suppression', channel: null },
  { id: 'abtest', label: 'A/B Test', nodeType: 'abtest', channel: null },
  { id: 'attribution', label: 'Attribution Point', nodeType: 'attribution', channel: null },
  { id: 'score', label: 'Update Score', nodeType: 'score', channel: null },
];

// Mock data - Ophthalmology brands
const brands = [
  { id: '1', name: 'Eylea', therapeuticArea: 'Retina', indications: ['Wet AMD', 'DME', 'Diabetic Retinopathy', 'RVO'] },
  { id: '2', name: 'Lucentis', therapeuticArea: 'Retina', indications: ['Wet AMD', 'DME', 'RVO', 'Myopic CNV'] },
  { id: '3', name: 'Beovu', therapeuticArea: 'Retina', indications: ['Wet AMD'] },
];

const audienceTypes = ['HCP', 'PATIENT'];

// Pre-built Journey Templates for demonstration
interface JourneyTemplate {
  id: string;
  name: string;
  description: string;
  brand: string;
  audienceType: 'HCP' | 'PATIENT';
  segment: string;
  label: string;
  nodes: Node[];
  edges: Edge[];
}

const savedJourneyTemplates: JourneyTemplate[] = [
  // Template 1: Wet AMD New Product Launch
  {
    id: 'template-1',
    name: 'Wet AMD New Product Launch',
    description: 'Multi-channel campaign launching Eylea to high-volume retina specialists with HAWK study data',
    brand: '1', // Eylea
    audienceType: 'HCP',
    segment: '1', // Retina Specialists - High Volume
    label: 'Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch',
    nodes: [
      { id: 'node-1', type: 'journey', position: { x: 50, y: 250 }, data: { label: 'Journey Start', nodeType: 'entry' } },
      { id: 'node-2', type: 'journey', position: { x: 300, y: 250 }, data: { label: 'HAWK Study Email', nodeType: 'email', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0001') } },
      { id: 'node-3', type: 'journey', position: { x: 550, y: 250 }, data: { label: 'Wait 48h', nodeType: 'wait', waitConfig: { type: 'time', duration: 48, durationUnit: 'hours' } } },
      { id: 'node-4', type: 'journey', position: { x: 800, y: 250 }, data: { label: 'Email Opened?', nodeType: 'decision', decisionConfig: { criterion: 'email_opened', paths: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] } } },
      { id: 'node-5a', type: 'journey', position: { x: 1050, y: 100 }, data: { label: 'LinkedIn Thought Leadership', nodeType: 'paid-social', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0011') } },
      { id: 'node-5b', type: 'journey', position: { x: 1050, y: 400 }, data: { label: 'Email Resend', nodeType: 'email', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0001') } },
      { id: 'node-6', type: 'journey', position: { x: 1300, y: 250 }, data: { label: 'Retina Times Ad', nodeType: 'print', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0040') } },
      { id: 'node-7', type: 'journey', position: { x: 1550, y: 250 }, data: { label: 'Rep Meeting', nodeType: 'attribution' } },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3-4', source: 'node-3', target: 'node-4', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e4-5a', source: 'node-4', sourceHandle: 'path-0', target: 'node-5a', type: 'default', markerEnd: { type: MarkerType.ArrowClosed }, label: 'Yes' },
      { id: 'e4-5b', source: 'node-4', sourceHandle: 'path-1', target: 'node-5b', type: 'default', markerEnd: { type: MarkerType.ArrowClosed }, label: 'No' },
      { id: 'e5a-6', source: 'node-5a', target: 'node-6', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e5b-6', source: 'node-5b', target: 'node-6', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e6-7', source: 'node-6', target: 'node-7', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
    ],
  },

  // Template 2: Patient Adherence Journey
  {
    id: 'template-2',
    name: 'Patient Treatment Adherence',
    description: 'Multi-touchpoint campaign to improve injection appointment adherence for DME patients',
    brand: '1', // Eylea
    audienceType: 'PATIENT',
    segment: '8', // DME Patients - Active Treatment
    label: 'Eylea PATIENT DME Patients EMAIL MOBILE WEB Q3 Adherence',
    nodes: [
      { id: 'node-1', type: 'journey', position: { x: 50, y: 250 }, data: { label: 'Journey Start', nodeType: 'entry' } },
      { id: 'node-2', type: 'journey', position: { x: 300, y: 250 }, data: { label: 'Welcome Email', nodeType: 'email', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0500') } },
      { id: 'node-3', type: 'journey', position: { x: 550, y: 250 }, data: { label: 'Wait 3 Days', nodeType: 'wait', waitConfig: { type: 'time', duration: 3, durationUnit: 'days' } } },
      { id: 'node-4', type: 'journey', position: { x: 800, y: 250 }, data: { label: 'Patient Portal Access', nodeType: 'web', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0510') } },
      { id: 'node-5', type: 'journey', position: { x: 1050, y: 250 }, data: { label: 'Wait 1 Week', nodeType: 'wait', waitConfig: { type: 'time', duration: 7, durationUnit: 'days' } } },
      { id: 'node-6', type: 'journey', position: { x: 1300, y: 250 }, data: { label: 'Appointment Reminder', nodeType: 'mobile', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0520') } },
      { id: 'node-7', type: 'journey', position: { x: 1550, y: 250 }, data: { label: 'Injection Completed', nodeType: 'attribution' } },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3-4', source: 'node-3', target: 'node-4', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e4-5', source: 'node-4', target: 'node-5', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e5-6', source: 'node-5', target: 'node-6', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e6-7', source: 'node-6', target: 'node-7', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
    ],
  },

  // Template 3: Patient DTC Awareness Campaign
  {
    id: 'template-3',
    name: 'Patient DTC AMD Awareness',
    description: 'Direct-to-consumer campaign for newly diagnosed wet AMD patients with paid media',
    brand: '1', // Eylea
    audienceType: 'PATIENT',
    segment: '7', // Wet AMD Patients - Newly Diagnosed
    label: 'Eylea PATIENT Newly Diagnosed EMAIL PAID_DISPLAY WEB Q4 DTC Awareness',
    nodes: [
      { id: 'node-1', type: 'journey', position: { x: 50, y: 250 }, data: { label: 'Journey Start', nodeType: 'entry' } },
      { id: 'node-2', type: 'journey', position: { x: 300, y: 250 }, data: { label: 'Suppression Filter', nodeType: 'suppression' } },
      { id: 'node-3', type: 'journey', position: { x: 550, y: 250 }, data: { label: 'Educational Email', nodeType: 'email', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0500') } },
      { id: 'node-4', type: 'journey', position: { x: 800, y: 250 }, data: { label: 'Display Retargeting', nodeType: 'paid-display', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0561') } },
      { id: 'node-5', type: 'journey', position: { x: 1050, y: 250 }, data: { label: 'AMD Education Article', nodeType: 'web', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0511') } },
      { id: 'node-6', type: 'journey', position: { x: 1300, y: 250 }, data: { label: 'Financial Assistance', nodeType: 'web', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0512') } },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3-4', source: 'node-3', target: 'node-4', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e4-5', source: 'node-4', target: 'node-5', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e5-6', source: 'node-5', target: 'node-6', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
    ],
  },

  // Template 4: HCP CME & Education
  {
    id: 'template-4',
    name: 'HCP Continuing Education',
    description: 'Multi-channel educational campaign with CME module for comprehensive ophthalmologists',
    brand: '2', // Lucentis
    audienceType: 'HCP',
    segment: '4', // Comprehensive Ophthalmologists
    label: 'Lucentis HCP Comprehensive Ophthalmologists EMAIL WEB PAID_SOCIAL Q2 CME Education',
    nodes: [
      { id: 'node-1', type: 'journey', position: { x: 50, y: 250 }, data: { label: 'Journey Start', nodeType: 'entry' } },
      { id: 'node-2', type: 'journey', position: { x: 300, y: 250 }, data: { label: 'CME Invitation Email', nodeType: 'email', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0100') } },
      { id: 'node-3', type: 'journey', position: { x: 550, y: 250 }, data: { label: 'Opened?', nodeType: 'decision', decisionConfig: { criterion: 'email_opened', paths: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] } } },
      { id: 'node-4a', type: 'journey', position: { x: 800, y: 100 }, data: { label: 'CME Module', nodeType: 'web', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0531') } },
      { id: 'node-5a', type: 'journey', position: { x: 1050, y: 100 }, data: { label: 'Completed CME', nodeType: 'attribution' } },
      { id: 'node-4b', type: 'journey', position: { x: 800, y: 400 }, data: { label: 'LinkedIn Retargeting', nodeType: 'paid-social', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0110') } },
      { id: 'node-5b', type: 'journey', position: { x: 1050, y: 400 }, data: { label: 'Resend Email', nodeType: 'email', contentAsset: mockContentLibrary.find(c => c.id === 'CNT-2024-0101') } },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3-4a', source: 'node-3', sourceHandle: 'path-0', target: 'node-4a', type: 'default', markerEnd: { type: MarkerType.ArrowClosed }, label: 'Yes' },
      { id: 'e4a-5a', source: 'node-4a', target: 'node-5a', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3-4b', source: 'node-3', sourceHandle: 'path-1', target: 'node-4b', type: 'default', markerEnd: { type: MarkerType.ArrowClosed }, label: 'No' },
      { id: 'e4b-5b', source: 'node-4b', target: 'node-5b', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
    ],
  },
];

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
  const [showSequenceDashboard, setShowSequenceDashboard] = useState(false);

  // Node configuration dialog
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [configNodeType, setConfigNodeType] = useState<'wait' | 'decision' | 'suppression' | 'abtest' | 'attribution' | 'score'>('wait');
  const [pendingNodeConfig, setPendingNodeConfig] = useState<typeof nodeTypeConfigs[number] | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);

  // Journey template dialog
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [pendingNodePosition, setPendingNodePosition] = useState<{ x: number; y: number } | null>(null);

  // Node editing dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [nodeToEdit, setNodeToEdit] = useState<Node | null>(null);
  const [editedLabel, setEditedLabel] = useState('');

  // Saved journeys dialog
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [savedJourneys, setSavedJourneys] = useState<any[]>([]);

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
      averageTimeSpent: 172800, // 48 hours
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
    'node-4': {
      nodeId: 'node-4',
      entered: 355,
      completed: 245,
      inProgress: 34,
      dropped: 76,
      sent: 355,
      delivered: 350,
      opened: 245,
      clicked: 98,
      converted: 56,
    },
    'node-5': {
      nodeId: 'node-5',
      entered: 268,
      completed: 189,
      inProgress: 28,
      dropped: 51,
      sent: 268,
      delivered: 265,
      opened: 189,
      clicked: 76,
      converted: 34,
    },
    'node-6': {
      nodeId: 'node-6',
      entered: 189,
      completed: 134,
      inProgress: 22,
      dropped: 33,
      averageTimeSpent: 259200, // 72 hours
    },
    'node-7': {
      nodeId: 'node-7',
      entered: 134,
      completed: 98,
      inProgress: 15,
      dropped: 21,
      sent: 134,
      delivered: 132,
      opened: 98,
      clicked: 45,
      converted: 23,
    },
    'node-8': {
      nodeId: 'node-8',
      entered: 98,
      completed: 72,
      inProgress: 11,
      dropped: 15,
    },
    'node-9': {
      nodeId: 'node-9',
      entered: 72,
      completed: 56,
      inProgress: 8,
      dropped: 8,
      sent: 72,
      delivered: 71,
      opened: 56,
      clicked: 28,
      converted: 15,
    },
    'node-10': {
      nodeId: 'node-10',
      entered: 56,
      completed: 45,
      inProgress: 6,
      dropped: 5,
    },
  }), []);

  // Calculate sequence numbers for all nodes (topological order from entry point)
  const nodeSequences = useMemo(() => {
    const sequences = new Map<string, number>();
    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; sequence: number }> = [];

    // Find entry node
    const entryNode = nodes.find((n) => n.data.nodeType === 'entry');
    if (entryNode) {
      queue.push({ nodeId: entryNode.id, sequence: 1 });
      visited.add(entryNode.id);
    }

    // BFS traversal to assign sequences
    while (queue.length > 0) {
      const { nodeId, sequence } = queue.shift()!;
      sequences.set(nodeId, sequence);

      // Find all edges from this node
      const outgoingEdges = edges.filter((e) => e.source === nodeId);
      outgoingEdges.forEach((edge) => {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          queue.push({ nodeId: edge.target, sequence: sequence + 1 });
        }
      });
    }

    return sequences;
  }, [nodes, edges]);

  // Enrich nodes with sequence numbers for display
  const enrichedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        sequence: nodeSequences.get(node.id),
        viewMode,
        metrics: mockNodeMetrics[node.id],
      },
    }));
  }, [nodes, nodeSequences, viewMode, mockNodeMetrics]);

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

    // Add segment name (shortened if too long)
    if (selectedSegment) {
      const segment = mockSegments.find((s) => s.id === selectedSegment);
      if (segment) {
        const segmentName = segment.name.replace('Segment:', '').trim();
        parts.push(segmentName);
      }
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
  }, [selectedBrand, selectedAudienceType, selectedSegment, activeChannels, campaignLabel]);

  // React Flow handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle node click - just select the node
  const onNodeClick = useCallback((_event: React.MouseEvent, _node: Node) => {
    // Node selection is handled by React Flow
    // Configuration is now handled by double-click
  }, []);

  // Handle dropping content onto existing nodes
  const onNodeDrop = useCallback((event: React.DragEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();

    const data = event.dataTransfer.getData('application/reactflow');
    if (!data) return;

    try {
      const { contentAsset } = JSON.parse(data);
      if (!contentAsset) return;

      // Update the node with the content
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  contentAsset,
                },
              }
            : n
        )
      );
    } catch (error) {
      console.error('Error attaching content to node:', error);
    }
  }, []);

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

        // Check if dropping onto an existing node
        const targetNode = nodes.find((node) => {
          const nodeElem = document.querySelector(`[data-id="${node.id}"]`);
          if (!nodeElem) return false;
          const bounds = nodeElem.getBoundingClientRect();
          return (
            event.clientX >= bounds.left &&
            event.clientX <= bounds.right &&
            event.clientY >= bounds.top &&
            event.clientY <= bounds.bottom
          );
        });

        // If dropping content onto an existing content node, merge it
        const contentNodeTypes = ['email', 'web', 'mobile', 'social', 'paid-social', 'paid-search', 'paid-display', 'print', 'tv-radio', 'ooh'];
        if (targetNode && contentAsset && contentNodeTypes.includes(targetNode.data.nodeType)) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === targetNode.id
                ? {
                    ...n,
                    data: {
                      ...n.data,
                      contentAsset,
                    },
                  }
                : n
            )
          );
          return;
        }

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
    [reactFlowInstance, nodeIdCounter, nodes, viewMode, mockNodeMetrics]
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
  const handleNodeConfigSave = (config: NodeConfig) => {
    if (editingNode) {
      // Editing existing node
      setNodes((nds) =>
        nds.map((n) =>
          n.id === editingNode.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...(configNodeType === 'wait' ? { waitConfig: config as WaitConfig } : {}),
                  ...(configNodeType === 'decision' ? { decisionConfig: config as DecisionConfig } : {}),
                  ...(configNodeType === 'suppression' ? { suppressionConfig: config as SuppressionConfig } : {}),
                  ...(configNodeType === 'abtest' ? { abtestConfig: config as ABTestConfig } : {}),
                  ...(configNodeType === 'attribution' ? { attributionConfig: config as AttributionConfig } : {}),
                  ...(configNodeType === 'score' ? { scoreConfig: config as ScoreConfig } : {}),
                },
              }
            : n
        )
      );
      setEditingNode(null);
    } else {
      // Creating new node
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
          ...(configNodeType === 'suppression' ? { suppressionConfig: config as SuppressionConfig } : {}),
          ...(configNodeType === 'abtest' ? { abtestConfig: config as ABTestConfig } : {}),
          ...(configNodeType === 'attribution' ? { attributionConfig: config as AttributionConfig } : {}),
          ...(configNodeType === 'score' ? { scoreConfig: config as ScoreConfig } : {}),
        },
        position: pendingNodePosition,
      };

      setNodes((nds) => [...nds, newNode]);
      setNodeIdCounter((c) => c + 1);
    }

    // Clear pending state
    setPendingNodeConfig(null);
    setPendingNodePosition(null);
  };

  // Handle node label edit save
  const handleLabelEditSave = () => {
    if (!nodeToEdit) return;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeToEdit.id
          ? {
              ...n,
              data: {
                ...n.data,
                label: editedLabel.trim() || n.data.label, // Keep old label if empty
              },
            }
          : n
      )
    );

    setEditDialogOpen(false);
    setNodeToEdit(null);
    setEditedLabel('');
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
    let nodeType = 'email'; // default fallback

    // Map content channel and asset type to node type
    if (content.channel === 'EMAIL') {
      nodeType = 'email';
    } else if (content.channel === 'WEB') {
      nodeType = 'web';
    } else if (content.channel === 'MOBILE') {
      nodeType = 'mobile';
    } else if (content.channel === 'SOCIAL') {
      nodeType = 'social';
    } else if (content.channel === 'PAID_MEDIA') {
      // For paid media, map based on asset type
      if (content.assetType === 'PAID_SOCIAL_AD') {
        nodeType = 'paid-social';
      } else if (content.assetType === 'PAID_SEARCH_AD') {
        nodeType = 'paid-search';
      } else if (content.assetType === 'PAID_DISPLAY_AD') {
        nodeType = 'paid-display';
      } else if (content.assetType === 'PRINT_AD' || content.assetType === 'PRINT_JOURNAL_AD') {
        nodeType = 'print';
      } else if (content.assetType === 'TV_SPOT' || content.assetType === 'RADIO_SPOT') {
        nodeType = 'tv-radio';
      } else if (content.assetType === 'OOH_CREATIVE') {
        nodeType = 'ooh';
      }
    }

    const nodeConfig = nodeTypeConfigs.find((n) => n.nodeType === nodeType);

    // If we can't find the config, fall back to email
    return { nodeConfig: nodeConfig || nodeTypeConfigs.find((n) => n.nodeType === 'email')!, contentAsset: content };
  };

  // Handle node palette drag start
  const handleNodeDragStart = (event: React.DragEvent, nodeConfig: typeof nodeTypeConfigs[number]) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeConfig, contentAsset: null })
    );
  };

  // Load saved journeys from localStorage on mount
  useEffect(() => {
    const loadSavedJourneys = () => {
      try {
        const saved = localStorage.getItem('brandguard_journeys');
        if (saved) {
          setSavedJourneys(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved journeys:', error);
      }
    };
    loadSavedJourneys();
  }, []);

  // Save/load journey
  const saveJourney = () => {
    const journey = {
      id: `journey-${Date.now()}`,
      name: campaignName || 'Untitled Journey',
      brand: selectedBrand,
      audienceType: selectedAudienceType,
      segment: selectedSegment,
      label: campaignLabel,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('brandguard_journeys');
      const journeys = existing ? JSON.parse(existing) : [];
      journeys.unshift(journey); // Add to beginning

      // Keep only last 20 journeys
      const trimmed = journeys.slice(0, 20);

      localStorage.setItem('brandguard_journeys', JSON.stringify(trimmed));
      setSavedJourneys(trimmed);

      // Show success message
      alert(`Journey "${journey.name}" saved successfully!`);
    } catch (error) {
      console.error('Error saving journey:', error);
      alert('Error saving journey. Please try again.');
    }
  };

  const loadJourney = () => {
    // Show saved journeys dialog
    setLoadDialogOpen(true);
  };

  const loadJourneyFromSaved = (journey: any) => {
    // Load the selected journey
    setSelectedBrand(journey.brand);
    setSelectedAudienceType(journey.audienceType);
    setSelectedSegment(journey.segment);
    setCampaignLabel(journey.label);
    setNodes(journey.nodes);
    setEdges(journey.edges);
    setLoadDialogOpen(false);
  };

  const deleteSavedJourney = (journeyId: string) => {
    try {
      const filtered = savedJourneys.filter(j => j.id !== journeyId);
      localStorage.setItem('brandguard_journeys', JSON.stringify(filtered));
      setSavedJourneys(filtered);
    } catch (error) {
      console.error('Error deleting journey:', error);
    }
  };

  const loadJourneyTemplate = (template: JourneyTemplate) => {
    // Load the selected template
    setSelectedBrand(template.brand);
    setSelectedAudienceType(template.audienceType);
    setSelectedSegment(template.segment);
    setCampaignLabel(template.label);
    setNodes(template.nodes);
    setEdges(template.edges);
    setTemplateDialogOpen(false);
  };

  const clearCanvas = () => {
    // Reset everything to initial state
    setNodes(initialNodes);
    setEdges([]);
    setSelectedBrand('');
    setSelectedAudienceType('');
    setSelectedSegment('');
    setCampaignLabel('');
    setJourneyStatus('DESIGN');
    setViewMode('design');
  };

  const handleNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // Entry nodes can't be edited
    if (node.data.nodeType === 'entry') return;

    // For configurable nodes, open config dialog
    const configurableTypes = ['wait', 'decision', 'suppression', 'abtest', 'attribution', 'score'];
    if (configurableTypes.includes(node.data.nodeType)) {
      setEditingNode(node);
      setConfigNodeType(node.data.nodeType as any);
      setConfigDialogOpen(true);
    } else {
      // For all other nodes, open edit dialog to change label
      setNodeToEdit(node);
      setEditedLabel(node.data.label);
      setEditDialogOpen(true);
    }
  }, []);

  const changeNodeType = (newNodeType: string) => {
    if (!nodeToChange) return;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeToChange.id) {
          // Keep the content if it's compatible, otherwise clear it
          const currentContent = n.data.contentAsset;
          let newContent = currentContent;

          // Clear content if changing to/from flow control nodes
          const flowControlTypes = ['wait', 'decision', 'abtest', 'attribution', 'score', 'suppression'];
          if (flowControlTypes.includes(newNodeType) || flowControlTypes.includes(n.data.nodeType)) {
            newContent = undefined;
          }

          return {
            ...n,
            data: {
              ...n.data,
              nodeType: newNodeType,
              contentAsset: newContent,
            },
          };
        }
        return n;
      })
    );

    setChangeTypeDialogOpen(false);
    setNodeToChange(null);
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
                  ? 'Orchestrate omnichannel campaigns with sequence-level tracking'
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

            {/* Sequence Dashboard Toggle (only show in analytics mode) */}
            {viewMode === 'analytics' && journeyStatus !== 'DESIGN' && (
              <Button
                size="sm"
                variant={showSequenceDashboard ? 'default' : 'outline'}
                onClick={() => setShowSequenceDashboard(!showSequenceDashboard)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showSequenceDashboard ? 'Show Canvas' : 'Sequence Dashboard'}
              </Button>
            )}

            {/* Journey Actions */}
            {journeyStatus === 'DESIGN' && (
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  setJourneyStatus('ACTIVE');
                  setViewMode('analytics');
                }}
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
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New Journey
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
                  Format: Brand + Audience + Segment + Channels + Label
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
                    Drag Email/Web/Mobile/Social/Paid nodes to canvas to activate channels
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tracking Architecture (shown in analytics mode) */}
          {viewMode === 'analytics' && (
            <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Badge variant="default" className="bg-blue-600">
                    Tracking Architecture
                  </Badge>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-medium">
                    Composite Key Structure (for sequence-level content performance tracking)
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <Badge variant="outline">{campaignName}</Badge>
                    <span className="text-muted-foreground">/</span>
                    <Badge variant="outline">SEQ-#</Badge>
                    <span className="text-muted-foreground">/</span>
                    <Badge variant="outline">CONTENT-ID</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Each content piece is tracked at its sequence position. Export to S3 for 3rd party agencies (CDI Media, etc.)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <Card className="w-52 m-4 mr-0 rounded-r-none border-r-0 flex flex-col">
          <CardContent className="p-3 space-y-3 flex-1 overflow-auto">
            {/* Owned Media Section */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Owned Media</p>
              <div className="space-y-1">
                {paletteNodes
                  .filter((n) => ['email', 'web', 'mobile', 'social'].includes(n.nodeType))
                  .map((config) => (
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
              </div>
            </div>

            {/* Paid Media Section */}
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Paid Media</p>
              <div className="space-y-1">
                {paletteNodes
                  .filter((n) => ['paid-social', 'paid-search', 'paid-display', 'print', 'tv-radio', 'ooh'].includes(n.nodeType))
                  .map((config) => (
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
              </div>
              <p className="text-xs text-muted-foreground/70 mt-2">
                3rd party agency execution
              </p>
            </div>

            {/* Flow Control Section */}
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Flow Control</p>
              <div className="space-y-1">
                {paletteNodes
                  .filter((n) => n.channel === null && !['abtest', 'attribution', 'score'].includes(n.nodeType))
                  .map((config) => (
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
              </div>
            </div>

            {/* Advanced Analytics Section */}
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Advanced Analytics</p>
              <div className="space-y-1">
                {paletteNodes
                  .filter((n) => ['abtest', 'attribution', 'score'].includes(n.nodeType))
                  .map((config) => (
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canvas or Sequence Dashboard */}
        <div className="flex-1 m-4 ml-0 border rounded-lg bg-background overflow-hidden">
          {showSequenceDashboard ? (
            <SequenceDashboard
              nodes={enrichedNodes}
              edges={edges}
              nodeSequences={nodeSequences}
              metrics={mockNodeMetrics}
            />
          ) : (
            <div
              ref={reactFlowWrapper}
              className="h-full"
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <ReactFlow
                nodes={enrichedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeDoubleClick={handleNodeDoubleClick}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          )}
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

      {/* Edit Node Label Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Node Label</DialogTitle>
            <DialogDescription>
              Change the display label for "{nodeToEdit?.data.label}". This helps you identify nodes on the canvas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="node-label">Node Label</Label>
              <Input
                id="node-label"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                placeholder="Enter node label"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLabelEditSave();
                  }
                }}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This label is for display purposes only and doesn't affect functionality.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLabelEditSave}>
              Save Label
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Saved Journey Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Load Saved Journey</DialogTitle>
            <DialogDescription>
              Select a previously saved journey to continue working on it. Your last 20 saved journeys are shown below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {savedJourneys.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No saved journeys found.</p>
                <p className="text-sm mt-2">Save your current journey using the "Save" button.</p>
              </div>
            ) : (
              savedJourneys.map((journey) => (
                <Card
                  key={journey.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => loadJourneyFromSaved(journey)}>
                        <h3 className="font-semibold text-lg">{journey.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Saved {new Date(journey.createdAt).toLocaleString()}
                        </p>
                        <div className="flex gap-2 mt-3">
                          {journey.brand && (
                            <Badge variant="outline">{brands.find(b => b.id === journey.brand)?.name || journey.brand}</Badge>
                          )}
                          {journey.audienceType && (
                            <Badge variant="secondary">{journey.audienceType}</Badge>
                          )}
                          {journey.segment && (
                            <Badge>{mockSegments.find(s => s.id === journey.segment)?.name || journey.segment}</Badge>
                          )}
                          <Badge variant="outline">{journey.nodes?.length || 0} nodes</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${journey.name}"?`)) {
                            deleteSavedJourney(journey.id);
                          }
                        }}
                        className="ml-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Or start from a template:</h4>
            <Button
              variant="outline"
              onClick={() => {
                setLoadDialogOpen(false);
                setTemplateDialogOpen(true);
              }}
            >
              Browse Templates
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Journey Template Selection Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Load Journey Template</DialogTitle>
            <DialogDescription>
              Select a pre-built ophthalmology campaign journey to get started quickly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {savedJourneyTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => loadJourneyTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">{brands.find(b => b.id === template.brand)?.name}</Badge>
                        <Badge variant="secondary">{template.audienceType}</Badge>
                        <Badge>{mockSegments.find(s => s.id === template.segment)?.name}</Badge>
                        <Badge variant="outline">{template.nodes.length} nodes</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Node Type Dialog */}
      <Dialog open={changeTypeDialogOpen} onOpenChange={setChangeTypeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Node Type</DialogTitle>
            <DialogDescription>
              Select a new node type for "{nodeToChange?.data.label}". Double-click any node to change its type.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Owned Media</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['email', 'web', 'mobile', 'social'].map((type) => (
                    <Button
                      key={type}
                      variant={nodeToChange?.data.nodeType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => changeNodeType(type)}
                      className="justify-start"
                    >
                      {paletteNodes.find(n => n.nodeType === type)?.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Paid Media</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['paid-social', 'paid-search', 'paid-display', 'print', 'tv-radio', 'ooh'].map((type) => (
                    <Button
                      key={type}
                      variant={nodeToChange?.data.nodeType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => changeNodeType(type)}
                      className="justify-start"
                    >
                      {paletteNodes.find(n => n.nodeType === type)?.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Flow Control</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['wait', 'decision', 'suppression'].map((type) => (
                    <Button
                      key={type}
                      variant={nodeToChange?.data.nodeType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => changeNodeType(type)}
                      className="justify-start"
                    >
                      {paletteNodes.find(n => n.nodeType === type)?.label || type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Advanced</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['abtest', 'attribution', 'score'].map((type) => (
                    <Button
                      key={type}
                      variant={nodeToChange?.data.nodeType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => changeNodeType(type)}
                      className="justify-start"
                    >
                      {paletteNodes.find(n => n.nodeType === type)?.label || type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
