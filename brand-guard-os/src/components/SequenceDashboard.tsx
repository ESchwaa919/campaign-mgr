import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle } from 'lucide-react';
import { CampaignPerformanceMatrix } from './CampaignPerformanceMatrix';

interface SequencePerformance {
  sequenceNumber: number;
  nodeType: string;
  contentId?: string;
  contentTitle?: string;
  entered: number;
  completed: number;
  dropped: number;
  conversionRate: number;
  avgTimeInSequence: string;
  topPerformer: boolean;
  needsAttention: boolean;
}

interface PathComparison {
  pathName: string;
  sequences: number[];
  totalEntered: number;
  totalConverted: number;
  conversionRate: number;
  avgJourneyTime: string;
}

export function SequenceDashboard() {
  // Mock sequence performance data for Eylea AMD campaign
  const sequences: SequencePerformance[] = [
    {
      sequenceNumber: 1,
      nodeType: 'Entry',
      entered: 1500,
      completed: 1247,
      dropped: 253,
      conversionRate: 83.1,
      avgTimeInSequence: '0m',
      topPerformer: false,
      needsAttention: false,
    },
    {
      sequenceNumber: 2,
      nodeType: 'Email',
      contentId: 'CNT-2024-0145',
      contentTitle: 'Eylea Wet AMD: New Efficacy Data from HAWK Study',
      entered: 1247,
      completed: 892,
      dropped: 355,
      conversionRate: 71.5,
      avgTimeInSequence: '2m 15s',
      topPerformer: true,
      needsAttention: false,
    },
    {
      sequenceNumber: 3,
      nodeType: 'Wait',
      entered: 892,
      completed: 892,
      dropped: 0,
      conversionRate: 100,
      avgTimeInSequence: '48h',
      topPerformer: false,
      needsAttention: false,
    },
    {
      sequenceNumber: 4,
      nodeType: 'Decision',
      contentTitle: 'Email Opened?',
      entered: 892,
      completed: 892,
      dropped: 0,
      conversionRate: 100,
      avgTimeInSequence: '< 1s',
      topPerformer: false,
      needsAttention: false,
    },
    {
      sequenceNumber: 5,
      nodeType: 'Paid Social',
      contentId: 'CNT-2024-0198',
      contentTitle: 'LinkedIn Thought Leadership: Anti-VEGF Treatment Paradigms',
      entered: 623,
      completed: 445,
      dropped: 178,
      conversionRate: 71.4,
      avgTimeInSequence: '1m 45s',
      topPerformer: true,
      needsAttention: false,
    },
    {
      sequenceNumber: 5,
      nodeType: 'Email',
      contentId: 'CNT-2024-0146',
      contentTitle: 'Eylea AMD: Reminder with Different Subject Line',
      entered: 269,
      completed: 197,
      dropped: 72,
      conversionRate: 73.2,
      avgTimeInSequence: '1m 55s',
      topPerformer: false,
      needsAttention: false,
    },
    {
      sequenceNumber: 6,
      nodeType: 'Print Media',
      contentId: 'CNT-2024-0223',
      contentTitle: 'Retina Times Full Page: Eylea Durability Data',
      entered: 445,
      completed: 312,
      dropped: 133,
      conversionRate: 70.1,
      avgTimeInSequence: '5d',
      topPerformer: false,
      needsAttention: false,
    },
    {
      sequenceNumber: 7,
      nodeType: 'Attribution',
      contentTitle: 'Rep Meeting Scheduled',
      entered: 312,
      completed: 89,
      dropped: 223,
      conversionRate: 28.5,
      avgTimeInSequence: '2w',
      topPerformer: false,
      needsAttention: true,
    },
  ];

  // Path comparison data
  const paths: PathComparison[] = [
    {
      pathName: 'Email Opened → Paid Social → Print',
      sequences: [2, 5, 6, 7],
      totalEntered: 623,
      totalConverted: 89,
      conversionRate: 14.3,
      avgJourneyTime: '18 days',
    },
    {
      pathName: 'Email NOT Opened → Resend Email → Print',
      sequences: [2, 5, 6, 7],
      totalEntered: 269,
      totalConverted: 34,
      conversionRate: 12.6,
      avgJourneyTime: '19 days',
    },
  ];

  // Calculate drop-off points
  const dropOffAnalysis = sequences
    .filter((s) => s.contentId) // Only content touchpoints
    .map((s, index, arr) => ({
      ...s,
      dropOffRate: ((s.dropped / s.entered) * 100).toFixed(1),
      improvementOpportunity:
        index > 0 && s.conversionRate < arr[index - 1].conversionRate,
    }))
    .sort((a, b) => b.dropped - a.dropped);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Sequence-Level Performance Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Campaign: <Badge variant="outline">Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch</Badge>
        </p>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Matrix</TabsTrigger>
          <TabsTrigger value="registry">ID Registry</TabsTrigger>
          <TabsTrigger value="sequence">By Sequence</TabsTrigger>
          <TabsTrigger value="path">Path Comparison</TabsTrigger>
          <TabsTrigger value="dropoff">Drop-Off Analysis</TabsTrigger>
        </TabsList>

        {/* Performance Matrix Tab */}
        <TabsContent value="performance">
          <CampaignPerformanceMatrix />
        </TabsContent>

        {/* ID Registry Tab */}
        <TabsContent value="registry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ID Registry - Composite Key Tracking</CardTitle>
              <p className="text-sm text-muted-foreground">
                All minted IDs for this campaign showing the composite key structure that enables granular performance tracking
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Composite Key</th>
                      <th className="text-left p-2 font-semibold">Campaign ID</th>
                      <th className="text-left p-2 font-semibold">Sequence</th>
                      <th className="text-left p-2 font-semibold">Content ID</th>
                      <th className="text-left p-2 font-semibold">Microsegment</th>
                      <th className="text-left p-2 font-semibold">UTM Parameters</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-001</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-1</td>
                      <td className="p-2">CNT-2024-0001</td>
                      <td className="p-2">MSEG-001</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-002</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-1</td>
                      <td className="p-2">CNT-2024-0001</td>
                      <td className="p-2">MSEG-002</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-003</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-1</td>
                      <td className="p-2">CNT-2024-0001</td>
                      <td className="p-2">MSEG-003</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-004</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-1</td>
                      <td className="p-2">CNT-2024-0001</td>
                      <td className="p-2">MSEG-004</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-001</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-3</td>
                      <td className="p-2">CNT-2024-0011</td>
                      <td className="p-2">MSEG-001</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-002</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-3</td>
                      <td className="p-2">CNT-2024-0011</td>
                      <td className="p-2">MSEG-002</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-003</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-3</td>
                      <td className="p-2">CNT-2024-0011</td>
                      <td className="p-2">MSEG-003</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-004</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-3</td>
                      <td className="p-2">CNT-2024-0011</td>
                      <td className="p-2">MSEG-004</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-001</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-5</td>
                      <td className="p-2">CNT-2024-0040</td>
                      <td className="p-2">MSEG-001</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-002</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-5</td>
                      <td className="p-2">CNT-2024-0040</td>
                      <td className="p-2">MSEG-002</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-003</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-5</td>
                      <td className="p-2">CNT-2024-0040</td>
                      <td className="p-2">MSEG-003</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2">CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-004</td>
                      <td className="p-2">CMP-2024-001</td>
                      <td className="p-2">SEQ-5</td>
                      <td className="p-2">CNT-2024-0040</td>
                      <td className="p-2">MSEG-004</td>
                      <td className="p-2 text-xs">utm_campaign=eylea_hcp_retina_q4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm font-semibold text-blue-900 mb-1">How Composite Keys Enable Optimization</p>
                <p className="text-sm text-blue-800">
                  Each composite key tracks performance at the intersection of <strong>Campaign → Sequence → Content → Microsegment</strong>.
                  This granularity allows you to answer questions like: "Does LinkedIn perform better for Academic HCPs vs Rural HCPs in Sequence 3?"
                  Traditional campaign tracking (campaign-level only) cannot answer this question.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Sequence Tab */}
        <TabsContent value="sequence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Journey Sequence</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track exactly how audiences interact with content at each stage
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sequences.map((seq) => (
                  <div
                    key={`${seq.sequenceNumber}-${seq.nodeType}-${seq.contentId || 'flow'}`}
                    className={`border rounded-lg p-4 ${
                      seq.topPerformer
                        ? 'bg-green-50 border-green-300'
                        : seq.needsAttention
                        ? 'bg-red-50 border-red-300'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">
                            SEQ-{seq.sequenceNumber}
                          </Badge>
                          <Badge variant="secondary">{seq.nodeType}</Badge>
                          {seq.topPerformer && (
                            <Badge variant="default" className="bg-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Top Performer
                            </Badge>
                          )}
                          {seq.needsAttention && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Needs Attention
                            </Badge>
                          )}
                        </div>
                        {seq.contentId && (
                          <div className="mb-2">
                            <p className="text-sm font-semibold">{seq.contentTitle}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {seq.contentId}
                            </p>
                          </div>
                        )}
                        {!seq.contentId && seq.contentTitle && (
                          <p className="text-sm font-medium mb-2">{seq.contentTitle}</p>
                        )}
                        <div className="grid grid-cols-5 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Entered</p>
                            <p className="text-lg font-bold">{seq.entered.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Completed</p>
                            <p className="text-lg font-bold">{seq.completed.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Dropped</p>
                            <p className="text-lg font-bold text-red-600">
                              {seq.dropped.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Conversion</p>
                            <p className="text-lg font-bold">{seq.conversionRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Avg Time</p>
                            <p className="text-sm font-semibold">{seq.avgTimeInSequence}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Path Comparison Tab */}
        <TabsContent value="path" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journey Path Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare performance across different decision paths
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paths.map((path, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="font-mono">
                        Path {index + 1}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">{path.pathName}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Entered</p>
                        <p className="text-lg font-bold">{path.totalEntered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Converted</p>
                        <p className="text-lg font-bold">{path.totalConverted.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversion Rate</p>
                        <p className="text-lg font-bold">{path.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Journey Time</p>
                        <p className="text-sm font-semibold">{path.avgJourneyTime}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Sequence Flow:</p>
                      <div className="flex items-center gap-1">
                        {path.sequences.map((seqNum, idx) => (
                          <div key={idx} className="flex items-center">
                            <Badge variant="secondary" className="text-xs">
                              SEQ-{seqNum}
                            </Badge>
                            {idx < path.sequences.length - 1 && (
                              <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Key Insight</p>
                  <p className="text-sm text-blue-800">
                    Path 1 (Email Opened → Paid Social) outperforms Path 2 (Email Resend) by{' '}
                    <strong className="font-bold">+1.7%</strong> conversion rate. Consider
                    reallocating budget to Paid Social for engaged HCPs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drop-Off Analysis Tab */}
        <TabsContent value="dropoff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drop-Off Analysis by Sequence</CardTitle>
              <p className="text-sm text-muted-foreground">
                Identify stages where audiences exit the journey
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dropOffAnalysis.map((seq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          SEQ-{seq.sequenceNumber}
                        </Badge>
                        <div>
                          <p className="text-sm font-semibold">{seq.contentTitle}</p>
                          <p className="text-xs text-muted-foreground font-mono">{seq.contentId}</p>
                        </div>
                      </div>
                      {seq.improvementOpportunity && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Conversion Drop
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Drop-Off Rate</span>
                        <span className="font-bold text-red-600">{seq.dropOffRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${seq.dropOffRate}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {seq.dropped.toLocaleString()} HCPs dropped
                        </span>
                        <span className="text-muted-foreground">
                          {seq.completed.toLocaleString()} continued
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Effectiveness Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Effectiveness Heat Map</CardTitle>
              <p className="text-sm text-muted-foreground">
                Which content resonates at which journey stage?
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sequences
                  .filter((s) => s.contentId)
                  .map((seq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono">
                              SEQ-{seq.sequenceNumber}
                            </Badge>
                            <Badge variant="secondary">{seq.nodeType}</Badge>
                          </div>
                          <p className="text-sm font-semibold mb-1">{seq.contentTitle}</p>
                          <p className="text-xs text-muted-foreground font-mono mb-3">
                            {seq.contentId}
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Engagement Rate</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      seq.conversionRate >= 70
                                        ? 'bg-green-500'
                                        : seq.conversionRate >= 50
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${seq.conversionRate}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold">{seq.conversionRate}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Time in Content</p>
                              <p className="text-sm font-semibold mt-1">{seq.avgTimeInSequence}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Performance</p>
                              <div className="mt-1">
                                {seq.topPerformer ? (
                                  <Badge variant="default" className="bg-green-600">
                                    Excellent
                                  </Badge>
                                ) : seq.conversionRate >= 60 ? (
                                  <Badge variant="secondary">Good</Badge>
                                ) : (
                                  <Badge variant="outline">Average</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-1">
                    Content Optimization Recommendations
                  </p>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>
                      • <strong>SEQ-2 Email</strong> (71.5% engagement): Top performer. Use this
                      subject line format for other brands.
                    </li>
                    <li>
                      • <strong>SEQ-5 Paid Social</strong> (71.4% engagement): LinkedIn thought
                      leadership resonates well. Increase frequency.
                    </li>
                    <li>
                      • <strong>SEQ-7 Attribution</strong> (28.5% conversion): Low rep meeting
                      conversion. Consider adding pre-call digital content.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
