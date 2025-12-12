'use client';

import type { Priorities } from '@/lib/parser/types';

interface PriorityTimelineProps {
  data: Priorities;
}

export default function PriorityTimeline({ data }: PriorityTimelineProps) {
  const allPriorities = [
    ...data.immediate,
    ...data.strategic,
    ...data.longTerm,
  ];

  return (
    <div className="card p-6 print-avoid-break">
      <div className="section-header">
        <h3 className="section-title">Strategic Priorities</h3>
        <div className="badge badge-neutral">
          {allPriorities.length} actions
        </div>
      </div>

      {/* Priority Sections */}
      <div className="space-y-8">
        {/* Immediate Priorities */}
        {data.immediate.length > 0 && (
          <div className="print-avoid-break">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-semibold text-primary">Immediate</span>
              <span className="text-xs text-muted uppercase tracking-wider">This Month</span>
            </div>
            <div className="space-y-3 ml-6 border-l-2 border-red-200 pl-4">
              {data.immediate.map((priority, index) => (
                <PriorityCard key={index} priority={priority} type="immediate" />
              ))}
            </div>
          </div>
        )}

        {/* Strategic Initiatives */}
        {data.strategic.length > 0 && (
          <div className="print-avoid-break">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="font-semibold text-primary">Strategic</span>
              <span className="text-xs text-muted uppercase tracking-wider">This Quarter</span>
            </div>
            <div className="space-y-3 ml-6 border-l-2 border-amber-200 pl-4">
              {data.strategic.map((priority, index) => (
                <PriorityCard key={index} priority={priority} type="strategic" />
              ))}
            </div>
          </div>
        )}

        {/* Long-term Vision */}
        {data.longTerm.length > 0 && (
          <div className="print-avoid-break">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-semibold text-primary">Long-term</span>
              <span className="text-xs text-muted uppercase tracking-wider">6-12 Months</span>
            </div>
            <div className="space-y-3 ml-6 border-l-2 border-emerald-200 pl-4">
              {data.longTerm.map((priority, index) => (
                <PriorityCard key={index} priority={priority} type="longterm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PriorityCard({ priority, type }: { priority: any; type: 'immediate' | 'strategic' | 'longterm' }) {
  const getImpactBadge = (impact: string) => {
    const impactLower = impact?.toLowerCase() || '';
    if (impactLower.includes('high') || impactLower.includes('critical')) {
      return 'badge-danger';
    }
    if (impactLower.includes('medium') || impactLower.includes('moderate')) {
      return 'badge-warning';
    }
    return 'badge-success';
  };

  return (
    <div className={`priority-card ${type}`}>
      <h4 className="font-semibold text-primary mb-2">{priority.title}</h4>

      {priority.currentStatus && (
        <p className="text-sm text-muted mb-2">
          <span className="font-medium text-secondary">Current:</span> {priority.currentStatus}
        </p>
      )}

      <p className="text-sm text-secondary mb-3">{priority.action}</p>

      <div className="flex flex-wrap gap-2">
        {priority.impact && (
          <span className={`badge ${getImpactBadge(priority.impact)}`}>
            {priority.impact} Impact
          </span>
        )}

        {priority.timeline && (
          <span className="badge badge-neutral">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {priority.timeline}
          </span>
        )}
      </div>

      {priority.successMetric && (
        <p className="text-xs text-muted mt-3 pt-3 border-t border-black/[0.04]">
          <span className="font-medium">Success Metric:</span> {priority.successMetric}
        </p>
      )}
    </div>
  );
}
