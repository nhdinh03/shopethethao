export const chartConfigs = {
  barChart: {
    options: {
      chart: { type: "bar" },
      xaxis: {
        categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"]
      },
      colors: ["#1E90FF"]
    },
    series: [{
      name: "Doanh thu",
      data: [126560, 135000, 145000, 160000, 170000, 180000]
    }],
    type: "bar"
  },

  lineChart: {
    options: {
      chart: { type: "line" },
      xaxis: {
        categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"]
      },
      stroke: { curve: "smooth" },
      colors: ["#FF5733"]
    },
    series: [{
      name: "Xu hướng",
      data: [1200, 2300, 1900, 3400, 2800, 4500]
    }],
    type: "line"
  },

  areaChart: {
    options: {
      chart: { type: "area" },
      xaxis: { categories: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"] },
      colors: ["#28B463"],
      stroke: { curve: "smooth" }
    },
    series: [{
      name: "Doanh thu",
      data: [600, 1200, 900, 1400]
    }],
    type: "area"
  },

  radarChart: {
    options: {
      chart: { type: "radar" },
      labels: ["Chất lượng", "Thời trang", "Độ bền", "Giá trị"]
    },
    series: [{
      name: "Áo thể thao",
      data: [85, 90, 80, 75]
    }],
    type: "radar"
  },

  scatterChart: {
    options: {
      chart: { type: "scatter" },
      xaxis: { title: { text: "Số lượng bán (đơn vị)" } },
      yaxis: { title: { text: "Doanh thu (triệu VNĐ)" } }
    },
    series: [
      {
        name: "Áo thể thao",
        data: [[50, 120], [60, 180], [70, 240]]
      },
      {
        name: "Quần thể thao",
        data: [[30, 90], [40, 120], [50, 150]]
      }
    ],
    type: "scatter"
  },

  heatmapChart: {
    options: {
      chart: { type: "heatmap" },
      colors: ["#008FFB"],
      dataLabels: { enabled: false }
    },
    series: [
      {
        name: "Tháng 1",
        data: [
          { x: "Áo thể thao", y: 40 },
          { x: "Quần thể thao", y: 30 },
          { x: "Giày thể thao", y: 20 }
        ]
      },
      {
        name: "Tháng 2",
        data: [
          { x: "Áo thể thao", y: 50 },
          { x: "Quần thể thao", y: 35 },
          { x: "Giày thể thao", y: 25 }
        ]
      }
    ],
    type: "heatmap"
  }
};
