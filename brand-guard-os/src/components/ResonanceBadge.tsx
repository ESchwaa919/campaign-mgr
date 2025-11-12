import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';
import { ContentResonancePrediction } from '@/types';

interface ResonanceBadgeProps {
  prediction: ContentResonancePrediction;
  microsegmentName: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ResonanceBadge({
  prediction,
  microsegmentName,
  size = 'md',
  showLabel = true,
}: ResonanceBadgeProps) {
  const { resonanceScore } = prediction;

  // Determine color and icon based on score
  const getScoreVariant = (score: number): {
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    color: string;
    stars: number;
  } => {
    if (score >= 85) {
      return { variant: 'default', color: 'bg-green-100 text-green-800 border-green-300', stars: 5 };
    } else if (score >= 75) {
      return { variant: 'default', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', stars: 4 };
    } else if (score >= 65) {
      return { variant: 'default', color: 'bg-amber-100 text-amber-800 border-amber-300', stars: 3 };
    } else if (score >= 50) {
      return { variant: 'outline', color: 'bg-orange-100 text-orange-800 border-orange-300', stars: 2 };
    } else {
      return { variant: 'outline', color: 'bg-slate-100 text-slate-700 border-slate-300', stars: 1 };
    }
  };

  const scoreInfo = getScoreVariant(resonanceScore);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  const iconSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
  };

  return (
    <Badge
      variant={scoreInfo.variant}
      className={`${scoreInfo.color} ${sizeClasses[size]} font-semibold flex items-center gap-1 border`}
    >
      <TrendingUp className={iconSizes[size]} />
      <span>{resonanceScore}</span>
      {showLabel && size !== 'sm' && (
        <>
          <span className="mx-0.5">•</span>
          <div className="flex items-center">
            {Array.from({ length: scoreInfo.stars }).map((_, i) => (
              <Star key={i} className={`${iconSizes[size]} fill-current`} />
            ))}
          </div>
        </>
      )}
    </Badge>
  );
}

interface ResonanceBadgeGroupProps {
  predictions: ContentResonancePrediction[];
  microsegmentNames: Map<string, string>; // microsegmentId -> name
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function ResonanceBadgeGroup({
  predictions,
  microsegmentNames,
  layout = 'vertical',
  size = 'sm',
}: ResonanceBadgeGroupProps) {
  if (predictions.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic">
        No resonance data available
      </div>
    );
  }

  // Sort predictions by score descending
  const sortedPredictions = [...predictions].sort((a, b) => b.resonanceScore - a.resonanceScore);

  return (
    <div className={`flex ${layout === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} gap-1.5`}>
      {sortedPredictions.map((prediction) => {
        const microsegmentName = microsegmentNames.get(prediction.microsegmentId) || 'Unknown Segment';

        return (
          <div
            key={prediction.microsegmentId}
            className="flex items-center gap-2"
            title={`${microsegmentName}: ${prediction.resonanceScore}% resonance score`}
          >
            {layout === 'vertical' && size !== 'sm' && (
              <span className="text-xs text-muted-foreground min-w-[100px] truncate">
                {microsegmentName}:
              </span>
            )}
            <ResonanceBadge
              prediction={prediction}
              microsegmentName={microsegmentName}
              size={size}
              showLabel={layout === 'horizontal'}
            />
          </div>
        );
      })}
    </div>
  );
}
