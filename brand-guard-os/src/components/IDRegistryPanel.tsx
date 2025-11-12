import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { IDRegistryEntry } from '@/types';

interface IDRegistryPanelProps {
  entries: IDRegistryEntry[];
  campaignId: string;
}

export function IDRegistryPanel({ entries, campaignId }: IDRegistryPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Group entries by type
  const campaignEntries = entries.filter((e) => e.type === 'CAMPAIGN');
  const sequenceEntries = entries.filter((e) => e.type === 'SEQUENCE');
  const contentEntries = entries.filter((e) => e.type === 'CONTENT');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CAMPAIGN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'SEQUENCE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CONTENT':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">ID Registry</CardTitle>
          </div>
          <Badge variant="secondary" className="font-mono">
            {entries.length} entries
          </Badge>
        </div>
        <CardDescription>
          Campaign ID: <span className="font-mono font-semibold text-foreground">{campaignId}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {/* Campaign Level */}
            {campaignEntries.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Campaign Level</h4>
                {campaignEntries.map((entry) => (
                  <IDRegistryCard
                    key={entry.id}
                    entry={entry}
                    onCopy={handleCopy}
                    isCopied={copiedId === entry.id}
                    typeColor={getTypeColor(entry.type)}
                  />
                ))}
              </div>
            )}

            {/* Sequence Level */}
            {sequenceEntries.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Sequence Level ({sequenceEntries.length})
                </h4>
                {sequenceEntries.map((entry) => (
                  <IDRegistryCard
                    key={entry.id}
                    entry={entry}
                    onCopy={handleCopy}
                    isCopied={copiedId === entry.id}
                    typeColor={getTypeColor(entry.type)}
                  />
                ))}
              </div>
            )}

            {/* Content Level */}
            {contentEntries.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Content Level ({contentEntries.length})
                </h4>
                {contentEntries.map((entry) => (
                  <IDRegistryCard
                    key={entry.id}
                    entry={entry}
                    onCopy={handleCopy}
                    isCopied={copiedId === entry.id}
                    typeColor={getTypeColor(entry.type)}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface IDRegistryCardProps {
  entry: IDRegistryEntry;
  onCopy: (text: string, id: string) => void;
  isCopied: boolean;
  typeColor: string;
}

function IDRegistryCard({ entry, onCopy, isCopied, typeColor }: IDRegistryCardProps) {
  return (
    <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge className={`text-xs border ${typeColor}`}>
            {entry.type}
          </Badge>
          {entry.sequenceNumber !== undefined && (
            <Badge variant="outline" className="text-xs">
              SEQ-{entry.sequenceNumber}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={() => onCopy(entry.compositeKey, entry.id)}
        >
          {isCopied ? (
            <CheckCircle2 className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-mono font-medium break-all">
          {entry.compositeKey}
        </p>

        {entry.contentId && (
          <p className="text-xs text-muted-foreground">
            Content: <span className="font-mono">{entry.contentId}</span>
          </p>
        )}

        {entry.microsegmentId && (
          <p className="text-xs text-muted-foreground">
            Microsegment: <span className="font-mono">{entry.microsegmentId}</span>
          </p>
        )}

        <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Minted: {new Date(entry.mintedAt).toLocaleString()}</span>
          <span>•</span>
          <Badge
            variant={entry.status === 'ACTIVE' ? 'default' : 'secondary'}
            className="text-xs h-4 px-1"
          >
            {entry.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
