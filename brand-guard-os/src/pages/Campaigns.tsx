import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog-layout';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockProducts } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, Search, AlertTriangle, Loader2, BarChart3 } from 'lucide-react';
import { useCampaigns, useCreateCampaign } from '@/hooks/useCampaigns';
import { toast } from 'sonner';

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    productId: '',
    objective: '',
    startDate: '',
    endDate: '',
  });

  // Fetch campaigns using hook
  const { data: campaigns, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();

  const filteredCampaigns = campaigns?.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.objective.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getProduct = (productId: string) => mockProducts.find(p => p.id === productId);

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.productId || !newCampaign.objective) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createCampaign.mutateAsync({
        name: newCampaign.name,
        productId: newCampaign.productId,
        objective: newCampaign.objective,
        startDate: new Date(newCampaign.startDate || Date.now()),
        endDate: new Date(newCampaign.endDate || Date.now() + 90 * 24 * 60 * 60 * 1000),
        taxonomy: {
          channel: 'Email',
          audience: 'HCP',
          region: 'US',
        },
        linkedClaimIds: [],
      });

      toast.success('Campaign created successfully');
      setShowCreateDialog(false);
      setNewCampaign({
        name: '',
        productId: '',
        objective: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage marketing campaigns with governance controls</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Show campaign grid
  return (
    <>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground mt-1">Manage marketing campaigns with governance controls</p>
          </div>
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => {
          const product = getProduct(campaign.productId);
          const hasValidationIssues = campaign.status === 'DRAFT' && campaign.linkedClaimIds.length === 0;

          return (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">{product?.name}</CardDescription>
                  </div>
                  <StatusBadge status={campaign.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Objective</p>
                  <p className="text-sm">{campaign.objective}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{campaign.startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{campaign.endDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Taxonomy</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(campaign.taxonomy).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Linked Claims ({campaign.linkedClaimIds.length})
                  </p>
                  {hasValidationIssues && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                      <AlertTriangle className="h-3 w-3" />
                      Cannot promote to READY without approved claims
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Performance
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No campaigns found matching your search.</p>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Create a new marketing campaign. All campaigns must pass Claravine validation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="e.g., NEXORA-HCP-Q1-EMAIL-001"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Follow naming convention: BRAND-AUDIENCE-QUARTER-CHANNEL-SEQUENCE
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <select
                id="product"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newCampaign.productId}
                onChange={(e) => setNewCampaign({ ...newCampaign, productId: e.target.value })}
              >
                <option value="">Select a product...</option>
                {mockProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Campaign Objective *</Label>
              <Textarea
                id="objective"
                placeholder="Describe the campaign objective and success metrics..."
                value={newCampaign.objective}
                onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              disabled={createCampaign.isPending}
            >
              {createCampaign.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
