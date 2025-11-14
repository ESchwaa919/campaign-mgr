import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Eye, MousePointerClick, CheckCircle2, Mail, Radio, FileText, Info, Database } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceOverviewTabProps {
  campaignId: string;
}

export function PerformanceOverviewTab({ campaignId }: PerformanceOverviewTabProps) {
  // Mock performance data - in production would come from Snowflake Aggregation Layer (BRD SW-004)
  const campaignMetrics = {
    impressions: 24847,
    clicks: 8234,
    conversions: 1456,
    ctr: 33.1, // clicks / impressions * 100
    conversionRate: 17.7, // conversions / clicks * 100
    totalReach: 47234,
    uniqueOpens: 21487,
  };

  // Benchmark data
  const benchmarks = {
    ctr: 28.5,
    conversionRate: 15.4,
  };

  // Performance trend data (last 30 days)
  const trendData = [
    { date: 'Nov 1', impressions: 1847, clicks: 612, conversions: 108 },
    { date: 'Nov 3', impressions: 2134, clicks: 701, conversions: 124 },
    { date: 'Nov 5', impressions: 2456, clicks: 815, conversions: 143 },
    { date: 'Nov 7', impressions: 2187, clicks: 724, conversions: 129 },
    { date: 'Nov 9', impressions: 2698, clicks: 892, conversions: 157 },
    { date: 'Nov 11', impressions: 3124, clicks: 1035, conversions: 182 },
    { date: 'Nov 13', impressions: 2843, clicks: 942, conversions: 167 },
    { date: 'Nov 15', impressions: 3287, clicks: 1087, conversions: 192 },
    { date: 'Nov 17', impressions: 2945, clicks: 976, conversions: 172 },
    { date: 'Nov 19', impressions: 3471, clicks: 1150, conversions: 203 },
  ];

  // Channel breakdown data
  const channelData = [
    {
      channel: 'Email',
      impressions: 14234,
      clicks: 5847,
      conversions: 924,
      ctr: 41.1,
      cvr: 15.8,
      spend: 2450,
      roas: 12.4,
    },
    {
      channel: 'Paid Social (LinkedIn)',
      impressions: 6847,
      clicks: 1824,
      conversions: 387,
      ctr: 26.6,
      cvr: 21.2,
      spend: 8750,
      roas: 4.2,
    },
    {
      channel: 'Print (Retina Times)',
      impressions: 3766,
      clicks: 563,
      conversions: 145,
      ctr: 14.9,
      cvr: 25.8,
      spend: 15000,
      roas: 1.8,
    },
  ];

  // Channel mix for pie chart
  const channelMixData = channelData.map((ch) => ({
    name: ch.channel,
    value: ch.impressions,
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B'];

  // Top performing sequences
  const topSequences = [
    { seq: 'SEQ-1', name: 'HAWK Study Email', conversions: 187, cvr: 52.2 },
    { seq: 'SEQ-3', name: 'LinkedIn Ad', conversions: 156, cvr: 57.1 },
    { seq: 'SEQ-8', name: 'Final Resources Email', conversions: 134, cvr: 48.6 },
  ];

  return (
    <div className="space-y-6">
      {/* Campaign-Level KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Impressions</p>
            </div>
            <p className="text-3xl font-bold">{campaignMetrics.impressions.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+12.3% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Clicks</p>
            </div>
            <p className="text-3xl font-bold">{campaignMetrics.clicks.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+8.1% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Conversions</p>
            </div>
            <p className="text-3xl font-bold">{campaignMetrics.conversions.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+5.2% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Click-Through Rate</p>
            </div>
            <p className="text-3xl font-bold">{campaignMetrics.ctr.toFixed(1)}%</p>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant={campaignMetrics.ctr > benchmarks.ctr ? 'default' : 'secondary'} className="text-xs">
                {campaignMetrics.ctr > benchmarks.ctr ? '+' : ''}
                {(campaignMetrics.ctr - benchmarks.ctr).toFixed(1)}pp vs benchmark
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold mt-1">{campaignMetrics.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <Badge
                  variant={campaignMetrics.conversionRate > benchmarks.conversionRate ? 'default' : 'secondary'}
                  className="bg-green-600"
                >
                  {campaignMetrics.conversionRate > benchmarks.conversionRate ? '↑' : '↓'}{' '}
                  {Math.abs(campaignMetrics.conversionRate - benchmarks.conversionRate).toFixed(1)}pp
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">vs {benchmarks.conversionRate}% benchmark</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-3xl font-bold mt-1">{campaignMetrics.totalReach.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Unique Opens</p>
                <p className="text-xl font-bold">{campaignMetrics.uniqueOpens.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {((campaignMetrics.uniqueOpens / campaignMetrics.totalReach) * 100).toFixed(1)}% open rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend (Last 30 Days)</CardTitle>
          <CardDescription>Daily aggregated metrics from Snowflake (hourly rollups via Snowflake Tasks)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} name="Impressions" />
              <Line type="monotone" dataKey="clicks" stroke="#8B5CF6" strokeWidth={2} name="Clicks" />
              <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Channel Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        {/* Channel Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance Breakdown</CardTitle>
            <CardDescription>Aggregated metrics by channel (BRD SW-004: Channel mix analysis)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((channel) => (
                <div key={channel.channel} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {channel.channel.includes('Email') && <Mail className="h-5 w-5 text-blue-600" />}
                    {channel.channel.includes('Social') && <Radio className="h-5 w-5 text-purple-600" />}
                    {channel.channel.includes('Print') && <FileText className="h-5 w-5 text-amber-600" />}
                    <h4 className="font-semibold">{channel.channel}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                      <p className="font-bold">{channel.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="font-bold">{channel.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                      <p className="font-bold text-green-600">{channel.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="font-bold">{channel.ctr}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CVR</p>
                      <p className="font-bold">{channel.cvr}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROAS</p>
                      <p className="font-bold">{channel.roas.toFixed(1)}x</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel Mix Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Mix (Impressions)</CardTitle>
            <CardDescription>Distribution of impressions across channels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelMixData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Channel Legend */}
            <div className="mt-4 space-y-2">
              {channelMixData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index] }} />
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-semibold">{entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Sequences */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Sequences</CardTitle>
          <CardDescription>Sequences ranked by conversion rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSequences.map((seq, idx) => (
              <div key={seq.seq} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold text-primary">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono">
                      {seq.seq}
                    </Badge>
                    <span className="font-semibold">{seq.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{seq.cvr}%</p>
                  <p className="text-xs text-muted-foreground">{seq.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Source Attribution */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Data Source:</strong> Snowflake Aggregation Layer (BRD SW-004) | These metrics are aggregated via
          hourly Snowflake Tasks from raw event data ingested through Snowpipe. Campaign-level rollups include
          impressions, clicks, conversions, CTR, conversion rate, channel breakdown, and sequence-level tracking. Data
          refreshes every hour to provide near real-time visibility.
        </AlertDescription>
      </Alert>
    </div>
  );
}
