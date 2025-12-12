'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TrustNode {
  category: string;
  name: string;
  present: boolean;
  qualityScore: number | null;
  url: string | null;
  notes: string;
}

interface Citation {
  sourceUrl: string;
  sourceName: string;
  sourceDomain: string;
  sourceType: string;
  authorityScore: number;
  dataStructureScore: number;
  brandAlignmentScore: number;
  freshnessScore: number;
  crossLinkScore: number;
  compositeScore: number;
  citedByPerplexity: boolean;
  citedByChatGPT: boolean;
  citedByGemini: boolean;
  strengths: string[];
  weaknesses: string[];
  notes: string;
}

interface LLMResponse {
  platform: string;
  queryType: string;
  queryText: string;
  brandMentioned: boolean;
  brandPosition: number | null;
  brandDescription: string | null;
  competitorsMentioned: string[];
  citationsFound: string[];
  responseSummary: string;
  sentiment: string;
  specialNote?: string;
}

interface CausalChain {
  step1: string;
  step2: string;
  step3: string;
  insight: string;
}

interface AuditData {
  metadata: {
    brand: string;
    category: string;
    date: string;
    website?: string;
  };
  summary: {
    overallScore: number;
    trustNodeCoverage: number;
    trustNodeTotal: number;
    trustNodePercentage: number;
    citationQuality: number;
    aiCitationRate: number;
  };
  trustNodes: {
    nodes: TrustNode[];
    categories: { name: string; coverage: number; total: number; status: string }[];
  };
  citationQuality: {
    overall: number;
    dimensions: Record<string, number>;
    citations: Citation[];
  };
  llmResponses: LLMResponse[];
  causalChain?: {
    explanation: string;
    chains: CausalChain[];
  };
  companyInfo?: {
    founded: string;
    founder: string;
    headquarters: string;
    additionalOffices: string[];
    companySize: string;
    industry: string;
    specialization: string;
  };
  reauditSchedule?: {
    nextAuditDate: string;
    frequency: string;
    milestones: string[];
  };
  gaps?: {
    critical: string[];
    impact: string;
  };
}

export default function DetailsPage() {
  const [data, setData] = useState<AuditData | null>(null);
  const [activeTab, setActiveTab] = useState<'trust-nodes' | 'citations' | 'llm-responses' | 'analysis'>('trust-nodes');

  useEffect(() => {
    fetch('/data/audit-data.json')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error('Error loading audit data:', err));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading detailed audit data...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'trust-nodes', label: 'Trust Nodes', count: data.trustNodes.nodes?.length || 0 },
    { id: 'citations', label: 'Citations', count: data.citationQuality.citations?.length || 0 },
    { id: 'llm-responses', label: 'LLM Responses', count: data.llmResponses?.length || 0 },
    { id: 'analysis', label: 'Analysis & Next Steps', count: null },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Summary
            </Link>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl text-gray-900 tracking-tight mb-2">
            {data.metadata.brand} - Full Audit Details
          </h1>
          <p className="text-gray-500">{data.metadata.category} | {data.metadata.date}</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'trust-nodes' && <TrustNodesTab nodes={data.trustNodes.nodes || []} categories={data.trustNodes.categories} />}
        {activeTab === 'citations' && <CitationsTab citations={data.citationQuality.citations || []} dimensions={data.citationQuality.dimensions} />}
        {activeTab === 'llm-responses' && <LLMResponsesTab responses={data.llmResponses || []} />}
        {activeTab === 'analysis' && (
          <AnalysisTab
            causalChain={data.causalChain}
            companyInfo={data.companyInfo}
            reauditSchedule={data.reauditSchedule}
            gaps={data.gaps}
          />
        )}
      </div>
    </div>
  );
}

