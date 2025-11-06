import type { SystemUser, AuditLog, SystemMetrics, IntegrationStatus } from '@/types';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users
const mockUsers: SystemUser[] = [
  {
    id: 'user-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@pharma.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Marketing Operations',
    lastLogin: new Date('2024-11-05T08:30:00'),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-002',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@pharma.com',
    role: 'REVIEWER',
    status: 'ACTIVE',
    department: 'Medical Affairs',
    lastLogin: new Date('2024-11-04T16:45:00'),
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'user-003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@pharma.com',
    role: 'MARKETER',
    status: 'ACTIVE',
    department: 'Brand Marketing',
    lastLogin: new Date('2024-11-05T09:15:00'),
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'user-004',
    name: 'David Kim',
    email: 'david.kim@pharma.com',
    role: 'STEWARD',
    status: 'ACTIVE',
    department: 'Data Governance',
    lastLogin: new Date('2024-11-03T14:20:00'),
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-005',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@pharma.com',
    role: 'ANALYST',
    status: 'ACTIVE',
    department: 'Marketing Analytics',
    lastLogin: new Date('2024-11-05T07:50:00'),
    createdAt: new Date('2024-04-01'),
  },
  {
    id: 'user-006',
    name: 'John Smith',
    email: 'john.smith@pharma.com',
    role: 'MARKETER',
    status: 'INACTIVE',
    department: 'Brand Marketing',
    lastLogin: new Date('2024-10-15T11:30:00'),
    createdAt: new Date('2023-11-01'),
  },
];

// Mock audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-001',
    timestamp: new Date('2024-11-05T10:30:15'),
    userId: 'user-003',
    userName: 'Emily Rodriguez',
    action: 'CREATE',
    entity: 'Campaign',
    entityId: 'CAMP-045',
    changes: { name: 'Q4 Product Launch', status: 'DRAFT' },
    ipAddress: '192.168.1.105',
  },
  {
    id: 'audit-002',
    timestamp: new Date('2024-11-05T10:15:42'),
    userId: 'user-002',
    userName: 'Dr. Michael Chen',
    action: 'APPROVE',
    entity: 'MLR Case',
    entityId: 'MLR-023',
    changes: { status: 'APPROVED', notes: 'All claims substantiated' },
    ipAddress: '192.168.1.102',
  },
  {
    id: 'audit-003',
    timestamp: new Date('2024-11-05T09:45:20'),
    userId: 'user-003',
    userName: 'Emily Rodriguez',
    action: 'UPDATE',
    entity: 'Campaign',
    entityId: 'CAMP-042',
    changes: { status: 'ACTIVE' },
    ipAddress: '192.168.1.105',
  },
  {
    id: 'audit-004',
    timestamp: new Date('2024-11-05T09:30:08'),
    userId: 'user-005',
    userName: 'Jessica Martinez',
    action: 'VIEW',
    entity: 'Analytics Dashboard',
    entityId: 'DASH-001',
    ipAddress: '192.168.1.110',
  },
  {
    id: 'audit-005',
    timestamp: new Date('2024-11-05T09:00:55'),
    userId: 'user-004',
    userName: 'David Kim',
    action: 'UPDATE',
    entity: 'Segment',
    entityId: 'SEG-012',
    changes: { estimatedCount: 2450, query: { specialty: 'Oncology' } },
    ipAddress: '192.168.1.108',
  },
  {
    id: 'audit-006',
    timestamp: new Date('2024-11-05T08:45:33'),
    userId: 'user-001',
    userName: 'Sarah Johnson',
    action: 'CREATE',
    entity: 'User',
    entityId: 'user-007',
    changes: { name: 'Alex Thompson', role: 'MARKETER', status: 'PENDING' },
    ipAddress: '192.168.1.101',
  },
];

// Mock system metrics
const mockMetrics: SystemMetrics = {
  dataQualityScore: 94.2,
  taxonomyCompliance: 98.7,
  mlrCycleTime: 4.5, // days
  campaignCount: 156,
  activeUsers: 47,
  eventVolume: 125847,
};

