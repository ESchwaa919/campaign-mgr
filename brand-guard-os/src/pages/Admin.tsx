import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Users,
  Shield,
  Database,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Plus,
  Loader2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useUsers, useAuditLogs, useSystemMetrics, useIntegrations, useCreateUser, useTestIntegration } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import type { SystemUser, UserRole, UserStatus } from '@/types';

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [newUser, setNewUser] = useState<Partial<SystemUser>>({
    name: '',
    email: '',
    role: 'MARKETER',
    status: 'ACTIVE',
    department: '',
  });

  // Fetch data
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: auditLogs, isLoading: logsLoading } = useAuditLogs({ limit: 20 });
  const { data: metrics, isLoading: metricsLoading } = useSystemMetrics();
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations();

  const createUser = useCreateUser();
  const testIntegration = useTestIntegration();

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createUser.mutateAsync({
        name: newUser.name!,
        email: newUser.email!,
        role: newUser.role!,
        status: newUser.status!,
        department: newUser.department,
      });

      toast.success('User created successfully');
      setShowCreateUserDialog(false);
      setNewUser({
        name: '',
        email: '',
        role: 'MARKETER',
        status: 'ACTIVE',
        department: '',
      });
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    const toastId = toast.loading('Testing connection...');

    try {
      const result = await testIntegration.mutateAsync(integrationId);

      if (result.success) {
        toast.success(`Connection successful (${result.latency}ms)`, { id: toastId });
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Test failed', { id: toastId });
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
      REVIEWER: 'bg-blue-100 text-blue-800 border-blue-200',
      MARKETER: 'bg-green-100 text-green-800 border-green-200',
      STEWARD: 'bg-orange-100 text-orange-800 border-orange-200',
      ANALYST: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };
    return colors[role];
  };

  const getIntegrationIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (usersLoading || metricsLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin</h1>
          <p className="text-muted-foreground mt-1">System administration and monitoring</p>
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
            <h1 className="text-3xl font-bold text-foreground">Admin</h1>
            <p className="text-muted-foreground mt-1">System administration and monitoring</p>
          </div>
          <Button className="gap-2" onClick={() => setShowCreateUserDialog(true)}>
            <Plus className="h-4 w-4" />
            Create User
          </Button>
        </div>

        {/* System Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.dataQualityScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+2.3%</span> vs last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxonomy</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.taxonomyCompliance}%</div>
              <p className="text-xs text-muted-foreground mt-1">Compliance rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MLR Cycle</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.mlrCycleTime} days</div>
              <p className="text-xs text-muted-foreground mt-1">Average review time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.campaignCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Total active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(metrics?.eventVolume || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">Users ({users?.length || 0})</TabsTrigger>
            <TabsTrigger value="integrations">Integrations ({integrations?.length || 0})</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <CardDescription className="mt-1">{user.email}</CardDescription>
                      </div>
                      <Badge
                        variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    {user.department && (
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{user.department}</p>
                      </div>
                    )}
                    {user.lastLogin && (
                      <div>
                        <p className="text-sm text-muted-foreground">Last Login</p>
                        <p className="text-xs font-medium">{user.lastLogin.toLocaleString()}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={user.status === 'INACTIVE'}
                      >
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations?.map((integration) => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getIntegrationIcon(integration.status)}
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{integration.type}</Badge>
                      </div>
                      <Badge
                        variant={
                          integration.status === 'CONNECTED'
                            ? 'default'
                            : integration.status === 'ERROR'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {integration.lastSync && (
                      <div>
                        <p className="text-sm text-muted-foreground">Last Sync</p>
                        <p className="text-xs font-medium">{integration.lastSync.toLocaleString()}</p>
                      </div>
                    )}
                    {integration.errorMessage && (
                      <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                        <p className="text-sm text-red-800 dark:text-red-200">{integration.errorMessage}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleTestIntegration(integration.id)}
                        disabled={testIntegration.isPending}
                      >
                        {testIntegration.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Test Connection
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>System audit log showing recent user actions</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs?.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{log.userName}</p>
                            <Badge variant="outline" className="text-xs">
                              {log.action}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {log.entity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {log.entity} ID: {log.entityId}
                          </p>
                          {log.changes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Changes: {JSON.stringify(log.changes)}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {auditLogs && auditLogs.length === 0 && (
                      <p className="text-sm text-center text-muted-foreground py-8">
                        No audit logs available
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system with specific role and permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name *</Label>
              <Input
                id="userName"
                placeholder="e.g., John Smith"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address *</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="john.smith@pharma.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userRole">Role *</Label>
                <select
                  id="userRole"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                >
                  <option value="MARKETER">Marketer</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="STEWARD">Steward</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userStatus">Status *</Label>
                <select
                  id="userStatus"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as UserStatus })}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userDept">Department</Label>
              <Input
                id="userDept"
                placeholder="e.g., Brand Marketing"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={createUser.isPending}>
              {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
