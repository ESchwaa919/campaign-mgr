import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Microsegment, ContentResonancePrediction } from '@/types';

interface ContentMappingTableProps {
  microsegments: Microsegment[];
  predictions: ContentResonancePrediction[];
  contentAssets: Array<{
    id: string;
    title: string;
    type: string;
    format: string;
  }>;
}

export function ContentMappingTable({ microsegments, predictions, contentAssets }: ContentMappingTableProps) {
  // Build mapping: contentId -> microsegmentId -> prediction
  const contentToMicrosegmentMap = new Map<string, Map<string, ContentResonancePrediction>>();
  predictions.forEach((pred) => {
    if (!contentToMicrosegmentMap.has(pred.contentId)) {
      contentToMicrosegmentMap.set(pred.contentId, new Map());
    }
    contentToMicrosegmentMap.get(pred.contentId)!.set(pred.microsegmentId, pred);
  });

  // Helper: Get resonance badge variant
  const getResonanceVariant = (score: number) => {
    if (score >= 85) return { color: 'bg-green-100 text-green-800 border-green-300', label: 'Excellent' };
    if (score >= 75) return { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: 'Good' };
    if (score >= 65) return { color: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Moderate' };
    if (score >= 50) return { color: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Fair' };
    return { color: 'bg-red-100 text-red-800 border-red-300', label: 'Low' };
  };

  // Helper: Get trend icon
  const getTrendIcon = (prediction: ContentResonancePrediction) => {
    if (!prediction.historicalData || prediction.historicalData.length === 0) {
      return <Minus className="h-3 w-3 text-muted-foreground" />;
    }

    const avgHistorical =
      prediction.historicalData.reduce((sum, d) => sum + d.conversionRate, 0) /
      prediction.historicalData.length;
    const predicted = prediction.predictedMetrics.conversionRate;

    if (predicted > avgHistorical * 1.1) {
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    } else if (predicted < avgHistorical * 0.9) {
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    }
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content × Microsegment Performance Matrix</CardTitle>
        <CardDescription>
          Predicted resonance scores and performance metrics for each content asset across microsegments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] sticky left-0 bg-background z-10">Content Asset</TableHead>
                {microsegments.map((ms) => (
                  <TableHead key={ms.id} className="text-center min-w-[180px]">
                    <div className="space-y-1">
                      <p className="font-semibold text-xs">{ms.name}</p>
                      <Badge variant="outline" className="text-xs font-mono">
                        {ms.estimatedCount.toLocaleString()} HCPs
                      </Badge>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentAssets.map((asset) => {
                const microsegmentPredictions = contentToMicrosegmentMap.get(asset.id);

                return (
                  <TableRow key={asset.id}>
                    {/* Content Column */}
                    <TableCell className="sticky left-0 bg-background z-10 border-r">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{asset.title}</p>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {asset.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {asset.format}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {/* Microsegment Cells */}
                    {microsegments.map((ms) => {
                      const prediction = microsegmentPredictions?.get(ms.id);

                      if (!prediction) {
                        return (
                          <TableCell key={ms.id} className="text-center">
                            <span className="text-xs text-muted-foreground">No data</span>
                          </TableCell>
                        );
                      }

                      const variant = getResonanceVariant(prediction.resonanceScore);

                      return (
                        <TableCell key={ms.id} className="text-center">
                          <div className="space-y-2">
                            {/* Resonance Score Badge */}
                            <div className="flex items-center justify-center gap-1">
                              <Badge className={`text-xs ${variant.color}`}>
                                {prediction.resonanceScore}
                              </Badge>
                              {getTrendIcon(prediction)}
                            </div>

                            {/* Predicted Metrics */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-muted-foreground">Open:</span>
                                <span className="font-medium">
                                  {(prediction.predictedMetrics.openRate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <Progress
                                value={prediction.predictedMetrics.openRate * 100}
                                className="h-1"
                              />

                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-muted-foreground">Click:</span>
                                <span className="font-medium">
                                  {(prediction.predictedMetrics.clickRate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <Progress
                                value={prediction.predictedMetrics.clickRate * 100}
                                className="h-1"
                              />

                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-muted-foreground">Conv:</span>
                                <span className="font-medium">
                                  {(prediction.predictedMetrics.conversionRate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <Progress
                                value={prediction.predictedMetrics.conversionRate * 100}
                                className="h-1"
                              />
                            </div>

                            {/* Confidence */}
                            <div className="text-xs text-muted-foreground">
                              {(prediction.predictedMetrics.confidence * 100).toFixed(0)}% confident
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs font-semibold mb-2">Resonance Score Legend:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
              <span>85+ Excellent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>75-84 Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              <span>65-74 Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300" />
              <span>50-64 Fair</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
              <span>&lt;50 Low</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
