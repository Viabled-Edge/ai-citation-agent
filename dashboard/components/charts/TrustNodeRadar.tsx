'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { TrustNodeCoverage } from '@/lib/parser/types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface TrustNodeRadarProps {
  data: TrustNodeCoverage;
}

export default function TrustNodeRadar({ data }: TrustNodeRadarProps) {
  const chartData = {
    labels: data.categories.map((cat) => cat.name),
    datasets: [
      {
        label: 'Coverage %',
        data: data.categories.map((cat) => cat.percentage),
        backgroundColor: 'rgba(13, 148, 136, 0.15)',
        borderColor: '#0D9488',
        borderWidth: 2,
        pointBackgroundColor: '#0D9488',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0D9488',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.06)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
        },
        pointLabels: {
          font: {
            size: 11,
            family: 'var(--font-body)',
            weight: '500' as const,
          },
          color: '#4a4a4a',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 10,
          },
          color: '#737373',
          backdropColor: 'transparent',
          callback: function (value: number | string) {
            return value + '%';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        titleFont: {
          size: 12,
          weight: '600' as const,
        },
        bodyFont: {
          size: 11,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const category = data.categories[context.dataIndex];
            return [
              `Coverage: ${category.coverage}/${category.total}`,
              `Percentage: ${category.percentage}%`,
              `Status: ${category.status}`,
            ];
          },
        },
      },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'strong':
        return 'text-emerald-600 bg-emerald-50';
      case 'moderate':
        return 'text-amber-600 bg-amber-50';
      case 'weak':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card p-6 print-avoid-break">
      <div className="section-header">
        <h3 className="section-title">Trust Node Coverage</h3>
        <div className="text-right">
          <p className="score-display-sm text-teal-600">
            {data.overall.percentage}%
          </p>
          <p className="text-sm text-muted font-medium">
            {data.overall.coverage}/{data.overall.total} nodes
          </p>
        </div>
      </div>

      <div className="h-[320px] chart-container">
        <Radar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6">
        {data.categories.map((category) => (
          <div
            key={category.name}
            className="metric-card flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-medium text-secondary">{category.name}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusColor(category.status)}`}>
                {category.status}
              </span>
            </div>
            <span className="font-semibold text-teal-600">
              {category.coverage}/{category.total}
            </span>
          </div>
        ))}
      </div>

      {data.criticalGaps.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Critical Missing Nodes ({data.criticalGaps.length})
          </h4>
          <ul className="space-y-2">
            {data.criticalGaps.slice(0, 3).map((gap, index) => (
              <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span><strong>{gap.name}</strong> — {gap.impact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
