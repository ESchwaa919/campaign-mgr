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
import { Clock, GitBranch } from 'lucide-react';

export interface WaitConfig {
  type: 'time' | 'event' | 'time_or_event';
  duration?: number;
  durationUnit?: 'hours' | 'days' | 'weeks';
  event?: string;
  maxWaitDuration?: number;
  maxWaitUnit?: 'hours' | 'days' | 'weeks';
}

export interface DecisionConfig {
  type: 'engagement' | 'demographic' | 'behavioral' | 'segment' | 'custom';
  criterion?: string;
  paths: {
    label: string;
    condition: string;
  }[];
}

interface NodeConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeType: 'wait' | 'decision';
  onSave: (config: WaitConfig | DecisionConfig) => void;
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
    } else {
      const config: DecisionConfig = {
        type: decisionType,
        criterion,
        paths: getDecisionPaths(decisionType, criterion),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {nodeType === 'wait' ? (
              <>
                <Clock className="h-5 w-5" />
                Configure Wait Node
              </>
            ) : (
              <>
                <GitBranch className="h-5 w-5" />
                Configure Decision Split
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {nodeType === 'wait'
              ? 'Set the wait duration or event that must occur before continuing the journey.'
              : 'Define the criteria for splitting the audience into different paths.'}
          </DialogDescription>
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
          )}
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
