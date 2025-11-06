/**
 * MLR (Medical Legal Review) Service
 *
 * Manages the MLR approval workflow for pharmaceutical marketing content.
 * Handles multi-stage review process (Medical, Legal, Regulatory).
 *
 * TODO: Integrate with Salesforce Approval Process or custom workflow
 * - Custom objects: MLR_Case__c, MLR_Comment__c
 * - Assignment rules for routing to reviewers
 * - SLA tracking and escalation
 *
 * Phase 1 Requirements:
 * - REQ-115: Multi-Stage MLR Workflow
 * - REQ-116: Role-Based Access Control
 * - REQ-117: Review Task Management
 * - REQ-119: Change Request Workflow
 * - REQ-120: Approval Status Tracking
 * - REQ-303: Multi-Stage Workflow Orchestration Engine
 * - REQ-304: Role-Based Review Task Management
 * - REQ-305: Structured Comment Framework
 */

import { mockMLRCases } from '@/lib/mockData';
import type { MLRCase, MLRComment } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CreateMLRCaseDto {
  campaignId: string;
  notes?: string;
}

export interface AddCommentDto {
  content: string;
  section?: string;
  commentType: 'major' | 'minor' | 'question' | 'approval';
}

export interface AssignReviewerDto {
  reviewerId: string;
  reviewerName: string;
}

export interface MLRMetrics {
  medianCycleTime: number; // in days
  firstPassApprovalRate: number; // percentage
  overdueCount: number;
  inReviewCount: number;
}

class MLRService {
  /**
   * Get all MLR cases with filtering
   * TODO: Salesforce SOQL:
   * SELECT Id, Campaign__c, Status__c, AssignedReviewer__c, SubmittedDate__c
   * FROM MLR_Case__c
   */
  async getMLRCases(filters?: {
    status?: MLRCase['status'];
    assignedTo?: string;
  }): Promise<MLRCase[]> {
    await delay(300);

    let cases = [...mockMLRCases];

    if (filters?.status) {
      cases = cases.filter(c => c.status === filters.status);
    }

    if (filters?.assignedTo) {
      cases = cases.filter(c => c.assignedReviewerId === filters.assignedTo);
    }

    return cases;
  }

  /**
   * Get MLR case by ID with all comments
   * TODO: Query MLR_Case__c with related MLR_Comment__c records
   */
  async getMLRCaseById(id: string): Promise<MLRCase | null> {
    await delay(200);
    return mockMLRCases.find(c => c.id === id) || null;
  }

  /**
   * Create new MLR case for campaign
   * TODO: Create MLR_Case__c record in Salesforce
   * Trigger approval process
   */
  async createMLRCase(data: CreateMLRCaseDto): Promise<MLRCase> {
    await delay(500);

    const newCase: MLRCase = {
      id: `MLR-${Date.now()}`,
      campaignId: data.campaignId,
      status: 'DRAFT',
      notes: data.notes || '',
      comments: [],
    };

    console.log('Mock: Created MLR case', newCase);

    // TODO: In real implementation:
    // 1. Create MLR_Case__c record
    // 2. Determine review path based on content type
    // 3. Assign to first reviewer using assignment rules
    // 4. Set SLA deadline based on priority
    // 5. Send notification to reviewer

    return newCase;
  }

  /**
   * Submit case for review
   * Transitions from DRAFT to SUBMITTED status
   */
  async submitForReview(caseId: string): Promise<MLRCase> {
    await delay(400);

    const mlrCase = await this.getMLRCaseById(caseId);
    if (!mlrCase) {
      throw new Error(`MLR case ${caseId} not found`);
    }

    const updated: MLRCase = {
      ...mlrCase,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    };

    console.log('Mock: Submitted MLR case for review', updated);

    // TODO: In real implementation:
    // 1. Validate all required documents attached
    // 2. Update status to SUBMITTED
    // 3. Auto-assign to next available reviewer
    // 4. Start SLA timer
    // 5. Send notification

    return updated;
  }

  /**
   * Assign reviewer to case
   * TODO: Update MLR_Case__c.AssignedReviewer__c
   */
  async assignReviewer(caseId: string, reviewer: AssignReviewerDto): Promise<MLRCase> {
    await delay(300);

    const mlrCase = await this.getMLRCaseById(caseId);
    if (!mlrCase) {
      throw new Error(`MLR case ${caseId} not found`);
    }

    const updated: MLRCase = {
      ...mlrCase,
      assignedReviewerId: reviewer.reviewerId,
      status: mlrCase.status === 'SUBMITTED' ? 'IN_REVIEW' : mlrCase.status,
    };

    console.log(`Mock: Assigned reviewer ${reviewer.reviewerName} to case ${caseId}`);

    // TODO: Send notification to assigned reviewer
    return updated;
  }

