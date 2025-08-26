import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

// Global options
Chart.defaults.color = "#8898aa";
Chart.defaults.font.family = "Open Sans";
Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.enabled = true;

const chartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: "#8898aa", padding: 10 },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: "#8898aa",
        beginAtZero: true,
        callback: (val) => (val % 10 === 0 ? `$${val}k` : ""),
      },
      grid: {
        color: "#e9ecef",
        borderDash: [2],
        drawBorder: false,
      },
    },
  },
  plugins: {
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
});

const chartExample1 = {
  options: chartOptions(),
  data1: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [0, 20, 10, 30, 15, 40, 20, 60],
        backgroundColor: "#5e72e4",
        borderRadius: 6,
        barThickness: 10,
      },
    ],
  },
  data2: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [0, 20, 5, 25, 10, 30, 15, 40],
        backgroundColor: "#11cdef",
        borderRadius: 6,
        barThickness: 10,
      },
    ],
  },
};

const chartExample2 = {
  options: chartOptions(),
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29],
        backgroundColor: "#fb6340",
        borderRadius: 6,
        barThickness: 10,
      },
    ],
  },
};

export { chartOptions, chartExample1, chartExample2 };
