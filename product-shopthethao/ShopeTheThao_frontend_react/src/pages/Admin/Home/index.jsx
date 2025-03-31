import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiClock,
  FiAlertCircle,
  FiBell,
  FiShield,
  FiBarChart2,
  FiDatabase,
  FiClipboard,
} from "react-icons/fi";
import {
  BiSolidDashboard,
  BiAnalyse,
  BiPackage,
  BiStore,
  BiShieldQuarter,
  BiCog,
  BiReceipt,
} from "react-icons/bi";
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingBag,
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { message, Spin, notification, Badge, Tooltip, Progress } from "antd";
import moment from "moment";
import { userHistoryApi } from "api/Admin";
import { userHistorySSE } from "api/Admin/UserHistory/userHistorySSE";
import "./HomeModule.scss";

const AdminIndex = () => {
  const [adminHistories, setAdminHistories] = useState([]);
  const [recentHistories, setRecentHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({
    auth: "connected", // Mặc định là connected, chỉ thay đổi nếu có lỗi
    admin: "connected",
  });

  const notificationsEnabled = useRef(false);
  const previousHistoriesCount = useRef({
    auth: 0,
    admin: 0,
  });

  const cardRefs = useRef([]);

  const fetchAuthActivities = useCallback(async () => {
    try {
      const response = await userHistoryApi.getAllauthactivities();
      if (response?.data?.content) {
        setRecentHistories(response.data.content);
        previousHistoriesCount.current.auth = response.data.content.length;
        setConnectionStatus((prev) => ({ ...prev, auth: "connected" })); // Cập nhật trạng thái khi fetch thành công
      }
    } catch (error) {
      console.error("Error fetching auth activities:", error);
      message.error("Không thể tải dữ liệu hoạt động người dùng");
      setConnectionStatus((prev) => ({ ...prev, auth: "error" }));
    }
  }, []);

  const fetchAdminActivities = useCallback(async () => {
    try {
      const response = await userHistoryApi.getAlladminactivities();
      if (response?.data?.content) {
        setAdminHistories(response.data.content);
        previousHistoriesCount.current.admin = response.data.content.length;
        setConnectionStatus((prev) => ({ ...prev, admin: "connected" })); // Cập nhật trạng thái khi fetch thành công
      }
    } catch (error) {
      console.error("Error fetching admin activities:", error);
      message.error("Không thể tải dữ liệu hoạt động quản trị");
      setConnectionStatus((prev) => ({ ...prev, admin: "error" }));
    }
  }, []);

  const handleAuthActivitiesUpdate = useCallback((data) => {
    if (data?.content) {
      setRecentHistories(data.content);
      setConnectionStatus((prev) => ({ ...prev, auth: "connected" }));

      if (
        notificationsEnabled.current &&
        previousHistoriesCount.current.auth < data.content.length
      ) {
        const newCount =
          data.content.length - previousHistoriesCount.current.auth;
        notification.info({
          message: `${newCount} hoạt động mới`,
          description: "Có hoạt động đăng nhập/đăng xuất mới",
          placement: "bottomRight",
          icon: <FiBell className="text-blue-500" />,
        });
      }
      previousHistoriesCount.current.auth = data.content.length;
    }
  }, []);

  const handleAdminActivitiesUpdate = useCallback((data) => {
    if (data?.content) {
      setAdminHistories(data.content);
      setConnectionStatus((prev) => ({ ...prev, admin: "connected" }));

      if (
        notificationsEnabled.current &&
        previousHistoriesCount.current.admin < data.content.length
      ) {
        const newCount =
          data.content.length - previousHistoriesCount.current.admin;
        notification.info({
          message: `${newCount} hoạt động quản trị mới`,
          description: "Có hoạt động quản trị mới",
          placement: "bottomRight",
          icon: <FiBell className="text-purple-500" />,
        });
      }
      previousHistoriesCount.current.admin = data.content.length;
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchAuthActivities(), fetchAdminActivities()])
      .catch((error) => {
        console.error("Error fetching initial data:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          notificationsEnabled.current = true;
        }, 2000);
      });

    const authUnsubscribe = userHistorySSE.subscribeToAuthActivities(
      handleAuthActivitiesUpdate
    );
    const adminUnsubscribe = userHistorySSE.subscribeToAdminActivities(
      handleAdminActivitiesUpdate
    );

    return () => {
      authUnsubscribe();
      adminUnsubscribe();
      userHistorySSE.closeAllConnections();
      notificationsEnabled.current = false;
    };
  }, [
    fetchAuthActivities,
    fetchAdminActivities,
    handleAuthActivitiesUpdate,
    handleAdminActivitiesUpdate,
  ]);

  const handleMouseMove = (e, element) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    element.style.setProperty("--mouse-x", `${x}px`);
    element.style.setProperty("--mouse-y", `${y}px`);
  };

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: "126,560,000đ",
      icon: <HiOutlineCurrencyDollar className="w-10 h-10" />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      change: "+12% so với tuần trước",
      positive: true,
      trendIcon: <FiTrendingUp />,
      progressValue: 72,
    },
    {
      title: "Đơn hàng mới",
      value: "156",
      icon: <HiOutlineShoppingBag className="w-10 h-10" />,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      change: "+8% so với hôm qua",
      positive: true,
      trendIcon: <FiTrendingUp />,
      progressValue: 68,
    },
    {
      title: "Khách hàng mới",
      value: "40",
      icon: <HiOutlineUserGroup className="w-10 h-10" />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      change: "+5% so với tuần trước",
      positive: true,
      trendIcon: <FiTrendingUp />,
      progressValue: 55,
    },
    {
      title: "Sản phẩm tồn kho",
      value: "1,234",
      icon: <BiPackage className="w-10 h-10" />,
      bgColor: "bg-gradient-to-br from-orange-500 to-amber-600",
      change: "-3% so với tuần trước",
      positive: false,
      trendIcon: <FiTrendingDown />,
      progressValue: 34,
    },
  ];

  const quickActions = [
    {
      title: "Thêm sản phẩm mới",
      description: "Thêm sản phẩm mới vào kho",
      link: "/dashboard-management-sys/catalog/products",
      color: "bg-blue-100 text-blue-600",
      icon: <BiPackage className="w-12 h-12" />,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Xử lý đơn hàng",
      description: "Quản lý đơn hàng mới",
      link: "/dashboard-management-sys/invoices",
      color: "bg-green-100 text-green-600",
      icon: <BiReceipt className="w-12 h-12" />,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Quản lý kho",
      description: "Kiểm tra nhập kho",
      link: "/dashboard-management-sys/inventory/stock-receipts",
      color: "bg-orange-100 text-orange-600",
      icon: <BiStore className="w-12 h-12" />,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Báo cáo doanh thu",
      description: "Xem báo cáo chi tiết",
      link: "/dashboard-management-sys/charts",
      color: "bg-purple-100 text-purple-600",
      icon: <BiAnalyse className="w-12 h-12" />,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const getLatestFive = (items) => {
    return items
      .sort((a, b) => moment(b.historyDateTime) - moment(a.historyDateTime))
      .slice(0, 3);
  };

  const getActionTypeIcon = (actionType) => {
    const icons = {
      LOGIN: "🔐",
      LOGOUT: "🔒",
      LOGIN_FAILED: "⛔",
      RELOGIN: "🔄",
      CREATE_ACCOUNT: "👥",
      UPDATE_ACCOUNT: "✏️",
      DELETE_ACCOUNT: "❌",
      CREATE_ACCOUNTSTAFF: "👔",
      UPDATE_ACCOUNTSTAFF: "✏️",
      DELETE_ACCOUNTSTAFF: "❌",
      CREATE_PRODUCT: "🛍️",
      UPDATE_PRODUCT: "✏️",
      DELETE_PRODUCT: "🗑️",
      CREATE_BRAND: "🏢",
      UPDATE_BRAND: "✏️",
      DELETE_BRAND: "🗑️",
      CREATE_SUPPLIER: "🏭",
      UPDATE_SUPPLIER: "✏️",
      DELETE_SUPPLIER: "🗑️",
      CREATE_SIZE: "📏",
      UPDATE_SIZE: "✏️",
      DELETE_SIZE: "🗑️",
      CREATE_ROLE: "🔑",
      UPDATE_ROLE: "✏️",
      DELETE_ROLE: "🗑️",
      CREATE_STOCK_RECEIPT: "📦",
      UPDATE_STOCK_RECEIPT: "✏️",
      DELETE_STOCK_RECEIPT: "🗑️",
      CREATE_CATEGORIE: "📁",
      UPDATE_CATEGORIE: "✏️",
      DELETE_CATEGORIE: "🗑️",
      default: "📝",
    };
    return icons[actionType] || icons.default;
  };

  const formatActionMessage = (history) => {
    const messages = {
      LOGIN: `${history.note}`,
      LOGOUT: `${history.note}`,
      LOGIN_FAILED: "Đăng nhập thất bại",
      RELOGIN: "Đăng nhập lại",
      CREATE_ACCOUNT: `Tạo tài khoản mới: ${history.note}`,
      UPDATE_ACCOUNT: `Cập nhật tài khoản: ${history.note}`,
      DELETE_ACCOUNT: `Xóa tài khoản: ${history.note}`,
      CREATE_ACCOUNTSTAFF: `Tạo tài khoản nhân viên: ${history.note}`,
      UPDATE_ACCOUNTSTAFF: `Cập nhật tài khoản nhân viên: ${history.note}`,
      DELETE_ACCOUNTSTAFF: `Xóa tài khoản nhân viên: ${history.note}`,
      CREATE_PRODUCT: `Thêm sản phẩm mới: ${history.note}`,
      UPDATE_PRODUCT: `Cập nhật sản phẩm: ${history.note}`,
      DELETE_PRODUCT: `Xóa sản phẩm: ${history.note}`,
      CREATE_BRAND: `Thêm thương hiệu mới: ${history.note}`,
      UPDATE_BRAND: `Cập nhật thương hiệu: ${history.note}`,
      DELETE_BRAND: `Xóa thương hiệu: ${history.note}`,
      CREATE_SUPPLIER: `Thêm nhà cung cấp mới: ${history.note}`,
      UPDATE_SUPPLIER: `Cập nhật nhà cung cấp: ${history.note}`,
      DELETE_SUPPLIER: `Xóa nhà cung cấp: ${history.note}`,
      CREATE_SIZE: `Thêm size mới: ${history.note}`,
      UPDATE_SIZE: `Cập nhật size: ${history.note}`,
      DELETE_SIZE: `Xóa size: ${history.note}`,
      CREATE_ROLE: `Thêm vai trò mới: ${history.note}`,
      UPDATE_ROLE: `Cập nhật vai trò: ${history.note}`,
      DELETE_ROLE: `Xóa vai trò: ${history.note}`,
      CREATE_STOCK_RECEIPT: `Tạo phiếu nhập kho: ${history.note}`,
      UPDATE_STOCK_RECEIPT: `Cập nhật phiếu nhập kho: ${history.note}`,
      DELETE_STOCK_RECEIPT: `Xóa phiếu nhập kho: ${history.note}`,
      CREATE_CATEGORIE: `Tạo danh mục: ${history.note}`,
      UPDATE_CATEGORIE: `Cập nhật danh mục: ${history.note}`,
      DELETE_CATEGORIE: `Xóa danh mục: ${history.note}`,
      default: history.note,
    };
    return messages[history.actionType] || messages.default;
  };

  const getActionTypeBgColor = (actionType) => {
    if (!actionType) return "bg-gray-100 text-gray-700 border-gray-200";

    const actionTypeBase = actionType.split("_")[0];
    const colors = {
      CREATE: "bg-green-100 text-green-700 border-green-200",
      UPDATE: "bg-blue-100 text-blue-700 border-blue-200",
      DELETE: "bg-red-100 text-red-700 border-red-200",
      LOGIN: "bg-emerald-100 text-emerald-700 border-emerald-200",
      LOGOUT: "bg-slate-100 text-slate-700 border-slate-200",
      LOGIN_FAILED: "bg-red-100 text-red-700 border-red-200",
      RELOGIN: "bg-cyan-100 text-cyan-700 border-cyan-200",
      default: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[actionTypeBase] || colors.default;
  };

  const renderHistoryItem = (history, isAdmin = false) => (
    <div
      key={history.idHistory}
      className={`
        activity-item
        ${
          isAdmin
            ? "border-l-8 border-purple-500"
            : "border-l-8 border-blue-500"
        } 
        bg-white/90 shadow-sm hover:shadow-md 
        p-6 rounded-lg transition-all duration-200
        hover:bg-white/100 group
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`activity-icon p-4 rounded-xl ${getActionTypeBgColor(
              history.actionType
            )} bg-opacity-20`}
          >
            <span className="text-2xl">
              {getActionTypeIcon(history.actionType)}
            </span>
          </div>
          <div className="space-y-1">
            <span
              className={`
              activity-badge
              inline-flex items-center px-3 py-1 rounded-full 
              tracking-wide
              ${getActionTypeBgColor(history.actionType)}
            `}
            >
              {history.actionType}
            </span>
            <span className="block activity-message">
              {formatActionMessage(history)}
            </span>
          </div>
        </div>
        <Badge
          count={history.userRole}
          style={{
            backgroundColor:
              history.userRole === "ADMIN" ? "#9333ea" : "#3b82f6",
            fontSize: "12px",
            padding: "0 8px",
          }}
        />
      </div>

      <div className="mb-4 pl-16">
        <Tooltip title="Tên người dùng">
          <span className="activity-username flex items-center gap-2">
            <FiUsers className="text-indigo-400" /> {history.username}
          </span>
        </Tooltip>
      </div>

      <div className="flex flex-wrap items-center gap-3 activity-meta pl-16 pr-4 py-3 rounded-lg">
        <div className="flex items-center gap-1">
          <span className="meta-label">ID:</span>
          <span className="meta-value bg-white px-2 py-1 rounded-md border border-gray-200">
            {history.idHistory}
          </span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <FiClock className="text-gray-400" />
          <time className="meta-value">
            {moment(history.historyDateTime).format("HH:mm:ss DD/MM/YYYY")}
          </time>
        </div>
        {history.deviceInfo && (
          <>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <span className="meta-label">IP:</span>
              <span className="meta-value">{history.ipAddress}</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1 flex-grow">
              <BiCog className="text-gray-400" />
              <span className="meta-value truncate max-w-[200px]">
                {history.deviceInfo?.split("(")[0]}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderActivitySection = (title, data, isAdmin = false) => (
    <div className="activity-section bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
      <div
        className={`section-header p-6 border-b ${
          isAdmin ? "bg-purple-50" : "bg-blue-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title flex items-center gap-2">
              {isAdmin ? (
                <BiShieldQuarter className="text-purple-600" />
              ) : (
                <FiShield className="text-blue-600" />
              )}
              {title}
            </h2>
            <p className="section-subtitle">Hoạt động gần đây nhất</p>
          </div>
          <div
            className={`connection-status ${
              connectionStatus[isAdmin ? "admin" : "auth"]
            }`}
          >
            {connectionStatus[isAdmin ? "admin" : "auth"] === "connected"
              ? "Kết nối trực tiếp"
              : "Lỗi kết nối"}
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spin size="large" />
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {data.length > 0 ? (
              getLatestFive(data).map((history) =>
                renderHistoryItem(history, isAdmin)
              )
            ) : (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center">
                <FiAlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                <span>Không có dữ liệu</span>
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
      className="stat-card bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
      ref={(el) => (cardRefs.current[index] = el)}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className={`icon-wrapper ${stat.bgColor}`}>
            {React.cloneElement(stat.icon, { className: "w-8 h-8 text-white" })}
          </div>
          <span
            className={`
              trend-indicator
              ${stat.positive ? "positive" : "negative"}
            `}
          >
            {React.cloneElement(stat.trendIcon, { className: "w-4 h-4" })}
            {stat.change}
          </span>
        </div>

        <div className="space-y-2">
          <p className="stat-title">{stat.title}</p>
          <h3 className="stat-value">{stat.value}</h3>
          <Progress
            percent={stat.progressValue}
            showInfo={false}
            strokeColor={{
              "0%": stat.bgColor.includes("blue")
                ? "#3b82f6"
                : stat.bgColor.includes("green")
                ? "#22c55e"
                : stat.bgColor.includes("purple")
                ? "#8b5cf6"
                : "#f97316",
              "100%": stat.bgColor.includes("blue")
                ? "#2563eb"
                : stat.bgColor.includes("green")
                ? "#16a34a"
                : stat.bgColor.includes("purple")
                ? "#7c3aed"
                : "#ea580c",
            }}
            trailColor={
              stat.bgColor.includes("blue")
                ? "rgba(59, 130, 246, 0.1)"
                : stat.bgColor.includes("green")
                ? "rgba(34, 197, 94, 0.1)"
                : stat.bgColor.includes("purple")
                ? "rgba(139, 92, 246, 0.1)"
                : "rgba(249, 115, 22, 0.1)"
            }
          />
        </div>
      </div>
      <div
        className={`h-1 ${stat.bgColor}`}
        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      />
    </div>
  );

  const renderQuickAction = (action, index) => (
    <Link
      key={index}
      to={action.link}
      ref={(el) => {
        if (!cardRefs.current) cardRefs.current = [];
        cardRefs.current[index + 4] = el;
      }}
      onMouseMove={(e) => handleMouseMove(e, cardRefs.current[index + 4])}
    >
      <div
        className={`
          action-card h-full
          bg-gradient-to-br ${action.color} rounded-xl p-6 
          transition-all duration-300 border border-opacity-5
        `}
      >
        <div className="flex items-center gap-4">
          <div
            className={`action-icon bg-gradient-to-br ${action.gradient} p-3`}
          >
            {React.cloneElement(action.icon, {
              className: "w-8 h-8 text-white",
            })}
          </div>
          <div className="space-y-1">
            <h3 className="action-title">{action.title}</h3>
            <p className="action-description">{action.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="admin-dashboard p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="admin-dashboard-header mb-8">
        <h1 className="flex items-center gap-3">
          <BiSolidDashboard className="w-10 h-10" />
          Dashboard Quản Trị
        </h1>
        <p>
          Hệ thống quản lý ShopTheThao - Theo dõi số liệu và hoạt động hệ thống
          trong thời gian thực
        </p>
      </div>

      <div className="space-y-8">
        <div className="admin-dashboard-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map(renderStatsCard)}
        </div>

        <div className="admin-dashboard-quick-actions grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map(renderQuickAction)}
        </div>

        <div className="admin-dashboard-activity grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderActivitySection("Nhật ký quản trị", adminHistories, true)}
          {renderActivitySection("Hoạt động tài khoản", recentHistories)}
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;
