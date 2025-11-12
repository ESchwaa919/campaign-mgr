import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { IDRegistryEntry } from '@/types';

interface TrackingKeyDisplayProps {
  entry: IDRegistryEntry;
  baseURL?: string;
}

export function TrackingKeyDisplay({ entry, baseURL }: TrackingKeyDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Build full tracking URL
  const trackingURL = baseURL
    ? `${baseURL}?${buildQueryString({ ...entry.utmParameters, ...entry.cmParameters })}`
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Tracking Parameters</CardTitle>
          </div>
          {entry.sequenceNumber !== undefined && (
            <Badge variant="secondary">SEQ-{entry.sequenceNumber}</Badge>
          )}
        </div>
        <CardDescription className="font-mono text-xs">{entry.compositeKey}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* UTM Parameters */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-muted-foreground">UTM Parameters</span>
            <Badge variant="outline" className="text-xs">
              Standard
            </Badge>
          </h4>
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            {Object.entries(entry.utmParameters).map(([key, value]) => (
              value && (
                <ParameterRow
                  key={key}
                  name={key}
                  value={value}
                  onCopy={handleCopy}
                  isCopied={copied === key}
                />
              )
            ))}
          </div>
        </div>

        {/* cm_* Parameters */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-muted-foreground">Custom Marketing Parameters</span>
            <Badge variant="outline" className="text-xs">
              cm_*
            </Badge>
          </h4>
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            {Object.entries(entry.cmParameters).map(([key, value]) => (
              value && (
                <ParameterRow
                  key={key}
                  name={key}
                  value={value}
                  onCopy={handleCopy}
                  isCopied={copied === key}
                />
              )
            ))}
          </div>
        </div>

        {/* Full Tracking URL */}
        {trackingURL && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-semibold text-muted-foreground">Full Tracking URL</h4>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <p className="text-xs font-mono break-all flex-1">{trackingURL}</p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => handleCopy(trackingURL, 'full-url')}
                  >
                    {copied === 'full-url' ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => window.open(trackingURL, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Query String Only */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Query String</h4>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <p className="text-xs font-mono break-all flex-1">
                {buildQueryString({ ...entry.utmParameters, ...entry.cmParameters })}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() =>
                  handleCopy(
                    buildQueryString({ ...entry.utmParameters, ...entry.cmParameters }),
                    'query-string'
                  )
                }
              >
                {copied === 'query-string' ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ParameterRowProps {
  name: string;
  value: string;
  onCopy: (text: string, key: string) => void;
  isCopied: boolean;
}

function ParameterRow({ name, value, onCopy, isCopied }: ParameterRowProps) {
  return (
    <div className="flex items-center justify-between text-xs group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="font-mono text-muted-foreground">{name}=</span>
        <span className="font-mono font-medium truncate">{value}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 px-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onCopy(value, name)}
      >
        {isCopied ? (
          <CheckCircle2 className="h-3 w-3 text-green-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}

// Helper: Build query string from parameters
function buildQueryString(params: Record<string, string | undefined>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`)
    .join('&');
}
