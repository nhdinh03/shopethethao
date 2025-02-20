import React, { useState } from "react";
import { FiPackage, FiUsers, FiDollarSign, FiShoppingCart, FiActivity, FiUserCheck } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminIndex = () => {
  const [activeCard, setActiveCard] = useState(null);

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: "126,560,000đ",
      icon: <FiDollarSign className="w-8 h-8" />,
      bgColor: "bg-blue-500",
      change: "+12% so với tuần trước"
    },
    {
      title: "Đơn hàng mới",
      value: "156",
      icon: <FiShoppingCart className="w-8 h-8" />,
      bgColor: "bg-green-500",
      change: "+8% so với hôm qua"
    },
    {
      title: "Khách hàng mới",
      value: "40",
      icon: <FiUsers className="w-8 h-8" />,
      bgColor: "bg-purple-500",
      change: "+5% so với tuần trước"
    },
    {
      title: "Sản phẩm tồn kho",
      value: "1,234",
      icon: <FiPackage className="w-8 h-8" />,
      bgColor: "bg-orange-500",
      change: "-3% so với tuần trước"
    }
  ];

  const quickActions = [
    { title: "Thêm sản phẩm mới", link: "/admin/products/add", color: "bg-blue-100 text-blue-600" },
    { title: "Xử lý đơn hàng", link: "/admin/orders", color: "bg-green-100 text-green-600" },
    { title: "Quản lý kho", link: "/admin/inventory", color: "bg-orange-100 text-orange-600" },
    { title: "Báo cáo doanh thu", link: "/admin/reports", color: "bg-purple-100 text-purple-600" }
  ];

  const recentActivities = [
    { time: "09:45", action: "Đơn hàng mới #12345 từ Nguyễn Văn A" },
    { time: "09:30", action: "Cập nhật số lượng Áo thể thao Nike" },
    { time: "09:15", action: "Khách hàng mới đăng ký tài khoản" },
    { time: "09:00", action: "Đơn hàng #12344 đã được giao thành công" }
  ];

  const userActivities = [
    {
      type: 'registration',
      user: 'Nguyễn Văn A',
      time: '10:30',
      email: 'nguyenvana@email.com',
      status: 'Đăng ký thành công'
    },
    {
      type: 'purchase',
      user: 'Trần Thị B',
      time: '10:15',
      orderCode: '#12346',
      amount: '1,500,000đ',
      items: '3 sản phẩm'
    },
    {
      type: 'login',
      user: 'Lê Văn C',
      time: '10:00',
      device: 'iPhone 13',
      location: 'Hà Nội'
    }
  ];

  const adminActions = [
    {
      admin: 'Admin Hoàng',
      action: 'Xóa sản phẩm',
      target: 'Áo Nike Pro #A123',
      time: '09:45',
      status: 'success'
    },
    {
      admin: 'Admin Linh',
      action: 'Cập nhật đơn hàng',
      target: '#12345',
      time: '09:30',
      status: 'warning'
    },
    {
      admin: 'Admin Minh',
      action: 'Thêm sản phẩm mới',
      target: 'Giày Adidas #B456',
      time: '09:15',
      status: 'success'
    }
  ];

  const handleMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = -(x - centerX) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.3s ease'
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex justify-between items-center">
              <div className="transform translate-z-20">
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">{stat.value}</h3>
                <p className="text-sm text-gray-600 mt-2 font-medium">{stat.change}</p>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-2xl text-white shadow-lg transform transition-transform hover:scale-110`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <div 
              className={`${action.color} rounded-xl p-5 hover:shadow-lg transition-all duration-300
                transform hover:-translate-y-1 hover:scale-105 active:scale-95
                backdrop-blur-lg shadow-sm`}
              style={{
                transform: `perspective(1000px) translateZ(0)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <h3 className="font-semibold text-lg">{action.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Activities Panel */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Hoạt động người dùng</h2>
            <FiUsers className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {userActivities.map((activity, index) => (
              <div 
                key={index}
                className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-blue-50/50 rounded-r-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{activity.user}</p>
                    {activity.type === 'registration' && (
                      <p className="text-sm text-gray-600">Đăng ký mới - {activity.email}</p>
                    )}
                    {activity.type === 'purchase' && (
                      <p className="text-sm text-gray-600">
                        Đơn hàng {activity.orderCode} - {activity.amount}
                        <br/>{activity.items}
                      </p>
                    )}
                    {activity.type === 'login' && (
                      <p className="text-sm text-gray-600">
                        Đăng nhập từ {activity.device}
                        <br/>Vị trí: {activity.location}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions Panel */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Nhật ký quản trị</h2>
            <FiActivity className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-4">
            {adminActions.map((action, index) => (
              <div 
                key={index}
                className={`border-l-4 ${
                  action.status === 'success' ? 'border-green-500' : 'border-yellow-500'
                } pl-4 py-3 hover:bg-gray-50/50 rounded-r-lg transition-all`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {action.admin}
                      <span className="text-sm text-gray-500 ml-2">
                        {action.action}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {action.target}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{action.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Hoạt động gần đây</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-start border-b pb-3 last:border-0 hover:bg-gray-50/50 p-3 rounded-lg transition-all duration-300"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm">
                {activity.time}
              </div>
              <p className="ml-4 text-gray-700">{activity.action}</p>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminIndex;