// Mock integration statuses
const mockIntegrations: IntegrationStatus[] = [
  {
    id: 'int-001',
    name: 'Salesforce Sales Cloud',
    type: 'SALESFORCE',
    status: 'CONNECTED',
    lastSync: new Date('2024-11-05T10:30:00'),
  },
  {
    id: 'int-002',
    name: 'Marketing Cloud Engagement',
    type: 'MARKETING_CLOUD',
    status: 'CONNECTED',
    lastSync: new Date('2024-11-05T10:25:00'),
  },
  {
    id: 'int-003',
    name: 'Claravine Validation Gateway',
    type: 'CLARAVINE',
    status: 'CONNECTED',
    lastSync: new Date('2024-11-05T10:20:00'),
  },
  {
    id: 'int-004',
    name: 'Snowflake Data Warehouse',
    type: 'DATA_WAREHOUSE',
    status: 'CONNECTED',
    lastSync: new Date('2024-11-05T10:15:00'),
  },
  {
    id: 'int-005',
    name: 'Braze Email Platform',
    type: 'BRAZE',
    status: 'ERROR',
    lastSync: new Date('2024-11-05T08:30:00'),
    errorMessage: 'API authentication failed - invalid credentials',
  },
];

/**
 * Admin Service
 * Manages system administration, users, audit logs, and integrations
 *
 * TODO: Replace with real Salesforce/platform admin APIs
 * - Connect to Salesforce user management API
 * - Implement real audit logging
 * - Add platform health monitoring
 * - Integrate with authentication provider
 */
export const adminService = {
  /**
   * Get all system users
   */
  async getUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<SystemUser[]> {
    await delay(400);

    let users = [...mockUsers];

    if (filters?.role) {
      users = users.filter(u => u.role === filters.role);
    }
    if (filters?.status) {
      users = users.filter(u => u.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    // TODO: Replace with Salesforce user API
    return users;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<SystemUser | null> {
    await delay(300);
    return mockUsers.find(u => u.id === userId) || null;
  },

  /**
   * Create new user
   */
  async createUser(data: Omit<SystemUser, 'id' | 'createdAt'>): Promise<SystemUser> {
    await delay(500);

    const newUser: SystemUser = {
      ...data,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };

    // TODO: Create user in Salesforce/IdP
    // TODO: Send welcome email
    // TODO: Assign default permissions

    return newUser;
  },

  /**
   * Update user
   */
  async updateUser(userId: string, data: Partial<SystemUser>): Promise<SystemUser> {
    await delay(500);

    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const updated: SystemUser = {
      ...user,
      ...data,
    };

    // TODO: Update user in Salesforce/IdP
    // TODO: Create audit log entry

    return updated;
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(filters?: {
    userId?: string;
    entity?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLog[]> {
    await delay(400);

    let logs = [...mockAuditLogs];

    if (filters?.userId) {
      logs = logs.filter(l => l.userId === filters.userId);
    }
    if (filters?.entity) {
      logs = logs.filter(l => l.entity === filters.entity);
    }
    if (filters?.action) {
      logs = logs.filter(l => l.action === filters.action);
    }
    if (filters?.startDate) {
      logs = logs.filter(l => l.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      logs = logs.filter(l => l.timestamp <= filters.endDate!);
    }
    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    // TODO: Query audit logs from database
    // TODO: Implement pagination
    // TODO: Add export functionality

    return logs;
  },

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    await delay(300);

    // TODO: Calculate real-time metrics
    // TODO: Query from monitoring systems

    return mockMetrics;
  },

  /**
   * Get integration statuses
   */
  async getIntegrations(): Promise<IntegrationStatus[]> {
    await delay(400);

    // TODO: Check actual integration health
    // TODO: Test API connections
    // TODO: Monitor sync job status

    return mockIntegrations;
  },

  /**
   * Test integration connection
   */
  async testIntegration(integrationId: string): Promise<{
    success: boolean;
    message: string;
    latency?: number;
  }> {
    await delay(1000); // Simulate connection test

    const integration = mockIntegrations.find(i => i.id === integrationId);
    if (!integration) {
      return {
        success: false,
        message: 'Integration not found',
      };
    }

    if (integration.status === 'ERROR') {
      return {
        success: false,
        message: integration.errorMessage || 'Connection failed',
      };
    }

    // TODO: Actually test the connection
    return {
      success: true,
      message: 'Connection successful',
      latency: 120, // ms
    };
  },
};
