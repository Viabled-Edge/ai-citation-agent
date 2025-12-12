import Link from 'next/link';
import { loadLatestAudit, loadAllAudits, hasAudits } from '@/lib/audit-loader';
import { formatDate } from '@/lib/utils';
import TrustNodeRadar from '@/components/charts/TrustNodeRadar';
import CitationQualityBars from '@/components/charts/CitationQualityBars';
import LLMRankingsTable from '@/components/charts/LLMRankingsTable';
import PriorityTimeline from '@/components/charts/PriorityTimeline';
import PrintButton from '@/components/PrintButton';
import AuditNavigation from '@/components/AuditNavigation';

export default function Home() {
  if (!hasAudits()) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="font-display text-3xl text-gray-900 mb-3">
            No Audits Found
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            Run an AI visibility audit to generate your first report and start tracking your brand's presence across AI platforms.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl mx-auto text-left shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">?</span>
              Getting Started
            </h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">1</span>
                <span>Navigate to the project root directory</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">2</span>
                <span>Run: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-xs">/agents:audit-citations</code></span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">3</span>
                <span>Provide brand name and category when prompted</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">4</span>
                <span>Wait ~8-10 minutes for the complete audit</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">5</span>
                <span>Refresh this dashboard to see results</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const audit = loadLatestAudit();
  const allAudits = loadAllAudits();

  if (!audit) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-gray-900 mb-2">Error Loading Audit</h2>
          <p className="text-gray-500">
            Unable to parse the audit report. Please check the markdown format.
          </p>
        </div>
      </div>
    );
  }

  const { metadata, executiveSummary, trustNodeCoverage, citationQuality, llmRankings, priorities } = audit;

  // Determine score color class
  const getScoreGrade = (score: number) => {
    if (score >= 8) return { grade: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 6) return { grade: 'B', color: 'text-teal-600', bg: 'bg-teal-50' };
    if (score >= 4) return { grade: 'C', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const scoreInfo = getScoreGrade(executiveSummary.overallScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block mb-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Visibility Audit Report</h1>
            <p className="text-sm text-gray-500">Generated by aiclicks.io methodology</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>{formatDate(metadata.date)}</p>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Brand Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 print:hidden">
              <PrintButton />
              <AuditNavigation currentSlug={metadata.slug} allAudits={allAudits} />
              <Link
                href="/details"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                View Full Details
              </Link>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl text-gray-900 tracking-tight mb-2">
              {metadata.brand}
            </h1>
            <p className="text-lg text-gray-500 mb-3">{metadata.category}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(metadata.date)}
              </span>
            </div>
          </div>

          {/* Overall Score */}
          <div className="hero-score lg:w-80 print-avoid-break">
            <div className="relative z-10">
              <p className="text-teal-100 text-sm font-medium uppercase tracking-wider mb-1">Overall AI Visibility Score</p>
              <div className="flex items-baseline gap-2">
                <span className="hero-score-value">{executiveSummary.overallScore.toFixed(1)}</span>
                <span className="text-2xl text-white/60">/10</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${executiveSummary.overallScore * 10}%` }}
                  />
                </div>
                <span className="text-sm text-white/80 font-medium">{Math.round(executiveSummary.overallScore * 10)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card p-6 mb-8 animate-fade-in-up stagger-1 print-avoid-break">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl ${scoreInfo.bg} flex items-center justify-center shrink-0`}>
            <span className={`text-lg font-bold ${scoreInfo.color}`}>{scoreInfo.grade}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {executiveSummary.bottomLine}
            </p>
            {executiveSummary.keyFindings.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Findings</h3>
                <ul className="space-y-2">
                  {executiveSummary.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-2">
        <MetricCard
          label="Trust Nodes"
          value={`${trustNodeCoverage.overall.coverage}/${trustNodeCoverage.overall.total}`}
          percentage={trustNodeCoverage.overall.percentage}
          trend={trustNodeCoverage.overall.percentage >= 70 ? 'good' : trustNodeCoverage.overall.percentage >= 40 ? 'warning' : 'critical'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
        />
        <MetricCard
          label="Citation Quality"
          value={`${citationQuality.average.toFixed(1)}/10`}
          percentage={citationQuality.average * 10}
          trend={citationQuality.average >= 7 ? 'good' : citationQuality.average >= 5 ? 'warning' : 'critical'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          label="AI Citation Rate"
          value={`${llmRankings.aiCitationRate}%`}
          percentage={llmRankings.aiCitationRate}
          trend={llmRankings.aiCitationRate >= 66 ? 'good' : llmRankings.aiCitationRate >= 33 ? 'warning' : 'critical'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <MetricCard
          label="Platforms"
          value={`${llmRankings.platforms.filter(p => p.cited).length}/${llmRankings.platforms.length}`}
          percentage={(llmRankings.platforms.filter(p => p.cited).length / llmRankings.platforms.length) * 100}
          trend={llmRankings.platforms.filter(p => p.cited).length === llmRankings.platforms.length ? 'good' : llmRankings.platforms.filter(p => p.cited).length >= 2 ? 'warning' : 'critical'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trust Node Radar */}
        <div className="card p-6 animate-fade-in-up stagger-3 chart-container print-avoid-break">
          <TrustNodeRadar data={trustNodeCoverage} />
        </div>

        {/* Citation Quality Bars */}
        <div className="card p-6 animate-fade-in-up stagger-4 chart-container print-avoid-break">
          <CitationQualityBars data={citationQuality} />
        </div>
      </div>

      {/* LLM Rankings - Full Width */}
      <div className="card p-6 mb-8 animate-fade-in-up stagger-5 print-section">
        <LLMRankingsTable data={llmRankings} />
      </div>

      {/* Priorities Timeline - Full Width */}
      <div className="card p-6 animate-fade-in-up print-break-before">
        <PriorityTimeline data={priorities} />
      </div>

      {/* Print Footer */}
      <div className="hidden print:block print-footer">
        <div className="flex justify-between items-center">
          <span>AI Visibility Dashboard • {metadata.brand}</span>
          <span>aiclicks.io</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  percentage,
  trend,
  icon,
}: {
  label: string;
  value: string;
  percentage: number;
  trend: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}) {
  const trendColors = {
    good: {
      icon: 'text-emerald-600 bg-emerald-50',
      bar: 'bg-emerald-500',
      text: 'text-emerald-600',
    },
    warning: {
      icon: 'text-amber-600 bg-amber-50',
      bar: 'bg-amber-500',
      text: 'text-amber-600',
    },
    critical: {
      icon: 'text-red-600 bg-red-50',
      bar: 'bg-red-500',
      text: 'text-red-600',
    },
  };

  const colors = trendColors[trend];

  return (
    <div className="metric-card print-avoid-break">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${colors.icon} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${colors.text} font-mono`}>{value}</p>
      <div className="progress-bar mt-3">
        <div
          className={`progress-bar-fill ${colors.bar}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration) - rebuild every 60 seconds
export const revalidate = 60;
