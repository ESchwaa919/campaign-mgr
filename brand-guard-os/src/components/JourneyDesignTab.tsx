import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Radio, Clock, GitBranch, FileText, Target, CheckCircle2, Info } from 'lucide-react';
import type { IDRegistryEntry, Microsegment } from '@/types';

interface JourneyDesignTabProps {
  campaignId: string;
  idRegistry: IDRegistryEntry[];
  microsegments: Microsegment[];
}

interface SequenceNode {
  sequenceNumber: number;
  nodeType: 'EMAIL' | 'PAID_SOCIAL' | 'WAIT' | 'DECISION' | 'PRINT';
  channel?: string;
  contentId?: string;
  contentTitle: string;
  microsegmentIds: string[];
  timing: string;
  waitLogic?: string;
  decisionLogic?: {
    criteria: string;
    paths: { label: string; nextSeq: number }[];
  };
}

export function JourneyDesignTab({ campaignId, idRegistry, microsegments }: JourneyDesignTabProps) {
  // Build sequence nodes from ID Registry
  const sequenceEntries = idRegistry.filter((e) => e.type === 'SEQUENCE');

  // Mock journey data - in production would come from Journey Canvas
  const journeyNodes: SequenceNode[] = [
    {
      sequenceNumber: 1,
      nodeType: 'EMAIL',
      channel: 'Email',
      contentId: 'CNT-2024-0001',
      contentTitle: 'Eylea Wet AMD: HAWK Study Results Email',
      microsegmentIds: ['MSEG-001', 'MSEG-002', 'MSEG-003', 'MSEG-004'],
      timing: 'Immediate (on campaign activation)',
    },
    {
      sequenceNumber: 2,
      nodeType: 'WAIT',
      contentTitle: 'Wait Period',
      microsegmentIds: [],
      timing: 'Wait 3 days',
      waitLogic: 'Time-based: 3 days after SEQ-1 completion',
    },
    {
      sequenceNumber: 3,
      nodeType: 'PAID_SOCIAL',
      channel: 'LinkedIn',
      contentId: 'CNT-2024-0011',
      contentTitle: 'LinkedIn Thought Leadership Ad',
      microsegmentIds: ['MSEG-001', 'MSEG-002', 'MSEG-003', 'MSEG-004'],
      timing: 'After 3-day wait',
    },
    {
      sequenceNumber: 4,
      nodeType: 'DECISION',
      contentTitle: 'Email Engagement Check',
      microsegmentIds: [],
      timing: 'Immediate after SEQ-3',
      decisionLogic: {
        criteria: 'Email engagement (opened SEQ-1 email)',
        paths: [
          { label: 'Engaged (opened)', nextSeq: 5 },
          { label: 'Not engaged', nextSeq: 6 },
        ],
      },
    },
    {
      sequenceNumber: 5,
      nodeType: 'EMAIL',
      channel: 'Email',
      contentId: 'CNT-2024-0025',
      contentTitle: 'Follow-up: AMD Treatment Options',
      microsegmentIds: ['MSEG-001', 'MSEG-002', 'MSEG-004'],
      timing: 'For engaged path only',
    },
    {
      sequenceNumber: 6,
      nodeType: 'PRINT',
      channel: 'Print',
      contentId: 'CNT-2024-0040',
      contentTitle: 'Retina Times Full Page Ad',
      microsegmentIds: ['MSEG-002', 'MSEG-003'],
      timing: 'For non-engaged path only',
    },
    {
      sequenceNumber: 7,
      nodeType: 'WAIT',
      contentTitle: 'Wait Period',
      microsegmentIds: [],
      timing: 'Wait 7 days',
      waitLogic: 'Time-based: 7 days after SEQ-5 or SEQ-6',
    },
    {
      sequenceNumber: 8,
      nodeType: 'EMAIL',
      channel: 'Email',
      contentId: 'CNT-2024-0055',
      contentTitle: 'Final Touchpoint: Clinical Resources',
      microsegmentIds: ['MSEG-001', 'MSEG-002', 'MSEG-003', 'MSEG-004'],
      timing: 'After 7-day wait',
    },
  ];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="h-5 w-5 text-blue-600" />;
      case 'PAID_SOCIAL':
        return <Radio className="h-5 w-5 text-purple-600" />;
      case 'PRINT':
        return <FileText className="h-5 w-5 text-amber-600" />;
      case 'WAIT':
        return <Clock className="h-5 w-5 text-gray-600" />;
      case 'DECISION':
        return <GitBranch className="h-5 w-5 text-green-600" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return 'bg-blue-50 border-blue-200';
      case 'PAID_SOCIAL':
        return 'bg-purple-50 border-purple-200';
      case 'PRINT':
        return 'bg-amber-50 border-amber-200';
      case 'WAIT':
        return 'bg-gray-50 border-gray-200';
      case 'DECISION':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-muted border-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Journey Metadata */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Journey Design</CardTitle>
              <CardDescription>
                Visual journey flow designed in Journey Canvas - 8 sequences across 3 channels
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Validated
              </Badge>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Sequences</p>
              <p className="text-2xl font-bold">{journeyNodes.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Channels</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Email, LinkedIn, Print</p>
            </div>
            <div>
              <p className="text-muted-foreground">Decision Nodes</p>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">Email engagement-based</p>
            </div>
            <div>
              <p className="text-muted-foreground">Microsegments</p>
              <p className="text-2xl font-bold">{microsegments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Journey Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Flow Visualization</CardTitle>
          <CardDescription>
            Sequence progression with decision node branching (designed in Journey Canvas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeyNodes.map((node, idx) => {
              const isDecisionNode = node.nodeType === 'DECISION';
              const showBranching = isDecisionNode && node.decisionLogic;

              return (
                <div key={node.sequenceNumber}>
                  <div className={`p-4 rounded-lg border-2 ${getNodeColor(node.nodeType)}`}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="mt-1">{getNodeIcon(node.nodeType)}</div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono">
                            SEQ-{node.sequenceNumber}
                          </Badge>
                          <Badge variant="secondary">{node.nodeType}</Badge>
                          {node.channel && <Badge variant="outline">{node.channel}</Badge>}
                        </div>

                        <h4 className="font-semibold mb-2">{node.contentTitle}</h4>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Timing</p>
                            <p className="font-medium">{node.timing}</p>
                          </div>
                          {node.contentId && (
                            <div>
                              <p className="text-xs text-muted-foreground">Content ID</p>
                              <p className="font-mono text-xs">{node.contentId}</p>
                            </div>
                          )}
                          {node.microsegmentIds.length > 0 && (
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground mb-1">Target Microsegments</p>
                              <div className="flex flex-wrap gap-1">
                                {node.microsegmentIds.map((msId) => {
                                  const ms = microsegments.find((m) => m.id === msId);
                                  return (
                                    <Badge key={msId} variant="secondary" className="text-xs">
                                      {ms?.name || msId}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {node.waitLogic && (
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Wait Logic</p>
                              <p className="text-xs">{node.waitLogic}</p>
                            </div>
                          )}
                        </div>

                        {/* Decision Logic */}
                        {showBranching && node.decisionLogic && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Decision Logic</p>
                            <p className="text-xs mb-2">{node.decisionLogic.criteria}</p>
                            <div className="flex gap-2">
                              {node.decisionLogic.paths.map((path) => (
                                <div key={path.label} className="flex items-center gap-2 text-xs p-2 rounded bg-white border">
                                  <GitBranch className="h-3 w-3" />
                                  <span>{path.label}</span>
                                  <span className="text-muted-foreground">→ SEQ-{path.nextSeq}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  {idx < journeyNodes.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-px h-6 bg-muted" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Journey Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Validation Status</CardTitle>
          <CardDescription>
            Pre-activation validation checks from Journey Canvas (BRD JC-006)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">
                <strong>Journey Validation: PASSED</strong>
                <p className="text-xs mt-1">All validation checks completed successfully</p>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">No Orphan Nodes</p>
                  <p className="text-xs text-muted-foreground">All nodes connected</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">Connection Validation</p>
                  <p className="text-xs text-muted-foreground">All edges valid</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">ID Registry Minted</p>
                  <p className="text-xs text-muted-foreground">{idRegistry.length} unique IDs</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">Claravine Validated</p>
                  <p className="text-xs text-muted-foreground">Taxonomy approved</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Attribution */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Data Source:</strong> Journey Canvas (Design phase) | This journey was designed in Journey Canvas with
          drag-and-drop nodes, validated pre-activation (JC-006), and integrated with ID Registry for composite key
          generation. Content assignments use AI resonance scoring (JC-005) to optimize content-segment fit.
        </AlertDescription>
      </Alert>
    </div>
  );
}
