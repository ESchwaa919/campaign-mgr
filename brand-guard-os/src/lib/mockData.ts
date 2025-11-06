import { Brand, Product, Campaign, Claim, MLRCase, Segment, User, Dashboard } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Dr Sarah Johnson',
  email: 'sarah.johnson@pharma.com',
  role: 'ADMIN',
  status: 'active',
  createdAt: new Date('2024-01-01'),
};

export const mockBrands: Brand[] = [
  { id: '1', name: 'CardioLife', therapeuticArea: 'Cardiovascular' },
  { id: '2', name: 'NeuroCare', therapeuticArea: 'Neurology' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    brandId: '1',
    name: 'CardioLife 10mg',
    indications: ['Hypertension', 'Heart Failure'],
    markets: ['UK', 'EU', 'US'],
  },
  {
    id: '2',
    brandId: '1',
    name: 'CardioLife 20mg',
    indications: ['Hypertension'],
    markets: ['UK', 'EU'],
  },
  {
    id: '3',
    brandId: '2',
    name: 'NeuroCare XR',
    indications: ['Multiple Sclerosis'],
    markets: ['UK', 'EU', 'US', 'CA'],
  },
];

export const mockClaims: Claim[] = [
  {
    id: '1',
    productId: '1',
    claimText: 'Reduces systolic blood pressure by 20mmHg on average',
    claimCategory: 'Efficacy',
    version: 1,
    status: 'APPROVED',
    effectiveFrom: new Date('2024-01-01'),
    createdBy: '1',
    evidenceDocuments: [
      {
        id: '1',
        claimId: '1',
        title: 'PROGRESS Trial Results',
        sourceType: 'Clinical Trial',
        url: '/evidence/progress-trial.pdf',
        uploadedBy: '1',
        uploadedAt: new Date('2024-01-01'),
        checksum: 'abc123',
      },
    ],
  },
  {
    id: '2',
    productId: '1',
    claimText: 'Well tolerated in elderly populations',
    claimCategory: 'Safety',
    version: 1,
    status: 'APPROVED',
    effectiveFrom: new Date('2024-02-01'),
    createdBy: '1',
    evidenceDocuments: [
      {
        id: '2',
        claimId: '2',
        title: 'Elderly Safety Study',
        sourceType: 'Post-Marketing Study',
        url: '/evidence/elderly-safety.pdf',
        uploadedBy: '1',
        uploadedAt: new Date('2024-02-01'),
        checksum: 'def456',
      },
    ],
  },
  {
    id: '3',
    productId: '3',
    claimText: 'Reduces relapse rate by 45%',
    claimCategory: 'Efficacy',
    version: 1,
    status: 'UNDER_REVIEW',
    effectiveFrom: new Date('2024-03-01'),
    createdBy: '1',
    evidenceDocuments: [],
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    productId: '1',
    name: 'Q1 2024 HCP Education Campaign',
    objective: 'Increase awareness of dosing guidelines',
    status: 'ACTIVE',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    taxonomy: {
      channel: 'Email',
      audience: 'Cardiologists',
      region: 'UK',
    },
    linkedClaimIds: ['1', '2'],
    createdBy: '1',
  },
  {
    id: '2',
    productId: '1',
    name: 'Patient Support Programme Launch',
    objective: 'Drive patient enrollment',
    status: 'READY',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-06-30'),
    taxonomy: {
      channel: 'Multi-channel',
      audience: 'Patients',
      region: 'EU',
    },
    linkedClaimIds: ['1'],
    createdBy: '1',
  },
  {
    id: '3',
    productId: '3',
    name: 'MS Awareness Month Campaign',
    objective: 'Disease awareness',
    status: 'DRAFT',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-31'),
    taxonomy: {
      channel: 'Social Media',
      audience: 'General Public',
      region: 'UK',
    },
    linkedClaimIds: [],
    createdBy: '1',
  },
  {
    id: '4',
    productId: '2',
    name: 'Q4 2023 GP Education',
    objective: 'Product positioning',
    status: 'PAUSED',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-12-31'),
    taxonomy: {
      channel: 'Webinar',
      audience: 'GPs',
      region: 'UK',
    },
    linkedClaimIds: ['1'],
    createdBy: '1',
  },
];

export const mockMLRCases: MLRCase[] = [
  {
    id: '1',
    campaignId: '1',
    status: 'APPROVED',
    assignedReviewerId: '2',
    submittedAt: new Date('2023-12-15'),
    decidedAt: new Date('2023-12-20'),
    notes: 'All claims properly referenced. Approved for activation.',
    comments: [
      {
        id: '1',
        caseId: '1',
        authorId: '1',
        authorName: 'Dr Sarah Johnson',
        content: 'Submitted for review. All evidence attached.',
        createdAt: new Date('2023-12-15'),
      },
      {
        id: '2',
        caseId: '1',
        authorId: '2',
        authorName: 'Dr Michael Chen',
        content: 'Reviewed. Claims are substantiated. Approved.',
        section: 'Overall',
        createdAt: new Date('2023-12-20'),
      },
    ],
  },
  {
    id: '2',
    campaignId: '2',
    status: 'IN_REVIEW',
    assignedReviewerId: '2',
    submittedAt: new Date('2024-02-01'),
    notes: 'Awaiting reviewer decision.',
    comments: [
      {
        id: '3',
        caseId: '2',
        authorId: '1',
        authorName: 'Dr Sarah Johnson',
        content: 'Submitted for MLR approval.',
        createdAt: new Date('2024-02-01'),
      },
    ],
  },
  {
    id: '3',
    campaignId: '3',
    status: 'DRAFT',
    notes: 'Not yet submitted.',
    comments: [],
  },
];

export const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'UK Cardiologists - High Volume',
    description: 'Cardiologists in the UK seeing 50+ hypertension patients per month',
    query: {
      specialty: 'Cardiology',
      country: 'UK',
      patientVolume: { min: 50 },
    },
    segmentType: 'DEMOGRAPHIC',
    estimatedCount: 3420,
    createdBy: '1',
  },
  {
    id: '2',
    name: 'Teaching Hospitals - Tier 1',
    description: 'Major teaching hospitals with research programmes',
    query: {
      institutionType: 'Teaching Hospital',
      tier: 1,
      hasResearch: true,
    },
    segmentType: 'INSTITUTIONAL',
    estimatedCount: 156,
    createdBy: '1',
  },
  {
    id: '3',
    name: 'Recent Prescribers',
    description: 'HCPs who prescribed in the last 3 months',
    query: {
      lastPrescription: { days: 90 },
    },
    segmentType: 'BEHAVIOURAL',
    estimatedCount: 8750,
    createdBy: '1',
  },
  {
    id: '4',
    name: 'EU Neurologists',
    description: 'Neurologists in EU markets',
    query: {
      specialty: 'Neurology',
      region: 'EU',
    },
    segmentType: 'DEMOGRAPHIC',
    estimatedCount: 12300,
    createdBy: '1',
  },
];

export const mockDashboard: Dashboard = {
  totalCampaigns: 4,
  activeCampaigns: 1,
  pendingMLR: 1,
  approvedClaims: 2,
  recentEvents: 12847,
};