function TrustNodesTab({ nodes, categories }: { nodes: TrustNode[]; categories: { name: string; coverage: number; total: number; status: string }[] }) {
  const groupedNodes = nodes.reduce((acc, node) => {
    const cat = node.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(node);
    return acc;
  }, {} as Record<string, TrustNode[]>);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{cat.name}</div>
            <div className="text-2xl font-bold text-gray-900">{cat.coverage}/{cat.total}</div>
            <div className={`text-xs mt-1 ${
              cat.status === 'Critical' ? 'text-red-600' :
              cat.status === 'Weak' ? 'text-amber-600' :
              cat.status === 'Good' ? 'text-emerald-600' : 'text-gray-500'
            }`}>
              {cat.status}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed List */}
      {Object.entries(groupedNodes).map(([category, categoryNodes]) => (
        <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{category}</h3>
            <p className="text-sm text-gray-500">
              {categoryNodes.filter(n => n.present).length} of {categoryNodes.length} nodes present
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {categoryNodes.map((node, idx) => (
              <div key={idx} className="px-6 py-4 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  node.present ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {node.present ? (
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{node.name}</span>
                    {node.qualityScore && (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                        {node.qualityScore}/10
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{node.notes}</p>
                  {node.url && (
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:text-teal-700 mt-2 inline-flex items-center gap-1"
                    >
                      {node.url.substring(0, 50)}...
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CitationsTab({ citations, dimensions }: { citations: Citation[]; dimensions: Record<string, number> }) {
  const dimensionLabels: Record<string, string> = {
    authority: 'Authority',
    dataStructure: 'Data Structure',
    brandAlignment: 'Brand Alignment',
    freshness: 'Freshness',
    crossLinks: 'Cross-Links',
  };

  return (
    <div className="space-y-8">
      {/* Dimension Averages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Dimension Averages</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(dimensions).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{dimensionLabels[key] || key}</div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    value >= 7 ? 'bg-emerald-500' : value >= 5 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Citations */}
      <div className="space-y-4">
        {citations.map((citation, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{citation.sourceName}</h3>
                <p className="text-sm text-gray-500">{citation.sourceDomain} | {citation.sourceType}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                citation.compositeScore >= 7 ? 'bg-emerald-100 text-emerald-700' :
                citation.compositeScore >= 5 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {citation.compositeScore.toFixed(1)}/10
              </div>
            </div>
            <div className="p-6">
              {/* Score Grid */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                {[
                  { label: 'Authority', score: citation.authorityScore },
                  { label: 'Data Structure', score: citation.dataStructureScore },
                  { label: 'Brand Align', score: citation.brandAlignmentScore },
                  { label: 'Freshness', score: citation.freshnessScore },
                  { label: 'Cross-Links', score: citation.crossLinkScore },
                ].map((dim) => (
                  <div key={dim.label} className="text-center">
                    <div className={`text-lg font-bold ${
                      dim.score >= 7 ? 'text-emerald-600' : dim.score >= 5 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {dim.score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">{dim.label}</div>
                  </div>
                ))}
              </div>

              {/* LLM Citations */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">Cited by:</span>
                <span className={`px-2 py-1 text-xs rounded ${citation.citedByPerplexity ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                  Perplexity {citation.citedByPerplexity ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${citation.citedByChatGPT ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  ChatGPT {citation.citedByChatGPT ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${citation.citedByGemini ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                  Gemini {citation.citedByGemini ? '✓' : '✗'}
                </span>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {citation.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Weaknesses</h4>
                  <ul className="space-y-1">
                    {citation.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">-</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* URL */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={citation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                >
                  {citation.sourceUrl}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LLMResponsesTab({ responses }: { responses: LLMResponse[] }) {
  const platformColors: Record<string, string> = {
    Perplexity: 'bg-blue-100 text-blue-700 border-blue-200',
    ChatGPT: 'bg-green-100 text-green-700 border-green-200',
    Gemini: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const sentimentColors: Record<string, string> = {
    positive: 'bg-emerald-100 text-emerald-700',
    neutral: 'bg-gray-100 text-gray-700',
    negative: 'bg-red-100 text-red-700',
    not_mentioned: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6">
      {responses.map((response, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${platformColors[response.platform]}`}>
                  {response.platform}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {response.queryType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {response.brandMentioned ? (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    Mentioned {response.brandPosition ? `#${response.brandPosition}` : ''}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    Not Mentioned
                  </span>
                )}
                <span className={`px-2 py-1 text-xs rounded-full ${sentimentColors[response.sentiment]}`}>
                  {response.sentiment.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Query */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Query</h4>
              <p className="text-gray-900 font-mono text-sm bg-gray-50 p-3 rounded-lg">
                "{response.queryText}"
              </p>
            </div>

            {/* Brand Description */}
            {response.brandDescription && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">How Brand Was Described</h4>
                <p className="text-gray-700 italic">"{response.brandDescription}"</p>
              </div>
            )}

            {/* Special Note */}
            {response.specialNote && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-amber-800">{response.specialNote}</p>
                </div>
              </div>
            )}

            {/* Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Response Summary</h4>
              <p className="text-gray-700">{response.responseSummary}</p>
            </div>

            {/* Competitors */}
            {response.competitorsMentioned.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Competitors Mentioned</h4>
                <div className="flex flex-wrap gap-2">
                  {response.competitorsMentioned.map((comp, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Citations */}
            {response.citationsFound.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Citations Found ({response.citationsFound.length})</h4>
                <ul className="space-y-1">
                  {response.citationsFound.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 truncate max-w-full"
                      >
                        {url}
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalysisTab({
  causalChain,
  companyInfo,
  reauditSchedule,
  gaps,
}: {
  causalChain?: { explanation: string; chains: CausalChain[] };
  companyInfo?: {
    founded: string;
    founder: string;
    headquarters: string;
    additionalOffices: string[];
    companySize: string;
    industry: string;
    specialization: string;
  };
  reauditSchedule?: { nextAuditDate: string; frequency: string; milestones: string[] };
  gaps?: { critical: string[]; impact: string };
}) {
  return (
    <div className="space-y-8">
      {/* Causal Chain Analysis */}
      {causalChain && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">The Connection: How All Steps Link</h3>
            <p className="text-sm text-gray-600">{causalChain.explanation}</p>
          </div>
          <div className="p-6 space-y-6">
            {causalChain.chains.map((chain, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-xs text-red-600 font-medium mb-1">Step 1</div>
                    <div className="text-sm text-red-800">{chain.step1}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center relative">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="text-xs text-amber-600 font-medium mb-1">Step 2</div>
                    <div className="text-sm text-amber-800">{chain.step2}</div>
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center relative">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Step 3</div>
                    <div className="text-sm text-gray-800">{chain.step3}</div>
                  </div>
                </div>
              </div>
            ))}
            {causalChain.chains.map((chain, idx) => (
              <div key={`insight-${idx}`} className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-teal-800"><strong>Insight:</strong> {chain.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Gaps */}
      {gaps && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Critical Gaps</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3 mb-4">
              {gaps.critical.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{gap}</span>
                </li>
              ))}
            </ul>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800"><strong>Impact:</strong> {gaps.impact}</p>
            </div>
          </div>
        </div>
      )}

      {/* Company Info */}
      {companyInfo && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Company Information</h3>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Founded</dt>
                <dd className="text-gray-900 font-medium">{companyInfo.founded}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Founder</dt>
                <dd className="text-gray-900 font-medium">{companyInfo.founder}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Headquarters</dt>
                <dd className="text-gray-900 font-medium">{companyInfo.headquarters}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Company Size</dt>
                <dd className="text-gray-900 font-medium">{companyInfo.companySize}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Industry</dt>
                <dd className="text-gray-900 font-medium">{companyInfo.industry}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Specialization</dt>
                <dd className="text-gray-900 font-medium">{companyInfo.specialization}</dd>
              </div>
            </dl>
            {companyInfo.additionalOffices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <dt className="text-xs text-gray-500 uppercase tracking-wider mb-2">Additional Offices</dt>
                <div className="flex flex-wrap gap-2">
                  {companyInfo.additionalOffices.map((office, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      {office}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Re-audit Schedule */}
      {reauditSchedule && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Re-Audit Schedule</h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-1">{reauditSchedule.nextAuditDate}</div>
                <div className="text-sm text-gray-500">Next Audit Date</div>
                <div className="text-sm text-gray-500 mt-1">Frequency: {reauditSchedule.frequency}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Milestones to Achieve</h4>
                <ul className="space-y-2">
                  {reauditSchedule.milestones.map((milestone, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
