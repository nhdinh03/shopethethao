import React, { useState, useEffect, useCallback } from "react";
import { FiPackage, FiUsers, FiDollarSign, FiShoppingCart, FiActivity } from "react-icons/fi";
import { Link } from "react-router-dom";
import { message, Spin } from "antd";
import moment from "moment";
import { userHistoryApi } from "api/Admin";
// 

const AdminIndex = () => {
  const [adminHistories, setAdminHistories] = useState([]);
  const [recentHistories, setRecentHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add this for forcing refresh

  // Add refresh interval state
  const REFRESH_INTERVAL = 1000; // 10 seconds

  // Wrap fetch functions in useCallback
  const fetchAuthActivities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userHistoryApi.getAllauthactivities();
      if (response?.data?.content) {
        setRecentHistories(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching auth activities:", error);
      message.error("Không thể tải dữ liệu hoạt động người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminActivities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userHistoryApi.getAlladminactivities();
      if (response?.data?.content) {
        setAdminHistories(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching admin activities:", error);
      message.error("Không thể tải dữ liệu hoạt động quản trị");
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup auto-refresh
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchAuthActivities(),
        fetchAdminActivities()
      ]);
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchAuthActivities, fetchAdminActivities, refreshKey]);

  // Add manual refresh function
  const handleManualRefresh = useCallback(() => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  }, []);

  // Add refresh button component
  const RefreshButton = () => (
    <button
      onClick={handleManualRefresh}
      disabled={loading}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
        ${loading 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
    >
      <svg 
        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      {loading ? 'Đang làm mới...' : 'Làm mới dữ liệu'}
    </button>
  );

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: "126,560,000đ",
      icon: <FiDollarSign className="w-10 h-10" />,
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

  // const recentActivities = [
  //   { time: "09:45", action: "Đơn hàng mới #12345 từ Nguyễn Văn A" },
  //   { time: "09:30", action: "Cập nhật số lượng Áo thể thao Nike" },
  //   { time: "09:15", action: "Khách hàng mới đăng ký tài khoản" },
  //   { time: "09:00", action: "Đơn hàng #12344 đã được giao thành công" }
  // ];

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

  // const adminActions = [= [
  //   {  {
  //     admin: 'Admin Hoàng',g',
  //     action: 'Xóa sản phẩm',m',
  //     target: 'Áo Nike Pro #A123',3',
  //     time: '09:45',5',
  //     status: 'success'ss'
  //   }, },
  //   {  {
  //     admin: 'Admin Linh',h',
  //     action: 'Cập nhật đơn hàng',g',
  //     target: '#12345',5',
  //     time: '09:30',0',
  //     status: 'warning'ng'
  //   }, },
  //   {  {
  //     admin: 'Admin Minh',h',
  //     action: 'Thêm sản phẩm mới',i',
  //     target: 'Giày Adidas #B456',6',
  //     time: '09:15',5',
  //     status: 'success'ss'
  //   }  }
  // ]; ];

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

  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <Spin />
      <span className="ml-2 text-gray-600">Đang cập nhật...</span>
    </div>
  );

  // Add this function to get latest 5 items
  const getLatestFive = (items) => {
    return items
      .sort((a, b) => moment(b.historyDateTime) - moment(a.historyDateTime))
      .slice(0, 5);
  };

  const renderAdminActions = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          {renderLoadingSpinner()}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Nhật ký quản trị mới nhất
          <span className="text-sm ml-2 text-gray-500">
            (5 hoạt động gần đây)
          </span>
        </h2>
        <div className="flex items-center gap-4">
          <RefreshButton />
          <FiActivity className="w-6 h-6 text-purple-500" />
        </div>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="text-center py-4">
            <Spin />
          </div>
        ) : (
          getLatestFive(adminHistories).map((history) => (
            <div
              key={history.idHistory}
              className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-gray-50/50 rounded-r-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" title={history.actionType}>
                      {getActionTypeIcon(history.actionType)}
                    </span>
                    <span className="font-medium text-lg">{history.username}</span>
                    <span className={`px-2 py-0.5 rounded text-sm ${getActionTypeColor(history.actionType)} bg-opacity-10`}>
                      {history.actionType}
                    </span>
                    <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {history.userRole}
                    </span>
                  </div>
                  <p className="text-base text-gray-600">
                    {history.note}
                  </p>
                  <div className="text-sm text-gray-500">
                    ID: {history.userId} • {moment(history.historyDateTime).format('DD/MM/YYYY HH:mm:ss')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const getActionTypeColor = (actionType) => {
    switch (actionType) {
      case 'CREATE':
        return 'text-green-600';
      case 'UPDATE':
        return 'text-blue-600';
      case 'DELETE':
        return 'text-red-600';
      case 'LOGIN':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActionTypeIcon = (actionType) => {
    switch (actionType) {
      case 'CREATE':
        return '➕';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      case 'LOGIN':
        return '🔐';
      default:
        return '📝';
    }
  };

  const formatActionMessage = (history) => {
    switch (history.actionType) {
      case 'CREATE':
        return `Thêm mới ${history.note}`;
      case 'UPDATE':
        return `Cập nhật ${history.note}`;
      case 'DELETE':
        return `Xóa ${history.note}`;
      case 'LOGIN':
        return `Đăng nhập từ ${history.deviceInfo}`;
      default:
        return history.note;
    }
  };

  const renderAuthActivities = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          {renderLoadingSpinner()}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Hoạt động đăng nhập mới nhất
        <span className="text-sm ml-2 text-gray-500">
          (5 hoạt động gần đây)
        </span>
      </h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="text-center py-4">
            <Spin />
          </div>
        ) : (
          getLatestFive(recentHistories).map((history, index) => (
            <div
              key={history.idHistory}
              className="flex items-start border-b pb-3 last:border-0 hover:bg-gray-50/50 p-3 rounded-lg"
            >
              <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-base font-medium shadow-sm">
                {moment(history.historyDateTime).format('HH:mm:ss')}
              </div>
              <div className="ml-4 flex-grow space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl" title={history.actionType}>
                    {getActionTypeIcon(history.actionType)}
                  </span>
                  <span className="font-medium text-lg">{history.username}</span>
                  <span className={`px-2 py-0.5 rounded text-sm ${getActionTypeColor(history.actionType)} bg-opacity-10`}>
                    {history.actionType}
                  </span>
                  <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                    {history.userRole}
                  </span>
                </div>
                <div className="text-base text-gray-600">
                  {formatActionMessage(history)}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {history.userId} • {moment(history.historyDateTime).format('DD/MM/YYYY')}
                  <br/>IP: {history.ipAddress} • {history.deviceInfo?.split('(')[0]}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Add a "View All" button component
  const ViewAllButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="mt-4 w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 
                 text-gray-600 rounded-lg transition-colors duration-200
                 flex items-center justify-center gap-2 border border-gray-200"
    >
      <span>Xem tất cả</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  );

  // Add click handlers for View All buttons
  const handleViewAllAdmin = () => {
    // Implement view all admin activities
    console.log("View all admin activities");
  };

  const handleViewAllAuth = () => {
    // Implement view all auth activities
    console.log("View all auth activities");
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
                <p className="text-gray-500 text-base font-medium">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</h3>
                <p className="text-base text-gray-600 mt-2 font-medium">{stat.change}</p>
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
              <h3 className="font-semibold text-xl">{action.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Activities Panel */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Hoạt động người dùng</h2>
            <FiUsers className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            {userActivities.map((activity, index) => (
              <div 
                key={index}
                className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-blue-50/50 rounded-r-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-lg text-gray-800">{activity.user}</p>
                    {activity.type === 'registration' && (
                      <p className="text-base text-gray-600">Đăng ký mới - {activity.email}</p>
                    )}
                    {activity.type === 'purchase' && (
                      <p className="text-base text-gray-600">
                        Đơn hàng {activity.orderCode} - {activity.amount}
                        <br/>{activity.items}
                      </p>
                    )}
                    {activity.type === 'login' && (
                      <p className="text-base text-gray-600">
                        Đăng nhập từ {activity.device}
                        <br/>Vị trí: {activity.location}
                      </p>
                    )}
                  </div>
                  <span className="text-base text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {renderAdminActions()}
      </div>

      {renderAuthActivities()}

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #666;
          }
          
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

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
        `}
      </style>
    </div>
  );
};

export default AdminIndex;
