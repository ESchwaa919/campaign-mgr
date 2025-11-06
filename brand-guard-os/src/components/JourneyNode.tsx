import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import type { ContentAsset } from '@/types';
import { Mail, Globe, Smartphone, Users, Clock, Play, GitBranch } from 'lucide-react';

interface JourneyNodeData {
  label: string;
  nodeType: 'entry' | 'email' | 'web' | 'mobile' | 'segment' | 'wait' | 'decision';
  contentAsset?: ContentAsset;
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
  segment: { icon: Users, color: 'bg-orange-100 border-orange-300 text-orange-800' },
  wait: { icon: Clock, color: 'bg-gray-100 border-gray-300 text-gray-800' },
  decision: { icon: GitBranch, color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
};

export function JourneyNode({ data, isConnectable }: JourneyNodeProps) {
  const config = nodeTypeConfig[data.nodeType];
  const Icon = config.icon;

  return (
    <div
      className={`relative px-4 py-3 rounded-lg border-2 min-w-[180px] group ${config.color} transition-all hover:shadow-md`}
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

      {/* Content */}
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      {/* Content Asset Badge */}
      {data.contentAsset && (
        <div className="mt-2 space-y-1">
          <Badge variant="secondary" className="text-xs font-mono">
            {data.contentAsset.id}
          </Badge>
          <p className="text-xs truncate">{data.contentAsset.title}</p>
        </div>
      )}

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
      />

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
