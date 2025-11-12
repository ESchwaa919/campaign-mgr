import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, Users, Database, Map } from 'lucide-react';
import { IDRegistryPanel } from '@/components/IDRegistryPanel';
import { TrackingKeyDisplay } from '@/components/TrackingKeyDisplay';
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
        <Tabs defaultValue="hierarchy" className="h-full flex flex-col">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="hierarchy">Audience Hierarchy</TabsTrigger>
            <TabsTrigger value="content">Content Mappings</TabsTrigger>
            <TabsTrigger value="tracking">ID Registry & Tracking</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Audience Hierarchy Tab */}
          <TabsContent value="hierarchy" className="flex-1 overflow-auto mt-4">
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

          {/* Content Mappings Tab */}
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

          {/* Performance Tab */}
          <TabsContent value="performance" className="flex-1 overflow-auto mt-4">
            <SequencePerformanceDashboard
              idRegistry={idRegistry}
              microsegments={microsegments}
              campaignId={campaign.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
