import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiPackage, FiUsers, FiDollarSign, FiShoppingCart, FiTrendingUp, FiPieChart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { message, Spin, notification } from "antd";
import moment from "moment";
import { userHistoryApi } from "api/Admin";
import { userHistorySSE } from "api/Admin/UserHistory/userHistorySSE";


const AdminIndex = () => {
  const [adminHistories, setAdminHistories] = useState([]);
  const [recentHistories, setRecentHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({
    auth: "connecting",
    admin: "connecting"
  });
  
  // Use refs to track when we should display notifications
  const notificationsEnabled = useRef(false);
  const previousHistoriesCount = useRef({
    auth: 0,
    admin: 0
  });

  const fetchAuthActivities = useCallback(async () => {
    try {
      const response = await userHistoryApi.getAllauthactivities();
      if (response?.data?.content) {
        setRecentHistories(response.data.content);
        previousHistoriesCount.current.auth = response.data.content.length;
      }
    } catch (error) {
      console.error("Error fetching auth activities:", error);
      message.error("Không thể tải dữ liệu hoạt động người dùng");
      setConnectionStatus(prev => ({...prev, auth: "error"}));
    }
  }, []);

  const fetchAdminActivities = useCallback(async () => {
    try {
      const response = await userHistoryApi.getAlladminactivities();
      if (response?.data?.content) {
        setAdminHistories(response.data.content);
        previousHistoriesCount.current.admin = response.data.content.length;
      }
    } catch (error) {
      console.error("Error fetching admin activities:", error);
      message.error("Không thể tải dữ liệu hoạt động quản trị");
      setConnectionStatus(prev => ({...prev, admin: "error"}));
    }
  }, []);

  const handleAuthActivitiesUpdate = useCallback((data) => {
    if (data?.content) {
      setRecentHistories(data.content);
      setConnectionStatus(prev => ({...prev, auth: "connected"}));
      
      // Check if we should show a notification
      if (notificationsEnabled.current && previousHistoriesCount.current.auth < data.content.length) {
        const newCount = data.content.length - previousHistoriesCount.current.auth;
        notification.info({
          message: `${newCount} hoạt động mới`,
          description: 'Có hoạt động đăng nhập/đăng xuất mới',
          placement: 'bottomRight',
        });
      }
      previousHistoriesCount.current.auth = data.content.length;
    }
  }, []);

  const handleAdminActivitiesUpdate = useCallback((data) => {
    if (data?.content) {
      setAdminHistories(data.content);
      setConnectionStatus(prev => ({...prev, admin: "connected"}));
      
      // Check if we should show a notification
      if (notificationsEnabled.current && previousHistoriesCount.current.admin < data.content.length) {
        const newCount = data.content.length - previousHistoriesCount.current.admin;
        notification.info({
          message: `${newCount} hoạt động quản trị mới`,
          description: 'Có hoạt động quản trị mới',
          placement: 'bottomRight',
        });
      }
      previousHistoriesCount.current.admin = data.content.length;
    }
  }, []);

  useEffect(() => {
    // Initial data fetch
    setIsLoading(true);
    Promise.all([
      fetchAuthActivities(),
      fetchAdminActivities()
    ])
    .catch(error => {
      console.error("Error fetching initial data:", error);
    })
    .finally(() => {
      setIsLoading(false);
      // Enable notifications after initial load (prevent notifications on first load)
      setTimeout(() => {
        notificationsEnabled.current = true;
      }, 2000);
    });

    // Set up SSE subscriptions for real-time updates
    const authUnsubscribe = userHistorySSE.subscribeToAuthActivities(handleAuthActivitiesUpdate);
    const adminUnsubscribe = userHistorySSE.subscribeToAdminActivities(handleAdminActivitiesUpdate);

    return () => {
      authUnsubscribe();
      adminUnsubscribe();
      notificationsEnabled.current = false;
    };
  }, [fetchAuthActivities, fetchAdminActivities, handleAuthActivitiesUpdate, handleAdminActivitiesUpdate]);

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
      link: "/admin/product",
      color: "bg-blue-100 text-blue-600",
      icon: <FiPackage className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Xử lý đơn hàng",
      description: "Quản lý đơn hàng mới",
      link: "/admin/invoices",
      color: "bg-green-100 text-green-600",
      icon: <FiShoppingCart className="w-8 h-8 text-green-500" />
    },
    {
      title: "Quản lý kho",
      description: "Kiểm tra nhập kho",
      link: "/admin/stock-receipts",
      color: "bg-orange-100 text-orange-600",
      icon: <FiPieChart className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Báo cáo doanh thu",
      description: "Xem báo cáo chi tiết",
      link: "/admin/charts",
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

  //danh sách
  const getLatestFive = (items) => {
    return items
      .sort((a, b) => moment(b.historyDateTime) - moment(a.historyDateTime))
      .slice(0, 3);
  };

  const getActionTypeIcon = (actionType) => {
    const icons = {
      // Auth actions
      LOGIN: '🔐',
      LOGOUT: '🔒',
      LOGIN_FAILED: '⛔',
      RELOGIN: '🔄',

      // Account actions
      CREATE_ACCOUNT: '👥',
      UPDATE_ACCOUNT: '✏️',
      DELETE_ACCOUNT: '❌',

      // Staff account actions
      CREATE_ACCOUNTSTAFF: '👔',
      UPDATE_ACCOUNTSTAFF: '✏️',
      DELETE_ACCOUNTSTAFF: '❌',

      // Product actions
      CREATE_PRODUCT: '🛍️',
      UPDATE_PRODUCT: '✏️',
      DELETE_PRODUCT: '🗑️',

      // Brand actions
      CREATE_BRAND: '🏢',
      UPDATE_BRAND: '✏️',
      DELETE_BRAND: '🗑️',

      // Supplier actions
      CREATE_SUPPLIER: '🏭',
      UPDATE_SUPPLIER: '✏️',
      DELETE_SUPPLIER: '🗑️',

      // Size actions
      CREATE_SIZE: '📏',
      UPDATE_SIZE: '✏️',
      DELETE_SIZE: '🗑️',

      // Role actions
      CREATE_ROLE: '🔑',
      UPDATE_ROLE: '✏️',
      DELETE_ROLE: '🗑️',

      // Stock receipt actions
      CREATE_STOCK_RECEIPT: '📦',
      UPDATE_STOCK_RECEIPT: '✏️',
      DELETE_STOCK_RECEIPT: '🗑️',

      // Category actions
      CREATE_CATEGORIE: '📁',
      UPDATE_CATEGORIE: '✏️',
      DELETE_CATEGORIE: '🗑️',

      default: '📝'
    };
    return icons[actionType] || icons.default;
  };

  const formatActionMessage = (history) => {
    const messages = {
      // Auth messages
      LOGIN: `${history.note}`,
      LOGOUT: `${history.note}`,
      LOGIN_FAILED: 'Đăng nhập thất bại',
      RELOGIN: 'Đăng nhập lại',

      // Account messages
      CREATE_ACCOUNT: `Tạo tài khoản mới: ${history.note}`,
      UPDATE_ACCOUNT: `Cập nhật tài khoản: ${history.note}`,
      DELETE_ACCOUNT: `Xóa tài khoản: ${history.note}`,

      // Staff account messages
      CREATE_ACCOUNTSTAFF: `Tạo tài khoản nhân viên: ${history.note}`,
      UPDATE_ACCOUNTSTAFF: `Cập nhật tài khoản nhân viên: ${history.note}`,
      DELETE_ACCOUNTSTAFF: `Xóa tài khoản nhân viên: ${history.note}`,

      // Product messages
      CREATE_PRODUCT: `Thêm sản phẩm mới: ${history.note}`,
      UPDATE_PRODUCT: `Cập nhật sản phẩm: ${history.note}`,
      DELETE_PRODUCT: `Xóa sản phẩm: ${history.note}`,

      // Brand messages
      CREATE_BRAND: `Thêm thương hiệu mới: ${history.note}`,
      UPDATE_BRAND: `Cập nhật thương hiệu: ${history.note}`,
      DELETE_BRAND: `Xóa thương hiệu: ${history.note}`,

      // Supplier messages
      CREATE_SUPPLIER: `Thêm nhà cung cấp mới: ${history.note}`,
      UPDATE_SUPPLIER: `Cập nhật nhà cung cấp: ${history.note}`,
      DELETE_SUPPLIER: `Xóa nhà cung cấp: ${history.note}`,

      // Size messages
      CREATE_SIZE: `Thêm size mới: ${history.note}`,
      UPDATE_SIZE: `Cập nhật size: ${history.note}`,
      DELETE_SIZE: `Xóa size: ${history.note}`,

      // Role messages
      CREATE_ROLE: `Thêm vai trò mới: ${history.note}`,
      UPDATE_ROLE: `Cập nhật vai trò: ${history.note}`,
      DELETE_ROLE: `Xóa vai trò: ${history.note}`,

      // Stock receipt messages
      CREATE_STOCK_RECEIPT: `Tạo phiếu nhập kho: ${history.note}`,
      UPDATE_STOCK_RECEIPT: `Cập nhật phiếu nhập kho: ${history.note}`,
      DELETE_STOCK_RECEIPT: `Xóa phiếu nhập kho: ${history.note}`,

      // Category messages
      CREATE_CATEGORIE: `Tạo danh mục: ${history.note}`,
      UPDATE_CATEGORIE: `Cập nhật danh mục: ${history.note}`,
      DELETE_CATEGORIE: `Xóa danh mục: ${history.note}`,

      default: history.note
    };
    return messages[history.actionType] || messages.default;
  };

  const getActionTypeBgColor = (actionType) => {
    if (!actionType) return 'bg-gray-100 text-gray-700 border-gray-200';
    
    const actionTypeBase = actionType.split('_')[0];
    const colors = {
      // Base actions
      CREATE: 'bg-green-100 text-green-700 border-green-200',
      UPDATE: 'bg-blue-100 text-blue-700 border-blue-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200',

      // Auth actions
      LOGIN: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      LOGOUT: 'bg-slate-100 text-slate-700 border-slate-200',
      LOGIN_FAILED: 'bg-red-100 text-red-700 border-red-200',
      RELOGIN: 'bg-cyan-100 text-cyan-700 border-cyan-200',

      default: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[actionTypeBase] || colors.default;
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
      <div className={`p-8 border-b ${isAdmin ? 'bg-purple-50' : 'bg-blue-50'}`}>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-lg text-gray-600 mt-3">
          Hoạt động gần đây nhất
        </p>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spin size="large" />
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {data.length > 0 ? (
              getLatestFive(data).map(history => renderHistoryItem(history, isAdmin))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>
        )}
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
