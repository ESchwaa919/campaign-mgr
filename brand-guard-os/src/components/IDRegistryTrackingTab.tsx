import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Database, Link2 } from 'lucide-react';
import type { IDRegistryEntry, Microsegment } from '@/types';
import { IDHierarchyTree } from './IDHierarchyTree';
import { TrackingParametersPanel } from './TrackingParametersPanel';
import { useState } from 'react';

interface IDRegistryTrackingTabProps {
  campaignId: string;
  idRegistry: IDRegistryEntry[];
  microsegments: Microsegment[];
}

export function IDRegistryTrackingTab({ campaignId, idRegistry, microsegments }: IDRegistryTrackingTabProps) {
  const [selectedEntry, setSelectedEntry] = useState<IDRegistryEntry | null>(
    idRegistry.find((e) => e.type === 'CONTENT' && e.microsegmentId) || null
  );

  // Mock Claravine validation status
  const claravineStatus = {
    validated: true,
    taxonomyId: 'CLV-2024-Q4-1847',
    approvalDate: new Date('2024-10-28'),
    validationChecks: {
      taxonomyCompliance: true,
      malformedParameters: false,
      missingIds: false,
      activationApproved: true,
    },
  };

  // Mock Snowflake join rate (from SW-003 requirement)
  const snowflakeJoinRate = 98.4; // >98% target
  const orphanedEvents = 387;
  const totalEvents = 24234;

  // Get campaign-level entry
  const campaignEntry = idRegistry.find((e) => e.type === 'CAMPAIGN');

  return (
    <div className="space-y-6">
      {/* System Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* ID Registry Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">ID Registry</p>
                  <p className="text-lg font-bold">{idRegistry.length}</p>
                  <p className="text-xs text-muted-foreground">Unique IDs Minted</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Claravine Validation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Claravine</p>
                  <p className="text-lg font-bold">Validated</p>
                  <p className="text-xs text-muted-foreground font-mono">{claravineStatus.taxonomyId}</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">Approved</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Snowflake Join Rate */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Snowflake Join Rate</p>
                  <p className="text-lg font-bold">{snowflakeJoinRate}%</p>
                  <p className="text-xs text-muted-foreground">
                    {orphanedEvents.toLocaleString()} orphaned ({((orphanedEvents / totalEvents) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">{'>'} 98%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign ID Header */}
      {campaignEntry && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Campaign ID Registry</CardTitle>
                <CardDescription>
                  Unique identifiers minted by ID Registry and validated by Claravine
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-base px-4 py-2">
                {campaignEntry.campaignId}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Main Content: ID Hierarchy + Tracking Parameters */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel: ID Registry Hierarchy */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              ID Registry Hierarchy
            </CardTitle>
            <CardDescription>
              Composite key structure enabling granular attribution
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[500px]">
            <IDHierarchyTree
              idRegistry={idRegistry}
              microsegments={microsegments}
              selectedEntry={selectedEntry}
              onSelectEntry={setSelectedEntry}
            />
          </CardContent>
        </Card>

        {/* Right Panel: Claravine Tracking Parameters */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Claravine Tracking Parameters
            </CardTitle>
            <CardDescription>
              {selectedEntry
                ? `Tracking parameters for: ${selectedEntry.compositeKey}`
                : 'Select an ID from the hierarchy to view tracking parameters'}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[500px]">
            {selectedEntry ? (
              <TrackingParametersPanel
                entry={selectedEntry}
                claravineStatus={claravineStatus}
                snowflakeJoinRate={snowflakeJoinRate}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select an entry from the ID Registry hierarchy</p>
                <p className="text-xs mt-2">to view its tracking parameters and validation status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Claravine Validation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Claravine Validation Status</CardTitle>
          <CardDescription>Pre-activation taxonomy validation and approval gates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">
                <strong>Pre-activation validation: PASSED</strong>
                <p className="text-xs mt-1">
                  All tracking parameters validated on {claravineStatus.approvalDate.toLocaleDateString()}
                </p>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">Taxonomy Compliance</p>
                  <p className="text-xs text-muted-foreground">All parameters follow approved taxonomy</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">No Malformed Parameters</p>
                  <p className="text-xs text-muted-foreground">All UTM + cm_* params correctly formatted</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">All IDs Present</p>
                  <p className="text-xs text-muted-foreground">Campaign, Sequence, Content, Segment IDs detected</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium">Activation Approved</p>
                  <p className="text-xs text-muted-foreground">Campaign permitted to activate</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Data Dissemination */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking Data Dissemination</CardTitle>
          <CardDescription>Synchronized tracking parameters across vendor platforms and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Campaign Manager (API sync)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>CMI Media Platform</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Salesforce Marketing Cloud</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Google Ads</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Veeva CRM</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Snowflake (dim_tracking_plan)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Why this matters:</strong> The composite key structure shown in the ID Registry (left panel) enables
          the granular Content × Microsegment performance tracking in Tab 8. The {snowflakeJoinRate}% join rate
          ensures accurate attribution by matching event data with these composite keys in Snowflake.
        </AlertDescription>
      </Alert>
    </div>
  );
}
