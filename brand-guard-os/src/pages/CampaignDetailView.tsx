import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, Users, Database, Map, Key, Workflow, FileText, TrendingUp, GitBranch, Target } from 'lucide-react';
import { IDRegistryTrackingTab } from '@/components/IDRegistryTrackingTab';
import { ContentMappingTable } from '@/components/ContentMappingTable';
import { SequencePerformanceDashboard } from '@/components/SequencePerformanceDashboard';
import {
  mockIDRegistry,
  mockMicrosegments,
  mockBrands,
  mockSegments,
  mockContentLibrary,
  mockContentResonance,
} from '@/lib/mockData';

export default function CampaignDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock campaign data - in production this would be fetched based on ID
  const campaign = {
    id: id || 'CMP-EYLEA-2024-001',
    name: 'Eylea HCP Retina Q4 AMD Launch',
    status: 'ACTIVE' as const,
    brand: mockBrands[0],
    audienceType: 'HCP' as const,
    segment: mockSegments[0],
    startDate: new Date('2024-11-01'),
    activatedAt: new Date('2024-11-01T09:23:15Z'),
  };

  // Mock data - in production would come from activation result
  const microsegments = mockMicrosegments;
  const idRegistry = mockIDRegistry;

  // Prepare content assets for mapping table (first 6 for demo)
  const contentAssets = mockContentLibrary.slice(0, 6).map((asset) => ({
    id: asset.id,
    title: asset.title,
    type: asset.type,
    format: asset.format,
  }));

  // Get relevant resonance predictions
  const contentIds = contentAssets.map((c) => c.id);
  const relevantPredictions = mockContentResonance.filter((pred) =>
    contentIds.includes(pred.contentId)
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6 space-y-4">
          {/* Back Button & Title */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/campaigns')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Campaigns
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{campaign.name}</h1>
                  <Badge
                    variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Campaign ID: <span className="font-mono font-semibold">{campaign.id}</span>
                </p>
              </div>
            </div>

            <div className="text-right text-sm">
              <p className="text-muted-foreground">Activated</p>
              <p className="font-semibold">{campaign.activatedAt.toLocaleString()}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Sequences</p>
                </div>
                <p className="text-2xl font-bold mt-1">8</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Microsegments</p>
                </div>
                <p className="text-2xl font-bold mt-1">{microsegments.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Registry Entries</p>
                </div>
                <p className="text-2xl font-bold mt-1">{idRegistry.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Total Audience</p>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {microsegments.reduce((sum, ms) => sum + ms.estimatedCount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="flex-1 overflow-hidden p-6">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-8 h-auto">
            <TabsTrigger value="overview" className="flex flex-col items-center gap-1 py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex flex-col items-center gap-1 py-2">
              <Users className="h-4 w-4" />
              <span className="text-xs">Audience</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex flex-col items-center gap-1 py-2">
              <Key className="h-4 w-4" />
              <span className="text-xs">ID Registry</span>
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex flex-col items-center gap-1 py-2">
              <Workflow className="h-4 w-4" />
              <span className="text-xs">Journey</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex flex-col items-center gap-1 py-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Content</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex flex-col items-center gap-1 py-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="sequence" className="flex flex-col items-center gap-1 py-2">
              <GitBranch className="h-4 w-4" />
              <span className="text-xs">Sequences</span>
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex flex-col items-center gap-1 py-2">
              <Target className="h-4 w-4" />
              <span className="text-xs">Matrix</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Campaign Overview */}
          <TabsContent value="overview" className="flex-1 overflow-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Overview</CardTitle>
                <CardDescription>
                  Campaign metadata, ClaimID linkages, and activation summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Campaign Metadata */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Brand</p>
                      <p className="text-lg font-semibold">{campaign.brand.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.brand.therapeuticArea}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Audience Type</p>
                      <p className="text-lg font-semibold">{campaign.audienceType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Segment</p>
                      <p className="text-lg font-semibold">{campaign.segment.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">MLR Status</p>
                      <Badge variant="default" className="bg-green-600">Approved</Badge>
                    </div>
                  </div>

                  {/* Activation Timeline */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Activation Timeline</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">Created</span>
                      </div>
                      <div className="flex-1 h-px bg-muted" />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">MLR Approved</span>
                      </div>
                      <div className="flex-1 h-px bg-muted" />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">Activated</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>2024-10-15</span>
                      <span>2024-10-28</span>
                      <span>{campaign.activatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* ClaimID Linkages */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Linked ClaimIDs</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="font-mono">CLM-EYLEA-AMD-2024-001</Badge>
                          <Badge variant="default" className="bg-green-600">Approved</Badge>
                        </div>
                        <p className="text-sm mb-2">
                          "Eylea demonstrated superior efficacy in treating wet AMD compared to ranibizumab"
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Expires: 2025-03-15</span>
                          <span>Evidence: HAWK Study (evidence_doc_v3.pdf)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Integration Status */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">System Integration Status</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Salesforce: Campaign Object Synced</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>ID Registry: IDs Minted</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Claravine: Taxonomy Validated</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Snowflake: Events Ingesting</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Audience & Segments */}
          <TabsContent value="audience" className="flex-1 overflow-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Hierarchy</CardTitle>
                <CardDescription>
                  Complete audience structure from brand to microsegments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Brand Level */}
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-full bg-primary rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Brand</Badge>
                        <h3 className="font-semibold text-lg">{campaign.brand.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {campaign.brand.therapeuticArea}
                      </p>
                    </div>
                  </div>

                  {/* Audience Type Level */}
                  <div className="ml-6 flex items-start gap-3">
                    <div className="w-1 h-full bg-blue-500 rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Audience Type</Badge>
                        <h4 className="font-semibold">{campaign.audienceType}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Segment Level */}
                  <div className="ml-12 flex items-start gap-3">
                    <div className="w-1 h-full bg-green-500 rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Segment</Badge>
                        <h4 className="font-semibold">{campaign.segment.name}</h4>
                        <Badge variant="secondary" className="font-mono">
                          {campaign.segment.estimatedCount.toLocaleString()} HCPs
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {campaign.segment.description}
                      </p>

                      {/* Microsegments */}
                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Microsegments:</p>
                        {microsegments.map((ms, idx) => (
                          <div key={ms.id} className="ml-6 p-3 rounded-lg border bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                #{idx + 1}
                              </Badge>
                              <h5 className="font-medium">{ms.name}</h5>
                              <Badge variant="outline" className="font-mono ml-auto">
                                {ms.estimatedCount.toLocaleString()} HCPs (
                                {((ms.estimatedCount / campaign.segment.estimatedCount) * 100).toFixed(1)}
                                %)
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{ms.description}</p>

                            {/* Criteria Summary */}
                            {ms.criteria.behavioral && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {ms.criteria.behavioral.engagementScore && (
                                  <Badge variant="outline" className="text-xs">
                                    Engagement: {ms.criteria.behavioral.engagementScore.min}-
                                    {ms.criteria.behavioral.engagementScore.max}
                                  </Badge>
                                )}
                                {ms.criteria.behavioral.previousCampaignResponse && (
                                  <Badge variant="outline" className="text-xs">
                                    Response: {ms.criteria.behavioral.previousCampaignResponse}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: ID Registry & Tracking */}
          <TabsContent value="tracking" className="flex-1 overflow-auto mt-4">
            <IDRegistryTrackingTab
              campaignId={campaign.id}
              idRegistry={idRegistry}
              microsegments={microsegments}
            />
          </TabsContent>

          {/* Tab 4: Journey Design */}
          <TabsContent value="journey" className="flex-1 overflow-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Journey Design</CardTitle>
                <CardDescription>
                  Visual journey flow and sequence configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Journey Canvas visualization will be displayed here</p>
                  <p className="text-xs mt-2">Coming soon: Visual journey flow with node configuration</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Content Strategy */}
          <TabsContent value="content" className="flex-1 overflow-auto mt-4">
            <ContentMappingTable
              microsegments={microsegments}
              predictions={relevantPredictions}
              contentAssets={contentAssets}
            />
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="flex-1 overflow-auto mt-4">
            <div className="grid grid-cols-2 gap-4">
              <IDRegistryPanel entries={idRegistry} campaignId={campaign.id} />
              <div>
                {idRegistry.length > 0 && idRegistry[3] && (
                  <TrackingKeyDisplay
                    entry={idRegistry[3]}
                    baseURL="https://example.com/content"
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab 7: Sequence & Path Analysis */}
          <TabsContent value="sequence" className="flex-1 overflow-auto mt-4">
            <SequencePerformanceDashboard
              idRegistry={idRegistry}
              microsegments={microsegments}
              campaignId={campaign.id}
            />
          </TabsContent>

          {/* Tab 8: Content × Microsegment Performance Matrix */}
          <TabsContent value="matrix" className="flex-1 overflow-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Content × Microsegment Performance Matrix</CardTitle>
                <CardDescription>
                  Granular performance tracking using composite keys from Snowflake
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Campaign Performance Matrix will be displayed here</p>
                  <p className="text-xs mt-2">Coming soon: Content × Microsegment performance analysis</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
