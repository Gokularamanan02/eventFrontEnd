import { Pie } from "react-chartjs-2";

const CategoryChart = () => {
  const data = {
    labels: ["Tech", "Music", "Sports"],
    datasets: [
      {
        data: [5, 3, 2],
      },
    ],
  };

  return <Pie data={data} />;
};

export default CategoryChart;
