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

// Mock Content Library - 50+ assets for demonstration
import type { ContentAsset } from '@/types';

export const mockContentLibrary: ContentAsset[] = [
  // Eylea Email Content
  {
    id: 'CNT-2024-0001',
    title: 'Eylea Efficacy Email Template',
    description: 'HCP email showcasing Eylea efficacy data for oncology specialists',
    assetType: 'EMAIL_TEMPLATE',
    channel: 'EMAIL',
    brandId: '1', // Eylea
    linkedClaimIds: ['1'], // Eylea efficacy claim
    mlrStatus: 'APPROVED',
    mlrCaseId: 'MLR-023',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    tags: ['HCP', 'Oncology', 'Efficacy', 'Clinical Data'],
    audienceType: 'HCP',
    version: 2,
    effectiveFrom: new Date('2024-01-15'),
    createdBy: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'CNT-2024-0002',
    title: 'Eylea Safety Profile Email',
    description: 'Safety and tolerability information for HCP audiences',
    assetType: 'EMAIL_HTML',
    channel: 'EMAIL',
    brandId: '1',
    linkedClaimIds: ['1'],
    mlrStatus: 'APPROVED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
    tags: ['HCP', 'Safety', 'Clinical'],
    audienceType: 'HCP',
    version: 1,
    effectiveFrom: new Date('2024-01-20'),
    createdBy: '1',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'CNT-2024-0003',
    title: 'Eylea Dosing Guide Email',
    description: 'Dosing and administration guidance for HCP',
    assetType: 'EMAIL_TEMPLATE',
    channel: 'EMAIL',
    brandId: '1',
    linkedClaimIds: ['1'],
    mlrStatus: 'APPROVED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400',
    tags: ['HCP', 'Dosing', 'Administration'],
    audienceType: 'HCP',
    version: 1,
    effectiveFrom: new Date('2024-02-01'),
    createdBy: '1',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01'),
  },
  // Eylea Web Content
  {
    id: 'CNT-2024-0004',
    title: 'Eylea HCP Landing Page',
    description: 'Main HCP landing page with efficacy data and resources',
    assetType: 'WEB_LANDING_PAGE',
    channel: 'WEB',
    brandId: '1',
    linkedClaimIds: ['1'],
    mlrStatus: 'APPROVED',
    mlrCaseId: 'MLR-021',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    tags: ['HCP', 'Landing Page', 'Efficacy'],
    audienceType: 'HCP',
    version: 3,
    effectiveFrom: new Date('2024-01-10'),
    createdBy: '1',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'CNT-2024-0005',
    title: 'Eylea Clinical Study Banner',
    description: 'Web banner highlighting latest clinical study results',
    assetType: 'WEB_BANNER',
    channel: 'WEB',
    brandId: '1',
    linkedClaimIds: ['1'],
    mlrStatus: 'APPROVED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    tags: ['HCP', 'Clinical Study', 'Banner'],
    audienceType: 'HCP',
    version: 1,
    effectiveFrom: new Date('2024-02-15'),
    createdBy: '1',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
  },
  // Dupixent Email Content
  {
    id: 'CNT-2024-0010',
    title: 'Dupixent Patient Welcome Email',
    description: 'Welcome email for patients starting Dupixent therapy',
    assetType: 'EMAIL_TEMPLATE',
    channel: 'EMAIL',
    brandId: '2', // Dupixent
    linkedClaimIds: ['2'],
    mlrStatus: 'APPROVED',
    mlrCaseId: 'MLR-025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
    tags: ['Patient', 'Welcome', 'Support'],
    audienceType: 'PATIENT',
    version: 2,
    effectiveFrom: new Date('2024-01-05'),
    createdBy: '1',
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'CNT-2024-0011',
    title: 'Dupixent HCP Dermatology Email',
    description: 'Efficacy data for dermatologists treating atopic dermatitis',
    assetType: 'EMAIL_TEMPLATE',
    channel: 'EMAIL',
    brandId: '2',
    linkedClaimIds: ['2'],
    mlrStatus: 'APPROVED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    tags: ['HCP', 'Dermatology', 'Efficacy'],
    audienceType: 'HCP',
    version: 1,
    effectiveFrom: new Date('2024-01-22'),
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-22'),
  },
  // Dupixent Web Content
  {
    id: 'CNT-2024-0012',
    title: 'Dupixent Patient Portal Landing Page',
    description: 'Patient education portal with treatment information',
    assetType: 'WEB_LANDING_PAGE',
    channel: 'WEB',
    brandId: '2',
    linkedClaimIds: ['2'],
    mlrStatus: 'APPROVED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
    tags: ['Patient', 'Education', 'Portal'],
    audienceType: 'PATIENT',
    version: 2,
    effectiveFrom: new Date('2024-01-12'),
    createdBy: '1',
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2024-01-12'),
  },
  // Mobile Content
  {
    id: 'CNT-2024-0020',
    title: 'Eylea Dosing Reminder Push',
    description: 'Mobile push notification for dosing reminders',
    assetType: 'MOBILE_PUSH',
    channel: 'MOBILE',
    brandId: '1',
    linkedClaimIds: ['1'],
    mlrStatus: 'APPROVED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    tags: ['Patient', 'Reminder', 'Adherence'],
    audienceType: 'PATIENT',
    version: 1,
    effectiveFrom: new Date('2024-02-01'),
    createdBy: '1',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'CNT-2024-0021',
    title: 'Dupixent Support App Message',
    description: 'In-app message with support program information',
    assetType: 'MOBILE_IN_APP',
    channel: 'MOBILE',
    brandId: '2',
    linkedClaimIds: ['2'],
    mlrStatus: 'APPROVED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400',
    tags: ['Patient', 'Support', 'Program'],
    audienceType: 'PATIENT',
    version: 1,
    effectiveFrom: new Date('2024-02-10'),
    createdBy: '1',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-10'),
  },
  // Additional Content for scale demonstration (continuing with similar patterns)
  ...Array.from({ length: 40 }, (_, i) => {
    const num = i + 30;
    const brands = ['1', '2', '3']; // Eylea, Dupixent, Libtayo
    const channels: Array<'EMAIL' | 'WEB' | 'MOBILE'> = ['EMAIL', 'WEB', 'MOBILE'];
    const assetTypes: Array<'EMAIL_TEMPLATE' | 'WEB_BANNER' | 'MOBILE_PUSH' | 'WEB_ARTICLE' | 'VIDEO'> = [
      'EMAIL_TEMPLATE',
      'WEB_BANNER',
      'MOBILE_PUSH',
      'WEB_ARTICLE',
      'VIDEO',
    ];
    const audienceTypes: Array<'HCP' | 'PATIENT'> = ['HCP', 'PATIENT'];

    // Real Unsplash photos for medical/pharmaceutical content
    const unsplashPhotos = [
      '1576091160550-2173dba999ef', // Medical
      '1551601651-2a8555f1a136', // Healthcare
      '1584036561566-baf8f5f1b144', // Medicine
      '1559757175-5f3fef7c8b02', // Science
      '1551288049-bebda4e38f71', // Technology
      '1460925895917-afdab827c52f', // Business
      '1557804506-669a67965ba0', // Team
      '1551076805-e1869033e561', // Office
    ];

    const brandId = brands[num % 3];
    const channel = channels[num % 3];
    const assetType = assetTypes[num % 5];
    const audienceType = audienceTypes[num % 2];

    return {
      id: `CNT-2024-${String(num).padStart(4, '0')}`,
      title: `${brandId === '1' ? 'Eylea' : brandId === '2' ? 'Dupixent' : 'Libtayo'} ${
        assetType.replace('_', ' ')
      } ${num}`,
      description: `${audienceType} focused content for ${channel} channel`,
      assetType,
      channel,
      brandId,
      linkedClaimIds: [brandId],
      mlrStatus: num % 5 === 0 ? 'IN_REVIEW' : 'APPROVED' as 'APPROVED' | 'IN_REVIEW',
      thumbnailUrl: `https://images.unsplash.com/photo-${unsplashPhotos[num % unsplashPhotos.length]}?w=400&h=300&fit=crop`,
      tags: [
        audienceType,
        channel,
        num % 2 === 0 ? 'Education' : 'Clinical',
        num % 3 === 0 ? 'Efficacy' : 'Safety',
      ],
      audienceType,
      version: 1,
      effectiveFrom: new Date(`2024-0${(num % 3) + 1}-${(num % 28) + 1}`),
      createdBy: '1',
      createdAt: new Date(`2024-0${(num % 3) + 1}-${(num % 28) + 1}`),
      updatedAt: new Date(`2024-0${(num % 3) + 1}-${(num % 28) + 1}`),
    } as ContentAsset;
  }),
];
