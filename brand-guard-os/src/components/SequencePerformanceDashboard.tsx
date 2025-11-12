import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, MousePointerClick, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import type { IDRegistryEntry, Microsegment } from '@/types';

interface SequencePerformanceData {
  sequenceNumber: number;
  sequenceName: string;
  totalAudience: number;
  reached: number;
  opened: number;
  clicked: number;
  converted: number;
  dropOffRate: number;
  avgTimeInSequence: string;
}

interface SequencePerformanceDashboardProps {
  idRegistry: IDRegistryEntry[];
  microsegments: Microsegment[];
  campaignId: string;
}

export function SequencePerformanceDashboard({ idRegistry, microsegments, campaignId }: SequencePerformanceDashboardProps) {
  // Generate mock performance data based on registry entries
  const sequenceEntries = idRegistry.filter((e) => e.type === 'SEQUENCE');

  // Mock performance data - in production would come from analytics
  const performanceData: SequencePerformanceData[] = sequenceEntries.map((entry, idx) => {
    const totalAudience = microsegments.reduce((sum, ms) => sum + ms.estimatedCount, 0);
    const reachedRate = 1 - (idx * 0.12); // Simulate drop-off
    const reached = Math.floor(totalAudience * reachedRate);
    const opened = Math.floor(reached * (0.45 + Math.random() * 0.15));
    const clicked = Math.floor(opened * (0.25 + Math.random() * 0.10));
    const converted = Math.floor(clicked * (0.15 + Math.random() * 0.10));
    const dropOffRate = idx > 0 ? (1 - reachedRate / (1 - (idx - 1) * 0.12)) * 100 : 0;

    return {
      sequenceNumber: entry.sequenceNumber || 0,
      sequenceName: `Sequence ${entry.sequenceNumber}`,
      totalAudience,
      reached,
      opened,
      clicked,
      converted,
      dropOffRate,
      avgTimeInSequence: `${2 + Math.floor(Math.random() * 3)}d ${Math.floor(Math.random() * 24)}h`,
    };
  }).sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  // Calculate totals
  const totalReached = performanceData[0]?.reached || 0;
  const totalOpened = performanceData.reduce((sum, d) => sum + d.opened, 0);
  const totalClicked = performanceData.reduce((sum, d) => sum + d.clicked, 0);
  const totalConverted = performanceData.reduce((sum, d) => sum + d.converted, 0);

  const overallOpenRate = totalReached > 0 ? (totalOpened / totalReached) * 100 : 0;
  const overallClickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
  const overallConversionRate = totalClicked > 0 ? (totalConverted / totalClicked) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overall Campaign Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Reached</p>
            </div>
            <p className="text-2xl font-bold">{totalReached.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Across {performanceData.length} sequences</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Open Rate</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{overallOpenRate.toFixed(1)}%</p>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2%
              </Badge>
            </div>
            <Progress value={overallOpenRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Click Rate</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{overallClickRate.toFixed(1)}%</p>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.8%
              </Badge>
            </div>
            <Progress value={overallClickRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Conversion Rate</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{overallConversionRate.toFixed(1)}%</p>
              <Badge variant="secondary" className="text-xs">
                <TrendingDown className="h-3 w-3 mr-1" />
                -1.3%
              </Badge>
            </div>
            <Progress value={overallConversionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Sequence-Level Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Sequence-Level Journey Funnel</CardTitle>
          <CardDescription>
            Audience progression and drop-off rates through campaign sequences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((seq, idx) => {
              const reachRate = (seq.reached / seq.totalAudience) * 100;
              const openRate = (seq.opened / seq.reached) * 100;
              const clickRate = (seq.clicked / seq.opened) * 100;
              const conversionRate = (seq.converted / seq.clicked) * 100;

              return (
                <div key={seq.sequenceNumber} className="space-y-3">
                  {/* Sequence Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        SEQ-{seq.sequenceNumber}
                      </Badge>
                      <h4 className="font-semibold">{seq.sequenceName}</h4>
                      {seq.dropOffRate > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {seq.dropOffRate.toFixed(1)}% drop-off
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Time: {seq.avgTimeInSequence}</p>
                  </div>

                  {/* Funnel Visualization */}
                  <div className="grid grid-cols-4 gap-3">
                    {/* Reached */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Reached</span>
                        <span className="font-semibold">{seq.reached.toLocaleString()}</span>
                      </div>
                      <div className="relative h-16 bg-muted rounded overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all"
                          style={{ height: `${reachRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-center font-medium">{reachRate.toFixed(1)}%</p>
                    </div>

                    {/* Opened */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Opened</span>
                        <span className="font-semibold">{seq.opened.toLocaleString()}</span>
                      </div>
                      <div className="relative h-16 bg-muted rounded overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-green-500 transition-all"
                          style={{ height: `${openRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-center font-medium">{openRate.toFixed(1)}%</p>
                    </div>

                    {/* Clicked */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Clicked</span>
                        <span className="font-semibold">{seq.clicked.toLocaleString()}</span>
                      </div>
                      <div className="relative h-16 bg-muted rounded overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-amber-500 transition-all"
                          style={{ height: `${clickRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-center font-medium">{clickRate.toFixed(1)}%</p>
                    </div>

                    {/* Converted */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Converted</span>
                        <span className="font-semibold">{seq.converted.toLocaleString()}</span>
                      </div>
                      <div className="relative h-16 bg-muted rounded overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-purple-500 transition-all"
                          style={{ height: `${conversionRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-center font-medium">{conversionRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Separator */}
                  {idx < performanceData.length - 1 && (
                    <div className="flex items-center justify-center py-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Strong Early Engagement</p>
                <p className="text-green-700">
                  Sequence 1 shows {performanceData[0]?.opened ? ((performanceData[0].opened / performanceData[0].reached) * 100).toFixed(1) : 0}% open rate,
                  above benchmark of 40%
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <TrendingDown className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Mid-Journey Drop-Off</p>
                <p className="text-amber-700">
                  {performanceData[Math.floor(performanceData.length / 2)]?.dropOffRate.toFixed(1)}% drop-off at Sequence {Math.floor(performanceData.length / 2) + 1} -
                  consider content refresh or timing adjustment
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Microsegment Opportunity</p>
                <p className="text-blue-700">
                  {microsegments[0]?.name || 'High Engagers'} showing highest conversion rates - consider expanding audience with similar profiles
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
