import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Camera } from 'lucide-react';

const PharmaDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [time, setTime] = useState(0);
  const [animatedMetrics, setAnimatedMetrics] = useState({
    pipeline: 0,
    campaigns: 0,
    engagement: 0,
    compliance: 0
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate metrics on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedMetrics({
        pipeline: Math.floor(8.4 * progress * 10) / 10,
        campaigns: Math.floor(42 * progress),
        engagement: Math.floor(67 * progress),
        compliance: Math.floor(98 * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Sample campaign data
  const campaigns = [
    {
      id: 'CAMP-001',
      name: 'Oncology HCP Awareness Q4',
      therapeutic: 'Oncology',
      status: 'executing',
      stage: 5,
      budget: 450000,
      spend: 287000,
      pipeline: 2400000,
      leads: 847,
      compliance: 'approved',
      segments: ['Oncologists', 'Medical Centers'],
      contentIds: ['CNT-045', 'CNT-087', 'CNT-112'],
      channels: ['Email', 'Paid Media', 'Web', 'Events']
    },
    {
      id: 'CAMP-002',
      name: 'Diabetes Patient Education',
      therapeutic: 'Endocrinology',
      status: 'executing',
      stage: 4,
      budget: 320000,
      spend: 198000,
      pipeline: 1800000,
      leads: 1243,
      compliance: 'approved',
      segments: ['Type 2 Patients', 'Caregivers'],
      contentIds: ['CNT-201', 'CNT-203'],
      channels: ['Email', 'Social', 'Web']
    },
    {
      id: 'CAMP-003',
      name: 'Cardio Specialist Engagement',
      therapeutic: 'Cardiovascular',
      status: 'orchestrate',
      stage: 3,
      budget: 280000,
      spend: 0,
      pipeline: 0,
      leads: 0,
      compliance: 'approved',
      segments: ['Cardiologists', 'Hospitals'],
      contentIds: ['CNT-301', 'CNT-305', 'CNT-308'],
      channels: ['Email', 'Direct Mail', 'Sales']
    },
    {
      id: 'CAMP-004',
      name: 'Rare Disease Awareness',
      therapeutic: 'Rare Disease',
      status: 'creating',
      stage: 2,
      budget: 520000,
      spend: 0,
      pipeline: 0,
      leads: 0,
      compliance: 'review',
      segments: ['Specialists', 'Patient Advocacy'],
      contentIds: ['CNT-401'],
      channels: ['Events', 'Web', 'Paid']
    }
  ];

  // Swimlane flow data
  const swimlanes = [
    { id: 1, name: 'Govern', icon: '🛡️', color: 'bg-blue-600', campaigns: 4, status: '100% Compliant' },
    { id: 2, name: 'Segment', icon: '👥', color: 'bg-indigo-600', campaigns: 4, status: '12 Active Segments' },
    { id: 3, name: 'Create', icon: '✏️', color: 'bg-purple-600', campaigns: 3, status: '94% Approved' },
    { id: 4, name: 'Orchestrate', icon: '🎯', color: 'bg-pink-600', campaigns: 3, status: '8 Journeys Live' },
    { id: 5, name: 'Execute', icon: '🚀', color: 'bg-red-600', campaigns: 2, status: '2.4M Sends' },
    { id: 6, name: 'Measure', icon: '📊', color: 'bg-orange-600', campaigns: 2, status: 'Real-time' }
  ];

  // Pipeline data
  const pipelineData = [
    { month: 'Jul', mql: 2400, sql: 1800, opportunity: 1200, closed: 400 },
    { month: 'Aug', mql: 2800, sql: 2100, opportunity: 1400, closed: 480 },
    { month: 'Sep', mql: 3200, sql: 2400, opportunity: 1600, closed: 560 },
    { month: 'Oct', mql: 3600, sql: 2700, opportunity: 1900, closed: 680 },
    { month: 'Nov', mql: 4000 + (time * 50), sql: 3000 + (time * 40), opportunity: 2100 + (time * 30), closed: 740 + (time * 20) }
  ];

  // Channel performance
  const channelData = [
    { channel: 'Email', spend: 280000, pipeline: 3200000, roi: 11.4, leads: 1840 },
    { channel: 'Paid Media', spend: 420000, pipeline: 2800000, roi: 6.7, leads: 980 },
    { channel: 'Web', spend: 150000, pipeline: 2400000, roi: 16.0, leads: 1650 },
    { channel: 'Events', spend: 380000, pipeline: 1900000, roi: 5.0, leads: 420 },
    { channel: 'Direct Mail', spend: 220000, pipeline: 1500000, roi: 6.8, leads: 320 }
  ];

  // Content performance
  const contentData = [
    { id: 'CNT-045', name: 'Oncology Clinical Data Brief', views: 2847, engagement: 78, pipeline: 890000, persona: 'HCP' },
    { id: 'CNT-087', name: 'Treatment Comparison Guide', views: 3201, engagement: 82, pipeline: 1200000, persona: 'HCP' },
    { id: 'CNT-112', name: 'Patient Success Stories', views: 4580, engagement: 71, pipeline: 680000, persona: 'Patient' },
    { id: 'CNT-201', name: 'Diabetes Management eBook', views: 5234, engagement: 85, pipeline: 950000, persona: 'Patient' },
    { id: 'CNT-203', name: 'Blood Sugar Monitoring Tips', views: 6789, engagement: 79, pipeline: 580000, persona: 'Patient' }
  ];

  // Journey health
  const journeyData = [
    { stage: 'Entry', count: 8420, dropoff: 0 },
    { stage: 'Email 1', count: 7580, dropoff: 10 },
    { stage: 'Web Visit', count: 4520, dropoff: 40 },
    { stage: 'Email 2', count: 3890, dropoff: 14 },
    { stage: 'Demo Req', count: 1240, dropoff: 68 },
    { stage: 'SQL', count: 890, dropoff: 28 }
  ];

  // Governance metrics
  const governanceData = [
    { metric: 'Metadata Coverage', value: 94, target: 90 },
    { metric: 'UTM Compliance', value: 98, target: 95 },
    { metric: 'Content Approval', value: 96, target: 95 },
    { metric: 'Identity Match Rate', value: 82, target: 75 }
  ];

  // Segment performance
  const segmentData = [
    { segment: 'Oncologists - Enterprise', size: 2340, sqlRate: 24, pipeline: 3200000, winRate: 42 },
    { segment: 'Type 2 Patients - High Engagement', size: 8920, sqlRate: 12, pipeline: 1800000, winRate: 28 },
    { segment: 'Cardiologists - Teaching Hospitals', size: 1650, sqlRate: 28, pipeline: 2900000, winRate: 38 },
    { segment: 'Patient Advocacy Groups', size: 450, sqlRate: 18, pipeline: 890000, winRate: 52 }
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981'];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Marketing Pipeline</div>
          <div className="text-3xl font-bold mt-2">${animatedMetrics.pipeline}M</div>
          <div className="text-xs mt-2 opacity-75">↑ 24% vs last quarter</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Active Campaigns</div>
          <div className="text-3xl font-bold mt-2">{animatedMetrics.campaigns}</div>
          <div className="text-xs mt-2 opacity-75">across 4 therapeutic areas</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Engagement Rate</div>
          <div className="text-3xl font-bold mt-2">{animatedMetrics.engagement}%</div>
          <div className="text-xs mt-2 opacity-75">↑ 12% improvement</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Compliance Rate</div>
          <div className="text-3xl font-bold mt-2">{animatedMetrics.compliance}%</div>
          <div className="text-xs mt-2 opacity-75">0 critical errors</div>
        </div>
      </div>

      {/* Swimlane Flow */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Campaign Flow Through Six Swimlanes</h3>
        <div className="flex items-center justify-between">
          {swimlanes.map((lane, idx) => (
            <React.Fragment key={lane.id}>
              <div className="flex-1 text-center">
                <div className={`${lane.color} text-white rounded-lg p-4 mx-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer`}>
                  <div className="text-3xl mb-2">{lane.icon}</div>
                  <div className="font-bold text-sm">{lane.name}</div>
                  <div className="text-xs mt-2 opacity-90">{lane.campaigns} campaigns</div>
                  <div className="text-xs opacity-75">{lane.status}</div>
                </div>
              </div>
              {idx < swimlanes.length - 1 && (
                <div className="flex items-center justify-center" style={{ width: '40px' }}>
                  <div className="text-2xl text-gray-400">→</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pipeline Progression */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Pipeline Progression - Last 5 Months</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pipelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="mql" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="MQL" />
            <Area type="monotone" dataKey="sql" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="SQL" />
            <Area type="monotone" dataKey="opportunity" stackId="1" stroke="#EC4899" fill="#EC4899" name="Opportunity" />
            <Area type="monotone" dataKey="closed" stackId="1" stroke="#10B981" fill="#10B981" name="Closed Won" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Performance */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Channel ROI Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="roi" fill="#8B5CF6" name="ROI (x)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Channel Spend Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({channel, percent}) => `${channel} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="spend"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Active Campaigns</h3>
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div 
              key={campaign.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setSelectedCampaign(campaign)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500">{campaign.id}</span>
                    <span className="font-bold text-gray-800">{campaign.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.compliance === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.compliance}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span>📍 {campaign.therapeutic}</span>
                    <span>💰 ${(campaign.spend / 1000).toFixed(0)}K / ${(campaign.budget / 1000).toFixed(0)}K</span>
                    {campaign.pipeline > 0 && <span>💼 ${(campaign.pipeline / 1000000).toFixed(1)}M pipeline</span>}
                    {campaign.leads > 0 && <span>👥 {campaign.leads} leads</span>}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {campaign.channels.map(ch => (
                      <span key={ch} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{ch}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Stage Progress</div>
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map(stage => (
                      <div 
                        key={stage}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          stage <= campaign.stage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {stage}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCampaign && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Campaign Details: {selectedCampaign.name}</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Segments</h4>
              {selectedCampaign.segments.map(seg => (
                <div key={seg} className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded mb-2 text-sm">{seg}</div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Content Assets</h4>
              {selectedCampaign.contentIds.map(id => (
                <div key={id} className="px-3 py-2 bg-purple-50 text-purple-700 rounded mb-2 text-sm font-mono">{id}</div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Utilization:</span>
                  <span className="font-bold">{((selectedCampaign.spend / selectedCampaign.budget) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pipeline Generated:</span>
                  <span className="font-bold">${(selectedCampaign.pipeline / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Leads:</span>
                  <span className="font-bold">{selectedCampaign.leads}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderJourneys = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Journey Flow Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={journeyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#3B82F6" name="Participants" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-6 gap-2">
          {journeyData.map((stage, idx) => (
            <div key={idx} className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">{stage.stage}</div>
              <div className="font-bold text-sm mt-1">{stage.count.toLocaleString()}</div>
              {stage.dropoff > 0 && (
                <div className="text-xs text-red-600 mt-1">-{stage.dropoff}%</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Segment Performance</h3>
          <div className="space-y-3">
            {segmentData.map(seg => (
              <div key={seg.segment} className="border-l-4 border-blue-500 pl-3 py-2">
                <div className="font-medium text-sm text-gray-800">{seg.segment}</div>
                <div className="flex gap-4 mt-1 text-xs text-gray-600">
                  <span>Size: {seg.size.toLocaleString()}</span>
                  <span>SQL: {seg.sqlRate}%</span>
                  <span>Win: {seg.winRate}%</span>
                  <span>Pipeline: ${(seg.pipeline / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Journey Health Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Entry Rate</span>
                <span className="font-bold">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Step-Through Rate</span>
                <span className="font-bold">64%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '64%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>SQL Conversion</span>
                <span className="font-bold">11%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '11%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Average Time to SQL</span>
                <span className="font-bold text-green-600">18 days</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Engagement Score</span>
                <span className="font-bold text-blue-600">73/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Performing Content</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Content ID</th>
                <th className="px-4 py-2 text-left">Asset Name</th>
                <th className="px-4 py-2 text-left">Persona</th>
                <th className="px-4 py-2 text-right">Views</th>
                <th className="px-4 py-2 text-right">Engagement</th>
                <th className="px-4 py-2 text-right">Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {contentData.map(content => (
                <tr key={content.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{content.id}</td>
                  <td className="px-4 py-3 font-medium">{content.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      content.persona === 'HCP' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {content.persona}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{content.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-blue-600">{content.engagement}%</span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">${(content.pipeline / 1000000).toFixed(2)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Content Engagement by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement" fill="#8B5CF6" name="Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Content Resonance Score</h3>
          <div className="space-y-3">
            {contentData.map((content, idx) => (
              <div key={content.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-mono text-xs">{content.id}</span>
                  <span className="font-bold">{content.engagement}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                    style={{width: `${content.engagement}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {governanceData.map(item => (
          <div key={item.metric} className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-2">{item.metric}</div>
            <div className="text-3xl font-bold text-gray-800">{item.value}%</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.value >= item.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{width: `${item.value}%`}}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Target: {item.target}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Compliance Status</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-green-800">All Campaigns Compliant</div>
                <div className="text-sm text-green-600 mt-1">0 critical errors in last 30 days</div>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-blue-800">UTM Parameters</div>
                <div className="text-sm text-blue-600 mt-1">98% compliance rate • 2,847 validated links</div>
              </div>
              <div className="text-3xl">🔗</div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-purple-800">Content Approval</div>
                <div className="text-sm text-purple-600 mt-1">94% of content library approved • 3 pending review</div>
              </div>
              <div className="text-3xl">📄</div>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-orange-800">Identity Resolution</div>
                <div className="text-sm text-orange-600 mt-1">82% match rate • 847K events resolved</div>
              </div>
              <div className="text-3xl">👤</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Validation Activity</h3>
        <div className="space-y-2">
          {[
            { time: '2 min ago', action: 'Campaign parameters validated', campaign: 'CAMP-001', status: 'success' },
            { time: '15 min ago', action: 'Content approval completed', campaign: 'CNT-203', status: 'success' },
            { time: '1 hour ago', action: 'Segment export validated', campaign: 'SEG-047', status: 'success' },
            { time: '2 hours ago', action: 'UTM validation passed', campaign: 'CAMP-004', status: 'success' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <div>
                  <div className="text-sm font-medium">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.campaign} • {activity.time}</div>
                </div>
              </div>
              <div className="text-green-600 text-xl">✓</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pharmaceutical Marketing Command Center</h1>
          <p className="text-gray-600">End-to-End Campaign Lifecycle • Salesforce + Claravine Integration</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data • Updated {time * 2} seconds ago</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'campaigns', label: '🎯 Campaigns', icon: '🎯' },
              { id: 'journeys', label: '🗺️ Journeys', icon: '🗺️' },
              { id: 'content', label: '📝 Content', icon: '📝' },
              { id: 'governance', label: '🛡️ Governance', icon: '🛡️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'campaigns' && renderCampaigns()}
          {activeTab === 'journeys' && renderJourneys()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'governance' && renderGovernance()}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PharmaDashboard;