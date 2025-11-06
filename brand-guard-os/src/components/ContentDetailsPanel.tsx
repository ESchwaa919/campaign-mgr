import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Plus, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { ContentAsset } from '@/types';

interface ContentDetailsPanelProps {
  content: ContentAsset | null;
  onClose: () => void;
  onAddToCanvas: (content: ContentAsset) => void;
}

export function ContentDetailsPanel({ content, onClose, onAddToCanvas }: ContentDetailsPanelProps) {
  if (!content) return null;

  return (
    <Card className="w-96 flex flex-col h-full shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">Content Details</CardTitle>
            <CardDescription className="text-xs mt-1 font-mono">{content.id}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 -mr-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 pt-0 overflow-hidden">
        <ScrollArea className="flex-1 -mx-4 px-4">
          {/* Preview Image */}
          <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
            {content.thumbnailUrl ? (
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm mb-2">{content.title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{content.description}</p>

          <Separator className="my-4" />

          {/* MLR Status */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">MLR Status</p>
              <Badge
                variant={content.mlrStatus === 'APPROVED' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {content.mlrStatus === 'APPROVED' ? (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {content.mlrStatus}
              </Badge>
              {content.mlrCaseId && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Case: {content.mlrCaseId}
                </p>
              )}
            </div>

            {/* Asset Type */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Asset Type</p>
              <Badge variant="outline" className="text-xs">
                {content.assetType.replace(/_/g, ' ')}
              </Badge>
            </div>

            {/* Channel */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Channel</p>
              <Badge variant="outline" className="text-xs">
                {content.channel}
              </Badge>
            </div>

            {/* Audience Type */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Target Audience</p>
              <Badge variant="outline" className="text-xs">
                {content.audienceType}
              </Badge>
            </div>

            {/* Linked Claims */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Linked Claims</p>
              <div className="flex flex-wrap gap-1">
                {content.linkedClaimIds.map((claimId) => (
                  <Badge key={claimId} variant="secondary" className="text-xs font-mono">
                    {claimId}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {content.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Version & Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Version</p>
                <p className="text-xs">v{content.version}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Effective From</p>
                <p className="text-xs">{content.effectiveFrom.toLocaleDateString()}</p>
              </div>
            </div>

            {content.effectiveTo && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Expires</p>
                <p className="text-xs">{content.effectiveTo.toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="space-y-2 border-t pt-4">
          <Button
            className="w-full"
            size="sm"
            onClick={() => onAddToCanvas(content)}
            disabled={content.mlrStatus !== 'APPROVED'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Canvas
          </Button>
          {content.mlrStatus !== 'APPROVED' && (
            <p className="text-xs text-muted-foreground text-center">
              Only approved content can be added to journeys
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
