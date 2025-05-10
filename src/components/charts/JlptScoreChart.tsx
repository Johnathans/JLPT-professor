'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type JlptScoreChartProps = {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
};

export default function JlptScoreChart({ level }: JlptScoreChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${level} Score Distribution by Section`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 60,
        title: {
          display: true,
          text: 'Points'
        }
      }
    }
  };

  const sections = ['Language Knowledge', 'Reading', 'Listening'];
  const passingScores = level === 'N1' || level === 'N2' ? [19, 19, 19] : [15, 15, 15];
  const maxScores = level === 'N1' || level === 'N2' ? [60, 60, 60] : [50, 50, 50];

  const data = {
    labels: sections,
    datasets: [
      {
        label: 'Passing Score',
        data: passingScores,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Maximum Score',
        data: maxScores,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Line options={options} data={data} />
    </div>
  );
}
