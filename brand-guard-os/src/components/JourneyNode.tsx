import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import type { ContentAsset, JourneyNodeMetrics } from '@/types';
import type { WaitConfig, DecisionConfig } from './NodeConfigDialog';
import { Mail, Globe, Smartphone, Users, Clock, Play, GitBranch, TrendingUp, CheckCircle2, Share2, Split, Target, Zap, DollarSign, Search, Monitor, Newspaper, Tv, MapPin, UserX } from 'lucide-react';

interface JourneyNodeData {
  label: string;
  nodeType: 'entry' | 'email' | 'web' | 'mobile' | 'social' | 'paid-social' | 'paid-search' | 'paid-display' | 'print' | 'tv-radio' | 'ooh' | 'segment' | 'wait' | 'decision' | 'abtest' | 'attribution' | 'score' | 'suppression';
  contentAsset?: ContentAsset;
  viewMode?: 'design' | 'analytics';
  metrics?: JourneyNodeMetrics;
  waitConfig?: WaitConfig;
  decisionConfig?: DecisionConfig;
  sequence?: number;
}

interface JourneyNodeProps {
  data: JourneyNodeData;
  isConnectable: boolean;
}

const nodeTypeConfig = {
  entry: { icon: Play, color: 'bg-green-100 border-green-300 text-green-800' },
  email: { icon: Mail, color: 'bg-blue-100 border-blue-300 text-blue-800' },
  web: { icon: Globe, color: 'bg-purple-100 border-purple-300 text-purple-800' },
  mobile: { icon: Smartphone, color: 'bg-cyan-100 border-cyan-300 text-cyan-800' },
  social: { icon: Share2, color: 'bg-pink-100 border-pink-300 text-pink-800' },
  'paid-social': { icon: DollarSign, color: 'bg-lime-100 border-lime-300 text-lime-800' },
  'paid-search': { icon: Search, color: 'bg-lime-100 border-lime-300 text-lime-800' },
  'paid-display': { icon: Monitor, color: 'bg-lime-100 border-lime-300 text-lime-800' },
  'print': { icon: Newspaper, color: 'bg-slate-100 border-slate-300 text-slate-800' },
  'tv-radio': { icon: Tv, color: 'bg-red-100 border-red-300 text-red-800' },
  'ooh': { icon: MapPin, color: 'bg-teal-100 border-teal-300 text-teal-800' },
  segment: { icon: Users, color: 'bg-orange-100 border-orange-300 text-orange-800' },
  wait: { icon: Clock, color: 'bg-gray-100 border-gray-300 text-gray-800' },
  decision: { icon: GitBranch, color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  abtest: { icon: Split, color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
  attribution: { icon: Target, color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  score: { icon: Zap, color: 'bg-amber-100 border-amber-300 text-amber-800' },
  suppression: { icon: UserX, color: 'bg-rose-100 border-rose-300 text-rose-800' },
};

export function JourneyNode({ data, isConnectable }: JourneyNodeProps) {
  const config = nodeTypeConfig[data.nodeType];
  const Icon = config.icon;
  const isAnalyticsMode = data.viewMode === 'analytics';
  const metrics = data.metrics;

  // Calculate rates
  const openRate = metrics?.sent && metrics?.opened
    ? ((metrics.opened / metrics.sent) * 100).toFixed(1)
    : null;
  const clickRate = metrics?.sent && metrics?.clicked
    ? ((metrics.clicked / metrics.sent) * 100).toFixed(1)
    : null;
  const conversionRate = metrics?.entered && metrics?.converted
    ? ((metrics.converted / metrics.entered) * 100).toFixed(1)
    : null;

  // Format wait configuration
  const formatWaitConfig = (config?: WaitConfig): string => {
    if (!config) return 'Not configured';

    if (config.type === 'time') {
      return `${config.duration} ${config.durationUnit}`;
    } else if (config.type === 'event') {
      return config.event?.replace(/_/g, ' ') || 'event';
    } else if (config.type === 'time_or_event') {
      return `${config.duration} ${config.durationUnit} or ${config.event?.replace(/_/g, ' ')}`;
    }
    return 'Not configured';
  };

  // Format decision configuration
  const formatDecisionConfig = (config?: DecisionConfig): string => {
    if (!config) return 'Not configured';
    return config.criterion?.replace(/_/g, ' ') || 'criterion';
  };

  return (
    <div
      className={`relative px-4 py-3 rounded-lg border-2 min-w-[180px] group ${config.color} transition-all hover:shadow-md ${
        isAnalyticsMode && metrics ? 'min-w-[220px]' : ''
      }`}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        {data.sequence && (
          <Badge variant="outline" className="text-xs font-mono px-1 py-0">
            #{data.sequence}
          </Badge>
        )}
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium text-sm">{data.label}</span>
        {isAnalyticsMode && metrics && metrics.completed > 0 && (
          <CheckCircle2 className="h-3 w-3 ml-auto text-green-600" />
        )}
      </div>

      {/* Design Mode Content */}
      {!isAnalyticsMode && ['email', 'web', 'mobile', 'social', 'paid-social', 'paid-search', 'paid-display', 'print', 'tv-radio', 'ooh'].includes(data.nodeType) && (
        <div className="mt-2 space-y-1">
          {data.contentAsset ? (
            <>
              <Badge variant="secondary" className="text-xs font-mono">
                {data.contentAsset.id}
              </Badge>
              <p className="text-xs truncate">{data.contentAsset.title}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Drag content from library →
            </p>
          )}
        </div>
      )}

      {/* Wait Node Configuration */}
      {!isAnalyticsMode && data.nodeType === 'wait' && (
        <div className="mt-2">
          <p className="text-xs font-medium capitalize text-muted-foreground">
            {formatWaitConfig(data.waitConfig)}
          </p>
        </div>
      )}

      {/* Decision Node Configuration */}
      {!isAnalyticsMode && data.nodeType === 'decision' && (
        <div className="mt-2 space-y-1">
          <p className="text-xs font-medium capitalize">
            {formatDecisionConfig(data.decisionConfig)}
          </p>
          {data.decisionConfig?.paths && (
            <div className="text-xs text-muted-foreground">
              {data.decisionConfig.paths.length} paths
            </div>
          )}
        </div>
      )}

      {/* Analytics Mode Metrics */}
      {isAnalyticsMode && metrics && (
        <div className="mt-2 space-y-1.5">
          {/* Email/Web/Mobile/Paid media specific metrics */}
          {['email', 'web', 'mobile', 'paid-social', 'paid-search', 'paid-display', 'print', 'tv-radio', 'ooh'].includes(data.nodeType) && (
            <>
              {metrics.sent && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Sent</span>
                  <span className="font-semibold">{metrics.sent.toLocaleString()}</span>
                </div>
              )}
              {metrics.opened && openRate && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Opened</span>
                  <span className="font-semibold">
                    {metrics.opened.toLocaleString()} ({openRate}%)
                  </span>
                </div>
              )}
              {metrics.clicked && clickRate && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Clicked</span>
                  <span className="font-semibold">
                    {metrics.clicked.toLocaleString()} ({clickRate}%)
                  </span>
                </div>
              )}
              {metrics.converted && conversionRate && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Converted</span>
                  <span className="font-semibold text-green-600">
                    {metrics.converted.toLocaleString()} ({conversionRate}%)
                  </span>
                </div>
              )}
            </>
          )}

          {/* Wait node metrics */}
          {data.nodeType === 'wait' && metrics.averageTimeSpent && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Wait</span>
              <span className="font-semibold">
                {Math.floor(metrics.averageTimeSpent / 3600)}h
              </span>
            </div>
          )}

          {/* General progression metrics */}
          {metrics.inProgress > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">In Progress</span>
              <span className="font-semibold text-blue-600">
                {metrics.inProgress.toLocaleString()}
              </span>
            </div>
          )}

          {/* Content tracking key in analytics mode */}
          {data.contentAsset && data.sequence && (
            <div className="pt-1.5 mt-1.5 border-t space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">Tracking Key:</p>
              <Badge variant="secondary" className="text-xs font-mono px-1.5 py-0.5">
                SEQ-{data.sequence}/{data.contentAsset.id}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Right Handle(s) - Multiple for decision nodes */}
      {data.nodeType === 'decision' && data.decisionConfig?.paths ? (
        // Multiple outputs for decision paths
        data.decisionConfig.paths.map((path, idx) => (
          <Handle
            key={`path-${idx}`}
            type="source"
            position={Position.Right}
            id={`path-${idx}`}
            isConnectable={isConnectable}
            style={{
              top: `${(100 / (data.decisionConfig!.paths.length + 1)) * (idx + 1)}%`,
            }}
            className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white opacity-100"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {path.label}
            </div>
          </Handle>
        ))
      ) : (
        // Single output for non-decision nodes
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          isConnectable={isConnectable}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
