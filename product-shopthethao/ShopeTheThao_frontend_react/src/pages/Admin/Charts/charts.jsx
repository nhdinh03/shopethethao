import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './chartsStyle.scss';

const Charts = () => {
  const salesOptions = {
    chart: {
      type: 'area',
      height: 400,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      },
      dropShadow: {
        enabled: true,
        opacity: 0.3,
        blur: 5
      }
    },
    colors: ['#4CAF50', '#2196F3'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    stroke: { curve: 'smooth', width: 3 },
    title: { text: 'Doanh Số Theo Tháng', align: 'left' },
    xaxis: {
      categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
    },
    legend: { position: 'top' }
  };

  const productOptions = {
    chart: {
      type: 'radar',
      height: 400,
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1
      }
    },
    colors: ['#00C49F', '#FF8042'],
    markers: { size: 4, hover: { size: 8 } },
    title: { text: 'Phân Tích Chi Tiết Sản Phẩm', align: 'left' }
  };

  const pieOptions = {
    chart: {
      type: 'donut',
      height: 400
    },
    colors: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63'],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: { show: true },
            value: { show: true },
            total: { show: true, label: 'Tổng' }
          }
        }
      }
    },
    title: { text: 'Phân Bố Danh Mục', align: 'left' }
  };

  const heatmapOptions = {
    chart: {
      type: 'heatmap',
      height: 400,
      toolbar: { show: true }
    },
    dataLabels: { enabled: false },
    colors: ["#008FFB"],
    title: { text: 'Phân Tích Thời Gian Bán Hàng', align: 'left' }
  };

  return (
    <div className="charts-container">
      <h1 className="charts-title">Thống Kê Chi Tiết Cửa Hàng</h1>
      
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-content">
            <ReactApexChart
              options={salesOptions}
              series={[
                {
                  name: 'Doanh Thu',
                  data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 140, 180]
                },
                {
                  name: 'Đơn Hàng',
                  data: [20, 35, 40, 45, 39, 52, 75, 80, 100, 120, 110, 160]
                }
              ]}
              type="area"
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-content">
            <ReactApexChart
              options={productOptions}
              series={[
                {
                  name: 'Sản phẩm A',
                  data: [80, 90, 85, 95, 75]
                },
                {
                  name: 'Sản phẩm B',
                  data: [70, 85, 80, 90, 70]
                }
              ]}
              type="radar"
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-content">
            <ReactApexChart
              options={pieOptions}
              series={[44, 55, 41, 17]}
              type="donut"
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-content">
            <ReactApexChart
              options={heatmapOptions}
              series={[
                {
                  name: 'T2',
                  data: Array.from({length: 24}, () => ({
                    x: 'Hour',
                    y: Math.floor(Math.random() * 90) + 10
                  }))
                },
                // ... thêm data cho các ngày khác
              ]}
              type="heatmap"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
