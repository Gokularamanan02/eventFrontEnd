import { Bar } from "react-chartjs-2";

const EventPopularityChart = () => {
  const data = {
    labels: ["Event A", "Event B", "Event C"],
    datasets: [
      {
        label: "Registrations",
        data: [12, 19, 7],
      },
    ],
  };

  return <Bar data={data} />;
};

export default EventPopularityChart;
