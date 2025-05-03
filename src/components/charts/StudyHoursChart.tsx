'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type StudyHoursChartProps = {
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
};

const studyHoursData = {
  N1: { min: 1200, max: 1500 },
  N2: { min: 900, max: 1200 },
  N3: { min: 650, max: 800 },
  N4: { min: 400, max: 500 },
  N5: { min: 250, max: 350 }
};

export default function StudyHoursChart({ level }: StudyHoursChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} hours`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Study Hours Required'
        }
      }
    }
  };

  const data = {
    labels: ['N5', 'N4', 'N3', 'N2', 'N1'],
    datasets: [
      {
        label: 'Minimum Hours',
        data: [
          studyHoursData.N5.min,
          studyHoursData.N4.min,
          studyHoursData.N3.min,
          studyHoursData.N2.min,
          studyHoursData.N1.min
        ],
        backgroundColor: '#e8e3ff',
        borderColor: '#7c4dff',
        borderWidth: 1
      },
      {
        label: 'Additional Hours (Recommended)',
        data: [
          studyHoursData.N5.max - studyHoursData.N5.min,
          studyHoursData.N4.max - studyHoursData.N4.min,
          studyHoursData.N3.max - studyHoursData.N3.min,
          studyHoursData.N2.max - studyHoursData.N2.min,
          studyHoursData.N1.max - studyHoursData.N1.min
        ],
        backgroundColor: '#7c4dff',
        borderColor: '#5e35b1',
        borderWidth: 1
      }
    ]
  };

  return (
    <div style={{ height: '400px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Bar options={options} data={data} />
    </div>
  );
}
