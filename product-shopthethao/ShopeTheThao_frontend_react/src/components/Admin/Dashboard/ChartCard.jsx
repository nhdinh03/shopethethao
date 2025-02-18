import React from "react";
import ReactApexChart from "react-apexcharts";

const ChartCard = ({ title, options, series, type, height = 300 }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-md">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <ReactApexChart
        options={options}
        series={series}
        type={type}
        height={height}
      />
    </div>
  );
};

export default ChartCard;
