import React from "react";
import ReactApexChart from "react-apexcharts";
import "..//index.scss";
const AdminIndex = () => {
  // Dữ liệu giả lập
  const monthlyRevenue = Array(12)
    .fill()
    .map(() => Math.floor(Math.random() * 5000000));
  const categoryRevenue = [45, 30, 15, 10];
  const categoryNames = ["Áo thể thao", "Quần thể thao", "Giày thể thao", "Phụ kiện"];

  // Biểu đồ cột
  const barChartOptions = {
    chart: { type: "bar" },
    xaxis: {
      categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    },
    colors: ["#1E90FF"],
  };

  const barChartSeries = [
    { name: "Doanh thu", data: monthlyRevenue.slice(0, 6) },
  ];

  // Biểu đồ tròn
  const pieChartOptions = {
    labels: categoryNames,
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
  };

  const pieChartSeries = categoryRevenue;

  // Biểu đồ đường
  const lineChartOptions = {
    chart: { type: "line" },
    xaxis: {
      categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    },
    stroke: { curve: "smooth" },
    colors: ["#FF5733"],
  };

  const lineChartSeries = [
    { name: "Xu hướng", data: [1200, 2300, 1900, 3400, 2800, 4500] },
  ];

  // Biểu đồ khu vực
  const areaChartOptions = {
    chart: { type: "area" },
    xaxis: { categories: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"] },
    colors: ["#28B463"],
    stroke: { curve: "smooth" },
  };

  const areaChartSeries = [{ name: "Doanh thu", data: [600, 1200, 900, 1400] }];

  // Biểu đồ radar
  const radarChartOptions = {
    chart: { type: "radar" },
    labels: ["Chất lượng", "Thời trang", "Độ bền", "Giá trị"],
  };

  const radarChartSeries = [{ name: "Áo thể thao", data: [85, 90, 80, 75] }];

  // Biểu đồ phân tán
  const scatterChartOptions = {
    chart: { type: "scatter" },
    xaxis: { title: { text: "Số lượng bán (đơn vị)" } },
    yaxis: { title: { text: "Doanh thu (triệu VNĐ)" } },
  };

  const scatterChartSeries = [
    {
      name: "Áo thể thao",
      data: [
        [50, 120],
        [60, 180],
        [70, 240],
      ],
    },
    {
      name: "Quần thể thao",
      data: [
        [30, 90],
        [40, 120],
        [50, 150],
      ],
    },
  ];

  // Biểu đồ nhiệt
  const heatmapChartOptions = {
    chart: { type: "heatmap" },
    colors: ["#008FFB"],
    dataLabels: { enabled: false },
  };

  const heatmapChartSeries = [
    {
      name: "Tháng 1",
      data: [
        { x: "Áo thể thao", y: 40 },
        { x: "Quần thể thao", y: 30 },
        { x: "Giày thể thao", y: 20 },
      ],
    },
    {
      name: "Tháng 2",
      data: [
        { x: "Áo thể thao", y: 50 },
        { x: "Quần thể thao", y: 35 },
        { x: "Giày thể thao", y: 25 },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-md p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-blue-500">5M</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">Sản phẩm bán</h3>
          <p className="text-2xl font-bold text-green-500">2,456</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">Doanh thu tháng</h3>
          <p className="text-2xl font-bold text-orange-500">670K</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">Tài khoản Khách Hàng</h3>
          <p className="text-2xl font-bold text-red-500">40</p>
        </div>
      </div>

      {/* Lưới Biểu Đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Doanh thu (Cột)</h2>
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={300}
          />
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Xu hướng (Đường)</h2>
          <ReactApexChart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={300}
          />
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Doanh thu (Khu vực)</h2>
          <ReactApexChart
            options={areaChartOptions}
            series={areaChartSeries}
            type="area"
            height={300}
          />
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Chỉ số Radar</h2>
          <ReactApexChart
            options={radarChartOptions}
            series={radarChartSeries}
            type="radar"
            height={300}
          />
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Phân tích phân tán</h2>
          <ReactApexChart
            options={scatterChartOptions}
            series={scatterChartSeries}
            type="scatter"
            height={300}
          />
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Bản đồ nhiệt</h2>
          <ReactApexChart
            options={heatmapChartOptions}
            series={heatmapChartSeries}
            type="heatmap"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;
