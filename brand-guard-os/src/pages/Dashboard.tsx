import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertCircle, CheckCircle2, Megaphone, Loader2, TrendingUp, Target } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useMLRCases } from '@/hooks/useMLR';
import { useClaims } from '@/hooks/useClaims';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Dashboard() {
  // Fetch data using React Query hooks
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: mlrCases, isLoading: mlrLoading } = useMLRCases();
  const { data: claims, isLoading: claimsLoading } = useClaims();

  // Calculate dashboard metrics
  const totalCampaigns = campaigns?.length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'ACTIVE').length || 0;
  const pendingMLR = mlrCases?.filter(c => c.status === 'IN_REVIEW' || c.status === 'SUBMITTED') || [];
  const approvedClaims = claims?.filter(c => c.status === 'APPROVED').length || 0;
  const recentCampaigns = campaigns?.slice(0, 3) || [];

  // Pipeline progression data (campaign status distribution)
  const pipelineData = [
    {
      name: 'Draft',
      count: campaigns?.filter(c => c.status === 'DRAFT').length || 0,
      fill: '#94a3b8'
    },
    {
      name: 'Ready',
      count: campaigns?.filter(c => c.status === 'READY').length || 0,
      fill: '#3b82f6'
    },
    {
      name: 'Active',
      count: campaigns?.filter(c => c.status === 'ACTIVE').length || 0,
      fill: '#10b981'
    },
    {
      name: 'Paused',
      count: campaigns?.filter(c => c.status === 'PAUSED').length || 0,
      fill: '#f59e0b'
    },
    {
      name: 'Archived',
      count: campaigns?.filter(c => c.status === 'ARCHIVED').length || 0,
      fill: '#6b7280'
    },
  ].filter(item => item.count > 0);

  // Channel performance data (mock ROI data)
  const channelPerformanceData = [
    { channel: 'Email', roi: 4.2, spend: 125000, revenue: 525000 },
    { channel: 'Paid Media', roi: 3.1, spend: 280000, revenue: 868000 },
    { channel: 'Web', roi: 5.8, spend: 95000, revenue: 551000 },
    { channel: 'Field Sales', roi: 2.9, spend: 450000, revenue: 1305000 },
  ];

  // MLR workflow metrics
  const mlrMetrics = {
    totalCases: mlrCases?.length || 0,
    approvalRate: mlrCases?.length ?
      ((mlrCases.filter(c => c.status === 'APPROVED').length / mlrCases.length) * 100).toFixed(1) : '0',
    avgTurnaround: '3.2', // days (mock)
    pending: pendingMLR.length,
  };

  const mlrStatusData = [
    {
      name: 'Approved',
      value: mlrCases?.filter(c => c.status === 'APPROVED').length || 0,
      color: '#10b981'
    },
    {
      name: 'In Review',
      value: mlrCases?.filter(c => c.status === 'IN_REVIEW').length || 0,
      color: '#3b82f6'
    },
    {
      name: 'Changes Requested',
      value: mlrCases?.filter(c => c.status === 'CHANGES_REQUESTED').length || 0,
      color: '#f59e0b'
    },
    {
      name: 'Rejected',
      value: mlrCases?.filter(c => c.status === 'REJECTED').length || 0,
      color: '#ef4444'
    },
    {
      name: 'Draft',
      value: mlrCases?.filter(c => c.status === 'DRAFT').length || 0,
      color: '#94a3b8'
    },
  ].filter(item => item.value > 0);

  // Governance compliance indicators
  const governanceMetrics = {
    validationRate: '94.2', // % (mock)
    claimsWithEvidence: claims?.length ?
      ((claims.filter(c => c.evidenceDocuments.length > 0).length / claims.length) * 100).toFixed(1) : '0',
    taxonomyCompliance: '98.7', // % (mock)
    expiringClaims: claims?.filter(c => {
      const effectiveTo = c.effectiveTo;
      if (!effectiveTo) return false;
      const daysUntilExpiry = (effectiveTo.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length || 0,
  };

  // Loading skeleton
  if (campaignsLoading || mlrLoading || claimsLoading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Marketing Foundation OS overview</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Marketing Foundation OS overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCampaigns} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending MLR</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMLR.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedClaims}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 14 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Latest campaign activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCampaigns.length > 0 ? (
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.objective}</p>
                    </div>
                    <StatusBadge status={campaign.status} className="ml-3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No recent campaigns</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MLR Queue */}
        <Card>
          <CardHeader>
            <CardTitle>MLR Queue</CardTitle>
            <CardDescription>Cases requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingMLR.length > 0 ? (
              <div className="space-y-4">
                {pendingMLR.map((mlrCase) => {
                  const campaign = campaigns?.find(c => c.id === mlrCase.campaignId);
                  return (
                    <div key={mlrCase.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{campaign?.name || 'Unknown Campaign'}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {mlrCase.submittedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={mlrCase.status} className="ml-3" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pending cases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaign Pipeline Progression */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Pipeline</CardTitle>
              <CardDescription>Campaign status distribution</CardDescription>
            </div>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No campaign data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Channel Performance & MLR Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Performance ROI */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>ROI by channel</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="channel" type="category" className="text-xs" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}x`, 'ROI']}
                />
                <Bar dataKey="roi" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              {channelPerformanceData.map((channel) => (
                <div key={channel.channel} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="font-medium">{channel.channel}</span>
                  <span className="text-muted-foreground">${(channel.spend / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MLR Workflow Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>MLR Workflow</CardTitle>
            <CardDescription>Review metrics and case distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{mlrMetrics.approvalRate}%</p>
                <p className="text-xs text-muted-foreground">Approval Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mlrMetrics.avgTurnaround}</p>
                <p className="text-xs text-muted-foreground">Avg Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mlrMetrics.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
            {mlrStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mlrStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {mlrStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No MLR cases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Governance Compliance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Governance & Compliance</CardTitle>
          <CardDescription>Data quality and regulatory compliance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Validation Rate</p>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold">{governanceMetrics.validationRate}%</p>
              <p className="text-xs text-muted-foreground">Campaigns passing validation</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Claims Evidence</p>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold">{governanceMetrics.claimsWithEvidence}%</p>
              <p className="text-xs text-muted-foreground">Claims with documentation</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Taxonomy Compliance</p>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold">{governanceMetrics.taxonomyCompliance}%</p>
              <p className="text-xs text-muted-foreground">Naming convention adherence</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                {governanceMetrics.expiringClaims > 0 ? (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <p className="text-3xl font-bold">{governanceMetrics.expiringClaims}</p>
              <p className="text-xs text-muted-foreground">Claims expiring in 30 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