  /**
   * Add comment to MLR case
   * TODO: Create MLR_Comment__c record
   */
  async addComment(caseId: string, comment: AddCommentDto): Promise<MLRComment> {
    await delay(300);

    const newComment: MLRComment = {
      id: `CMT-${Date.now()}`,
      caseId,
      authorId: 'current-user-id', // TODO: Get from auth
      authorName: 'Current User', // TODO: Get from auth
      content: comment.content,
      section: comment.section,
      createdAt: new Date(),
    };

    console.log('Mock: Added comment to MLR case', newComment);

    // TODO: In real implementation:
    // 1. Create MLR_Comment__c record
    // 2. Link to parent MLR case
    // 3. If comment type is 'major', flag for resolution required
    // 4. Send notification to case submitter

    return newComment;
  }

  /**
   * Approve MLR case
   * Final approval transitions case to APPROVED
   */
  async approveCase(caseId: string, approvalNotes?: string): Promise<MLRCase> {
    await delay(500);

    const mlrCase = await this.getMLRCaseById(caseId);
    if (!mlrCase) {
      throw new Error(`MLR case ${caseId} not found`);
    }

    const updated: MLRCase = {
      ...mlrCase,
      status: 'APPROVED',
      decidedAt: new Date(),
      notes: approvalNotes || mlrCase.notes,
    };

    // Add approval comment
    const approvalComment: MLRComment = {
      id: `CMT-${Date.now()}`,
      caseId,
      authorId: 'current-reviewer-id',
      authorName: 'Current Reviewer',
      content: approvalNotes || 'Approved for use',
      createdAt: new Date(),
    };

    updated.comments = [...(mlrCase.comments || []), approvalComment];

    console.log('Mock: Approved MLR case', updated);

    // TODO: In real implementation:
    // 1. Update MLR_Case__c status
    // 2. Update related Campaign__c status to READY
    // 3. Unlock content for use in campaigns
    // 4. Send approval notification
    // 5. Update audit trail

    return updated;
  }

  /**
   * Reject MLR case
   * Requires changes before resubmission
   */
  async rejectCase(caseId: string, rejectionReason: string): Promise<MLRCase> {
    await delay(500);

    const mlrCase = await this.getMLRCaseById(caseId);
    if (!mlrCase) {
      throw new Error(`MLR case ${caseId} not found`);
    }

    const updated: MLRCase = {
      ...mlrCase,
      status: 'REJECTED',
      decidedAt: new Date(),
      notes: rejectionReason,
    };

    console.log('Mock: Rejected MLR case', updated);

    // TODO: In real implementation:
    // 1. Update status to REJECTED
    // 2. Send notification to submitter with rejection reasons
    // 3. Optionally route to revision workflow
    // 4. Update audit trail

    return updated;
  }

  /**
   * Request changes from submitter
   * Transitions to CHANGES_REQUESTED status
   */
  async requestChanges(caseId: string, changeRequest: string): Promise<MLRCase> {
    await delay(400);

    const mlrCase = await this.getMLRCaseById(caseId);
    if (!mlrCase) {
      throw new Error(`MLR case ${caseId} not found`);
    }

    const updated: MLRCase = {
      ...mlrCase,
      status: 'CHANGES_REQUESTED',
      notes: changeRequest,
    };

    console.log('Mock: Requested changes for MLR case', updated);

    // TODO: Send notification with change requirements
    return updated;
  }

  /**
   * Get MLR workflow metrics
   * For dashboard and reporting
   */
  async getMLRMetrics(): Promise<MLRMetrics> {
    await delay(500);

    // Mock metrics calculation
    // TODO: Query actual data from Salesforce

    return {
      medianCycleTime: 4.2, // weeks
      firstPassApprovalRate: 52, // percentage
      overdueCount: 3,
      inReviewCount: 38,
    };
  }

  /**
   * Get overdue MLR cases
   * Cases past their SLA deadline
   */
  async getOverdueCases(): Promise<MLRCase[]> {
    await delay(300);

    // Mock: filter for cases submitted > 6 weeks ago
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

    return mockMLRCases.filter(c =>
      (c.status === 'IN_REVIEW' || c.status === 'SUBMITTED') &&
      c.submittedAt &&
      new Date(c.submittedAt) < sixWeeksAgo
    );
  }

  /**
   * Get cases assigned to specific reviewer
   * For reviewer workload management
   */
  async getReviewerWorkload(reviewerId: string): Promise<{
    pending: number;
    inProgress: number;
    completed: number;
  }> {
    await delay(200);

    const cases = await this.getMLRCases({ assignedTo: reviewerId });

    return {
      pending: cases.filter(c => c.status === 'SUBMITTED').length,
      inProgress: cases.filter(c => c.status === 'IN_REVIEW').length,
      completed: cases.filter(c => c.status === 'APPROVED' || c.status === 'REJECTED').length,
    };
  }
}

export const mlrService = new MLRService();
