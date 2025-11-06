/**
 * Claim Service
 *
 * Manages pharmaceutical claims registry and substantiation evidence.
 * Critical for Phase 1 ClaimID Framework requirements.
 *
 * TODO: Integrate with Salesforce for claim storage
 * - Custom object: Claim__c in Salesforce
 * - Evidence stored in Files/Attachments with checksum verification
 * - Integrate with Document Management System for substantiation vault
 *
 * Phase 1 Requirements:
 * - REQ-010: ClaimID Data Model
 * - REQ-035: Claim Substantiation Vault
 * - REQ-298: ClaimID Data Model and Schema
 * - REQ-299: Claim Substantiation Evidence Management
 * - REQ-300: Claim-to-Indication Mapping and Off-Label Detection
 * - REQ-301: Claim Lifecycle Management
 */

import { mockClaims } from '@/lib/mockData';
import type { Claim, EvidenceDocument } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CreateClaimDto {
  productId: string;
  claimText: string;
  claimCategory: 'Efficacy' | 'Safety' | 'Quality of Life' | 'Pharmacoeconomics' | 'Other';
  version: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface ClaimFilters {
  status?: Claim['status'];
  productId?: string;
  expiringWithin?: number; // days
  searchQuery?: string;
}

export interface ClaimValidation {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  offLabelRisk?: 'low' | 'medium' | 'high';
  warnings?: string[];
}

class ClaimService {
  /**
   * Get all claims with filtering
   * TODO: Salesforce SOQL:
   * SELECT Id, ClaimText__c, Product__c, Status__c, EffectiveFrom__c, EffectiveTo__c
   * FROM Claim__c
   * WHERE IsActive__c = true
   */
  async getClaims(filters?: ClaimFilters): Promise<Claim[]> {
    await delay(300);

    let claims = [...mockClaims];

    // Apply filters
    if (filters?.status) {
      claims = claims.filter(c => c.status === filters.status);
    }

    if (filters?.productId) {
      claims = claims.filter(c => c.productId === filters.productId);
    }

    if (filters?.expiringWithin) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + filters.expiringWithin);

      claims = claims.filter(c =>
        c.effectiveTo &&
        new Date(c.effectiveTo) <= cutoffDate &&
        new Date(c.effectiveTo) >= new Date()
      );
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      claims = claims.filter(c => c.claimText.toLowerCase().includes(query));
    }

    return claims;
  }

  /**
   * Get claim by ID with evidence
   * TODO: Salesforce query with related evidence documents
   */
  async getClaimById(id: string): Promise<Claim | null> {
    await delay(200);
    return mockClaims.find(c => c.id === id) || null;
  }

  /**
   * Validate claim text for compliance
   * Checks for off-label promotion, unsubstantiated claims, etc.
   * TODO: Integrate with ML model or rules engine
   */
  async validateClaim(claimText: string, productId: string): Promise<ClaimValidation> {
    await delay(800);

    const errors: ClaimValidation['errors'] = [];
    const warnings: string[] = [];
    let offLabelRisk: ClaimValidation['offLabelRisk'] = 'low';

    // Check for required claim text
    if (!claimText || claimText.trim().length === 0) {
      errors.push({
        field: 'claimText',
        message: 'Claim text is required',
      });
    }

    // Check for minimum length
    if (claimText && claimText.length < 10) {
      errors.push({
        field: 'claimText',
        message: 'Claim text must be at least 10 characters',
      });
    }

    // Mock off-label detection
    const offLabelKeywords = ['off-label', 'unapproved', 'investigational', 'experimental'];
    const hasOffLabelKeywords = offLabelKeywords.some(keyword =>
      claimText.toLowerCase().includes(keyword)
    );

    if (hasOffLabelKeywords) {
      offLabelRisk = 'high';
      warnings.push('Claim may reference off-label use. Requires regulatory review.');
    }

    // Check for superlatives without substantiation
    const superlatives = ['best', 'superior', 'fastest', 'most effective', 'only'];
    const hasSuperlatives = superlatives.some(word =>
      claimText.toLowerCase().includes(word)
    );

    if (hasSuperlatives) {
      warnings.push('Claim contains superlative language. Ensure strong substantiation is available.');
    }

    // Check for quantitative claims without specificity
    if (/\d+%/.test(claimText) && !/(clinical|trial|study)/i.test(claimText)) {
      warnings.push('Quantitative claim should reference specific clinical evidence.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      offLabelRisk,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Create new claim
   * TODO: Create in Salesforce Claim__c object
   * Requires MLR approval before status = 'APPROVED'
   */
  async createClaim(data: CreateClaimDto): Promise<Claim> {
    await delay(500);

    // Validate claim first
    const validation = await this.validateClaim(data.claimText, data.productId);

    if (!validation.isValid) {
      throw new Error(`Claim validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const newClaim: Claim = {
      id: `CLM-${Date.now()}`,
      productId: data.productId,
      claimText: data.claimText,
      claimCategory: data.claimCategory,
      version: data.version,
      status: 'DRAFT', // Must go through MLR approval
      effectiveFrom: data.effectiveFrom,
      effectiveTo: data.effectiveTo,
      createdBy: 'current-user-id', // TODO: Get from auth
      evidenceDocuments: [],
    };

    console.log('Mock: Created claim', newClaim);

    // TODO: In real implementation:
    // 1. Validate claim text
    // 2. Check for off-label promotion
    // 3. Create in Salesforce
    // 4. Create MLR case for approval
    // 5. Set up expiry reminder workflow

    return newClaim;
  }

  /**
   * Upload evidence document for claim
   * TODO: Upload to Salesforce Files with checksum verification
   */
  async uploadEvidence(
    claimId: string,
    file: {
      title: string;
      sourceType: 'Clinical Trial' | 'Real-World Evidence' | 'Systematic Review' | 'Meta-Analysis' | 'Regulatory Approval' | 'Other';
      fileData: File;
    }
  ): Promise<EvidenceDocument> {
    await delay(1000);

    // Mock checksum calculation
    const checksum = `SHA256-${Math.random().toString(36).substring(7)}`;

    const evidence: EvidenceDocument = {
      id: `EVD-${Date.now()}`,
      claimId,
      title: file.title,
      sourceType: file.sourceType,
      url: `/evidence/${claimId}/${file.fileData.name}`, // Mock URL
      uploadedBy: 'current-user-id',
      uploadedAt: new Date(),
      checksum,
    };

    console.log('Mock: Uploaded evidence', evidence);

    // TODO: In real implementation:
    // 1. Upload to document management system
    // 2. Calculate checksum for integrity verification
    // 3. Virus scan
    // 4. Link to Claim record in Salesforce
    // 5. Update claim status if sufficient evidence provided

    return evidence;
  }

  /**
   * Get evidence documents for a claim
   * TODO: Query Salesforce ContentDocumentLinks
   */
  async getClaimEvidence(claimId: string): Promise<EvidenceDocument[]> {
    await delay(200);

    const claim = await this.getClaimById(claimId);
    return claim?.evidenceDocuments || [];
  }

  /**
   * Check claim expiry status
   * Returns days until expiry and whether renewal is needed
   */
  async checkClaimExpiry(claimId: string): Promise<{
    daysUntilExpiry: number;
    isExpired: boolean;
    renewalNeeded: boolean;
  }> {
    await delay(100);

    const claim = await this.getClaimById(claimId);

    if (!claim || !claim.effectiveTo) {
      return {
        daysUntilExpiry: Infinity,
        isExpired: false,
        renewalNeeded: false,
      };
    }

    const now = new Date();
    const expiryDate = new Date(claim.effectiveTo);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      daysUntilExpiry,
      isExpired: daysUntilExpiry < 0,
      renewalNeeded: daysUntilExpiry <= 90 && daysUntilExpiry > 0, // Renew if < 90 days
    };
  }

  /**
   * Get claims expiring soon
   * For automated renewal workflow (REQ-301)
   */
  async getExpiringClaims(daysThreshold: number = 90): Promise<Claim[]> {
    await delay(300);

    const allClaims = await this.getClaims({ status: 'APPROVED' });

    const expiringClaims = allClaims.filter(claim => {
      if (!claim.effectiveTo) return false;

      const daysUntilExpiry = Math.ceil(
        (new Date(claim.effectiveTo).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      return daysUntilExpiry > 0 && daysUntilExpiry <= daysThreshold;
    });

    return expiringClaims;
  }

  /**
   * Retire claim (soft delete)
   * Used when claim is no longer valid or product discontinued
   */
  async retireClaim(claimId: string, reason: string): Promise<void> {
    await delay(400);

    console.log(`Mock: Retiring claim ${claimId}. Reason: ${reason}`);

    // TODO: In real implementation:
    // 1. Update claim status to RETIRED
    // 2. Find all campaigns using this claim
    // 3. Pause/archive those campaigns (REQ-130)
    // 4. Notify stakeholders
    // 5. Update audit logs
  }
}

export const claimService = new ClaimService();
