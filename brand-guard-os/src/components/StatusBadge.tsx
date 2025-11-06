import { Badge } from '@/components/ui/badge';
import { CampaignStatus, ClaimStatus, MLRStatus } from '@/types';
import { cn } from '@/lib/utils';

type Status = CampaignStatus | ClaimStatus | MLRStatus;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  // Campaign statuses
  DRAFT: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  READY: { label: 'Ready', className: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
  PAUSED: { label: 'Paused', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  ARCHIVED: { label: 'Archived', className: 'bg-gray-100 text-gray-800 border-gray-200' },

  // Claim statuses
  UNDER_REVIEW: { label: 'Under Review', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-800 border-green-200' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
  RETIRED: { label: 'Retired', className: 'bg-gray-100 text-gray-800 border-gray-200' },

  // MLR statuses
  SUBMITTED: { label: 'Submitted', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  IN_REVIEW: { label: 'In Review', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  CHANGES_REQUESTED: { label: 'Changes Requested', className: 'bg-orange-100 text-orange-800 border-orange-200' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
