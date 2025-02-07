import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ReactApexChart from "react-apexcharts";

const AdminIndex = () => {
  const yearlyRevenue = Array(5)
    .fill()
    .map(() => Math.floor(Math.random() * 20000000));
  const activityData = [60, 25, 15]; // Product Sales, Account Creations, Other Activities
  const activityLabels = ["Sản phẩm bán", "Tạo tài khoản", "Hoạt động khác"];
  const totalRevenue = 126560;
  const sales = 2456;
  const monthlyRevenue = 670000;
  const customerAccounts = 40;
  const weeklyChange = 12; // percentage change for weekly comparison
  const dailyChange = 11; // percentage change for daily comparison
  // Dữ liệu giả lập

  const barChartOptions = {
    chart: { type: "bar" },
    xaxis: {
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
      ],
    },
    colors: ["#1E90FF"],
  };

  const barChartSeries = [
    {
      name: "Doanh thu",
      data: [126560, 135000, 145000, 160000, 170000, 180000],
    },
  ];

  // Pie chart data
  const pieChartOptions = {
    labels: ["Áo thể thao", "Quần thể thao", "Giày thể thao", "Phụ kiện"],
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
  };

  const pieChartSeries = [45, 30, 15, 10];

  // Line chart data
  const lineChartOptions = {
    chart: { type: "line" },
    xaxis: {
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
      ],
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
        {/* Total Revenue */}
        <div className="bg-white shadow-xl transform transition-transform hover:scale-105 p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-blue-500">
            {totalRevenue.toLocaleString()} VND
          </p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
            <span className="text-green-500">{weeklyChange}% Tuần</span>
          </p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowDown} className="text-red-500 mr-1" />
            <span className="text-red-500">{dailyChange}% Ngày</span>
          </p>
        </div>

        {/* Sales */}
        <div className="bg-white shadow-xl transform transition-transform hover:scale-105 p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">Sản phẩm bán</h3>
          <p className="text-2xl font-bold text-green-500">{sales}</p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
            <span className="text-green-500">{weeklyChange}% Tuần</span>
          </p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowDown} className="text-red-500 mr-1" />
            <span className="text-red-500">{dailyChange}% Ngày</span>
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white shadow-xl transform transition-transform hover:scale-105 p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">Doanh thu tháng</h3>
          <p className="text-2xl font-bold text-orange-500">
            {monthlyRevenue.toLocaleString()} VND
          </p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
            <span className="text-green-500">{weeklyChange}% Tuần</span>
          </p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowDown} className="text-red-500 mr-1" />
            <span className="text-red-500">{dailyChange}% Ngày</span>
          </p>
        </div>

        {/* Customer Accounts */}
        <div className="bg-white shadow-xl transform transition-transform hover:scale-105 p-6 rounded-md">
          <h3 className="text-sm font-bold text-gray-500">
            Tài khoản Khách Hàng
          </h3>
          <p className="text-2xl font-bold text-red-500">{customerAccounts}</p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
            <span className="text-green-500">{weeklyChange}% Tuần</span>
          </p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faArrowDown} className="text-red-500 mr-1" />
            <span className="text-red-500">{dailyChange}% Ngày</span>
          </p>
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
