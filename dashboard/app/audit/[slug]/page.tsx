import { notFound } from 'next/navigation';
import { loadAllAudits, loadAuditBySlug } from '@/lib/audit-loader';
import { formatDate } from '@/lib/utils';
import TrustNodeRadar from '@/components/charts/TrustNodeRadar';
import CitationQualityBars from '@/components/charts/CitationQualityBars';
import LLMRankingsTable from '@/components/charts/LLMRankingsTable';
import PriorityTimeline from '@/components/charts/PriorityTimeline';
import AuditNavigation from '@/components/AuditNavigation';
import PrintButton from '@/components/PrintButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const audits = loadAllAudits();
  return audits.map((audit) => ({
    slug: audit.metadata.slug,
  }));
}

export default async function AuditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audit = loadAuditBySlug(slug);

  if (!audit) {
    notFound();
  }

  const allAudits = loadAllAudits();
  const { metadata, executiveSummary, trustNodeCoverage, citationQuality, llmRankings, priorities } = audit;

  // Calculate best position
  const bestPosition = llmRankings.platforms
    .filter((p) => p.position !== null)
    .sort((a, b) => (a.position || 99) - (b.position || 99))[0];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Brand Info */}
            <div className="flex-1">
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
              <div className="flex items-center gap-3 mt-4 print:hidden">
                <PrintButton />
                <AuditNavigation currentSlug={slug} allAudits={allAudits} />
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
                      className="h-full bg-white/80 rounded-full transition-all duration-500"
                      style={{ width: `${executiveSummary.overallScore * 10}%` }}
                    />
                  </div>
                  <span className="text-sm text-white/80">{Math.round(executiveSummary.overallScore * 10)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="card p-6 mb-8 animate-fade-in-up stagger-1 print-avoid-break">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-display text-lg shrink-0">
              D
            </div>
            <div className="flex-1">
              <h2 className="section-title mb-3">Executive Summary</h2>
              <p className="text-secondary leading-relaxed mb-4">
                {executiveSummary.bottomLine}
              </p>
              <div className="pt-4 border-t border-black/[0.06]">
                <h3 className="text-sm font-semibold text-primary mb-3">Key Findings</h3>
                <ul className="space-y-2">
                  {executiveSummary.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-secondary">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-2">
          <div className="metric-card">
            <p className="text-sm font-medium text-muted mb-1">Trust Node Coverage</p>
            <p className="text-2xl font-semibold text-primary font-display">
              {trustNodeCoverage.overall.coverage}/{trustNodeCoverage.overall.total}
            </p>
            <p className="text-xs text-muted mt-1">{trustNodeCoverage.overall.percentage}% complete</p>
          </div>

          <div className="metric-card">
            <p className="text-sm font-medium text-muted mb-1">Citation Quality</p>
            <p className="text-2xl font-semibold text-primary font-display">
              {citationQuality.average.toFixed(1)}<span className="text-lg text-muted">/10</span>
            </p>
            <p className="text-xs text-muted mt-1">{citationQuality.distribution.highQuality.count} high-quality</p>
          </div>

          <div className="metric-card">
            <p className="text-sm font-medium text-muted mb-1">AI Citation Rate</p>
            <p className="text-2xl font-semibold text-primary font-display">{llmRankings.aiCitationRate}%</p>
            <p className="text-xs text-muted mt-1">{llmRankings.platforms.filter((p) => p.cited).length} of 3 platforms</p>
          </div>

          <div className="metric-card">
            <p className="text-sm font-medium text-muted mb-1">Best Position</p>
            <p className="text-2xl font-semibold text-primary font-display">
              {bestPosition?.position ? `#${bestPosition.position}` : 'N/A'}
            </p>
            <p className="text-xs text-muted mt-1">{bestPosition?.platform || 'None'}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up stagger-3">
          <TrustNodeRadar data={trustNodeCoverage} />
          <CitationQualityBars data={citationQuality} />
        </div>

        {/* LLM Rankings */}
        <div className="mb-8 animate-fade-in-up stagger-4">
          <LLMRankingsTable data={llmRankings} />
        </div>

        {/* Priority Timeline */}
        <div className="animate-fade-in-up stagger-5">
          <PriorityTimeline data={priorities} />
        </div>
      </div>
    </div>
  );
}
