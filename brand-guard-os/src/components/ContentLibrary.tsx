import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ResonanceBadgeGroup } from '@/components/ResonanceBadge';
import type { ContentAsset, Microsegment, ContentResonancePrediction } from '@/types';

interface ContentLibraryProps {
  content: ContentAsset[];
  totalCount: number;
  onContentSelect: (asset: ContentAsset) => void;
  onContentDrag: (asset: ContentAsset) => void;
  selectedContentId?: string;
  microsegments?: Microsegment[];
  resonancePredictions?: ContentResonancePrediction[];
}

export function ContentLibrary({
  content,
  totalCount,
  onContentSelect,
  onContentDrag,
  selectedContentId,
  microsegments = [],
  resonancePredictions = [],
}: ContentLibraryProps) {
  // Create map of microsegment IDs to names for easy lookup
  const microsegmentNames = new Map(microsegments.map((ms) => [ms.id, ms.name]));

  // Helper function to get predictions for a specific content item
  const getPredictionsForContent = (contentId: string): ContentResonancePrediction[] => {
    return resonancePredictions.filter((pred) => pred.contentId === contentId);
  };
  return (
    <Card className="w-80 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Content Library</CardTitle>
            <CardDescription className="text-xs mt-1">
              <span className="font-semibold text-foreground">{content.length}</span> of{' '}
              <span className="text-muted-foreground">{totalCount} eligible</span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {content.filter((c) => c.mlrStatus === 'APPROVED').length} Approved
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 pt-0 overflow-hidden">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input placeholder="Search content..." className="pl-7 h-8 text-xs" />
        </div>

        {/* Content Grid */}
        <ScrollArea className="flex-1 -mx-4 px-4">
          <div className="space-y-2">
            {content.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <p className="font-medium">No eligible content</p>
                <p className="text-xs mt-1">Adjust filters to see more content</p>
              </div>
            ) : (
              content.map((asset) => (
                <div
                  key={asset.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    const channelToNodeType: Record<string, string> = {
                      EMAIL: 'email',
                      WEB: 'web',
                      MOBILE: 'mobile',
                    };
                    const nodeType = channelToNodeType[asset.channel] || 'email';
                    const nodeTypeConfigs = [
                      { id: 'email', label: 'Email', nodeType: 'email' },
                      { id: 'web', label: 'Web Content', nodeType: 'web' },
                      { id: 'mobile', label: 'Mobile Push', nodeType: 'mobile' },
                    ];
                    const nodeConfig = nodeTypeConfigs.find((n) => n.nodeType === nodeType)!;
                    e.dataTransfer.setData(
                      'application/reactflow',
                      JSON.stringify({ nodeConfig, contentAsset: asset })
                    );
                    onContentDrag(asset);
                  }}
                  onClick={() => onContentSelect(asset)}
                  className={`
                    relative group cursor-move rounded-lg border transition-all
                    ${
                      selectedContentId === asset.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="p-2">
                    {/* Thumbnail */}
                    <div className="relative w-full h-20 bg-muted rounded overflow-hidden mb-2">
                      {asset.thumbnailUrl ? (
                        <img
                          src={asset.thumbnailUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}

                      {/* MLR Status Badge */}
                      {asset.mlrStatus === 'APPROVED' && (
                        <div className="absolute top-1 right-1">
                          <Badge variant="default" className="text-xs h-5 px-1 bg-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium line-clamp-2 leading-tight">
                        {asset.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{asset.id}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          {asset.channel}
                        </Badge>
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          {asset.audienceType}
                        </Badge>
                      </div>

                      {/* Resonance Scores */}
                      {microsegments.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">
                            Resonance Scores:
                          </p>
                          <ResonanceBadgeGroup
                            predictions={getPredictionsForContent(asset.id)}
                            microsegmentNames={microsegmentNames}
                            layout="vertical"
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Drag Indicator */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
                    <p className="text-xs font-medium text-primary">
                      Click to preview or drag to canvas
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Filter Summary */}
        {content.length > 0 && content.length < totalCount && (
          <div className="text-xs text-muted-foreground text-center py-2 border-t">
            {totalCount - content.length} items filtered out
          </div>
        )}
      </CardContent>
    </Card>
  );
}
