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
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type StudyTimeChartProps = {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
};

export default function StudyTimeChart({ level }: StudyTimeChartProps) {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${level} Recommended Study Hours per Week`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      }
    }
  };

  // These are example values - we can adjust based on real recommendations
  const studyHours = {
    N5: {
      vocabulary: 2,
      kanji: 2,
      grammar: 3,
      reading: 2,
      listening: 2
    },
    N4: {
      vocabulary: 3,
      kanji: 3,
      grammar: 4,
      reading: 3,
      listening: 2
    },
    N3: {
      vocabulary: 4,
      kanji: 4,
      grammar: 5,
      reading: 4,
      listening: 3
    },
    N2: {
      vocabulary: 5,
      kanji: 5,
      grammar: 6,
      reading: 5,
      listening: 4
    },
    N1: {
      vocabulary: 6,
      kanji: 6,
      grammar: 7,
      reading: 6,
      listening: 5
    }
  };

  const data = {
    labels: ['Vocabulary', 'Kanji', 'Grammar', 'Reading', 'Listening'],
    datasets: [
      {
        label: 'Hours per Week',
        data: Object.values(studyHours[level]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Bar options={options} data={data} />
    </div>
  );
}
