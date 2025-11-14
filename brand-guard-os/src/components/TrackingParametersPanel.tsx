import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, ExternalLink, Link2 } from 'lucide-react';
import type { IDRegistryEntry } from '@/types';
import { useState } from 'react';

interface ClaravineStatus {
  validated: boolean;
  taxonomyId: string;
  approvalDate: Date;
  validationChecks: {
    taxonomyCompliance: boolean;
    malformedParameters: boolean;
    missingIds: boolean;
    activationApproved: boolean;
  };
}

interface TrackingParametersPanelProps {
  entry: IDRegistryEntry;
  claravineStatus: ClaravineStatus;
  snowflakeJoinRate: number;
}

export function TrackingParametersPanel({ entry, claravineStatus, snowflakeJoinRate }: TrackingParametersPanelProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Build sample tracking URL
  const baseURL = 'https://eylea-hcp.com/amd-study';
  const utmParams = new URLSearchParams({
    utm_source: entry.utmParameters.utm_source,
    utm_medium: entry.utmParameters.utm_medium,
    utm_campaign: entry.utmParameters.utm_campaign,
    ...(entry.utmParameters.utm_content && { utm_content: entry.utmParameters.utm_content }),
    ...(entry.utmParameters.utm_term && { utm_term: entry.utmParameters.utm_term }),
    cm_campaign_id: entry.cmParameters.cm_campaign_id,
    ...(entry.cmParameters.cm_sequence_id && { cm_sequence_id: entry.cmParameters.cm_sequence_id }),
    ...(entry.cmParameters.cm_content_id && { cm_content_id: entry.cmParameters.cm_content_id }),
    ...(entry.cmParameters.cm_microsegment_id && { cm_microsegment_id: entry.cmParameters.cm_microsegment_id }),
  });

  const fullTrackingURL = `${baseURL}?${utmParams.toString()}`;

  // Build composite keys for display
  const journeyPathKey = [
    entry.campaignId,
    entry.sequenceNumber ? `SEQ-${entry.sequenceNumber}` : null,
    entry.microsegmentId,
  ]
    .filter(Boolean)
    .join('/');

  const contentLineageKey = [entry.contentId, entry.variantName, entry.microsegmentId].filter(Boolean).join('/');

  return (
    <div className="space-y-4">
      {/* Composite Key Display */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground">Composite Key</p>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => copyToClipboard(entry.compositeKey, 'composite')}
            >
              {copiedSection === 'composite' ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="p-3 rounded-lg bg-muted font-mono text-xs break-all">{entry.compositeKey}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Journey Path Key</p>
            <div className="p-2 rounded-lg bg-muted/50 font-mono text-xs break-all">{journeyPathKey}</div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Content Lineage Key</p>
            <div className="p-2 rounded-lg bg-muted/50 font-mono text-xs break-all">{contentLineageKey}</div>
          </div>
        </div>
      </div>

      {/* Standard UTM Parameters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Standard UTM Parameters</h4>
          <Badge variant="outline">Claravine Generated</Badge>
        </div>
        <div className="space-y-2">
          {Object.entries(entry.utmParameters).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-2 text-xs">
              <span className="font-mono text-muted-foreground">{key}</span>
              <span className="col-span-2 font-mono bg-muted/50 px-2 py-1 rounded">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom cm_* Parameters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Custom cm_* Parameters</h4>
          <Badge variant="outline">Regeneron-specific</Badge>
        </div>
        <div className="space-y-2">
          {Object.entries(entry.cmParameters).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-2 text-xs">
              <span className="font-mono text-muted-foreground">{key}</span>
              <span className="col-span-2 font-mono bg-muted/50 px-2 py-1 rounded">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Tracked URL */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Sample Tracked URL</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => copyToClipboard(fullTrackingURL, 'url')}
            >
              {copiedSection === 'url' ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
            <Button size="sm" variant="ghost" className="h-6 px-2" asChild>
              <a href={fullTrackingURL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="text-xs">Open</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted font-mono text-xs break-all max-h-32 overflow-auto">
          {fullTrackingURL}
        </div>
      </div>

      {/* Claravine Validation Badge */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-xs">Claravine Validation: PASSED</p>
              <p className="text-xs mt-1">
                Taxonomy ID: <span className="font-mono">{claravineStatus.taxonomyId}</span>
              </p>
              <p className="text-xs">Approved: {claravineStatus.approvalDate.toLocaleDateString()}</p>
            </div>
            <Badge variant="default" className="bg-green-600">Approved</Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Snowflake Integration Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Snowflake Integration Status
          </CardTitle>
          <CardDescription className="text-xs">Event-to-campaign join quality (BRD SW-003)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Join Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{snowflakeJoinRate}%</span>
                <Badge variant="default" className="bg-green-600">
                  {'>'} 98% Target
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p className="mb-2">This composite key structure enables:</p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Granular sequence-level attribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Content × Microsegment performance tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Multi-touch attribution modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Journey path comparison analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Distribution Status */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Distributed To</h4>
        <div className="space-y-2">
          {[
            'Salesforce Marketing Cloud',
            'Google Ads',
            'CMI Media Platform',
            'Veeva CRM',
            'Snowflake dim_tracking_plan',
          ].map((vendor) => (
            <div key={vendor} className="flex items-center gap-2 text-xs p-2 rounded-lg border bg-card">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>{vendor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
