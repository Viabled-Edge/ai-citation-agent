'use client';

import type { LLMRankings } from '@/lib/parser/types';

interface LLMRankingsTableProps {
  data: LLMRankings;
}

export default function LLMRankingsTable({ data }: LLMRankingsTableProps) {
  return (
    <div className="card p-6 print-avoid-break">
      <div className="section-header">
        <h3 className="section-title">LLM Platform Rankings</h3>
        <div className="text-right">
          <p className="score-display-sm text-teal-600">
            {data.aiCitationRate}%
          </p>
          <p className="text-sm text-muted font-medium">AI Citation Rate</p>
        </div>
      </div>

      {/* Platform Results */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th className="text-center">Cited?</th>
              <th className="text-center">Position</th>
              <th className="text-center">Citations</th>
            </tr>
          </thead>
          <tbody>
            {data.platforms.map((platform, index) => (
              <tr key={`${platform.platform}-${index}`}>
                <td className="font-medium text-primary">
                  {platform.platform}
                </td>
                <td className="text-center">
                  {platform.cited ? (
                    <span className="badge badge-success">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Yes
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      No
                    </span>
                  )}
                </td>
                <td className="text-center">
                  {platform.position ? (
                    <span className="font-semibold text-teal-600">
                      #{platform.position}
                    </span>
                  ) : (
                    <span className="text-muted">{platform.positionText}</span>
                  )}
                </td>
                <td className="text-center font-medium">
                  {platform.citationsFound}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitive Rankings */}
      {data.competitors.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Competitive Rankings
          </h4>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Competitor</th>
                  <th className="text-center">Perplexity</th>
                  <th className="text-center">ChatGPT</th>
                  <th className="text-center">Gemini</th>
                  <th className="text-center">Avg</th>
                </tr>
              </thead>
              <tbody>
                {data.competitors.map((competitor, index) => {
                  const isBrand = competitor.name.includes('**') || index === data.competitors.length - 1;
                  const cleanName = competitor.name.replace(/\*\*/g, '');

                  return (
                    <tr
                      key={`${competitor.name}-${index}`}
                      className={isBrand ? 'bg-teal-50' : ''}
                    >
                      <td className={`${isBrand ? 'font-bold text-teal-900' : 'text-primary'}`}>
                        {cleanName}
                      </td>
                      <td className="text-center">
                        {competitor.perplexity}
                      </td>
                      <td className="text-center">
                        {competitor.chatgpt}
                      </td>
                      <td className="text-center">
                        {competitor.gemini}
                      </td>
                      <td className="text-center font-semibold">
                        {competitor.avgPosition ?? '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platform Context */}
      {data.platforms.some((p) => p.context) && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Context
          </h4>
          {data.platforms
            .filter((p) => p.context)
            .map((platform, index) => (
              <div key={`context-${platform.platform}-${index}`} className="text-sm text-secondary p-3 bg-gray-50 rounded-lg border border-black/[0.04]">
                <span className="font-medium text-primary">{platform.platform}:</span> {platform.context}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
