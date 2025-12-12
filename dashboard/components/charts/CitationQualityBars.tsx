'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { CitationQuality } from '@/lib/parser/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CitationQualityBarsProps {
  data: CitationQuality;
}

export default function CitationQualityBars({ data }: CitationQualityBarsProps) {
  const getBarColor = (score: number) => {
    if (score >= 8) return { bg: 'rgba(5, 150, 105, 0.85)', border: '#059669' }; // emerald
    if (score >= 6) return { bg: 'rgba(217, 119, 6, 0.85)', border: '#D97706' }; // amber
    if (score >= 4) return { bg: 'rgba(249, 115, 22, 0.85)', border: '#F97316' }; // orange
    return { bg: 'rgba(220, 38, 38, 0.85)', border: '#DC2626' }; // red
  };

  const chartData = {
    labels: data.dimensions.map((dim) => dim.name),
    datasets: [
      {
        label: 'Score (0-10)',
        data: data.dimensions.map((dim) => dim.score),
        backgroundColor: data.dimensions.map((dim) => getBarColor(dim.score).bg),
        borderColor: data.dimensions.map((dim) => getBarColor(dim.score).border),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          font: {
            size: 11,
          },
          color: '#737373',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
            family: 'var(--font-body)',
          },
          color: '#4a4a4a',
        },
        grid: {
          display: false,
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
            const dimension = data.dimensions[context.dataIndex];
            return [
              `Score: ${dimension.score}/10`,
              `Assessment: ${dimension.assessment}`,
            ];
          },
        },
      },
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="card p-6 print-avoid-break">
      <div className="section-header">
        <h3 className="section-title">Citation Quality Scorecard</h3>
        <div className="text-right">
          <p className={`score-display-sm ${getScoreColor(data.average)}`}>
            {data.average.toFixed(1)}/10
          </p>
          <p className="text-sm text-muted font-medium">Average Quality</p>
        </div>
      </div>

      <div className="h-[280px] chart-container">
        <Bar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="metric-card text-center">
          <p className="text-2xl font-semibold text-emerald-600">
            {data.distribution.highQuality.count}
          </p>
          <p className="text-sm text-secondary font-medium">High Quality</p>
          <p className="text-xs text-muted mt-1">
            {data.distribution.highQuality.percentage}%
          </p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-semibold text-amber-600">
            {data.distribution.mediumQuality.count}
          </p>
          <p className="text-sm text-secondary font-medium">Medium Quality</p>
          <p className="text-xs text-muted mt-1">
            {data.distribution.mediumQuality.percentage}%
          </p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-semibold text-red-600">
            {data.distribution.lowQuality.count}
          </p>
          <p className="text-sm text-secondary font-medium">Low Quality</p>
          <p className="text-xs text-muted mt-1">
            {data.distribution.lowQuality.percentage}%
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-black/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Strongest:</span>
          <span className="badge badge-success">{data.strongest}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Weakest:</span>
          <span className="badge badge-danger">{data.weakest}</span>
        </div>
      </div>
    </div>
  );
}
