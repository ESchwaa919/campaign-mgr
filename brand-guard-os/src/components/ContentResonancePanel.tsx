import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentResonancePrediction, Microsegment } from '@/types';
import { TrendingUp, Target, AlertCircle, Lightbulb, BarChart3, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ContentResonancePanelProps {
  prediction: ContentResonancePrediction;
  microsegment: Microsegment;
  contentTitle: string;
}

export function ContentResonancePanel({
  prediction,
  microsegment,
  contentTitle,
}: ContentResonancePanelProps) {
  const { resonanceScore, historicalData, predictedMetrics, recommendations } = prediction;

  // Calculate average historical performance
  const avgHistorical = historicalData.length > 0
    ? {
        openRate: historicalData.reduce((sum, d) => sum + d.openRate, 0) / historicalData.length,
        clickRate: historicalData.reduce((sum, d) => sum + d.clickRate, 0) / historicalData.length,
        conversionRate: historicalData.reduce((sum, d) => sum + d.conversionRate, 0) / historicalData.length,
      }
    : null;

  const totalSampleSize = historicalData.reduce((sum, d) => sum + d.sampleSize, 0);

  // Determine resonance level
  const getResonanceLevel = (score: number): { label: string; color: string; icon: typeof TrendingUp } => {
    if (score >= 85) return { label: 'Excellent', color: 'text-green-600', icon: TrendingUp };
    if (score >= 75) return { label: 'Good', color: 'text-emerald-600', icon: TrendingUp };
    if (score >= 65) return { label: 'Moderate', color: 'text-amber-600', icon: Target };
    if (score >= 50) return { label: 'Fair', color: 'text-orange-600', icon: Target };
    return { label: 'Low', color: 'text-slate-600', icon: AlertCircle };
  };

  const resonanceLevel = getResonanceLevel(resonanceScore);
  const Icon = resonanceLevel.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className={`h-5 w-5 ${resonanceLevel.color}`} />
              Content Resonance Prediction
            </CardTitle>
            <CardDescription className="mt-1">
              {contentTitle} → {microsegment.name}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${resonanceLevel.color}`}>{resonanceScore}</div>
            <div className="text-xs text-muted-foreground">{resonanceLevel.label}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Predicted Performance Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Predicted Performance</h4>
            <Badge variant="secondary" className="text-xs">
              {(predictedMetrics.confidence * 100).toFixed(0)}% confidence
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Open Rate</span>
                <span className="font-semibold">{(predictedMetrics.openRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={predictedMetrics.openRate * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Click Rate</span>
                <span className="font-semibold">{(predictedMetrics.clickRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={predictedMetrics.clickRate * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-semibold text-green-600">{(predictedMetrics.conversionRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={predictedMetrics.conversionRate * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Historical Data */}
        {historicalData.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">Historical Performance</h4>
              <Badge variant="outline" className="text-xs">
                {historicalData.length} campaign{historicalData.length !== 1 ? 's' : ''}, {totalSampleSize.toLocaleString()} HCPs
              </Badge>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {historicalData.map((data, idx) => (
                <div key={data.campaignId} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Campaign {historicalData.length - idx} ({data.sampleSize.toLocaleString()} HCPs)
                  </span>
                  <div className="flex gap-3">
                    <span>
                      Open: <span className="font-semibold">{(data.openRate * 100).toFixed(1)}%</span>
                    </span>
                    <span>
                      Click: <span className="font-semibold">{(data.clickRate * 100).toFixed(1)}%</span>
                    </span>
                    <span>
                      Conv: <span className="font-semibold text-green-600">{(data.conversionRate * 100).toFixed(1)}%</span>
                    </span>
                  </div>
                </div>
              ))}

              {avgHistorical && (
                <div className="pt-2 border-t flex items-center justify-between text-xs font-medium">
                  <span>Average (Historical)</span>
                  <div className="flex gap-3">
                    <span>
                      Open: <span className="font-semibold">{(avgHistorical.openRate * 100).toFixed(1)}%</span>
                    </span>
                    <span>
                      Click: <span className="font-semibold">{(avgHistorical.clickRate * 100).toFixed(1)}%</span>
                    </span>
                    <span>
                      Conv: <span className="font-semibold text-green-600">{(avgHistorical.conversionRate * 100).toFixed(1)}%</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h4 className="font-semibold text-sm">Recommendations</h4>
            </div>

            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Microsegment Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Target Microsegment</span>
            <Badge variant="secondary" className="font-mono">
              {microsegment.estimatedCount.toLocaleString()} HCPs
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{microsegment.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
