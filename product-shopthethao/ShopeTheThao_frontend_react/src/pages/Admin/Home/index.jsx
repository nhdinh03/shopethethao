import React from "react";
import StatsCard from "../../../components/Admin/Dashboard/StatsCard";
import ChartCard from "../../../components/Admin/Dashboard/ChartCard";
import { chartConfigs } from "./chartConfigs"; // You'll need to create this

const AdminIndex = () => {
  const statsData = [
    {
      title: "Tổng doanh thu",
      value: 126560,
      weeklyChange: 12,
      dailyChange: 11,
      valueColor: "blue"
    },
    {
      title: "Sản phẩm bán",
      value: 2456,
      weeklyChange: 12,
      dailyChange: 11,
      valueColor: "green"
    },
    {
      title: "Doanh thu tháng",
      value: 670000,
      weeklyChange: 12,
      dailyChange: 11,
      valueColor: "orange"
    },
    {
      title: "Tài khoản Khách Hàng",
      value: 40,
      weeklyChange: 12,
      dailyChange: 11,
      valueColor: "red"
    }
  ];

  const { 
    barChart, 
    lineChart, 
    areaChart,
    radarChart,
    scatterChart,
    heatmapChart 
  } = chartConfigs;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="Doanh thu (Cột)" {...barChart} />
        <ChartCard title="Xu hướng (Đường)" {...lineChart} />
        <ChartCard title="Doanh thu (Khu vực)" {...areaChart} />
        <ChartCard title="Chỉ số Radar" {...radarChart} />
        <ChartCard title="Phân tích phân tán" {...scatterChart} />
        <ChartCard title="Bản đồ nhiệt" {...heatmapChart} />
      </div>
    </div>
  );
};

export default AdminIndex;
