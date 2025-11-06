import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Activity, Mail, Globe, DollarSign, Users, Loader2, Zap } from 'lucide-react';
import { useEvents, useEventMetrics } from '@/hooks/useEvents';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EventType } from '@/types';

export default function Events() {
  // Fetch events and metrics
  const { data: recentEvents, isLoading: eventsLoading } = useEvents({ limit: 50 });
  const { data: metrics, isLoading: metricsLoading } = useEventMetrics();

  const isLoading = eventsLoading || metricsLoading;

  // Event type colors
  const eventTypeColors: Record<EventType, string> = {
    EMAIL_OPEN: '#3b82f6',
    EMAIL_CLICK: '#2563eb',
    EMAIL_SEND: '#60a5fa',
    EMAIL_BOUNCE: '#ef4444',
    WEB_PAGE_VIEW: '#10b981',
    WEB_FORM_SUBMIT: '#059669',
    WEB_DOWNLOAD: '#047857',
    PAID_IMPRESSION: '#f59e0b',
    PAID_CLICK: '#d97706',
    PAID_CONVERSION: '#b45309',
    FIELD_MEETING: '#8b5cf6',
    FIELD_SAMPLE_DROP: '#7c3aed',
    CONSENT_GRANTED: '#06b6d4',
    CONSENT_REVOKED: '#64748b',
  };

  // Channel icons
  const channelIcons = {
    EMAIL: Mail,
    WEB: Globe,
    PAID_MEDIA: DollarSign,
    FIELD_SALES: Users,
    CONSENT: Activity,
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events & Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time event tracking and analytics</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Prepare chart data
  const eventTypeData = metrics?.eventsByType
    ? Object.entries(metrics.eventsByType).map(([type, count]) => ({
        name: type.replace(/_/g, ' '),
        value: count,
        color: eventTypeColors[type as EventType],
      }))
    : [];

  const channelData = metrics?.eventsByChannel
    ? Object.entries(metrics.eventsByChannel).map(([channel, count]) => ({
        channel,
        count,
      }))
    : [];

  const deviceData = metrics?.deviceBreakdown
    ? Object.entries(metrics.deviceBreakdown).map(([device, count]) => ({
        name: device.charAt(0).toUpperCase() + device.slice(1),
        value: count,
      }))
    : [];

  const deviceColors: Record<string, string> = {
    Desktop: '#3b82f6',
    Mobile: '#10b981',
    Tablet: '#f59e0b',
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Events & Analytics</h1>
        <p className="text-muted-foreground mt-1">Real-time event tracking and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalEvents.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Opens</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.eventsByType.EMAIL_OPEN?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12.5%
              </span>{' '}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Web Sessions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.eventsByType.WEB_PAGE_VIEW?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +18.3%
              </span>{' '}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((metrics?.eventsByType.PAID_CONVERSION || 0) +
                (metrics?.eventsByType.WEB_FORM_SUBMIT || 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8.2%
              </span>{' '}
              from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Volume Over Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Volume Over Time</CardTitle>
              <CardDescription>Events per day for the last 7 days</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.eventsByDay || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Events"
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Event Type Distribution & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Type Distribution</CardTitle>
            <CardDescription>Breakdown by event type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventTypeData.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Events by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  dataKey="count"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ channel, percent }) => `${channel} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {channelData.map((entry, index) => {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
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
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown & Hourly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Events by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device) => {
                const total = deviceData.reduce((sum, d) => sum + d.value, 0);
                const percentage = ((device.value / total) * 100).toFixed(1);
                return (
                  <div key={device.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{device.name}</span>
                      <span className="text-muted-foreground">
                        {device.value.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: deviceColors[device.name] || '#3b82f6',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Activity</CardTitle>
            <CardDescription>Events in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics?.eventsByHour.slice(-12) || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Event Stream */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Event Stream</CardTitle>
              <CardDescription>Most recent events across all channels</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentEvents?.map((event) => {
              const ChannelIcon = channelIcons[event.channel];
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ChannelIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {event.eventType.replace(/_/g, ' ')}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {event.channel}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.contactId && `Contact: ${event.contactId}`}
                        {event.campaignId && ` • Campaign: ${event.campaignId}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleTimeString()}
                    </p>
                    {event.deviceType && (
                      <p className="text-xs text-muted-foreground">
                        {event.deviceType}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
