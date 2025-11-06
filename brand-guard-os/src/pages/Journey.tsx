import { useState, useCallback } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Mail,
  Globe,
  Smartphone,
  Users,
  Clock,
  Play,
  Save,
  Download,
  Upload,
  Plus,
  GitBranch,
} from 'lucide-react';

// Node types for the journey
const nodeTypes = [
  { id: 'entry', label: 'Entry Point', icon: Play, color: 'bg-green-100 border-green-300' },
  { id: 'email', label: 'Email', icon: Mail, color: 'bg-blue-100 border-blue-300' },
  { id: 'web', label: 'Web Content', icon: Globe, color: 'bg-purple-100 border-purple-300' },
  { id: 'mobile', label: 'Mobile Push', icon: Smartphone, color: 'bg-cyan-100 border-cyan-300' },
  { id: 'segment', label: 'Audience Filter', icon: Users, color: 'bg-orange-100 border-orange-300' },
  { id: 'wait', label: 'Wait', icon: Clock, color: 'bg-gray-100 border-gray-300' },
  { id: 'decision', label: 'Decision Split', icon: GitBranch, color: 'bg-yellow-100 border-yellow-300' },
];

// Mock data for hierarchy filters
const brands = ['Eylea', 'Dupixent', 'Libtayo'];
const audiences = ['HCP - Oncology', 'HCP - Dermatology', 'HCP - Primary Care', 'Patients'];
const campaigns = ['Q4 Launch', 'Awareness Campaign', 'Education Series'];

// Initial nodes for demo
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Journey Start' },
    position: { x: 250, y: 50 },
  },
];

const initialEdges: Edge[] = [];

export default function Journey() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [journeyName, setJourneyName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

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

  const addNode = (type: typeof nodeTypes[number]) => {
    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type: 'default',
      data: {
        label: (
          <div className="flex items-center gap-2">
            <type.icon className="h-4 w-4" />
            <span>{type.label}</span>
          </div>
        ),
      },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 150,
      },
      style: {
        background: type.color.includes('green')
          ? '#dcfce7'
          : type.color.includes('blue')
          ? '#dbeafe'
          : type.color.includes('purple')
          ? '#f3e8ff'
          : type.color.includes('cyan')
          ? '#cffafe'
          : type.color.includes('orange')
          ? '#fed7aa'
          : type.color.includes('yellow')
          ? '#fef3c7'
          : '#f3f4f6',
        border: '2px solid',
        borderColor: type.color.includes('green')
          ? '#86efac'
          : type.color.includes('blue')
          ? '#93c5fd'
          : type.color.includes('purple')
          ? '#d8b4fe'
          : type.color.includes('cyan')
          ? '#67e8f9'
          : type.color.includes('orange')
          ? '#fdba74'
          : type.color.includes('yellow')
          ? '#fde68a'
          : '#d1d5db',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '12px',
        width: 180,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
  };

  const saveJourney = () => {
    const journey = {
      name: journeyName,
      brand: selectedBrand,
      audience: selectedAudience,
      campaign: selectedCampaign,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
    };

    // In production, this would save to Salesforce
    localStorage.setItem('savedJourney', JSON.stringify(journey));
    console.log('Journey saved:', journey);
  };

  const loadJourney = () => {
    const saved = localStorage.getItem('savedJourney');
    if (saved) {
      const journey = JSON.parse(saved);
      setJourneyName(journey.name);
      setSelectedBrand(journey.brand);
      setSelectedAudience(journey.audience);
      setSelectedCampaign(journey.campaign);
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
              Drag-and-drop visual campaign journey builder
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

        {/* Hierarchy Filters */}
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="journey-name">Journey Name</Label>
            <Input
              id="journey-name"
              placeholder="e.g., Q4 HCP Launch"
              value={journeyName}
              onChange={(e) => setJourneyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger id="brand">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select value={selectedAudience} onValueChange={setSelectedAudience}>
              <SelectTrigger id="audience">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((audience) => (
                  <SelectItem key={audience} value={audience}>
                    {audience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign">Campaign</Label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger id="campaign">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign} value={campaign}>
                    {campaign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Context */}
        {(selectedBrand || selectedAudience || selectedCampaign) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Context:</span>
            {selectedBrand && (
              <Badge variant="outline">{selectedBrand}</Badge>
            )}
            {selectedAudience && (
              <Badge variant="outline">{selectedAudience}</Badge>
            )}
            {selectedCampaign && (
              <Badge variant="outline">{selectedCampaign}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Node Palette */}
        <Card className="w-64 m-4 mr-0 rounded-r-none border-r-0">
          <CardHeader>
            <CardTitle className="text-sm">Journey Nodes</CardTitle>
            <CardDescription>Drag nodes onto the canvas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {nodeTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addNode(type)}
              >
                <Plus className="h-4 w-4 mr-2" />
                <type.icon className="h-4 w-4 mr-2" />
                {type.label}
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
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
