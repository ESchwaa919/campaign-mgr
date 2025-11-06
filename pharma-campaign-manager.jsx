import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Target, FileText, CheckCircle, Send, BarChart3, 
  Shield, AlertCircle, Clock, TrendingUp, Calendar, Database,
  Settings, Filter, Plus, Search, ChevronRight, ChevronDown,
  Mail, Globe, DollarSign, UserCheck, Edit, Eye, Download,
  RefreshCw, AlertTriangle, CheckSquare, XCircle, Activity
} from 'lucide-react';

const PharmaCampaignManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [mlrQueue, setMlrQueue] = useState([]);
  const [segments, setSegments] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  // Mock data for campaigns
  const [campaigns] = useState([
    {
      id: 'CMP-2025-001',
      name: 'NEXORA-HCP-Q1-EMAIL-001',
      brand: 'Nexora',
      status: 'active',
      phase: 'execution',
      mlrStatus: 'approved',
      claimIds: ['CLM-NEX-001', 'CLM-NEX-002'],
      channels: ['email', 'web'],
      startDate: '2025-01-15',
      endDate: '2025-03-31',
      performance: {
        reach: 12500,
        engagement: 3.2,
        conversion: 145,
        compliance: 100
      }
    },
    {
      id: 'CMP-2025-002',
      name: 'CARDIALIFE-PAT-Q1-MULTI-001',
      brand: 'CardiaLife',
      status: 'review',
      phase: 'mlr',
      mlrStatus: 'pending',
      claimIds: ['CLM-CAR-001'],
      channels: ['email', 'paid', 'web'],
      startDate: '2025-02-01',
      endDate: '2025-04-30',
      performance: {
        reach: 0,
        engagement: 0,
        conversion: 0,
        compliance: 95
      }
    }
  ]);

  // Mock claims data
  const claims = [
    {
      id: 'CLM-NEX-001',
      text: 'Reduces symptom severity by 47% in clinical studies',
      product: 'Nexora',
      indication: 'Chronic Pain Management',
      substantiation: 'Phase 3 Trial NCT04567890',
      expiryDate: '2025-12-31',
      status: 'active'
    },
    {
      id: 'CLM-NEX-002',
      text: 'Improved patient quality of life scores',
      product: 'Nexora',
      indication: 'Chronic Pain Management',
      substantiation: 'QoL Study 2024',
      expiryDate: '2025-09-30',
      status: 'active'
    },
    {
      id: 'CLM-CAR-001',
      text: '32% reduction in cardiovascular events',
      product: 'CardiaLife',
      indication: 'Cardiovascular Disease',
      substantiation: 'CARDIAC-PROTECT Trial',
      expiryDate: '2026-03-31',
      status: 'active'
    }
  ];

  // Toggle expanded sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +20% vs last quarter
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MLR Compliance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">98.5%</p>
              <p className="text-xs text-gray-500 mt-1">Above target (95%)</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">45.2K</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% this month
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Quality</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">92%</p>
              <p className="text-xs text-gray-500 mt-1">Customer records</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Phase 1 Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Phase 1 Implementation Progress</h3>
        <div className="space-y-4">
          {[
            { name: 'Platform Foundation', progress: 100, status: 'complete' },
            { name: 'Core Capabilities', progress: 85, status: 'in-progress' },
            { name: 'Production Launch', progress: 45, status: 'in-progress' }
          ].map((phase, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{phase.name}</span>
                <span className="text-sm text-gray-500">{phase.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    phase.status === 'complete' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
          <button 
            onClick={() => setShowCreateCampaign(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MLR Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channels
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map(campaign => (
                <tr key={campaign.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {campaign.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {campaign.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.mlrStatus === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {campaign.mlrStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-1">
                      {campaign.channels.includes('email') && <Mail className="w-4 h-4 text-gray-400" />}
                      {campaign.channels.includes('web') && <Globe className="w-4 h-4 text-gray-400" />}
                      {campaign.channels.includes('paid') && <DollarSign className="w-4 h-4 text-gray-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-green-600 font-medium">{campaign.performance.engagement}%</span>
                      <TrendingUp className="w-3 h-3 ml-1 text-green-600" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Govern Tab - Claravine Integration & Claim Registry
  const GovernTab = () => (
    <div className="space-y-6">
      {/* Claravine Validation Gateway */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Claravine Validation Gateway
          </h3>
          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
            100% Compliance
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Campaigns Validated Today</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Average Validation Time</p>
            <p className="text-2xl font-bold text-green-600 mt-1">2.3 hrs</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Rejection Rate</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">8%</p>
          </div>
        </div>
      </div>

      {/* ClaimID Registry */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            ClaimID Registry
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Plus className="w-4 h-4 inline mr-1" />
            New Claim
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ClaimID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim Text</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Substantiation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map(claim => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{claim.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{claim.text}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{claim.product}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(claim.expiryDate) < new Date('2025-06-30') && 
                      <AlertTriangle className="w-4 h-4 text-yellow-500 inline mr-1" />
                    }
                    {claim.expiryDate}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consent Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-green-600" />
          Consent Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Email Opt-In Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">28.5%</p>
            <p className="text-xs text-green-600 mt-1">↑ 3% from last month</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">SMS Opt-In Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">12.3%</p>
            <p className="text-xs text-green-600 mt-1">↑ 1.5% from last month</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Preference Updates</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">342</p>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Consent Violations</p>
            <p className="text-2xl font-bold text-green-600 mt-1">0</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Segment Tab
  const SegmentTab = () => (
    <div className="space-y-6">
      {/* Segment Builder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Audience Segment Builder
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Plus className="w-4 h-4 inline mr-1" />
            Create Segment
          </button>
        </div>

        {/* Segment Creation Interface */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Segment Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., High-Value HCP Cardiologists"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Demographics</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Specialty: Cardiology', 'Years in Practice: 10+', 'Geography: Northeast', 
                  'Practice Setting: Hospital', 'Prescribing Volume: High', 'Teaching Status: Yes'].map((filter, idx) => (
                  <div key={idx} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <label className="text-sm text-gray-600">{filter}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Behavioral Filters</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Email Engagement: High', 'Web Visits: 5+', 'Content Downloads: Yes', 
                  'Event Attendance: Recent', 'Form Submissions: Yes'].map((filter, idx) => (
                  <div key={idx} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <label className="text-sm text-gray-600">{filter}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">Estimated Audience Size</p>
                  <p className="text-2xl font-bold text-blue-600">2,847</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Save Segment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Segments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'High-Value HCPs', size: 2847, lastUpdated: '2 hours ago', status: 'active' },
            { name: 'Engaged Patients', size: 12543, lastUpdated: '1 day ago', status: 'active' },
            { name: 'Northeast Cardiologists', size: 892, lastUpdated: '3 days ago', status: 'active' },
            { name: 'Recent Website Visitors', size: 4521, lastUpdated: '1 hour ago', status: 'processing' },
            { name: 'Email Subscribers - Active', size: 18234, lastUpdated: '5 hours ago', status: 'active' },
            { name: 'Trial Participants', size: 342, lastUpdated: '1 week ago', status: 'active' }
          ].map((segment, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{segment.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  segment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {segment.status}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{segment.size.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Updated {segment.lastUpdated}</p>
              <div className="flex space-x-2 mt-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">Duplicate</button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">Export</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Create Tab - MLR Workflow
  const CreateTab = () => (
    <div className="space-y-6">
      {/* MLR Review Queue */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Medical Legal Review (MLR) Queue
          </h3>
          <div className="flex space-x-2">
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option>All Stages</option>
              <option>Medical Review</option>
              <option>Legal Review</option>
              <option>Regulatory Review</option>
            </select>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option>Priority: All</option>
              <option>Priority: High</option>
              <option>Priority: Medium</option>
              <option>Priority: Low</option>
            </select>
          </div>
        </div>

        {/* MLR Items */}
        <div className="space-y-3">
          {[
            {
              id: 'MLR-2025-087',
              content: 'Nexora Patient Email Campaign',
              stage: 'Medical Review',
              priority: 'high',
              submittedBy: 'Sarah Johnson',
              submittedDate: '2025-01-28',
              dueDate: '2025-02-04',
              progress: 60,
              reviewers: ['Dr. Smith', 'Dr. Chen'],
              claims: 2
            },
            {
              id: 'MLR-2025-088',
              content: 'CardiaLife HCP Website Update',
              stage: 'Legal Review',
              priority: 'medium',
              submittedBy: 'Michael Brown',
              submittedDate: '2025-01-27',
              dueDate: '2025-02-10',
              progress: 40,
              reviewers: ['Legal Team'],
              claims: 3
            },
            {
              id: 'MLR-2025-089',
              content: 'Digital Ad Campaign - Q1',
              stage: 'Regulatory Review',
              priority: 'low',
              submittedBy: 'Emily Davis',
              submittedDate: '2025-01-26',
              dueDate: '2025-02-15',
              progress: 80,
              reviewers: ['Regulatory Affairs'],
              claims: 1
            }
          ].map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{item.id}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.priority} priority
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {item.stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Submitted by {item.submittedBy}</span>
                    <span>•</span>
                    <span>Due {item.dueDate}</span>
                    <span>•</span>
                    <span>{item.claims} claims referenced</span>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Review
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Reviewers */}
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Reviewers:</span>
                {item.reviewers.map((reviewer, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {reviewer}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MLR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Median Cycle Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">4.2 weeks</p>
          <p className="text-xs text-green-600 mt-1">↓ 0.8 weeks from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">First-Pass Approval</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">52%</p>
          <p className="text-xs text-green-600 mt-1">↑ 5% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Overdue Items</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
          <p className="text-xs text-gray-500 mt-1">8% of total</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">In Review</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">38</p>
          <p className="text-xs text-gray-500 mt-1">Across all stages</p>
        </div>
      </div>
    </div>
  );

  // Execute Tab
  const ExecuteTab = () => (
    <div className="space-y-6">
      {/* Channel Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Send className="w-5 h-5 mr-2 text-blue-600" />
          Multi-Channel Execution Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email Channel */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-medium">Email</h4>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sent Today</span>
                <span className="font-medium">12,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Rate</span>
                <span className="font-medium text-green-600">96.8%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Open Rate</span>
                <span className="font-medium">28.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Click Rate</span>
                <span className="font-medium">3.8%</span>
              </div>
            </div>
          </div>

          {/* Paid Media Channel */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-medium">Paid Media</h4>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Impressions</span>
                <span className="font-medium">245.8K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CTR</span>
                <span className="font-medium">1.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spend Today</span>
                <span className="font-medium">$3,842</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CPA</span>
                <span className="font-medium">$42.10</span>
              </div>
            </div>
          </div>

          {/* Web Channel */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-medium">Web</h4>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Page Views</span>
                <span className="font-medium">8,921</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Unique Visitors</span>
                <span className="font-medium">3,245</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Session</span>
                <span className="font-medium">2:34</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Conversions</span>
                <span className="font-medium">142</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns Execution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Execution Details</h3>
        <div className="space-y-4">
          {campaigns.filter(c => c.status === 'active').map(campaign => (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Running since {campaign.startDate}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Pause</button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">Report</button>
                </div>
              </div>

              {/* Channel Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{campaign.performance.reach.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Reach</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{campaign.performance.engagement}%</p>
                  <p className="text-xs text-gray-500">Engagement Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{campaign.performance.conversion}</p>
                  <p className="text-xs text-gray-500">Conversions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{campaign.performance.compliance}%</p>
                  <p className="text-xs text-gray-500">Compliance Score</p>
                </div>
              </div>

              {/* Frequency Capping Status */}
              <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">Frequency Cap: 3 per week</span>
                  </div>
                  <span className="text-sm text-gray-600">12% at cap limit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Measure Tab
  const MeasureTab = () => (
    <div className="space-y-6">
      {/* Real-time Metrics Dashboard */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Real-Time Campaign Performance
          </h3>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Last updated: 2 minutes ago</span>
          </div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Today's Reach</p>
            <p className="text-3xl font-bold text-blue-700">18.2K</p>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12% vs yesterday</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Engagement Rate</p>
            <p className="text-3xl font-bold text-green-700">4.8%</p>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+0.3% vs avg</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Conversions</p>
            <p className="text-3xl font-bold text-purple-700">342</p>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+28 today</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">ROI</p>
            <p className="text-3xl font-bold text-orange-700">3.2x</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Target: 2.5x</span>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">Interactive performance charts would display here</p>
            <p className="text-xs mt-1">Showing hourly, daily, and weekly trends</p>
          </div>
        </div>
      </div>

      {/* Channel Comparison */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Effectiveness Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reach</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { channel: 'Email', reach: '45.2K', engagement: '28.3%', conversions: 234, cost: '$1,250', cpa: '$5.34', roi: '8.2x' },
                { channel: 'Paid Search', reach: '128.5K', engagement: '1.2%', conversions: 156, cost: '$4,820', cpa: '$30.90', roi: '2.1x' },
                { channel: 'Display Ads', reach: '342.1K', engagement: '0.8%', conversions: 89, cost: '$2,950', cpa: '$33.15', roi: '1.9x' },
                { channel: 'Social Media', reach: '67.8K', engagement: '3.4%', conversions: 112, cost: '$1,780', cpa: '$15.89', roi: '3.5x' },
                { channel: 'Website', reach: '23.4K', engagement: '4.2%', conversions: 198, cost: '$500', cpa: '$2.53', roi: '12.4x' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.channel}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.reach}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.engagement}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.conversions}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.cost}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.cpa}</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">{row.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Quality Monitor */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-green-600" />
          Event Collection & Data Quality
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Events Collected (24h)</p>
            <p className="text-2xl font-bold text-gray-900">1.2M</p>
            <p className="text-xs text-gray-500 mt-1">Across all touchpoints</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Data Completeness</p>
            <p className="text-2xl font-bold text-green-600">96.8%</p>
            <p className="text-xs text-gray-500 mt-1">Required fields populated</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Schema Violations</p>
            <p className="text-2xl font-bold text-orange-600">12</p>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Create Campaign Modal
  const CreateCampaignModal = () => {
    if (!showCreateCampaign) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Create New Campaign</h2>
              <button 
                onClick={() => setShowCreateCampaign(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Campaign Brief */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., BRAND-AUDIENCE-QUARTER-CHANNEL-SEQUENCE"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Nexora</option>
                  <option>CardiaLife</option>
                  <option>RespiraCare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Healthcare Providers</option>
                  <option>Patients</option>
                  <option>Caregivers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Objectives</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe the primary objectives and success metrics..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Claims (Required)</label>
              <div className="border border-gray-200 rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {claims.map(claim => (
                  <div key={claim.id} className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">{claim.id}:</span> {claim.text}
                      <span className="text-gray-500 ml-2">({claim.product})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
              <div className="grid grid-cols-3 gap-2">
                {['Email', 'Web', 'Paid Media', 'Social', 'Field Sales', 'Direct Mail'].map(channel => (
                  <div key={channel} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <label className="text-sm">{channel}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              onClick={() => setShowCreateCampaign(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Submit for Validation
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pharma Campaign Manager</h1>
                <p className="text-xs text-gray-500">Phase 1 Foundation - v1.0</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Admin
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Home },
              { id: 'govern', name: 'Govern', icon: Shield },
              { id: 'segment', name: 'Segment', icon: Target },
              { id: 'create', name: 'Create', icon: FileText },
              { id: 'execute', name: 'Execute', icon: Send },
              { id: 'measure', name: 'Measure', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'govern' && <GovernTab />}
        {activeTab === 'segment' && <SegmentTab />}
        {activeTab === 'create' && <CreateTab />}
        {activeTab === 'execute' && <ExecuteTab />}
        {activeTab === 'measure' && <MeasureTab />}
      </main>

      {/* Modals */}
      <CreateCampaignModal />
    </div>
  );
};

export default PharmaCampaignManager;