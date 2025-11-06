/**
 * Claravine Validation Service
 *
 * Handles campaign taxonomy validation and metadata compliance.
 * Simulates Claravine's validation gateway for campaign governance.
 *
 * TODO: Integrate with Claravine API
 * - API Endpoint: https://app.claravine.com/api/v2/validations
 * - Authentication: API key in Authorization header
 * - Webhook support for async validation results
 *
 * Phase 1 Requirements:
 * - REQ-001: Claravine as Validation Gateway
 * - REQ-002: API-Enforced Validation
 * - REQ-003: Real-Time Validation Rules
 * - REQ-004: Automated Rollback Mechanism
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ValidationRule {
  field: string;
  rule: 'required' | 'regex' | 'enum' | 'unique';
  pattern?: string;
  allowedValues?: string[];
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    rule: string;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
  }>;
  validatedAt: Date;
  validationId: string;
}

export interface CampaignMetadata {
  name: string;
  brand: string;
  therapeuticArea: string;
  audience: string;
  channel: string;
  quarter: string;
  region: string;
  campaignType: string;
}

export interface UTMParameters {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
}

class ValidationService {
  // Mock validation rules (in real app, fetched from Claravine)
  private campaignNameRules: ValidationRule[] = [
    {
      field: 'name',
      rule: 'required',
      message: 'Campaign name is required',
    },
    {
      field: 'name',
      rule: 'regex',
      pattern: '^[A-Z][A-Z0-9-]+$',
      message: 'Campaign name must be uppercase alphanumeric with hyphens (e.g., NEXORA-HCP-Q1-EMAIL-001)',
    },
  ];

  private taxonomyRules: ValidationRule[] = [
    {
      field: 'brand',
      rule: 'required',
      message: 'Brand is required',
    },
    {
      field: 'therapeuticArea',
      rule: 'required',
      message: 'Therapeutic area is required',
    },
    {
      field: 'audience',
      rule: 'enum',
      allowedValues: ['HCP', 'Patient', 'Caregiver', 'Payer', 'Institution'],
      message: 'Audience must be one of: HCP, Patient, Caregiver, Payer, Institution',
    },
    {
      field: 'channel',
      rule: 'enum',
      allowedValues: ['Email', 'Web', 'Paid Media', 'Social', 'Events', 'Direct Mail', 'Field Sales'],
      message: 'Channel must be a valid marketing channel',
    },
  ];

  /**
   * Validate campaign name against naming convention
   * TODO: POST to Claravine /api/v2/validations/campaign-name
   */
  async validateCampaignName(name: string): Promise<ValidationResult> {
    await delay(400);

    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check naming convention: BRAND-AUDIENCE-QUARTER-CHANNEL-SEQUENCE
    const nameParts = name.split('-');

    if (!name) {
      errors.push({
        field: 'name',
        message: 'Campaign name is required',
        rule: 'required',
      });
    } else if (!/^[A-Z][A-Z0-9-]+$/.test(name)) {
      errors.push({
        field: 'name',
        message: 'Campaign name must be uppercase alphanumeric with hyphens',
        rule: 'regex',
      });
    } else if (nameParts.length < 4) {
      warnings.push({
        field: 'name',
        message: 'Campaign name should follow pattern: BRAND-AUDIENCE-QUARTER-CHANNEL-SEQUENCE',
      });
    }

    // Check for uniqueness (mock check)
    const existingCampaigns = ['NEXORA-HCP-Q1-EMAIL-001', 'CARDIALIFE-PAT-Q1-MULTI-001'];
    if (existingCampaigns.includes(name)) {
      errors.push({
        field: 'name',
        message: 'Campaign name already exists',
        rule: 'unique',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
      validationId: `VAL-${Date.now()}`,
    };
  }

  /**
   * Validate complete campaign metadata
   * TODO: POST to Claravine /api/v2/validations/metadata
   */
  async validateMetadata(metadata: CampaignMetadata): Promise<ValidationResult> {
    await delay(600);

    const errors: ValidationResult['errors'] = [];

    // Validate name
    const nameValidation = await this.validateCampaignName(metadata.name);
    errors.push(...nameValidation.errors);

    // Validate required fields
    if (!metadata.brand) {
      errors.push({
        field: 'brand',
        message: 'Brand is required',
        rule: 'required',
      });
    }

    if (!metadata.therapeuticArea) {
      errors.push({
        field: 'therapeuticArea',
        message: 'Therapeutic area is required',
        rule: 'required',
      });
    }

    // Validate enum values
    const validAudiences = ['HCP', 'Patient', 'Caregiver', 'Payer', 'Institution'];
    if (metadata.audience && !validAudiences.includes(metadata.audience)) {
      errors.push({
        field: 'audience',
        message: `Audience must be one of: ${validAudiences.join(', ')}`,
        rule: 'enum',
      });
    }

    const validChannels = ['Email', 'Web', 'Paid Media', 'Social', 'Events', 'Direct Mail', 'Field Sales'];
    if (metadata.channel && !validChannels.includes(metadata.channel)) {
      errors.push({
        field: 'channel',
        message: `Channel must be one of: ${validChannels.join(', ')}`,
        rule: 'enum',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedAt: new Date(),
      validationId: `VAL-${Date.now()}`,
    };
  }

  /**
   * Validate UTM parameters
   * TODO: POST to Claravine /api/v2/validations/utm
   */
  async validateUTMParameters(utmParams: UTMParameters): Promise<ValidationResult> {
    await delay(300);

    const errors: ValidationResult['errors'] = [];

    // Required UTM parameters
    if (!utmParams.utm_source) {
      errors.push({
        field: 'utm_source',
        message: 'utm_source is required',
        rule: 'required',
      });
    }

    if (!utmParams.utm_medium) {
      errors.push({
        field: 'utm_medium',
        message: 'utm_medium is required',
        rule: 'required',
      });
    }

    if (!utmParams.utm_campaign) {
      errors.push({
        field: 'utm_campaign',
        message: 'utm_campaign is required',
        rule: 'required',
      });
    }

    // Validate format (lowercase, no spaces)
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value && /[A-Z\s]/.test(value)) {
        errors.push({
          field: key,
          message: `${key} must be lowercase with no spaces`,
          rule: 'regex',
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      validatedAt: new Date(),
      validationId: `VAL-${Date.now()}`,
    };
  }

  /**
   * Get validation rules for a field
   * TODO: GET from Claravine /api/v2/rules/:field
   */
  async getValidationRules(field?: string): Promise<ValidationRule[]> {
    await delay(200);

    if (field) {
      return [...this.campaignNameRules, ...this.taxonomyRules].filter(r => r.field === field);
    }

    return [...this.campaignNameRules, ...this.taxonomyRules];
  }

  /**
   * Get validation history for a campaign
   * TODO: GET from Claravine /api/v2/validations/history/:campaignId
   */
  async getValidationHistory(campaignId: string): Promise<ValidationResult[]> {
    await delay(300);

    // Mock validation history
    return [
      {
        isValid: true,
        errors: [],
        validatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        validationId: 'VAL-001',
      },
      {
        isValid: false,
        errors: [
          {
            field: 'name',
            message: 'Campaign name must be uppercase',
            rule: 'regex',
          },
        ],
        validatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        validationId: 'VAL-002',
      },
    ];
  }

  /**
   * Validate all campaign data before submission
   * Comprehensive validation including name, metadata, and UTM parameters
   */
  async validateCampaign(campaign: {
    name: string;
    metadata: CampaignMetadata;
    utmParams?: UTMParameters;
  }): Promise<ValidationResult> {
    await delay(800);

    const allErrors: ValidationResult['errors'] = [];

    // Validate name
    const nameResult = await this.validateCampaignName(campaign.name);
    allErrors.push(...nameResult.errors);

    // Validate metadata
    const metadataResult = await this.validateMetadata(campaign.metadata);
    allErrors.push(...metadataResult.errors);

    // Validate UTM if provided
    if (campaign.utmParams) {
      const utmResult = await this.validateUTMParameters(campaign.utmParams);
      allErrors.push(...utmResult.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      validatedAt: new Date(),
      validationId: `VAL-${Date.now()}`,
    };
  }
}

export const validationService = new ValidationService();
