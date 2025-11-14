import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Database, GitBranch, FileText, Users } from 'lucide-react';
import type { IDRegistryEntry, Microsegment } from '@/types';
import { useState } from 'react';

interface IDHierarchyTreeProps {
  idRegistry: IDRegistryEntry[];
  microsegments: Microsegment[];
  selectedEntry: IDRegistryEntry | null;
  onSelectEntry: (entry: IDRegistryEntry) => void;
}

export function IDHierarchyTree({ idRegistry, microsegments, selectedEntry, onSelectEntry }: IDHierarchyTreeProps) {
  // Track which nodes are expanded
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['campaign', 'seq-1', 'seq-3', 'seq-5']));

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Get campaign entry
  const campaignEntry = idRegistry.find((e) => e.type === 'CAMPAIGN');
  if (!campaignEntry) return null;

  // Group entries by sequence
  const sequenceEntries = idRegistry.filter((e) => e.type === 'SEQUENCE');

  // Build hierarchy: sequence -> content -> microsegments
  const hierarchy: Record<
    number,
    {
      sequence: IDRegistryEntry;
      contents: Record<
        string,
        {
          content: IDRegistryEntry;
          microsegments: IDRegistryEntry[];
        }
      >;
    }
  > = {};

  sequenceEntries.forEach((seq) => {
    if (seq.sequenceNumber) {
      hierarchy[seq.sequenceNumber] = {
        sequence: seq,
        contents: {},
      };
    }
  });

  // Add content and microsegment entries
  idRegistry
    .filter((e) => e.type === 'CONTENT')
    .forEach((content) => {
      const seqNum = content.sequenceNumber;
      if (seqNum && hierarchy[seqNum]) {
        const contentId = content.contentId || 'unknown';
        if (!hierarchy[seqNum].contents[contentId]) {
          hierarchy[seqNum].contents[contentId] = {
            content,
            microsegments: [],
          };
        }

        // If this content entry has a microsegmentId, it's the composite key entry
        if (content.microsegmentId) {
          hierarchy[seqNum].contents[contentId].microsegments.push(content);
        }
      }
    });

  // Sort sequences
  const sortedSequences = Object.keys(hierarchy)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-2">
      {/* Campaign Level */}
      <div
        className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
          selectedEntry?.id === campaignEntry.id
            ? 'border-primary bg-primary/5'
            : 'border-muted hover:border-primary/50'
        }`}
        onClick={() => onSelectEntry(campaignEntry)}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode('campaign');
            }}
          >
            {expandedNodes.has('campaign') ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <Database className="h-4 w-4 text-blue-600" />
          <Badge variant="outline" className="font-mono">Campaign ID</Badge>
        </div>
        <div className="ml-6">
          <p className="font-mono text-sm font-semibold">{campaignEntry.campaignId}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Minted: {campaignEntry.mintedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sequences */}
      {expandedNodes.has('campaign') && (
        <div className="ml-6 space-y-2 border-l-2 border-muted pl-4">
          {sortedSequences.map((seqNum) => {
            const { sequence, contents } = hierarchy[seqNum];
            const nodeId = `seq-${seqNum}`;
            const isExpanded = expandedNodes.has(nodeId);

            return (
              <div key={sequence.id}>
                {/* Sequence Level */}
                <div
                  className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                    selectedEntry?.id === sequence.id
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => onSelectEntry(sequence)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNode(nodeId);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <GitBranch className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="font-mono">SEQ-{seqNum}</Badge>
                  </div>
                  <div className="ml-6">
                    <p className="text-xs text-muted-foreground">
                      {Object.keys(contents).length} content asset(s)
                    </p>
                  </div>
                </div>

                {/* Content Level */}
                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-2 border-l-2 border-muted pl-4">
                    {Object.entries(contents).map(([contentId, { content, microsegments: msEntries }]) => {
                      const contentNodeId = `content-${seqNum}-${contentId}`;
                      const isContentExpanded = expandedNodes.has(contentNodeId);

                      return (
                        <div key={content.id}>
                          {/* Content Level */}
                          <div
                            className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                              selectedEntry?.id === content.id
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => onSelectEntry(content)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNode(contentNodeId);
                                }}
                              >
                                {isContentExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <FileText className="h-4 w-4 text-purple-600" />
                              <Badge variant="outline" className="font-mono text-xs">{contentId}</Badge>
                            </div>
                            <div className="ml-6">
                              <p className="text-xs text-muted-foreground">
                                {msEntries.length} microsegment(s)
                              </p>
                            </div>
                          </div>

                          {/* Microsegment Level (Composite Keys) */}
                          {isContentExpanded && (
                            <div className="ml-6 mt-2 space-y-2 border-l-2 border-muted pl-4">
                              {msEntries.map((msEntry) => {
                                const mseg = microsegments.find((m) => m.id === msEntry.microsegmentId);

                                return (
                                  <div
                                    key={msEntry.id}
                                    className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                                      selectedEntry?.id === msEntry.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted hover:border-primary/50'
                                    }`}
                                    onClick={() => onSelectEntry(msEntry)}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <Users className="h-4 w-4 text-amber-600" />
                                      <Badge variant="secondary" className="text-xs">{msEntry.microsegmentId}</Badge>
                                    </div>
                                    <div className="ml-6">
                                      <p className="text-xs font-semibold mb-1">{mseg?.name || 'Unknown Segment'}</p>
                                      <p className="text-xs text-muted-foreground font-mono break-all bg-muted/50 p-2 rounded">
                                        {msEntry.compositeKey}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
