import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Clock, GitBranch, UserX, Split, Target, Zap } from 'lucide-react';
import type {
  WaitConfig,
  DecisionConfig,
  SuppressionConfig,
  ABTestConfig,
  AttributionConfig,
  ScoreConfig,
  NodeConfig,
} from '@/types';

interface NodeConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeType: 'wait' | 'decision' | 'suppression' | 'abtest' | 'attribution' | 'score';
  onSave: (config: NodeConfig) => void;
  existingConfig?: NodeConfig;
}

export function NodeConfigDialog({ open, onOpenChange, nodeType, onSave }: NodeConfigDialogProps) {
  // Wait node state
  const [waitType, setWaitType] = useState<'time' | 'event' | 'time_or_event'>('time');
  const [duration, setDuration] = useState('24');
  const [durationUnit, setDurationUnit] = useState<'hours' | 'days' | 'weeks'>('hours');
  const [event, setEvent] = useState('email_opened');
  const [maxWaitDuration, setMaxWaitDuration] = useState('72');
  const [maxWaitUnit, setMaxWaitUnit] = useState<'hours' | 'days' | 'weeks'>('hours');

  // Decision node state
  const [decisionType, setDecisionType] = useState<'engagement' | 'demographic' | 'behavioral' | 'segment' | 'custom'>('engagement');
  const [criterion, setCriterion] = useState('email_opened');

  // Suppression node state
  const [suppressionLists, setSuppressionLists] = useState<string[]>(['global_unsubscribe']);
  const [suppressionLogic, setSuppressionLogic] = useState<'AND' | 'OR'>('OR');
  const [suppressionAction, setSuppressionAction] = useState<'remove_from_journey' | 'skip_sequence'>('remove_from_journey');
  const [allowOverride, setAllowOverride] = useState(false);
  const [auditLog, setAuditLog] = useState(true);

  // A/B Test node state
  const [testName, setTestName] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [numVariants, setNumVariants] = useState(2);
  const [randomization, setRandomization] = useState<'random' | 'stable_hash' | 'stratified'>('stable_hash');
  const [successMetric, setSuccessMetric] = useState('click_through_rate');
  const [testDuration, setTestDuration] = useState('14');
  const [testDurationUnit, setTestDurationUnit] = useState<'days' | 'weeks'>('days');
  const [autoPromote, setAutoPromote] = useState(false);
  const [significanceThreshold, setSignificanceThreshold] = useState(95);

  // Attribution node state
  const [attributionEventType, setAttributionEventType] = useState('prescription_written');
  const [attributionEventName, setAttributionEventName] = useState('');
  const [conversionValue, setConversionValue] = useState('100');
  const [attributionWeight, setAttributionWeight] = useState('100');
  const [lookbackWindow, setLookbackWindow] = useState('30');
  const [lookbackUnit, setLookbackUnit] = useState<'days' | 'weeks'>('days');
  const [crossCampaignAttribution, setCrossCampaignAttribution] = useState(false);
  const [deduplication, setDeduplication] = useState<'allow_multiple' | 'first_only' | 'most_recent'>('first_only');
  const [notifyOnConversion, setNotifyOnConversion] = useState(true);
  const [updateCRM, setUpdateCRM] = useState(true);

  // Score node state
  const [scoreType, setScoreType] = useState('engagement_score');
  const [updateLogic, setUpdateLogic] = useState<'add' | 'subtract' | 'set' | 'multiply'>('add');
  const [pointValue, setPointValue] = useState('10');
  const [minBound, setMinBound] = useState('0');
  const [maxBound, setMaxBound] = useState('100');
  const [triggerCondition, setTriggerCondition] = useState<'immediate' | 'end_of_sequence' | 'on_event'>('immediate');
  const [reevaluateSegment, setReevaluateSegment] = useState(false);
  const [alertOnThreshold, setAlertOnThreshold] = useState(false);
  const [thresholdValue, setThresholdValue] = useState('80');

  const handleSave = () => {
    if (nodeType === 'wait') {
      const config: WaitConfig = {
        type: waitType,
        duration: parseInt(duration),
        durationUnit,
        event: waitType !== 'time' ? event : undefined,
        maxWaitDuration: waitType === 'time_or_event' ? parseInt(maxWaitDuration) : undefined,
        maxWaitUnit: waitType === 'time_or_event' ? maxWaitUnit : undefined,
      };
      onSave(config);
    } else if (nodeType === 'decision') {
      const config: DecisionConfig = {
        type: decisionType,
        criterion,
        paths: getDecisionPaths(decisionType, criterion),
      };
      onSave(config);
    } else if (nodeType === 'suppression') {
      const config: SuppressionConfig = {
        lists: suppressionLists,
        logic: suppressionLogic,
        action: suppressionAction,
        allowOverride,
        auditLog,
      };
      onSave(config);
    } else if (nodeType === 'abtest') {
      const variants = Array.from({ length: numVariants }, (_, i) => ({
        name: `Variant ${String.fromCharCode(65 + i)}`,
        allocation: Math.round(100 / numVariants),
      }));
      const config: ABTestConfig = {
        testName,
        hypothesis,
        variants,
        randomization,
        successMetric,
        duration: parseInt(testDuration),
        durationUnit: testDurationUnit,
        autoPromote,
        significanceThreshold,
      };
      onSave(config);
    } else if (nodeType === 'attribution') {
      const config: AttributionConfig = {
        eventType: attributionEventType,
        eventName: attributionEventName || attributionEventType.replace(/_/g, ' '),
        conversionValue: parseFloat(conversionValue),
        attributionWeight: parseFloat(attributionWeight),
        lookbackWindow: parseInt(lookbackWindow),
        lookbackUnit,
        crossCampaignAttribution,
        deduplication,
        notifyOnConversion,
        updateCRM,
      };
      onSave(config);
    } else if (nodeType === 'score') {
      const config: ScoreConfig = {
        scoreType,
        updateLogic,
        pointValue: parseFloat(pointValue),
        minBound: parseFloat(minBound),
        maxBound: parseFloat(maxBound),
        triggerCondition,
        reevaluateSegment,
        alertOnThreshold,
        thresholdValue: alertOnThreshold ? parseFloat(thresholdValue) : undefined,
      };
      onSave(config);
    }
    onOpenChange(false);
  };

  const getDecisionPaths = (type: string, crit: string) => {
    // Define paths based on decision type and criterion
    const pathMap: Record<string, { label: string; condition: string }[]> = {
      email_opened: [
        { label: 'Opened', condition: 'email_opened = true' },
        { label: 'Not Opened', condition: 'email_opened = false' },
      ],
      email_clicked: [
        { label: 'Clicked', condition: 'email_clicked = true' },
        { label: 'Not Clicked', condition: 'email_clicked = false' },
      ],
      engagement_score: [
        { label: 'High Engagement (>70)', condition: 'engagement_score > 70' },
        { label: 'Medium Engagement (30-70)', condition: 'engagement_score >= 30 AND engagement_score <= 70' },
        { label: 'Low Engagement (<30)', condition: 'engagement_score < 30' },
      ],
      hcp_specialty: [
        { label: 'Oncology', condition: 'specialty = Oncology' },
        { label: 'Ophthalmology', condition: 'specialty = Ophthalmology' },
        { label: 'Dermatology', condition: 'specialty = Dermatology' },
        { label: 'Other', condition: 'specialty NOT IN (Oncology, Ophthalmology, Dermatology)' },
      ],
      account_tier: [
        { label: 'Tier 1 (High Value)', condition: 'account_tier = 1' },
        { label: 'Tier 2 (Medium Value)', condition: 'account_tier = 2' },
        { label: 'Tier 3 (Low Value)', condition: 'account_tier = 3' },
      ],
      previous_response: [
        { label: 'Responded to Previous Campaign', condition: 'previous_campaign_response = true' },
        { label: 'No Previous Response', condition: 'previous_campaign_response = false' },
      ],
      consent_status: [
        { label: 'Full Consent', condition: 'consent_email = true AND consent_phone = true' },
        { label: 'Email Only', condition: 'consent_email = true AND consent_phone = false' },
        { label: 'No Consent', condition: 'consent_email = false' },
      ],
    };

    return pathMap[crit] || [
      { label: 'Path A', condition: 'true' },
      { label: 'Path B', condition: 'false' },
    ];
  };

  const getNodeIcon = () => {
    switch (nodeType) {
      case 'wait':
        return <Clock className="h-5 w-5" />;
      case 'decision':
        return <GitBranch className="h-5 w-5" />;
      case 'suppression':
        return <UserX className="h-5 w-5" />;
      case 'abtest':
        return <Split className="h-5 w-5" />;
      case 'attribution':
        return <Target className="h-5 w-5" />;
      case 'score':
        return <Zap className="h-5 w-5" />;
    }
  };

  const getNodeTitle = () => {
    switch (nodeType) {
      case 'wait':
        return 'Configure Wait Node';
      case 'decision':
        return 'Configure Decision Split';
      case 'suppression':
        return 'Configure Suppression Node';
      case 'abtest':
        return 'Configure A/B Test';
      case 'attribution':
        return 'Configure Attribution Point';
      case 'score':
        return 'Configure Score Update';
    }
  };

  const getNodeDescription = () => {
    switch (nodeType) {
      case 'wait':
        return 'Set the wait duration or event that must occur before continuing the journey.';
      case 'decision':
        return 'Define the criteria for splitting the audience into different paths.';
      case 'suppression':
        return 'Define suppression rules to filter customers who should not receive this campaign.';
      case 'abtest':
        return 'Configure A/B test variants and success metrics for content optimization.';
      case 'attribution':
        return 'Mark this point as a conversion event and configure attribution rules.';
      case 'score':
        return 'Update customer engagement or propensity scores based on behavior.';
    }
  };

  const toggleSuppressionList = (list: string) => {
    setSuppressionLists((prev) =>
      prev.includes(list) ? prev.filter((l) => l !== list) : [...prev, list]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getNodeIcon()}
            {getNodeTitle()}
          </DialogTitle>
          <DialogDescription>{getNodeDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {nodeType === 'wait' ? (
            <>
              {/* Wait Type */}
              <div className="space-y-2">
                <Label>Wait Type</Label>
                <RadioGroup value={waitType} onValueChange={(v) => setWaitType(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="time" id="time" />
                    <Label htmlFor="time" className="font-normal cursor-pointer">
                      Fixed time duration
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="event" id="event" />
                    <Label htmlFor="event" className="font-normal cursor-pointer">
                      Wait for event
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="time_or_event" id="time_or_event" />
                    <Label htmlFor="time_or_event" className="font-normal cursor-pointer">
                      Time or event (whichever comes first)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Duration (for time and time_or_event) */}
              {(waitType === 'time' || waitType === 'time_or_event') && (
                <div className="space-y-2">
                  <Label>
                    {waitType === 'time_or_event' ? 'Maximum Wait Duration' : 'Duration'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={waitType === 'time_or_event' ? maxWaitDuration : duration}
                      onChange={(e) =>
                        waitType === 'time_or_event'
                          ? setMaxWaitDuration(e.target.value)
                          : setDuration(e.target.value)
                      }
                      className="flex-1"
                    />
                    <Select
                      value={waitType === 'time_or_event' ? maxWaitUnit : durationUnit}
                      onValueChange={(v) =>
                        waitType === 'time_or_event'
                          ? setMaxWaitUnit(v as any)
                          : setDurationUnit(v as any)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Event (for event and time_or_event) */}
              {(waitType === 'event' || waitType === 'time_or_event') && (
                <div className="space-y-2">
                  <Label>Wait Until Event</Label>
                  <Select value={event} onValueChange={setEvent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email_opened">Email Opened</SelectItem>
                      <SelectItem value="email_clicked">Email Clicked</SelectItem>
                      <SelectItem value="link_clicked">Specific Link Clicked</SelectItem>
                      <SelectItem value="web_page_visited">Web Page Visited</SelectItem>
                      <SelectItem value="form_submitted">Form Submitted</SelectItem>
                      <SelectItem value="content_downloaded">Content Downloaded</SelectItem>
                      <SelectItem value="rep_visit_completed">Rep Visit Completed</SelectItem>
                      <SelectItem value="webinar_attended">Webinar Attended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {waitType === 'time_or_event' && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="flex-1"
                    placeholder="Wait duration"
                  />
                  <Select value={durationUnit} onValueChange={(v) => setDurationUnit(v as any)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Decision Type */}
              <div className="space-y-2">
                <Label>Decision Type</Label>
                <Select value={decisionType} onValueChange={(v) => setDecisionType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engagement">Engagement Behavior</SelectItem>
                    <SelectItem value="demographic">Demographic Attribute</SelectItem>
                    <SelectItem value="behavioral">Behavioral History</SelectItem>
                    <SelectItem value="segment">Segment Membership</SelectItem>
                    <SelectItem value="custom">Custom Criteria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Criterion */}
              <div className="space-y-2">
                <Label>Split Criterion</Label>
                <Select value={criterion} onValueChange={setCriterion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {decisionType === 'engagement' && (
                      <>
                        <SelectItem value="email_opened">Email Opened?</SelectItem>
                        <SelectItem value="email_clicked">Email Clicked?</SelectItem>
                        <SelectItem value="engagement_score">Engagement Score</SelectItem>
                      </>
                    )}
                    {decisionType === 'demographic' && (
                      <>
                        <SelectItem value="hcp_specialty">HCP Specialty</SelectItem>
                        <SelectItem value="account_tier">Account Tier</SelectItem>
                        <SelectItem value="consent_status">Consent Status</SelectItem>
                      </>
                    )}
                    {decisionType === 'behavioral' && (
                      <>
                        <SelectItem value="previous_response">Previous Campaign Response</SelectItem>
                        <SelectItem value="content_preference">Content Preference</SelectItem>
                        <SelectItem value="channel_preference">Channel Preference</SelectItem>
                      </>
                    )}
                    {decisionType === 'segment' && (
                      <>
                        <SelectItem value="high_value_segment">High Value Segment?</SelectItem>
                        <SelectItem value="early_adopter">Early Adopter?</SelectItem>
                        <SelectItem value="specialty_focus">Specialty Focus</SelectItem>
                      </>
                    )}
                    {decisionType === 'custom' && (
                      <SelectItem value="custom">Custom Expression</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview paths */}
              <div className="space-y-2">
                <Label>Resulting Paths</Label>
                <div className="text-sm text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
                  {getDecisionPaths(decisionType, criterion).map((path, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium">{path.label}</span>
                      <span className="text-xs">({path.condition})</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : nodeType === 'suppression' ? (
            <>
              {/* Suppression Lists */}
              <div className="space-y-3">
                <Label>Suppression Lists (Select all that apply)</Label>
                <div className="space-y-2">
                  {[
                    { id: 'global_unsubscribe', label: 'Global Unsubscribe List', desc: 'Customers who opted out of all communications' },
                    { id: 'campaign_exclusions', label: 'Campaign-Specific Exclusions', desc: 'Excluded from this campaign type' },
                    { id: 'consent_revoked', label: 'Consent Revocations', desc: 'Recently revoked consent' },
                    { id: 'bounce_complaint', label: 'Bounce/Complaint List', desc: 'Hard bounces and spam complaints' },
                    { id: 'clinical_trial', label: 'Clinical Trial Participants', desc: 'Active trial participants' },
                    { id: 'competitor_employees', label: 'Competitor Employees', desc: 'Known competitor staff' },
                    { id: 'deceased_inactive', label: 'Deceased/Inactive Records', desc: 'Deceased or inactive customers' },
                    { id: 'do_not_contact', label: 'Do Not Contact List', desc: 'Legal/compliance DNC list' },
                  ].map((list) => (
                    <div key={list.id} className="flex items-start space-x-2 p-2 rounded border">
                      <Checkbox
                        id={list.id}
                        checked={suppressionLists.includes(list.id)}
                        onCheckedChange={() => toggleSuppressionList(list.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={list.id} className="font-medium cursor-pointer">
                          {list.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{list.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suppression Logic */}
              <div className="space-y-2">
                <Label>Suppression Logic</Label>
                <RadioGroup value={suppressionLogic} onValueChange={(v) => setSuppressionLogic(v as 'AND' | 'OR')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OR" id="or" />
                    <Label htmlFor="or" className="font-normal cursor-pointer">
                      OR - Suppress if customer is on ANY selected list
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AND" id="and" />
                    <Label htmlFor="and" className="font-normal cursor-pointer">
                      AND - Suppress only if customer is on ALL selected lists
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Suppression Action */}
              <div className="space-y-2">
                <Label>Action When Suppressed</Label>
                <Select value={suppressionAction} onValueChange={(v) => setSuppressionAction(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remove_from_journey">Remove from Journey (Exit immediately)</SelectItem>
                    <SelectItem value="skip_sequence">Skip This Sequence (Continue to next)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowOverride"
                    checked={allowOverride}
                    onCheckedChange={(checked) => setAllowOverride(checked as boolean)}
                  />
                  <Label htmlFor="allowOverride" className="font-normal cursor-pointer">
                    Allow manual override with approval
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auditLog"
                    checked={auditLog}
                    onCheckedChange={(checked) => setAuditLog(checked as boolean)}
                  />
                  <Label htmlFor="auditLog" className="font-normal cursor-pointer">
                    Log all suppression events for compliance audit
                  </Label>
                </div>
              </div>
            </>
          ) : nodeType === 'abtest' ? (
            <>
              {/* Test Name */}
              <div className="space-y-2">
                <Label>Test Name</Label>
                <Input
                  placeholder="e.g., Email Subject Line Test Q4"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </div>

              {/* Hypothesis */}
              <div className="space-y-2">
                <Label>Hypothesis (Optional)</Label>
                <Input
                  placeholder="e.g., Personalized subject lines will increase open rates by 15%"
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                />
              </div>

              {/* Number of Variants */}
              <div className="space-y-2">
                <Label>Number of Variants</Label>
                <Select value={String(numVariants)} onValueChange={(v) => setNumVariants(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Variants (A/B)</SelectItem>
                    <SelectItem value="3">3 Variants (A/B/C)</SelectItem>
                    <SelectItem value="4">4 Variants (A/B/C/D)</SelectItem>
                    <SelectItem value="5">5 Variants (A/B/C/D/E)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Traffic will be split evenly: {Math.round(100 / numVariants)}% per variant
                </p>
              </div>

              {/* Randomization Strategy */}
              <div className="space-y-2">
                <Label>Randomization Strategy</Label>
                <Select value={randomization} onValueChange={(v) => setRandomization(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stable_hash">Stable Hash (Recommended - Same customer always sees same variant)</SelectItem>
                    <SelectItem value="random">Pure Random (Re-randomize each time)</SelectItem>
                    <SelectItem value="stratified">Stratified (Balance by segment attributes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Success Metric */}
              <div className="space-y-2">
                <Label>Success Metric</Label>
                <Select value={successMetric} onValueChange={setSuccessMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="click_through_rate">Click-Through Rate (CTR)</SelectItem>
                    <SelectItem value="open_rate">Open Rate (Email)</SelectItem>
                    <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                    <SelectItem value="engagement_score">Engagement Score Change</SelectItem>
                    <SelectItem value="time_to_conversion">Time to Conversion</SelectItem>
                    <SelectItem value="revenue_per_customer">Revenue per Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Test Duration */}
              <div className="space-y-2">
                <Label>Test Duration</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={testDuration}
                    onChange={(e) => setTestDuration(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={testDurationUnit} onValueChange={(v) => setTestDurationUnit(v as 'days' | 'weeks')}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Statistical Significance */}
              <div className="space-y-2">
                <Label>Statistical Significance Threshold: {significanceThreshold}%</Label>
                <Slider
                  value={[significanceThreshold]}
                  onValueChange={(v) => setSignificanceThreshold(v[0])}
                  min={80}
                  max={99}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum confidence level required to declare a winner
                </p>
              </div>

              {/* Auto-Promote Winner */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoPromote"
                  checked={autoPromote}
                  onCheckedChange={(checked) => setAutoPromote(checked as boolean)}
                />
                <Label htmlFor="autoPromote" className="font-normal cursor-pointer">
                  Automatically promote winning variant after test completes
                </Label>
              </div>
            </>
          ) : nodeType === 'attribution' ? (
            <>
              {/* Attribution Event Type */}
              <div className="space-y-2">
                <Label>Attribution Event Type</Label>
                <Select value={attributionEventType} onValueChange={setAttributionEventType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription_written">Prescription Written</SelectItem>
                    <SelectItem value="sample_requested">Sample Requested</SelectItem>
                    <SelectItem value="rep_meeting_scheduled">Rep Meeting Scheduled</SelectItem>
                    <SelectItem value="rep_meeting_completed">Rep Meeting Completed</SelectItem>
                    <SelectItem value="webinar_registration">Webinar Registration</SelectItem>
                    <SelectItem value="webinar_attendance">Webinar Attended</SelectItem>
                    <SelectItem value="patient_enrollment">Patient Program Enrollment</SelectItem>
                    <SelectItem value="consent_granted">Consent Granted</SelectItem>
                    <SelectItem value="form_submission">Form Submitted</SelectItem>
                    <SelectItem value="content_download">Content Downloaded</SelectItem>
                    <SelectItem value="custom_event">Custom Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Event Name */}
              {attributionEventType === 'custom_event' && (
                <div className="space-y-2">
                  <Label>Custom Event Name</Label>
                  <Input
                    placeholder="e.g., Product Demo Completed"
                    value={attributionEventName}
                    onChange={(e) => setAttributionEventName(e.target.value)}
                  />
                </div>
              )}

              {/* Conversion Value */}
              <div className="space-y-2">
                <Label>Conversion Value (Points or $)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={conversionValue}
                  onChange={(e) => setConversionValue(e.target.value)}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground">
                  Assign a value to this conversion for ROI tracking
                </p>
              </div>

              {/* Attribution Weight */}
              <div className="space-y-2">
                <Label>Attribution Weight: {attributionWeight}%</Label>
                <Slider
                  value={[parseFloat(attributionWeight)]}
                  onValueChange={(v) => setAttributionWeight(String(v[0]))}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of credit this touchpoint receives (used in multi-touch attribution)
                </p>
              </div>

              {/* Lookback Window */}
              <div className="space-y-2">
                <Label>Attribution Lookback Window</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={lookbackWindow}
                    onChange={(e) => setLookbackWindow(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={lookbackUnit} onValueChange={(v) => setLookbackUnit(v as 'days' | 'weeks')}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  How far back to credit touchpoints before this conversion
                </p>
              </div>

              {/* Deduplication */}
              <div className="space-y-2">
                <Label>Deduplication Rule</Label>
                <Select value={deduplication} onValueChange={(v) => setDeduplication(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_only">First Occurrence Only (Count once per customer)</SelectItem>
                    <SelectItem value="most_recent">Most Recent Only (Update to latest)</SelectItem>
                    <SelectItem value="allow_multiple">Allow Multiple (Count every occurrence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="crossCampaign"
                    checked={crossCampaignAttribution}
                    onCheckedChange={(checked) => setCrossCampaignAttribution(checked as boolean)}
                  />
                  <Label htmlFor="crossCampaign" className="font-normal cursor-pointer">
                    Include touchpoints from other campaigns in attribution
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyConversion"
                    checked={notifyOnConversion}
                    onCheckedChange={(checked) => setNotifyOnConversion(checked as boolean)}
                  />
                  <Label htmlFor="notifyConversion" className="font-normal cursor-pointer">
                    Send notification when conversion occurs
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updateCRM"
                    checked={updateCRM}
                    onCheckedChange={(checked) => setUpdateCRM(checked as boolean)}
                  />
                  <Label htmlFor="updateCRM" className="font-normal cursor-pointer">
                    Update CRM with conversion event
                  </Label>
                </div>
              </div>
            </>
          ) : nodeType === 'score' ? (
            <>
              {/* Score Type */}
              <div className="space-y-2">
                <Label>Score Type to Update</Label>
                <Select value={scoreType} onValueChange={setScoreType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engagement_score">Engagement Score</SelectItem>
                    <SelectItem value="propensity_to_prescribe">Propensity to Prescribe</SelectItem>
                    <SelectItem value="brand_affinity">Brand Affinity Score</SelectItem>
                    <SelectItem value="content_consumption">Content Consumption Score</SelectItem>
                    <SelectItem value="adherence_likelihood">Adherence Likelihood (Patient)</SelectItem>
                    <SelectItem value="custom_score">Custom Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Update Logic */}
              <div className="space-y-2">
                <Label>Update Logic</Label>
                <Select value={updateLogic} onValueChange={(v) => setUpdateLogic(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Points (Increase score)</SelectItem>
                    <SelectItem value="subtract">Subtract Points (Decrease score)</SelectItem>
                    <SelectItem value="set">Set to Absolute Value (Overwrite)</SelectItem>
                    <SelectItem value="multiply">Multiply by Factor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Point Value */}
              <div className="space-y-2">
                <Label>
                  {updateLogic === 'set' ? 'New Score Value' : updateLogic === 'multiply' ? 'Multiplier' : 'Point Value'}
                </Label>
                <Input
                  type="number"
                  step={updateLogic === 'multiply' ? '0.1' : '1'}
                  value={pointValue}
                  onChange={(e) => setPointValue(e.target.value)}
                  placeholder={updateLogic === 'multiply' ? '1.5' : '10'}
                />
                <p className="text-xs text-muted-foreground">
                  {updateLogic === 'add' && 'Points to add to current score'}
                  {updateLogic === 'subtract' && 'Points to subtract from current score'}
                  {updateLogic === 'set' && 'New absolute value for the score'}
                  {updateLogic === 'multiply' && 'Factor to multiply current score by (e.g., 1.5 = 50% increase)'}
                </p>
              </div>

              {/* Score Bounds */}
              <div className="space-y-2">
                <Label>Score Bounds</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Minimum</Label>
                    <Input
                      type="number"
                      value={minBound}
                      onChange={(e) => setMinBound(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Maximum</Label>
                    <Input
                      type="number"
                      value={maxBound}
                      onChange={(e) => setMaxBound(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Score will be clamped to this range after update
                </p>
              </div>

              {/* Trigger Condition */}
              <div className="space-y-2">
                <Label>When to Update Score</Label>
                <Select value={triggerCondition} onValueChange={(v) => setTriggerCondition(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediately (Real-time update)</SelectItem>
                    <SelectItem value="end_of_sequence">End of Sequence (Batch update)</SelectItem>
                    <SelectItem value="on_event">On Specific Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reevaluateSegment"
                    checked={reevaluateSegment}
                    onCheckedChange={(checked) => setReevaluateSegment(checked as boolean)}
                  />
                  <Label htmlFor="reevaluateSegment" className="font-normal cursor-pointer">
                    Re-evaluate segment membership after score update
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alertOnThreshold"
                    checked={alertOnThreshold}
                    onCheckedChange={(checked) => setAlertOnThreshold(checked as boolean)}
                  />
                  <Label htmlFor="alertOnThreshold" className="font-normal cursor-pointer">
                    Alert when score crosses threshold
                  </Label>
                </div>
                {alertOnThreshold && (
                  <div className="ml-6 space-y-2">
                    <Label>Alert Threshold Value</Label>
                    <Input
                      type="number"
                      value={thresholdValue}
                      onChange={(e) => setThresholdValue(e.target.value)}
                      placeholder="80"
                    />
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
