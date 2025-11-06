import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMLRCases } from '@/hooks/useMLR';
import { useCampaigns } from '@/hooks/useCampaigns';
import type { MLRCase } from '@/types';

export default function MLR() {
  // Fetch data using hooks
  const { data: mlrCases, isLoading: mlrLoading } = useMLRCases();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();

  const isLoading = mlrLoading || campaignsLoading;

  const pendingCases = mlrCases?.filter(
    c => c.status === 'SUBMITTED' || c.status === 'IN_REVIEW' || c.status === 'CHANGES_REQUESTED'
  ) || [];
  const completedCases = mlrCases?.filter(
    c => c.status === 'APPROVED' || c.status === 'REJECTED'
  ) || [];
  const draftCases = mlrCases?.filter(c => c.status === 'DRAFT') || [];

  const getCampaign = (campaignId: string) => campaigns?.find(c => c.id === campaignId);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medical Legal Review</h1>
          <p className="text-muted-foreground mt-1">Compliance review workflow</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const MLRCaseCard = ({ mlrCase }: { mlrCase: MLRCase }) => {
    const campaign = getCampaign(mlrCase.campaignId);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{campaign?.name}</CardTitle>
              <CardDescription className="mt-1">MLR Case #{mlrCase.id}</CardDescription>
            </div>
            <StatusBadge status={mlrCase.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {mlrCase.submittedAt && (
              <div>
                <p className="text-muted-foreground">Submitted</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="font-medium">{mlrCase.submittedAt.toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {mlrCase.decidedAt && (
              <div>
                <p className="text-muted-foreground">Decided</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="font-medium">{mlrCase.decidedAt.toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>

          {mlrCase.assignedReviewerId && (
            <div>
              <p className="text-sm text-muted-foreground">Assigned Reviewer</p>
              <Badge variant="secondary" className="mt-1">Dr Michael Chen</Badge>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">Notes</p>
            <p className="text-sm bg-muted/50 p-3 rounded">{mlrCase.notes}</p>
          </div>

          {mlrCase.comments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MessageSquare className="h-4 w-4" />
                <p>{mlrCase.comments.length} comment(s)</p>
              </div>
              <div className="space-y-2">
                {mlrCase.comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-primary pl-3 py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium">{comment.authorName}</p>
                      {comment.section && (
                        <Badge variant="outline" className="text-xs">{comment.section}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {comment.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            {mlrCase.status === 'IN_REVIEW' && (
              <Button size="sm" className="flex-1">
                Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">MLR Cases</h1>
        <p className="text-muted-foreground mt-1">Medical, Legal & Regulatory review workflow</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingCases.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCases.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftCases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingCases.map((mlrCase) => (
              <MLRCaseCard key={mlrCase.id} mlrCase={mlrCase} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedCases.map((mlrCase) => (
              <MLRCaseCard key={mlrCase.id} mlrCase={mlrCase} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {draftCases.map((mlrCase) => (
              <MLRCaseCard key={mlrCase.id} mlrCase={mlrCase} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
