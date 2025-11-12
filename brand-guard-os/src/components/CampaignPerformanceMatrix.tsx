import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Target, Sparkles } from 'lucide-react';

// Performance data structure showing how composite IDs enable granular tracking
interface SequenceMicrosegmentPerformance {
  compositeKey: string; // CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-001
  campaignId: string;
  sequenceNumber: number;
  contentId: string;
  contentTitle: string;
  microsegmentId: string;
  microsegmentName: string;

  // Metrics
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  cvr: number; // Conversion rate

  // Comparison
  vsAverage: number; // Performance vs campaign average
  resonanceScore: number; // 0-100 predicted score
  isTopPerformer: boolean;
  needsOptimization: boolean;
}

interface ContentOptimizationInsight {
  contentId: string;
  contentTitle: string;
  bestMicrosegment: string;
  worstMicrosegment: string;
  performanceSpread: number; // % difference between best and worst
  recommendation: string;
}

export function CampaignPerformanceMatrix() {
  // Synthetic performance data demonstrating composite key tracking
  // CMP-2024-001 = "Eylea HCP High-Volume Retina Specialists EMAIL PAID_SOCIAL PRINT Q4 AMD Launch"
  const performanceData: SequenceMicrosegmentPerformance[] = [
    // SEQ-1: HAWK Study Email across 4 microsegments
    {
      compositeKey: 'CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-001',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 1,
      contentId: 'CNT-2024-0001',
      contentTitle: 'Eylea Wet AMD: HAWK Study Results Email',
      microsegmentId: 'MSEG-001',
      microsegmentName: 'High Engagers (Academic)',
      impressions: 412,
      clicks: 358,
      conversions: 187,
      ctr: 86.9,
      cvr: 52.2,
      vsAverage: 38.5,
      resonanceScore: 88,
      isTopPerformer: true,
      needsOptimization: false,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-002',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 1,
      contentId: 'CNT-2024-0001',
      contentTitle: 'Eylea Wet AMD: HAWK Study Results Email',
      microsegmentId: 'MSEG-002',
      microsegmentName: 'Medium Engagers (Private Practice)',
      impressions: 528,
      clicks: 379,
      conversions: 174,
      ctr: 71.8,
      cvr: 45.9,
      vsAverage: 21.9,
      resonanceScore: 72,
      isTopPerformer: false,
      needsOptimization: false,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-003',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 1,
      contentId: 'CNT-2024-0001',
      contentTitle: 'Eylea Wet AMD: HAWK Study Results Email',
      microsegmentId: 'MSEG-003',
      microsegmentName: 'Low Engagers (Rural Community)',
      impressions: 387,
      clicks: 201,
      conversions: 78,
      ctr: 51.9,
      cvr: 38.8,
      vsAverage: 3.1,
      resonanceScore: 58,
      isTopPerformer: false,
      needsOptimization: true,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-1/CNT-2024-0001/MSEG-004',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 1,
      contentId: 'CNT-2024-0001',
      contentTitle: 'Eylea Wet AMD: HAWK Study Results Email',
      microsegmentId: 'MSEG-004',
      microsegmentName: 'New to Brand',
      impressions: 173,
      clicks: 125,
      conversions: 54,
      ctr: 72.3,
      cvr: 43.2,
      vsAverage: 14.7,
      resonanceScore: 79,
      isTopPerformer: false,
      needsOptimization: false,
    },

    // SEQ-3: LinkedIn Ad across 4 microsegments (after Wait + Decision)
    {
      compositeKey: 'CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-001',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 3,
      contentId: 'CNT-2024-0011',
      contentTitle: 'LinkedIn Thought Leadership Ad',
      microsegmentId: 'MSEG-001',
      microsegmentName: 'High Engagers (Academic)',
      impressions: 187,
      clicks: 156,
      conversions: 89,
      ctr: 83.4,
      cvr: 57.1,
      vsAverage: 51.8,
      resonanceScore: 88,
      isTopPerformer: true,
      needsOptimization: false,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-002',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 3,
      contentId: 'CNT-2024-0011',
      contentTitle: 'LinkedIn Thought Leadership Ad',
      microsegmentId: 'MSEG-002',
      microsegmentName: 'Medium Engagers (Private Practice)',
      impressions: 174,
      clicks: 118,
      conversions: 51,
      ctr: 67.8,
      cvr: 43.2,
      vsAverage: 14.8,
      resonanceScore: 72,
      isTopPerformer: false,
      needsOptimization: false,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-003',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 3,
      contentId: 'CNT-2024-0011',
      contentTitle: 'LinkedIn Thought Leadership Ad',
      microsegmentId: 'MSEG-003',
      microsegmentName: 'Low Engagers (Rural Community)',
      impressions: 78,
      clicks: 38,
      conversions: 14,
      ctr: 48.7,
      cvr: 36.8,
      vsAverage: -2.1,
      resonanceScore: 58,
      isTopPerformer: false,
      needsOptimization: true,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-3/CNT-2024-0011/MSEG-004',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 3,
      contentId: 'CNT-2024-0011',
      contentTitle: 'LinkedIn Thought Leadership Ad',
      microsegmentId: 'MSEG-004',
      microsegmentName: 'New to Brand',
      impressions: 54,
      clicks: 41,
      conversions: 19,
      ctr: 75.9,
      cvr: 46.3,
      vsAverage: 23.1,
      resonanceScore: 79,
      isTopPerformer: false,
      needsOptimization: false,
    },

    // SEQ-5: Retina Times Print Ad across 4 microsegments
    {
      compositeKey: 'CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-001',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 5,
      contentId: 'CNT-2024-0040',
      contentTitle: 'Retina Times Full Page Ad',
      microsegmentId: 'MSEG-001',
      microsegmentName: 'High Engagers (Academic)',
      impressions: 89,
      clicks: 71,
      conversions: 34,
      ctr: 79.8,
      cvr: 47.9,
      vsAverage: 27.4,
      resonanceScore: 81,
      isTopPerformer: false,
      needsOptimization: false,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-002',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 5,
      contentId: 'CNT-2024-0040',
      contentTitle: 'Retina Times Full Page Ad',
      microsegmentId: 'MSEG-002',
      microsegmentName: 'Medium Engagers (Private Practice)',
      impressions: 51,
      clicks: 37,
      conversions: 18,
      ctr: 72.5,
      cvr: 48.6,
      vsAverage: 29.2,
      resonanceScore: 76,
      isTopPerformer: true,
      needsOptimization: false,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-003',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 5,
      contentId: 'CNT-2024-0040',
      contentTitle: 'Retina Times Full Page Ad',
      microsegmentId: 'MSEG-003',
      microsegmentName: 'Low Engagers (Rural Community)',
      impressions: 14,
      clicks: 9,
      conversions: 4,
      ctr: 64.3,
      cvr: 44.4,
      vsAverage: 18.1,
      resonanceScore: 69,
      isTopPerformer: false,
      needsOptimization: false,
    },
    {
      compositeKey: 'CMP-2024-001/SEQ-5/CNT-2024-0040/MSEG-004',
      campaignId: 'CMP-2024-001',
      sequenceNumber: 5,
      contentId: 'CNT-2024-0040',
      contentTitle: 'Retina Times Full Page Ad',
      microsegmentId: 'MSEG-004',
      microsegmentName: 'New to Brand',
      impressions: 19,
      clicks: 13,
      conversions: 6,
      ctr: 68.4,
      cvr: 46.2,
      vsAverage: 22.8,
      resonanceScore: 74,
      isTopPerformer: false,
      needsOptimization: false,
    },
  ];

  // Calculate content optimization insights
  const contentInsights: ContentOptimizationInsight[] = [
    {
      contentId: 'CNT-2024-0001',
      contentTitle: 'HAWK Study Email',
      bestMicrosegment: 'High Engagers (Academic) - 52.2% CVR',
      worstMicrosegment: 'Low Engagers (Rural) - 38.8% CVR',
      performanceSpread: 34.5,
      recommendation:
        'Performs exceptionally well with academic audiences. Consider creating separate version for rural community physicians with simpler clinical data presentation.',
    },
    {
      contentId: 'CNT-2024-0011',
      contentTitle: 'LinkedIn Thought Leadership',
      bestMicrosegment: 'High Engagers (Academic) - 57.1% CVR',
      worstMicrosegment: 'Low Engagers (Rural) - 36.8% CVR',
      performanceSpread: 55.2,
      recommendation:
        'LinkedIn shows 55% performance gap between academic and rural segments. Rural physicians may not be active on LinkedIn - consider replacing with email for MSEG-003.',
    },
    {
      contentId: 'CNT-2024-0040',
      contentTitle: 'Retina Times Print Ad',
      bestMicrosegment: 'Medium Engagers (Private Practice) - 48.6% CVR',
      worstMicrosegment: 'Low Engagers (Rural) - 44.4% CVR',
      performanceSpread: 9.5,
      recommendation:
        'Most consistent performer across segments. Print journal ads reach well regardless of digital engagement level. Good equalizer for low-engagement segments.',
    },
  ];

  // Group by sequence for sequence-level view
  const sequenceGroups = performanceData.reduce((acc, item) => {
    const key = `SEQ-${item.sequenceNumber}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, SequenceMicrosegmentPerformance[]>);

  // Group by content for content-level view
  const contentGroups = performanceData.reduce((acc, item) => {
    if (!acc[item.contentId]) acc[item.contentId] = [];
    acc[item.contentId].push(item);
    return acc;
  }, {} as Record<string, SequenceMicrosegmentPerformance[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Campaign Performance Matrix</h2>
        <p className="text-sm text-muted-foreground">
          Granular tracking via composite IDs: <span className="font-mono text-xs bg-muted px-2 py-1 rounded">CampaignID/SEQ-#/ContentID/MicrosegmentID</span>
        </p>
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">Content × Microsegment Matrix</TabsTrigger>
          <TabsTrigger value="sequence">By Sequence</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Insights</TabsTrigger>
        </TabsList>

        {/* Content × Microsegment Matrix */}
        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Content Performance by Microsegment
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare how each content asset performs across different audience microsegments. Composite IDs enable this granular tracking.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(contentGroups).map(([contentId, performances]) => (
                  <div key={contentId} className="border rounded-lg p-4">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono">{contentId}</Badge>
                        <Badge variant="secondary">SEQ-{performances[0].sequenceNumber}</Badge>
                      </div>
                      <p className="text-sm font-semibold">{performances[0].contentTitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {performances.map((perf) => (
                        <div
                          key={perf.compositeKey}
                          className={`border rounded-lg p-3 ${
                            perf.isTopPerformer
                              ? 'bg-green-50 border-green-300'
                              : perf.needsOptimization
                              ? 'bg-amber-50 border-amber-300'
                              : 'bg-background'
                          }`}
                        >
                          <div className="mb-2">
                            <p className="text-xs font-semibold">{perf.microsegmentName}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              {perf.compositeKey.split('/').slice(-1)[0]}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">CTR</span>
                                <span className="font-bold">{perf.ctr.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    perf.ctr >= 75 ? 'bg-green-500' : perf.ctr >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(perf.ctr, 100)}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">CVR</span>
                                <span className="font-bold">{perf.cvr.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    perf.cvr >= 45 ? 'bg-green-500' : perf.cvr >= 35 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(perf.cvr * 2, 100)}%` }}
                                />
                              </div>
                            </div>

                            <div className="pt-2 border-t">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">vs Avg</span>
                                <span
                                  className={`font-bold flex items-center gap-1 ${
                                    perf.vsAverage > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}
                                >
                                  {perf.vsAverage > 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {Math.abs(perf.vsAverage).toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {perf.impressions.toLocaleString()} imp • {perf.clicks.toLocaleString()} clicks
                            </div>
                          </div>

                          {perf.isTopPerformer && (
                            <Badge variant="default" className="w-full mt-2 bg-green-600 justify-center">
                              Top Performer
                            </Badge>
                          )}
                          {perf.needsOptimization && (
                            <Badge variant="outline" className="w-full mt-2 border-amber-600 text-amber-600 justify-center">
                              Needs Optimization
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Performance summary */}
                    <div className="mt-4 pt-4 border-t bg-muted/50 rounded p-3">
                      <p className="text-xs font-semibold mb-2">Performance Summary:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Total Impressions:</span>
                          <span className="font-bold ml-1">
                            {performances.reduce((sum, p) => sum + p.impressions, 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Clicks:</span>
                          <span className="font-bold ml-1">
                            {performances.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Conversions:</span>
                          <span className="font-bold ml-1">
                            {performances.reduce((sum, p) => sum + p.conversions, 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg CVR:</span>
                          <span className="font-bold ml-1">
                            {(
                              performances.reduce((sum, p) => sum + p.cvr, 0) / performances.length
                            ).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Sequence View */}
        <TabsContent value="sequence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Journey Sequence</CardTitle>
              <p className="text-sm text-muted-foreground">
                See how microsegments perform at each stage of the journey. Composite keys track every touchpoint.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(sequenceGroups).map(([seqKey, performances]) => (
                  <div key={seqKey} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="font-mono text-base">{seqKey}</Badge>
                      <Badge variant="secondary">{performances[0].contentTitle}</Badge>
                      <Badge className="font-mono">{performances[0].contentId}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {performances.map((perf) => (
                        <div key={perf.compositeKey} className="border rounded p-3">
                          <p className="text-sm font-semibold mb-2">{perf.microsegmentName}</p>
                          <p className="text-xs text-muted-foreground font-mono mb-3">{perf.compositeKey}</p>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Impressions</span>
                              <span className="font-bold">{perf.impressions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Clicks</span>
                              <span className="font-bold">{perf.clicks.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Conversions</span>
                              <span className="font-bold text-green-600">{perf.conversions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span className="text-muted-foreground">CVR</span>
                              <span className="font-bold">{perf.cvr.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Insights */}
        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Content Optimization Insights
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations based on composite key performance tracking across segments
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentInsights.map((insight) => (
                  <div key={insight.contentId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono">{insight.contentId}</Badge>
                        </div>
                        <p className="text-sm font-semibold">{insight.contentTitle}</p>
                      </div>
                      <Badge
                        variant={insight.performanceSpread > 40 ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {insight.performanceSpread.toFixed(0)}% spread
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-xs font-semibold text-green-900 mb-1">
                          Best Performance
                        </p>
                        <p className="text-sm text-green-800">{insight.bestMicrosegment}</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-xs font-semibold text-red-900 mb-1">
                          Weakest Performance
                        </p>
                        <p className="text-sm text-red-800">{insight.worstMicrosegment}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        Optimization Recommendation
                      </p>
                      <p className="text-sm text-blue-800">{insight.recommendation}</p>
                    </div>
                  </div>
                ))}

                {/* Overall Campaign Insights */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
                  <p className="text-sm font-semibold text-purple-900 mb-3">
                    Overall Campaign Optimization Strategy
                  </p>
                  <ul className="text-sm text-purple-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>
                        <strong>High Engagers (Academic):</strong> All content performs exceptionally
                        well (50%+ CVR). Maintain current strategy and consider increasing frequency.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>
                        <strong>Low Engagers (Rural):</strong> 34-55% performance gap across digital
                        content. Replace LinkedIn with additional email touchpoint or increase print
                        allocation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>
                        <strong>Print Media Equalizer:</strong> Retina Times shows most consistent
                        performance (9.5% spread). Consider earlier placement in journey for
                        low-engagement segments.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>
                        <strong>Composite Key Value:</strong> Granular tracking enables segment-specific
                        optimization. Without {'{CampaignID/SEQ/Content/Segment}'} tracking, these
                        insights would be impossible.
                      </span>
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
