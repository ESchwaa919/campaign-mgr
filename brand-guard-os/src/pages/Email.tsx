import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog-layout';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Mail, FileText, Search, TrendingUp, AlertCircle, Clock, CheckCircle2, Loader2, Ban } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmailTemplates, useEmailSends, useEmailMetrics, useSuppressionList, useCreateEmailSend } from '@/hooks/useEmail';
import { mockProducts } from '@/lib/mockData';
import { toast } from 'sonner';
import type { EmailSend } from '@/types';

export default function Email() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateSendDialog, setShowCreateSendDialog] = useState(false);
  const [selectedSend, setSelectedSend] = useState<string | null>(null);
  const [newSend, setNewSend] = useState<Partial<EmailSend>>({
    name: '',
    templateId: '',
    audienceType: 'HCP',
    fromName: 'Medical Affairs Team',
    fromEmail: 'medical.affairs@pharma.com',
    subject: '',
    estimatedRecipients: 0,
    status: 'DRAFT',
  });

  // Fetch data
  const { data: templates, isLoading: templatesLoading } = useEmailTemplates();
  const { data: sends, isLoading: sendsLoading } = useEmailSends();
  const { data: suppressionList, isLoading: suppressionLoading } = useSuppressionList();
  const createSend = useCreateEmailSend();

  // Get metrics for selected send
  const { data: metrics } = useEmailMetrics(selectedSend || '');

  const filteredTemplates = templates?.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredSends = sends?.filter((send) =>
    send.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    send.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateSend = async () => {
    if (!newSend.name || !newSend.templateId || !newSend.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createSend.mutateAsync({
        name: newSend.name!,
        templateId: newSend.templateId!,
        status: 'DRAFT',
        audienceType: newSend.audienceType!,
        estimatedRecipients: newSend.estimatedRecipients || 0,
        fromName: newSend.fromName!,
        fromEmail: newSend.fromEmail!,
        subject: newSend.subject!,
        createdBy: 'current-user',
      });

      toast.success('Email send created successfully');
      setShowCreateSendDialog(false);
      setNewSend({
        name: '',
        templateId: '',
        audienceType: 'HCP',
        fromName: 'Medical Affairs Team',
        fromEmail: 'medical.affairs@pharma.com',
        subject: '',
        estimatedRecipients: 0,
        status: 'DRAFT',
      });
    } catch (error) {
      toast.error('Failed to create email send');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'SENDING': return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case 'SCHEDULED': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'FAILED': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (templatesLoading || sendsLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Studio</h1>
          <p className="text-muted-foreground mt-1">Manage email templates and campaigns</p>
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
            <h1 className="text-3xl font-bold text-foreground">Email Studio</h1>
            <p className="text-muted-foreground mt-1">Manage email templates and campaigns</p>
          </div>
          <Button className="gap-2" onClick={() => setShowCreateSendDialog(true)}>
            <Plus className="h-4 w-4" />
            Create Email Send
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates?.filter(t => t.status === 'ACTIVE').length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {templates?.length || 0} total templates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Sends</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sends?.filter(s => s.status === 'SCHEDULED').length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to send
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68.1%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+5.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppressed</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppressionList?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unsubscribed contacts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates and sends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList>
            <TabsTrigger value="templates">Templates ({templates?.length || 0})</TabsTrigger>
            <TabsTrigger value="sends">Sends ({sends?.length || 0})</TabsTrigger>
            <TabsTrigger value="suppression">Suppression ({suppressionList?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-md mb-4 flex items-center justify-center">
                      <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{template.subject}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <StatusBadge status={template.status} />
                      <Badge variant="outline">{template.audienceType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Linked Claims</p>
                      <p className="font-medium">{template.linkedClaimIds.length} claim(s)</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated {template.updatedAt.toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No templates found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Sends Tab */}
          <TabsContent value="sends" className="space-y-4 mt-6">
            <div className="space-y-4">
              {filteredSends.map((send) => {
                const template = templates?.find(t => t.id === send.templateId);
                return (
                  <Card key={send.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(send.status)}
                            <CardTitle className="text-base">{send.name}</CardTitle>
                          </div>
                          <CardDescription>{send.subject}</CardDescription>
                        </div>
                        <StatusBadge status={send.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Template</p>
                          <p className="font-medium truncate">{template?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Audience</p>
                          <Badge variant="outline">{send.audienceType}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Recipients</p>
                          <p className="font-medium">
                            {send.actualRecipients?.toLocaleString() || send.estimatedRecipients.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            {send.status === 'SCHEDULED' ? 'Scheduled' : 'Sent'}
                          </p>
                          <p className="font-medium text-xs">
                            {send.scheduledDate ? send.scheduledDate.toLocaleDateString() : send.sentDate?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {send.status === 'SENT' && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-3">Performance Metrics</p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="text-2xl font-bold text-green-600">98.0%</p>
                              <p className="text-xs text-muted-foreground mt-1">Delivered</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="text-2xl font-bold text-blue-600">64.0%</p>
                              <p className="text-xs text-muted-foreground mt-1">Open Rate</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="text-2xl font-bold text-purple-600">25.5%</p>
                              <p className="text-xs text-muted-foreground mt-1">Click Rate</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="text-2xl font-bold text-orange-600">39.9%</p>
                              <p className="text-xs text-muted-foreground mt-1">CTR</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="text-2xl font-bold text-amber-600">0.3%</p>
                              <p className="text-xs text-muted-foreground mt-1">Unsub Rate</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        {send.status === 'DRAFT' && (
                          <Button size="sm" className="flex-1">
                            Schedule Send
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredSends.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No email sends configured</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Suppression Tab */}
          <TabsContent value="suppression" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Suppression List</CardTitle>
                <CardDescription>
                  Contacts who have unsubscribed or bounced are automatically suppressed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suppressionLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {suppressionList?.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{entry.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.reason} • {entry.suppressedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={entry.reason === 'UNSUBSCRIBE' ? 'secondary' : 'destructive'}>
                          {entry.reason}
                        </Badge>
                      </div>
                    ))}

                    {suppressionList && suppressionList.length === 0 && (
                      <p className="text-sm text-center text-muted-foreground py-8">
                        No suppressed contacts
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Send Dialog */}
      <Dialog open={showCreateSendDialog} onOpenChange={setShowCreateSendDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Email Send</DialogTitle>
            <DialogDescription>
              Configure a new email send campaign. Template must be active and approved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sendName">Send Name *</Label>
              <Input
                id="sendName"
                placeholder="e.g., Q4 Product Launch - Northeast HCPs"
                value={newSend.name}
                onChange={(e) => setNewSend({ ...newSend, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Email Template *</Label>
              <select
                id="template"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newSend.templateId}
                onChange={(e) => {
                  const template = templates?.find(t => t.id === e.target.value);
                  setNewSend({
                    ...newSend,
                    templateId: e.target.value,
                    subject: template?.subject || '',
                    audienceType: template?.audienceType || 'HCP',
                  });
                }}
              >
                <option value="">Select a template...</option>
                {templates?.filter(t => t.status === 'ACTIVE').map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.audienceType})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                placeholder="Subject line"
                value={newSend.subject}
                onChange={(e) => setNewSend({ ...newSend, subject: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name *</Label>
                <Input
                  id="fromName"
                  value={newSend.fromName}
                  onChange={(e) => setNewSend({ ...newSend, fromName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email *</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={newSend.fromEmail}
                  onChange={(e) => setNewSend({ ...newSend, fromEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Estimated Recipients</Label>
              <Input
                id="recipients"
                type="number"
                placeholder="0"
                value={newSend.estimatedRecipients}
                onChange={(e) => setNewSend({ ...newSend, estimatedRecipients: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                This will be calculated based on segment selection
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateSendDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSend} disabled={createSend.isPending}>
              {createSend.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
