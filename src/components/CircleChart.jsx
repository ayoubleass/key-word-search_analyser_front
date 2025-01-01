import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CircleChart({ percent = 50 }) {
  const data = {
    labels: ['Completed', 'difficulty'], 
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: ['green', '#732E00'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '50%',
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className=' w-[150px]  h-[150px]'>
    <h2>keyword difficulty</h2>
      <Doughnut data={data} options={options} />
      <div>{100 - percent}%</div>
    </div>
  );
}

