import React, { useState, useEffect, useCallback } from "react";
import { FiPackage, FiUsers, FiDollarSign, FiShoppingCart, FiActivity, FiTrendingUp, FiCalendar, FiPieChart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { message, Spin } from "antd";
import moment from "moment";
import { userHistoryApi } from "api/Admin";

const AdminIndex = () => {
  const [adminHistories, setAdminHistories] = useState([]);
  const [recentHistories, setRecentHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const REFRESH_INTERVAL = 1000;

  const fetchAuthActivities = useCallback(async () => {
    try {
      const response = await userHistoryApi.getAllauthactivities();
      if (response?.data?.content) {
        setRecentHistories(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching auth activities:", error);
    }
  }, []);

  const fetchAdminActivities = useCallback(async () => {
    try {
      const response = await userHistoryApi.getAlladminactivities();
      if (response?.data?.content) {
        setAdminHistories(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching admin activities:", error);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      if (!isSubscribed) return;
      try {
        await Promise.all([
          fetchAuthActivities(),
          fetchAdminActivities()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [fetchAuthActivities, fetchAdminActivities]);

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
    { 
      title: "Thêm sản phẩm mới",
      description: "Thêm sản phẩm mới vào kho",
      link: "/admin/products/add",
      color: "bg-blue-100 text-blue-600",
      icon: <FiPackage className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Xử lý đơn hàng",
      description: "Quản lý đơn hàng mới",
      link: "/admin/orders",
      color: "bg-green-100 text-green-600",
      icon: <FiShoppingCart className="w-8 h-8 text-green-500" />
    },
    {
      title: "Quản lý kho",
      description: "Kiểm tra tồn kho",
      link: "/admin/inventory",
      color: "bg-orange-100 text-orange-600",
      icon: <FiPieChart className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Báo cáo doanh thu",
      description: "Xem báo cáo chi tiết",
      link: "/admin/reports",
      color: "bg-purple-100 text-purple-600",
      icon: <FiTrendingUp className="w-8 h-8 text-purple-500" />
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

  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <Spin />
      <span className="ml-2 text-gray-600">Đang cập nhật...</span>
    </div>
  );

  const getLatestFive = (items) => {
    return items
      .sort((a, b) => moment(b.historyDateTime) - moment(a.historyDateTime))
      .slice(0, 5);
  };

  const getActionTypeIcon = (actionType) => {
    const icons = {
      CREATE: '➕',
      UPDATE: '✏️',
      UPDATE_CATEGORIE: '📑',
      DELETE_CATEGORIE: '🗑️',
      UPDATE_STOCK_RECEIPT: '📦',
      UPDATE_SIZE: '📏',
      UPDATE_PRODUCT: '🛍️',
      UPDATE_USER: '👤',
      DELETE: '🗑️',
      LOGIN: '🔐',
      LOGOUT: '🔒',
      default: '📝'
    };
    return icons[actionType] || icons.default;
  };

  const formatActionMessage = (history) => {
    const messages = {
      CREATE: `Thêm mới ${history.note}`,
      UPDATE: `Cập nhật ${history.note}`,
      UPDATE_CATEGORIE: `Cập nhật danh mục: ${history.note}`,
      DELETE_CATEGORIE: `Xóa danh mục ${history.note}`,
      UPDATE_STOCK_RECEIPT: `Cập nhật phiếu nhập kho ${history.note}`,
      UPDATE_SIZE: `Cập nhật size: ${history.note}`,
      UPDATE_PRODUCT: `Cập nhật sản phẩm: ${history.note}`,
      UPDATE_USER: `Cập nhật người dùng: ${history.note}`,
      LOGIN: `${history.note}`,
      LOGOUT: `Đăng xuất`,
      default: history.note
    };
    return messages[history.actionType] || messages.default;
  };

  const getActionTypeBgColor = (actionType) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-700 border-green-200',
      UPDATE: 'bg-blue-100 text-blue-700 border-blue-200',
      UPDATE_CATEGORIE: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      DELETE_CATEGORIE: 'bg-red-100 text-red-700 border-red-200',
      UPDATE_STOCK_RECEIPT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      UPDATE_SIZE: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      UPDATE_PRODUCT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      UPDATE_USER: 'bg-orange-100 text-orange-700 border-orange-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200',
      LOGIN: 'bg-purple-100 text-purple-700 border-purple-200',
      LOGOUT: 'bg-slate-100 text-slate-700 border-slate-200',
      default: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[actionType] || colors.default;
  };

  const renderHistoryItem = (history, isAdminLog = false) => (
    <div
      key={history.idHistory}
      className={`
        ${isAdminLog ? "border-l-8 border-purple-500" : "border-l-8 border-blue-500"} 
        bg-white/90 shadow-sm hover:shadow-md 
        p-8 rounded-lg transition-all duration-200
        hover:bg-white/100 group
      `}
    >
      {/* Action Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${getActionTypeBgColor(history.actionType)} bg-opacity-20`}>
            <span className="text-4xl">{getActionTypeIcon(history.actionType)}</span>
          </div>
          <div className="space-y-2">
            <span className={`
              inline-flex items-center px-6 py-2 rounded-full 
              text-lg font-bold tracking-wide
              ${getActionTypeBgColor(history.actionType)}
            `}>
              {history.actionType}
            </span>
            <span className="block text-2xl font-medium text-gray-900">
              {formatActionMessage(history)}
            </span>
          </div>
        </div>
        <span className={`
          px-4 py-2 rounded-lg text-base font-bold
          ${history.userRole === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
        `}>
          {history.userRole}
        </span>
      </div>

      {/* User Info */}
      <div className="mb-6 pl-20">
        <span className="font-bold text-2xl text-indigo-600">{history.username}</span>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center gap-4 text-base text-gray-500 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="font-bold">ID:</span>
          <span className="font-mono text-lg bg-white px-3 py-1 rounded-lg border-2 border-gray-200">
            {history.idHistory}
          </span>
        </div>
        <span className="text-gray-300 text-xl">|</span>
        <div className="flex items-center gap-2">
          <span className="font-bold">Thời gian:</span>
          <time className="font-mono text-lg">
            {moment(history.historyDateTime).format('HH:mm:ss DD/MM/YYYY')}
          </time>
        </div>
        {history.deviceInfo && (
          <>
            <span className="text-gray-300 text-xl">|</span>
            <div className="flex items-center gap-2">
              <span className="font-bold">IP:</span>
              <span className="font-mono text-lg">{history.ipAddress}</span>
            </div>
            <span className="text-gray-300 text-xl">|</span>
            <div className="flex items-center gap-2">
              <span className="font-bold">Thiết bị:</span>
              <span className="text-lg">{history.deviceInfo?.split('(')[0]}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderActivitySection = (title, data, isAdmin = false) => (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg">
      <div className={`
        p-8 border-b ${isAdmin ? 'bg-purple-50' : 'bg-blue-50'}
        flex items-center justify-between
      `}>
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-lg text-gray-600 mt-3">
            Hoạt động gần đây nhất
          </p>
        </div>
        <FiActivity className={`w-12 h-12 ${isAdmin ? 'text-purple-500' : 'text-blue-500'}`} />
      </div>

      <div className="p-4">
        <div className="space-y-6">
          {getLatestFive(data).map(history => renderHistoryItem(history, isAdmin))}
        </div>
      </div>
    </div>
  );

  const renderStatsCard = (stat, index) => (
    <div
      key={index}
      className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl group"
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease'
      }}
      onMouseMove={(e) => handleMouseMove(e, index)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">{stat.title}</p>
            <h3 className="text-4xl font-bold text-gray-800 font-mono tracking-tight">{stat.value}</h3>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm ${
                stat.change.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                <FiTrendingUp className={`w-4 h-4 mr-1 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`} />
                {stat.change}
              </span>
            </div>
          </div>
          <div className={`${stat.bgColor} bg-opacity-10 p-3 rounded-xl group-hover:scale-110 transition-transform`}>
            {React.cloneElement(stat.icon, { 
              className: `w-8 h-8 ${stat.bgColor.replace('bg-', 'text-')}` 
            })}
          </div>
        </div>
      </div>
      <div className={`h-1 ${stat.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
    </div>
  );

  const renderQuickAction = (action, index) => (
    <Link key={index} to={action.link}>
      <div 
        className={`
          ${action.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300
          transform hover:-translate-y-1 hover:scale-102 active:scale-98
          backdrop-blur-lg shadow-sm h-full flex items-center gap-4
          border border-opacity-10 hover:border-opacity-20 group
        `}
      >
        {action.icon}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg group-hover:text-opacity-80">{action.title}</h3>
          <p className="text-sm opacity-75">{action.description}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
          <p className="text-gray-600">Xin chào, chúc bạn một ngày làm việc hiệu quả</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
          <FiCalendar className="text-gray-500" />
          <span className="text-gray-600">{moment().format('DD/MM/YYYY')}</span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map(renderStatsCard)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map(renderQuickAction)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderActivitySection('Nhật ký quản trị', adminHistories, true)}
          {renderActivitySection('Hoạt động tài khoản', recentHistories)}
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;
