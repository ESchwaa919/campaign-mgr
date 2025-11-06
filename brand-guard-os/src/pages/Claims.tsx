import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockProducts } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, Search, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClaims, useCreateClaim } from '@/hooks/useClaims';
import { toast } from 'sonner';
import type { Claim } from '@/types';

export default function Claims() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newClaim, setNewClaim] = useState({
    productId: '',
    claimText: '',
    claimCategory: 'Efficacy' as const,
  });

  // Fetch claims using hook
  const { data: claims, isLoading } = useClaims();
  const createClaim = useCreateClaim();

  const filteredClaims = claims?.filter((claim) =>
    claim.claimText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.claimCategory.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const approvedClaims = filteredClaims.filter(c => c.status === 'APPROVED');
  const underReviewClaims = filteredClaims.filter(c => c.status === 'UNDER_REVIEW');
  const draftClaims = filteredClaims.filter(c => c.status === 'DRAFT');

  const getProduct = (productId: string) => mockProducts.find(p => p.id === productId);

  const handleCreateClaim = async () => {
    if (!newClaim.productId || !newClaim.claimText) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createClaim.mutateAsync({
        productId: newClaim.productId,
        claimText: newClaim.claimText,
        claimCategory: newClaim.claimCategory,
        version: 1,
        effectiveFrom: new Date(),
      });

      toast.success('Claim created successfully');
      setShowCreateDialog(false);
      setNewClaim({
        productId: '',
        claimText: '',
        claimCategory: 'Efficacy',
      });
    } catch (error) {
      toast.error('Failed to create claim');
    }
  };

  const ClaimCard = ({ claim }: { claim: Claim }) => {
    const product = getProduct(claim.productId);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">{claim.claimCategory}</Badge>
                <Badge variant="secondary" className="text-xs">v{claim.version}</Badge>
              </div>
              <CardTitle className="text-base leading-relaxed">{claim.claimText}</CardTitle>
              <CardDescription className="mt-1">{product?.name}</CardDescription>
            </div>
            <StatusBadge status={claim.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Effective From</p>
              <p className="font-medium">{claim.effectiveFrom.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Evidence</p>
              <div className="flex items-center gap-1">
                {claim.evidenceDocuments.length > 0 ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <p className="font-medium">{claim.evidenceDocuments.length} document(s)</p>
                  </>
                ) : (
                  <p className="font-medium text-amber-600">None attached</p>
                )}
              </div>
            </div>
          </div>

          {claim.evidenceDocuments.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs text-muted-foreground mb-2">Evidence Documents</p>
              <div className="space-y-1">
                {claim.evidenceDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 text-xs">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="flex-1 truncate">{doc.title}</span>
                    <Badge variant="outline" className="text-xs">{doc.sourceType}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Claims Registry</h1>
          <p className="text-muted-foreground mt-1">Manage product claims and supporting evidence</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Claims Registry</h1>
            <p className="text-muted-foreground mt-1">Manage product claims and supporting evidence</p>
          </div>
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Create Claim
          </Button>
        </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search claims..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Claims by Status */}
      <Tabs defaultValue="approved" className="w-full">
        <TabsList>
          <TabsTrigger value="approved">Approved ({approvedClaims.length})</TabsTrigger>
          <TabsTrigger value="review">Under Review ({underReviewClaims.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftClaims.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="approved" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {approvedClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="review" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {underReviewClaims.length > 0 ? (
              underReviewClaims.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} />
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>No claims currently under review.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {draftClaims.length > 0 ? (
              draftClaims.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} />
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>No draft claims.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>

      {/* Create Claim Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Claim</DialogTitle>
            <DialogDescription>
              Create a new product claim. Claims must be substantiated with clinical evidence.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <select
                id="product"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newClaim.productId}
                onChange={(e) => setNewClaim({ ...newClaim, productId: e.target.value })}
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
              <Label htmlFor="category">Claim Category *</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newClaim.claimCategory}
                onChange={(e) => setNewClaim({ ...newClaim, claimCategory: e.target.value as any })}
              >
                <option value="Efficacy">Efficacy</option>
                <option value="Safety">Safety</option>
                <option value="Quality of Life">Quality of Life</option>
                <option value="Pharmacoeconomics">Pharmacoeconomics</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimText">Claim Text *</Label>
              <Textarea
                id="claimText"
                placeholder="e.g., Reduces symptom severity by 47% in clinical studies"
                value={newClaim.claimText}
                onChange={(e) => setNewClaim({ ...newClaim, claimText: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                All claims must be substantiated with clinical evidence and approved through MLR.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateClaim}
              disabled={createClaim.isPending}
            >
              {createClaim.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
