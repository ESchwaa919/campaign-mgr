import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2, AlertCircle, Rocket, Database, Globe, Upload } from 'lucide-react';
import type { JourneyActivationResult } from '@/types';

interface JourneyActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivate: () => Promise<JourneyActivationResult>;
  onComplete: (result: JourneyActivationResult) => void;
}

type ActivationStep = {
  id: string;
  label: string;
  description: string;
  icon: typeof Rocket;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  duration: number; // ms
};

export function JourneyActivationDialog({
  open,
  onOpenChange,
  onActivate,
  onComplete,
}: JourneyActivationDialogProps) {
  const [steps, setSteps] = useState<ActivationStep[]>([
    {
      id: 'validate',
      label: 'Validating Journey Structure',
      description: 'Checking campaign configuration and content assignments',
      icon: CheckCircle2,
      status: 'pending',
      duration: 500,
    },
    {
      id: 'mint_campaign',
      label: 'Minting Campaign ID',
      description: 'Generating unique campaign identifier in ID registry',
      icon: Database,
      status: 'pending',
      duration: 800,
    },
    {
      id: 'mint_sequences',
      label: 'Generating Sequence IDs',
      description: 'Creating composite keys for all journey nodes',
      icon: Database,
      status: 'pending',
      duration: 1000,
    },
    {
      id: 'generate_utms',
      label: 'Generating UTM Parameters',
      description: 'Building UTM + cm_* tracking structure',
      icon: Globe,
      status: 'pending',
      duration: 700,
    },
    {
      id: 'claravine',
      label: 'Claravine Validation',
      description: 'Validating taxonomy and tracking parameters',
      icon: CheckCircle2,
      status: 'pending',
      duration: 1000,
    },
    {
      id: 's3_export',
      label: 'Exporting to S3',
      description: 'Dropping campaign manifest for CMI Media',
      icon: Upload,
      status: 'pending',
      duration: 800,
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activationResult, setActivationResult] = useState<JourneyActivationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate overall progress
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  // Start activation when dialog opens
  useEffect(() => {
    if (open && currentStepIndex === -1) {
      startActivation();
    }
  }, [open]);

  const startActivation = async () => {
    setCurrentStepIndex(0);
    setError(null);

    try {
      // Execute steps sequentially with delays
      for (let i = 0; i < steps.length; i++) {
        setCurrentStepIndex(i);

        // Update step to in_progress
        setSteps((prev) =>
          prev.map((step, idx) =>
            idx === i ? { ...step, status: 'in_progress' as const } : step
          )
        );

        // Simulate step execution time
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration));

        // For the claravine step, actually call the activation function
        if (steps[i].id === 'claravine') {
          const result = await onActivate();
          setActivationResult(result);
        }

        // Update step to completed
        setSteps((prev) =>
          prev.map((step, idx) =>
            idx === i ? { ...step, status: 'completed' as const } : step
          )
        );
      }

      // All steps completed - notify parent
      if (activationResult) {
        onComplete(activationResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation failed');
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === currentStepIndex ? { ...step, status: 'error' as const } : step
        )
      );
    }
  };

  const handleClose = () => {
    if (completedSteps === steps.length || error) {
      // Reset state for next time
      setCurrentStepIndex(-1);
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'pending' as const })));
      setActivationResult(null);
      setError(null);
      onOpenChange(false);
    }
  };

  const isComplete = completedSteps === steps.length;
  const isActivating = currentStepIndex >= 0 && !isComplete && !error;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Rocket className={`h-5 w-5 ${isActivating ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} />
            <DialogTitle>
              {isComplete ? 'Journey Activated!' : isActivating ? 'Activating Journey...' : 'Journey Activation'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isComplete
              ? 'Your journey is now live and ready for execution.'
              : isActivating
              ? 'Please wait while we set up your journey infrastructure.'
              : 'Preparing to activate journey...'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold">{completedSteps} / {steps.length} steps</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStepIndex;
              const isPast = step.status === 'completed';
              const isError = step.status === 'error';

              return (
                <div
                  key={step.id}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg border transition-all
                    ${isActive ? 'border-primary bg-primary/5' : ''}
                    ${isPast ? 'border-green-200 bg-green-50/50' : ''}
                    ${isError ? 'border-red-200 bg-red-50/50' : ''}
                    ${!isActive && !isPast && !isError ? 'border-border bg-muted/30' : ''}
                  `}
                >
                  {/* Icon/Status */}
                  <div className="flex-shrink-0 mt-0.5">
                    {step.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {step.status === 'in_progress' && (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    )}
                    {step.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    {step.status === 'pending' && (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                        {step.label}
                      </p>
                      {isActive && (
                        <Badge variant="secondary" className="text-xs">
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Activation Failed</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Summary */}
          {isComplete && activationResult && (
            <div className="p-4 rounded-lg border border-green-200 bg-green-50">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">
                    Campaign ID: {activationResult.campaignId}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Sequences:</span>{' '}
                    <span className="font-semibold">{activationResult.sequenceCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Microsegments:</span>{' '}
                    <span className="font-semibold">{activationResult.microsegmentCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID Registry:</span>{' '}
                    <span className="font-semibold">{activationResult.idRegistryEntries.length}</span>
                  </div>
                </div>
                {activationResult.s3ExportPath && (
                  <div className="pt-2 border-t border-green-200">
                    <p className="text-xs text-muted-foreground">
                      S3 Export: <span className="font-mono">{activationResult.s3ExportPath}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {isComplete && (
            <Button onClick={handleClose}>
              Close
            </Button>
          )}
          {error && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={startActivation}>
                Retry
              </Button>
            </>
          )}
          {isActivating && (
            <Button disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Activating...
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
