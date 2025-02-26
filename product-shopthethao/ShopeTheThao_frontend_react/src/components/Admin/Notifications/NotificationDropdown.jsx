import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Badge, Dropdown, List, Typography, Avatar, Spin, Empty, Tabs, Button } from 'antd';
import { BellOutlined, CheckOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import userHistoryApi from 'api/Admin/UserHistory/userHistoryApi';
import { userHistorySSE } from 'api/Admin/UserHistory/userHistorySSE';
// import { format, formatDistanceToNow } from 'date-fns';
// import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './NotificationDropdown.css';
import NotificationDetailModal from './NotificationDetailModal';

const { Text, Title } = Typography;

// Create a cache key for localStorage
const CACHE_KEY_AUTH = 'shopethethao_auth_notifications';
const CACHE_KEY_ADMIN = 'shopethethao_admin_notifications';
const CACHE_EXPIRY = 'shopethethao_notifications_expiry';
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
          const authUnread = authData.filter(item => item.readStatus === 0).length;
          const adminUnread = adminData.filter(item => item.readStatus === 0).length;
          
          setUnreadAuthCount(authUnread);
          setUnreadAdminCount(adminUnread);
          hasInitializedRef.current = true;
        }
      }
    } catch (error) {
      console.error('Error loading cached notifications:', error);
      // If there's an error with cached data, we'll just fetch fresh data
    }
  }, []);

  // Update refs when state changes
  useEffect(() => {
    authActivitiesRef.current = authActivities;
    
    // Cache the auth data when it changes
    if (authActivities.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY_AUTH, JSON.stringify(authActivities));
        // Set or update expiry time
        localStorage.setItem(CACHE_EXPIRY, (Date.now() + CACHE_VALIDITY).toString());
      } catch (error) {
        console.error('Error caching auth notifications:', error);
      }
    }
  }, [authActivities]);

  useEffect(() => {
    adminActivitiesRef.current = adminActivities;
    
    // Cache the admin data when it changes
    if (adminActivities.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY_ADMIN, JSON.stringify(adminActivities));
        // Set or update expiry time
        localStorage.setItem(CACHE_EXPIRY, (Date.now() + CACHE_VALIDITY).toString());
      } catch (error) {
        console.error('Error caching admin notifications:', error);
      }
    }
  }, [adminActivities]);

  // Calculate unread counts when activities change
  useEffect(() => {
    const authUnread = authActivities.filter(item => item.readStatus === 0).length;
    setUnreadAuthCount(authUnread);
  }, [authActivities]);

  useEffect(() => {
    const adminUnread = adminActivities.filter(item => item.readStatus === 0).length;
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
      console.error('Error fetching unread counts:', error);
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
        userHistoryApi.getAlladminactivities()
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
      console.error('Error fetching notifications:', error);
      toast.error('Không thể tải thông báo, vui lòng thử lại sau.', {
        autoClose: 3000,
        position: 'bottom-right'
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
  }, [fetchNotifications, fetchUnreadCounts, authActivities.length, adminActivities.length]);

  // Refresh data when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      fetchNotifications();
    }
  }, [dropdownOpen, fetchNotifications]);

  // Subscribe to real-time updates
  useEffect(() => {
    // Set up SSE connections for realtime updates
    const authUnsubscribe = userHistorySSE.subscribeToAuthActivities(data => {
      if (data && data.content) {
        console.log('Received auth activities update:', data.content.length, 'items');
        
        // We need to preserve read status for items that might have been marked as read locally
        const updatedContent = data.content.map(newItem => {
          // Try to find the same item in our current state
          const existingItem = authActivitiesRef.current.find(
            item => item.idHistory === newItem.idHistory
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
            item => !authActivitiesRef.current.some(
              existing => existing.idHistory === item.idHistory
            )
          );
          
          if (newItems.length > 0) {
            toast.info(`Bạn có ${newItems.length} thông báo mới về hoạt động đăng nhập`, {
              position: 'bottom-right',
              autoClose: 3000
            });
          }
        }
        
        // Update unread count
        const newUnreadCount = updatedContent.filter(item => item.readStatus === 0).length;
        setUnreadAuthCount(newUnreadCount);
      }
    });

    const adminUnsubscribe = userHistorySSE.subscribeToAdminActivities(data => {
      if (data && data.content) {
        console.log('Received admin activities update:', data.content.length, 'items');
        
        // Same preservation logic for admin activities
        const updatedContent = data.content.map(newItem => {
          const existingItem = adminActivitiesRef.current.find(
            item => item.idHistory === newItem.idHistory
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
            item => !adminActivitiesRef.current.some(
              existing => existing.idHistory === item.idHistory
            )
          );
          
          if (newItems.length > 0) {
            toast.info(`Bạn có ${newItems.length} thông báo mới về hoạt động quản trị`, {
              position: 'bottom-right',
              autoClose: 3000
            });
          }
        }
        
        // Update unread count
        const newUnreadCount = updatedContent.filter(item => item.readStatus === 0).length;
        setUnreadAdminCount(newUnreadCount);
      }
    });

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
      setAuthActivities(prev =>
        prev.map(item =>
          item.idHistory === idHistory
            ? { ...item, readStatus: 1 }
            : item
        )
      );
      
      // Update admin activities
      setAdminActivities(prev =>
        prev.map(item =>
          item.idHistory === idHistory
            ? { ...item, readStatus: 1 }
            : item
        )
      );
      
      // Update unread counts
      const updatedAuthUnread = authActivitiesRef.current
        .filter(item => item.idHistory !== idHistory && item.readStatus === 0).length;
      const updatedAdminUnread = adminActivitiesRef.current
        .filter(item => item.idHistory !== idHistory && item.readStatus === 0).length;
      
      setUnreadAuthCount(updatedAuthUnread);
      setUnreadAdminCount(updatedAdminUnread);
    };

    window.addEventListener('notificationRead', handleNotificationRead);

    return () => {
      window.removeEventListener('notificationRead', handleNotificationRead);
    };
  }, []);

  const markAsRead = async (historyId) => {
    try {
      await userHistoryApi.markAsRead(historyId);
      
      // Update local state for auth activities
      setAuthActivities(prev => 
        prev.map(item => item.idHistory === historyId ? {...item, readStatus: 1} : item)
      );
      
      // Update local state for admin activities
      setAdminActivities(prev => 
        prev.map(item => item.idHistory === historyId ? {...item, readStatus: 1} : item)
      );
      
      // Update unread counts
      fetchUnreadCounts();
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async (type) => {
    try {
      if (type === 'auth') {
        await userHistoryApi.markAllAuthAsRead();
        setAuthActivities(prev => prev.map(item => ({...item, readStatus: 1})));
        setUnreadAuthCount(0);
      console.log(type);
      
        
      } else if (type === 'admin') {
        await userHistoryApi.markAllAdminAsRead();
        setAdminActivities(prev => prev.map(item => ({...item, readStatus: 1})));
        setUnreadAdminCount(0);
      }
      toast.success(`Đã đánh dấu tất cả thông báo là đã đọc`, {
        autoClose: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Không thể cập nhật trạng thái thông báo', {
        autoClose: 3000,
        position: 'bottom-right'
      });
    }
  };

  const handleNotificationClick = async (item) => {
    // Mark as read if not already
    if (item.readStatus === 0) {
      await markAsRead(item.idHistory);
    }
    
    // Show notification details modal first
    setSelectedNotification(item);
    setDetailModalVisible(true);
    
    // Keep the dropdown open while viewing details
    // Don't close the dropdown here: setDropdownOpen(false);
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    // Don't immediately navigate or close dropdown when modal closes
    // This gives a better UX, letting the user see the transition
    
    // Small delay before potentially navigating to ensure modal transition completes
    setTimeout(() => {
      if (selectedNotification) {
        handleActionAfterViewingDetails(selectedNotification);
      }
    }, 100);
  };

  const handleActionAfterViewingDetails = (item) => {
    // Close dropdown
    setDropdownOpen(false);
    
    // Navigate based on action type
    switch (item.actionType) {
      case 'UPDATE_CATEGORIE':
      case 'CREATE_CATEGORIE':
      case 'DELETE_CATEGORIE':
        // navigate(`/admin/categories/history/${item.idHistory}`);
        break;
      case 'UPDATE_PRODUCT':
      case 'CREATE_PRODUCT':
      case 'DELETE_PRODUCT':
        // navigate(`/admin/products/history/${item.idHistory}`);
        break;
      case 'LOGIN_FAILED':
        navigate('/admin/security-alerts');
        break;
      default:
        // For most notifications, just show the detail modal
        // We've already done this, so just close the dropdown
        setDropdownOpen(false);
    }
  };

  const renderActionIcon = (actionType) => {
    switch (actionType) {
      case 'LOGIN':
        return <Avatar size="small" style={{ backgroundColor: '#52c41a' }}>L</Avatar>;
      case 'LOGOUT':
        return <Avatar size="small" style={{ backgroundColor: '#faad14' }}>O</Avatar>;
      case 'LOGIN_FAILED':
        return <Avatar size="small" style={{ backgroundColor: '#f5222d' }}>F</Avatar>;
      case 'UPDATE_CATEGORIE':
        return <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>C</Avatar>;
      case 'UPDATE_PRODUCT':
        return <Avatar size="small" style={{ backgroundColor: '#722ed1' }}>P</Avatar>;
      default:
        return <Avatar size="small" style={{ backgroundColor: '#8c8c8c' }}>A</Avatar>;
    }
  };

  const renderNotificationItem = (item) => (
    <List.Item
      key={item.idHistory}
      className={item.readStatus === 0 ? 'notification-item unread' : 'notification-item'}
      onClick={() => handleNotificationClick(item)}
    >
      <List.Item.Meta
        avatar={renderActionIcon(item.actionType)}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong={item.readStatus === 0}>{getNotificationTitle(item)}</Text>
            <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
              {formatTimeDistance(item.historyDateTime)}
            </Text>
          </div>
        }
        description={
          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {getNotificationDescription(item)}
          </div>
        }
      />
      {item.readStatus === 0 && (
        <Badge status="processing" color="#1890ff" style={{ marginLeft: '8px' }} />
      )}
    </List.Item>
  );
  
  const formatTimeDistance = (dateString) => {
    try {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return ''; // Return empty string for invalid dates
      }
      
      // For today's dates, show relative time like "5 phút trước"
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
      
    //   if (isToday) {
    //     return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    //   } else {
    //     // For older dates, show the actual date and time
    //     return format(date, 'HH:mm - dd/MM/yyyy');
    //   }
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return dateString || ''; // Return the original string if there's an error
    }
  };
  
  const getNotificationTitle = (item) => {
    switch (item.actionType) {
      case 'LOGIN':
        return `Đăng nhập ${item.username ? '- ' + item.username : ''}`;
      case 'LOGOUT':
        return `Đăng xuất ${item.username ? '- ' + item.username : ''}`;
      case 'LOGIN_FAILED':
        return 'Đăng nhập thất bại';
      case 'UPDATE_CATEGORIE':
        return 'Cập nhật danh mục';
      case 'UPDATE_PRODUCT':
        return 'Cập nhật sản phẩm';
      default:
        return item.actionType.replace(/_/g, ' ').toLowerCase()
          .replace(/\b\w/g, c => c.toUpperCase());
    }
  };
  
  const getNotificationDescription = (item) => {
    if (item.note?.length > 100) {
      return `${item.note.substring(0, 100)}...`;
    }
    return item.note || 'Không có mô tả';
  };

  const handleTabChange = (activeKey) => {
    setActiveTabKey(activeKey);
  };

  // Don't show loading if we have cached data
  const showLoading = loading && ((activeTabKey === "1" && authActivities.length === 0) || 
                                (activeTabKey === "2" && adminActivities.length === 0));

  // Define tab items configuration
  const tabItems = [
    {
      key: "1",
      label: <Badge count={unreadAuthCount} size="small" offset={[8, 0]}>Đăng nhập</Badge>,
      children: (
        <>
          <div className="notification-header">
            <Title level={5}>Hoạt động đăng nhập</Title>
            <Button 
              type="link" 
              size="small" 
              icon={<CheckCircleOutlined />}
              onClick={() => markAllAsRead('auth')}
              disabled={unreadAuthCount === 0}
            >
              Đánh dấu đã đọc
            </Button>
          </div>
          
          {showLoading && activeTabKey === "1" ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : authActivities.length > 0 ? (
            <List
              className="notification-list"
              itemLayout="horizontal"
              dataSource={authActivities}
              renderItem={renderNotificationItem}
            />
          ) : (
            <Empty description="Không có thông báo" />
          )}
        </>
      )
    },
    {
      key: "2",
      label: <Badge count={unreadAdminCount} size="small" offset={[8, 0]}>Hoạt động</Badge>,
      children: (
        <>
          <div className="notification-header">
            <Title level={5}>Hoạt động quản trị</Title>
            <Button 
              type="link"
              size="small" 
              icon={<CheckCircleOutlined />}
              onClick={() => markAllAsRead('admin')}
              disabled={unreadAdminCount === 0}
            >
              Đánh dấu đã đọc
            </Button>
          </div>
          
          {showLoading && activeTabKey === "2" ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : adminActivities.length > 0 ? (
            <List
              className="notification-list"
              itemLayout="horizontal"
              dataSource={adminActivities}
              renderItem={renderNotificationItem}
            />
          ) : (
            <Empty description="Không có thông báo" />
          )}
        </>
      )
    }
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
        <Button type="link" onClick={() => {
          setDropdownOpen(false);
          navigate('/admin/userhistory');
        }}>
          Xem tất cả
        </Button>
      </div>
    </div>
  );

  // Create menu object for Dropdown
  const menu = {
    items: [{
      key: '1',
      label: notificationDropdownContent
    }]
  };

  return (
    <>
      <Dropdown
        menu={menu}
        trigger={['click']}
        open={dropdownOpen}
        onOpenChange={(visible) => {
          setDropdownOpen(visible);
          if (visible) {
            fetchNotifications();
          }
          // If dropdown is closed, also ensure modal is closed
          if (!visible && detailModalVisible) {
            setDetailModalVisible(false);
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
            className={(unreadAuthCount + unreadAdminCount) > 0 ? 'notification-badge-animated' : ''}
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
