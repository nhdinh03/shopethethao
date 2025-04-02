import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Badge,
  Dropdown,
  List,
  Typography,
  Avatar,
  Spin,
  Empty,
  Tabs,
  Button,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userHistoryApi from "api/Admin/UserHistory/userHistoryApi";
import { userHistorySSE } from "api/Admin/UserHistory/userHistorySSE";
// import { format, formatDistanceToNow } from 'date-fns';
// import { vi } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./NotificationDropdown.css";
import NotificationDetailModal from "./NotificationDetailModal";
import { ADMIN_ROUTES } from "constants/routeConstants";

const { Text, Title } = Typography;

// Create a cache key for localStorage
const CACHE_KEY_AUTH = "shopethethao_auth_notifications";
const CACHE_KEY_ADMIN = "shopethethao_admin_notifications";
const CACHE_EXPIRY = "shopethethao_notifications_expiry";
const CACHE_VALIDITY = 5 * 60 * 1000; // 5 minutes in milliseconds

const NotificationDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authActivities, setAuthActivities] = useState([]);
  const [adminActivities, setAdminActivities] = useState([]);
  const [unreadAuthCount, setUnreadAuthCount] = useState(0);
  const [unreadAdminCount, setUnreadAdminCount] = useState(0);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const hasInitializedRef = useRef(false);
  const authActivitiesRef = useRef([]);
  const adminActivitiesRef = useRef([]);
  const loadingTimeoutRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Load cached data on initial render to prevent spinner on page refresh
  useEffect(() => {
    try {
      const cachedAuthData = localStorage.getItem(CACHE_KEY_AUTH);
      const cachedAdminData = localStorage.getItem(CACHE_KEY_ADMIN);
      const expiryTime = localStorage.getItem(CACHE_EXPIRY);

      // Check if cache is still valid
      if (cachedAuthData && cachedAdminData && expiryTime) {
        const now = Date.now();
        if (now < parseInt(expiryTime)) {
          const authData = JSON.parse(cachedAuthData);
          const adminData = JSON.parse(cachedAdminData);
          setAuthActivities(authData);
          setAdminActivities(adminData);

          // Calculate unread counts from cached data
          const authUnread = authData.filter(
            (item) => item.readStatus === 0
          ).length;
          const adminUnread = adminData.filter(
            (item) => item.readStatus === 0
          ).length;

          setUnreadAuthCount(authUnread);
          setUnreadAdminCount(adminUnread);
          hasInitializedRef.current = true;
        }
      }
    } catch (error) {
      console.error("Error loading cached notifications:", error);
      // If there's an error with cached data, we'll just fetch fresh data
    }
  }, []);

  // Update refs when state changes
  // useEffect(() => {
  //   authActivitiesRef.current = authActivities;

  //   // Cache the auth data when it changes
  //   if (authActivities.length > 0) {
  //     try {
  //       localStorage.setItem(CACHE_KEY_AUTH, JSON.stringify(authActivities));
  //       // Set or update expiry time
  //       localStorage.setItem(
  //         CACHE_EXPIRY,
  //         (Date.now() + CACHE_VALIDITY).toString()
  //       );
  //     } catch (error) {
  //       console.error("Error caching auth notifications:", error);
  //     }
  //   }
  // }, [authActivities]);

  // useEffect(() => {
  //   adminActivitiesRef.current = adminActivities;

  //   // Cache the admin data when it changes
  //   if (adminActivities.length > 0) {
  //     try {
  //       localStorage.setItem(CACHE_KEY_ADMIN, JSON.stringify(adminActivities));
  //       // Set or update expiry time
  //       localStorage.setItem(
  //         CACHE_EXPIRY,
  //         (Date.now() + CACHE_VALIDITY).toString()
  //       );
  //     } catch (error) {
  //       console.error("Error caching admin notifications:", error);
  //     }
  //   }
  // }, [adminActivities]);

  // Calculate unread counts when activities change
  useEffect(() => {
    const authUnread = authActivities.filter(
      (item) => item.readStatus === 0
    ).length;
    setUnreadAuthCount(authUnread);
  }, [authActivities]);

  useEffect(() => {
    const adminUnread = adminActivities.filter(
      (item) => item.readStatus === 0
    ).length;
    setUnreadAdminCount(adminUnread);
  }, [adminActivities]);

  // Fetch unread counts separately to ensure they're always accurate
  const fetchUnreadCounts = useCallback(async () => {
    try {
      const response = await userHistoryApi.getUnreadCount();
      if (response && response.data) {
        const authCount = response.data.authCount || 0;
        const adminCount = response.data.adminCount || 0;
        setUnreadAuthCount(authCount);
        setUnreadAdminCount(adminCount);
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  }, []);

  // Fetch initial notifications with improved loading state management
  const fetchNotifications = useCallback(async () => {
    if (loading) return;

    // Set a timeout to show loading spinner only if fetch takes more than 300ms
    // This prevents flickering for quick responses
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      // Fetch notifications
      const [authResponse, adminResponse] = await Promise.all([
        userHistoryApi.getAllauthactivities(),
        userHistoryApi.getAlladminactivities(),
      ]);

      // Clear loading timeout since we got a response
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Only update state if we have valid data
      if (authResponse && authResponse.data && authResponse.data.content) {
        setAuthActivities(authResponse.data.content);
      }

      if (adminResponse && adminResponse.data && adminResponse.data.content) {
        setAdminActivities(adminResponse.data.content);
      }

      hasInitializedRef.current = true;

      // Always fetch unread counts
      await fetchUnreadCounts();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Không thể tải thông báo, vui lòng thử lại sau.", {
        autoClose: 3000,
        position: "bottom-right",
      });
    } finally {
      // Clear loading timeout and state
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setLoading(false);
    }
  }, [loading, fetchUnreadCounts]);

  // Initial load with fallback to cached data
  useEffect(() => {
    // If we already have cached data, fetch in background without showing loading
    if (authActivities.length > 0 && adminActivities.length > 0) {
      fetchNotifications().catch(console.error);
    } else {
      // Otherwise fetch and show loading if needed
      fetchNotifications();
    }

    // Set up periodic refresh of unread counts
    const countInterval = setInterval(fetchUnreadCounts, 60000); // Every minute

    return () => {
      clearInterval(countInterval);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [
    fetchNotifications,
    fetchUnreadCounts,
    authActivities.length,
    adminActivities.length,
  ]);

  // Refresh data when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      fetchNotifications();
    }
  }, [dropdownOpen, fetchNotifications]);

  // Subscribe to real-time updates
  useEffect(() => {
    // Set up SSE connections for realtime updates
    const authUnsubscribe = userHistorySSE.subscribeToAuthActivities((data) => {
      if (data && data.content) {
        // console.log('Received auth activities update:', data.content.length, 'items');

        // We need to preserve read status for items that might have been marked as read locally
        const updatedContent = data.content.map((newItem) => {
          // Try to find the same item in our current state
          const existingItem = authActivitiesRef.current.find(
            (item) => item.idHistory === newItem.idHistory
          );

          // If it exists and was marked as read, preserve that status
          if (existingItem && existingItem.readStatus === 1) {
            return { ...newItem, readStatus: 1 };
          }

          return newItem;
        });

        setAuthActivities(updatedContent);

        // Show toast for new notifications if dropdown is closed
        if (!dropdownOpen) {
          const newItems = updatedContent.filter(
            (item) =>
              !authActivitiesRef.current.some(
                (existing) => existing.idHistory === item.idHistory
              )
          );

          if (newItems.length > 0) {
            toast.info(
              `Bạn có ${newItems.length} thông báo mới về hoạt động đăng nhập`,
              {
                position: "bottom-right",
                autoClose: 3000,
              }
            );
          }
        }

        // Update unread count
        const newUnreadCount = updatedContent.filter(
          (item) => item.readStatus === 0
        ).length;
        setUnreadAuthCount(newUnreadCount);
      }
    });

    const adminUnsubscribe = userHistorySSE.subscribeToAdminActivities(
      (data) => {
        if (data && data.content) {
          // console.log('Received admin activities update:', data.content.length, 'items');

          // Same preservation logic for admin activities
          const updatedContent = data.content.map((newItem) => {
            const existingItem = adminActivitiesRef.current.find(
              (item) => item.idHistory === newItem.idHistory
            );

            if (existingItem && existingItem.readStatus === 1) {
              return { ...newItem, readStatus: 1 };
            }

            return newItem;
          });

          setAdminActivities(updatedContent);

          // Show toast for new notifications if dropdown is closed
          if (!dropdownOpen) {
            const newItems = updatedContent.filter(
              (item) =>
                !adminActivitiesRef.current.some(
                  (existing) => existing.idHistory === item.idHistory
                )
            );

            if (newItems.length > 0) {
              toast.info(
                `Bạn có ${newItems.length} thông báo mới về hoạt động quản trị`,
                {
                  position: "bottom-right",
                  autoClose: 3000,
                }
              );
            }
          }

          // Update unread count
          const newUnreadCount = updatedContent.filter(
            (item) => item.readStatus === 0
          ).length;
          setUnreadAdminCount(newUnreadCount);
        }
      }
    );

    return () => {
      // Clean up subscriptions when component unmounts
      authUnsubscribe();
      adminUnsubscribe();
    };
  }, [dropdownOpen]);

  // Add event listener for notification reads from UserHistory
  useEffect(() => {
    const handleNotificationRead = (event) => {
      const { idHistory } = event.detail;

      // Update auth activities
      setAuthActivities((prev) =>
        prev.map((item) =>
          item.idHistory === idHistory ? { ...item, readStatus: 1 } : item
        )
      );

      // Update admin activities
      setAdminActivities((prev) =>
        prev.map((item) =>
          item.idHistory === idHistory ? { ...item, readStatus: 1 } : item
        )
      );

      // Update unread counts
      const updatedAuthUnread = authActivitiesRef.current.filter(
        (item) => item.idHistory !== idHistory && item.readStatus === 0
      ).length;
      const updatedAdminUnread = adminActivitiesRef.current.filter(
        (item) => item.idHistory !== idHistory && item.readStatus === 0
      ).length;

      setUnreadAuthCount(updatedAuthUnread);
      setUnreadAdminCount(updatedAdminUnread);
    };

    window.addEventListener("notificationRead", handleNotificationRead);

    return () => {
      window.removeEventListener("notificationRead", handleNotificationRead);
    };
  }, []);

  // Update refs when activities change
  useEffect(() => {
    authActivitiesRef.current = authActivities;
  }, [authActivities]);

  useEffect(() => {
    adminActivitiesRef.current = adminActivities;
  }, [adminActivities]);

  const handleNotificationClick = async (item) => {
    setSelectedNotification(item);
    setDetailModalVisible(true);
    setDropdownOpen(false);

    if (item.readStatus === 0) {
      try {
        // Optimistic update
        const updateReadStatus = (activities) =>
          activities.map((activity) =>
            activity.idHistory === item.idHistory
              ? { ...activity, readStatus: 1 }
              : activity
          );

        // Update both state and refs immediately
        const updatedAuthActivities = updateReadStatus(authActivities);
        const updatedAdminActivities = updateReadStatus(adminActivities);
        
        setAuthActivities(updatedAuthActivities);
        setAdminActivities(updatedAdminActivities);
        
        // Update refs
        authActivitiesRef.current = updatedAuthActivities;
        adminActivitiesRef.current = updatedAdminActivities;

        // Update counts
        const isAuthNotification = ['LOGIN', 'LOGOUT', 'LOGIN_FAILED'].includes(item.actionType);
        if (isAuthNotification) {
          setUnreadAuthCount(prev => Math.max(0, prev - 1));
        } else {
          setUnreadAdminCount(prev => Math.max(0, prev - 1));
        }

        // API call
        await markAsRead(item.idHistory);
        
        // Refresh notifications to ensure sync
        await fetchNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Không thể cập nhật trạng thái thông báo", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    }
  };

  const markAsRead = async (historyId) => {
    try {
      await userHistoryApi.markAsRead(historyId);
      
      // Update both state and refs
      const updateReadStatus = (activities) =>
        activities.map((activity) =>
          activity.idHistory === historyId
            ? { ...activity, readStatus: 1 }
            : activity
        );

      setAuthActivities(prev => {
        const updated = updateReadStatus(prev);
        authActivitiesRef.current = updated;
        return updated;
      });

      setAdminActivities(prev => {
        const updated = updateReadStatus(prev);
        adminActivitiesRef.current = updated;
        return updated;
      });

      await fetchUnreadCounts();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  const markAllAsRead = async (type) => {
    try {
      if (type === "auth") {
        await userHistoryApi.markAllAuthAsRead();
        setAuthActivities((prev) =>
          prev.map((item) => ({ ...item, readStatus: 1 }))
        );
        setUnreadAuthCount(0);
        console.log(type);
      } else if (type === "admin") {
        await userHistoryApi.markAllAdminAsRead();
        setAdminActivities((prev) =>
          prev.map((item) => ({ ...item, readStatus: 1 }))
        );
        setUnreadAdminCount(0);
      }
      toast.success(`Đã đánh dấu tất cả thông báo là đã đọc`, {
        autoClose: 2000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Không thể cập nhật trạng thái thông báo", {
        autoClose: 3000,
        position: "bottom-right",
      });
    }
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedNotification(null);
  };

  const renderActionIcon = (actionType) => {
    switch (actionType) {
      // Auth actions
      case 'LOGIN':
        return <Avatar size="small" style={{ backgroundColor: "#52c41a" }}>LI</Avatar>;
      case 'LOGOUT':
        return <Avatar size="small" style={{ backgroundColor: "#faad14" }}>LO</Avatar>;
      case 'LOGIN_FAILED':
        return <Avatar size="small" style={{ backgroundColor: "#f5222d" }}>LF</Avatar>;
      case 'RELOGIN':
        return <Avatar size="small" style={{ backgroundColor: "#52c41a" }}>RL</Avatar>;

      // Product actions  
      case 'CREATE_PRODUCT':
        return <Avatar size="small" style={{ backgroundColor: "#722ed1" }}>CP</Avatar>;
      case 'UPDATE_PRODUCT':
        return <Avatar size="small" style={{ backgroundColor: "#722ed1" }}>UP</Avatar>;
      case 'DELETE_PRODUCT':
        return <Avatar size="small" style={{ backgroundColor: "#722ed1" }}>DP</Avatar>;

      // Category actions
      case 'CREATE_CATEGORIE':
        return <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>CC</Avatar>;
      case 'UPDATE_CATEGORIE':
        return <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>UC</Avatar>;
      case 'DELETE_CATEGORIE':
        return <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>DC</Avatar>;

      // Size actions
      case 'CREATE_SIZE':
        return <Avatar size="small" style={{ backgroundColor: "#13c2c2" }}>CS</Avatar>;
      case 'UPDATE_SIZE':
        return <Avatar size="small" style={{ backgroundColor: "#13c2c2" }}>US</Avatar>;
      case 'DELETE_SIZE':
        return <Avatar size="small" style={{ backgroundColor: "#13c2c2" }}>DS</Avatar>;

      // Brand actions  
      case 'CREATE_BRAND':
        return <Avatar size="small" style={{ backgroundColor: "#eb2f96" }}>CB</Avatar>;
      case 'UPDATE_BRAND':
        return <Avatar size="small" style={{ backgroundColor: "#eb2f96" }}>UB</Avatar>;
      case 'DELETE_BRAND':
        return <Avatar size="small" style={{ backgroundColor: "#eb2f96" }}>DB</Avatar>;

      // Supplier actions
      case 'CREATE_SUPPLIER':
        return <Avatar size="small" style={{ backgroundColor: "#fa8c16" }}>CS</Avatar>;
      case 'UPDATE_SUPPLIER':
        return <Avatar size="small" style={{ backgroundColor: "#fa8c16" }}>US</Avatar>;
      case 'DELETE_SUPPLIER':
        return <Avatar size="small" style={{ backgroundColor: "#fa8c16" }}>DS</Avatar>;

      // Stock Receipt actions
      case 'CREATE_STOCK_RECEIPT':
        return <Avatar size="small" style={{ backgroundColor: "#a0d911" }}>CR</Avatar>;
      case 'UPDATE_STOCK_RECEIPT':
        return <Avatar size="small" style={{ backgroundColor: "#a0d911" }}>UR</Avatar>;
      case 'DELETE_STOCK_RECEIPT':
        return <Avatar size="small" style={{ backgroundColor: "#a0d911" }}>DR</Avatar>;

      default:
        return <Avatar size="small" style={{ backgroundColor: "#8c8c8c" }}>N/A</Avatar>;
    }
  };

  const renderNotificationItem = (item) => (
    <List.Item
      key={item.idHistory}
      className={
        item.readStatus === 0 ? "notification-item unread" : "notification-item"
      }
      onClick={() => handleNotificationClick(item)}
    >
      <List.Item.Meta
        avatar={renderActionIcon(item.actionType)}
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text strong={item.readStatus === 0}>
              {getNotificationTitle(item)}
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: "12px", whiteSpace: "nowrap" }}
            >
              {formatTimeDistance(item.historyDateTime)}
            </Text>
          </div>
        }
        description={
          <div
            style={{
              fontSize: "12px",
              color: "rgba(0, 0, 0, 0.45)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {getNotificationDescription(item)}
          </div>
        }
      />
      {item.readStatus === 0 && (
        <Badge
          status="processing"
          color="#1890ff"
          style={{ marginLeft: "8px" }}
        />
      )}
    </List.Item>
  );

  const formatTimeDistance = (dateString) => {
    try {
      if (!dateString) return "";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return ""; // Return empty string for invalid dates
      }

      // For today's dates, show relative time like "5 phút trước"
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      //   if (isToday) {
      //     return formatDistanceToNow(date, { addSuffix: true, locale: vi });
      //   } else {
      //     // For older dates, show the actual date and time
      //     return format(date, 'HH:mm - dd/MM/yyyy');
      //   }
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return dateString || ""; // Return the original string if there's an error
    }
  };

  const getNotificationTitle = (item) => {
    // Lấy dòng đầu tiên của note làm tiêu đề
    const firstLine = item.note?.split('\n')[0] || '';
    if (firstLine) {
      return firstLine;
    }

    // Fallback nếu không có note
    switch (item.actionType) {
      case 'LOGIN':
        return `Đăng nhập - ${item.username || ''}`;
      case 'LOGOUT':
        return `Đăng xuất - ${item.username || ''}`;
      case 'LOGIN_FAILED':
        return `Đăng nhập thất bại - ${item.username || ''}`;
      default:
        return item.actionType
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getNotificationDescription = (item) => {
    // Lấy phần còn lại của note làm mô tả
    const lines = item.note?.split('\n') || [];
    if (lines.length > 1) {
      return lines.slice(1).join('\n');
    }
    return 'Không có mô tả';
  };

  const handleTabChange = (activeKey) => {
    setActiveTabKey(activeKey);
  };

  // Don't show loading if we have cached data
  const showLoading =
    loading &&
    ((activeTabKey === "1" && authActivities.length === 0) ||
      (activeTabKey === "2" && adminActivities.length === 0));

  // Define tab items configuration
  const filterUnreadNotifications = (notifications) => {
    return notifications.filter((item) => item.readStatus === 0);
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <Badge count={unreadAuthCount} size="small" offset={[8, 0]}>
          Đăng nhập
        </Badge>
      ),
      children: (
        <>
          <div className="notification-header">
            <Title level={5}>Hoạt động đăng nhập chưa đọc</Title>
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => markAllAsRead("auth")}
              disabled={unreadAuthCount === 0}
            >
              Đánh dấu đã đọc
            </Button>
          </div>

          {showLoading && activeTabKey === "1" ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          ) : unreadAuthCount > 0 ? (
            <List
              className="notification-list"
              itemLayout="horizontal"
              dataSource={filterUnreadNotifications(authActivities)}
              renderItem={renderNotificationItem}
            />
          ) : (
            <Empty description="Không có thông báo chưa đọc" />
          )}
        </>
      ),
    },
    {
      key: "2",
      label: (
        <Badge count={unreadAdminCount} size="small" offset={[8, 0]}>
          Hoạt động
        </Badge>
      ),
      children: (
        <>
          <div className="notification-header">
            <Title level={5}>Hoạt động quản trị chưa đọc</Title>
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => markAllAsRead("admin")}
              disabled={unreadAdminCount === 0}
            >
              Đánh dấu đã đọc
            </Button>
          </div>

          {showLoading && activeTabKey === "2" ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          ) : unreadAdminCount > 0 ? (
            <List
              className="notification-list"
              itemLayout="horizontal"
              dataSource={filterUnreadNotifications(adminActivities)}
              renderItem={renderNotificationItem}
            />
          ) : (
            <Empty description="Không có thông báo chưa đọc" />
          )}
        </>
      ),
    },
  ];

  const notificationDropdownContent = (
    <div className="notification-dropdown">
      <Tabs
        activeKey={activeTabKey}
        onChange={handleTabChange}
        centered
        items={tabItems}
      />

      <div className="notification-footer">
        <Button
          type="link"
          onClick={() => {
            setDropdownOpen(false);
            navigate(ADMIN_ROUTES.USERS.HISTORY);
          }}
        >
          Xem tất cả
        </Button>
      </div>
    </div>
  );

  // Create menu object for Dropdown
  const menu = {
    items: [
      {
        key: "1",
        label: notificationDropdownContent,
      },
    ],
  };

  return (
    <>
      <Dropdown
        menu={menu}
        trigger={["click"]}
        open={dropdownOpen}
        onOpenChange={(visible) => {
          setDropdownOpen(visible);
          if (visible) {
            fetchNotifications();
          }
          // Close modal if dropdown is closed
          if (!visible) {
            setDetailModalVisible(false);
            setSelectedNotification(null);
          }
        }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        dropdownRender={() => notificationDropdownContent}
        destroyPopupOnHide={false}
      >
        <div className="notification-trigger">
          <Badge
            count={unreadAuthCount + unreadAdminCount}
            size="small"
            className={
              unreadAuthCount + unreadAdminCount > 0
                ? "notification-badge-animated"
                : ""
            }
          >
            <span className="cursor-pointer text-gray-600 hover:text-blue-500">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
            </span>
          </Badge>
        </div>
      </Dropdown>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        visible={detailModalVisible}
        notification={selectedNotification}
        onClose={handleDetailModalClose}
        ref={modalRef}
      />
    </>
  );
};

export default NotificationDropdown;
