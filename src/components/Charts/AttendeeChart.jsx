import { Line } from "react-chartjs-2";

const AttendeeChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Attendees",
        data: [20, 40, 60],
      },
    ],
  };

  return <Line data={data} />;
};

export default AttendeeChart;
