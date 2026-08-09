import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function WeightChart({ records }) {
  const chartData = {
    labels: records.map((r) =>
      new Date(r.record_date).toLocaleDateString()
    ),

    datasets: [
      {
        label: "Weight (kg)",
        data: records.map((r) => Number(r.weight)),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Goat Weight Progress",
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default WeightChart;