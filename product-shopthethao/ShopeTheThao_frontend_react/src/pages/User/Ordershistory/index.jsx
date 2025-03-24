import React, { useState, useEffect, useRef } from 'react';
import './Ordershistory.scss';
import {
  FaSearch,
  FaCheckCircle,
  FaAngleDown,
  FaAngleUp,
  FaTimes,
  FaCalendarAlt,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaMapMarkerAlt,
  FaCreditCard,
  FaStickyNote,
  FaSpinner,
  FaEraser,
  FaRegClock,
  FaThList,
  FaRegBell,
  FaEye,
  FaHome,
  FaHistory
} from "react-icons/fa";
import Loading from "pages/Loading/loading";

const Ordershistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortOrder, setSortOrder] = useState("desc");
  const [orderStatistics, setOrderStatistics] = useState({
    total: 0,
    completed: 0
  });

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Đơn hàng tháng 8",
    "ORD-001",
    "COD",
  ]);

  const searchInputRef = useRef(null);
  const searchHistoryRef = useRef(null);

  // Dữ liệu mẫu đơn hàng đã hoàn thành
  const sampleOrders = [
    {
      id: 'ORD-001',
      orderCode: 'ORD-001',
      date: '15/06/2023',
      createdAt: '2023-06-15T10:30:00',
      total: 1250000,
      status: 'completed',
      items: 3,
      address: '123 Đường ABC, Quận 1, TP.HCM',
      paymentMethod: 'COD',
      note: 'Giao hàng buổi chiều',
      customerName: 'Nguyễn Văn A',
      products: [
        {
          id: 1,
          name: 'Áo bóng đá Arsenal',
          size: 'L',
          quantity: 1,
          price: 450000,
          image: 'arsenal_shirt.jpg',
        },
        {
          id: 2,
          name: 'Giày Nike Mercurial',
          size: '42',
          quantity: 1,
          price: 800000,
          image: 'nike_mercurial.jpg',
        }
      ]
    },
    {
      id: 'ORD-002',
      orderCode: 'ORD-002',
      date: '22/07/2023',
      createdAt: '2023-07-22T14:45:00',
      total: 890000,
      status: 'completed',
      items: 2,
      address: '456 Đường XYZ, Quận 7, TP.HCM',
      paymentMethod: 'Banking',
      note: '',
      customerName: 'Trần Thị B',
      products: [
        {
          id: 3,
          name: 'Quần đá bóng Adidas',
          size: 'M',
          quantity: 2,
          price: 350000,
          image: 'adidas_shorts.jpg',
        },
        {
          id: 4,
          name: 'Tất bóng đá',
          size: 'L',
          quantity: 2,
          price: 95000,
          image: 'football_socks.jpg',
        }
      ]
    },
    {
      id: 'ORD-003',
      orderCode: 'ORD-003',
      date: '05/08/2023',
      createdAt: '2023-08-05T09:15:00',
      total: 1750000,
      status: 'completed',
      items: 4,
      address: '789 Đường DEF, Quận 3, TP.HCM',
      paymentMethod: 'Momo',
      note: 'Giao vào buổi sáng',
      customerName: 'Lê Văn C',
      products: [
        {
          id: 5,
          name: 'Áo bóng đá Manchester United',
          size: 'XL',
          quantity: 1,
          price: 500000,
          image: 'mu_shirt.jpg',
        },
        {
          id: 6,
          name: 'Bóng đá Nike Strike',
          size: '5',
          quantity: 1,
          price: 850000,
          image: 'nike_ball.jpg',
        },
        {
          id: 7,
          name: 'Băng đô thể thao',
          size: 'Free size',
          quantity: 2,
          price: 200000,
          image: 'headband.jpg',
        }
      ]
    },
    {
      id: 'ORD-004',
      orderCode: 'ORD-004',
      date: '17/09/2023',
      createdAt: '2023-09-17T16:20:00',
      total: 2150000,
      status: 'completed',
      items: 3,
      address: '101 Đường GHI, Quận 2, TP.HCM',
      paymentMethod: 'Banking',
      note: '',
      customerName: 'Phạm Thị D',
      products: [
        {
          id: 8,
          name: 'Áo bóng đá Chelsea',
          size: 'L',
          quantity: 1,
          price: 450000,
          image: 'chelsea_shirt.jpg',
        },
        {
          id: 9,
          name: 'Giày Adidas Predator',
          size: '43',
          quantity: 1,
          price: 1500000,
          image: 'adidas_predator.jpg',
        },
        {
          id: 10,
          name: 'Túi đựng giày',
          size: 'Free size',
          quantity: 1,
          price: 200000,
          image: 'shoe_bag.jpg',
        }
      ]
    },
    {
      id: 'ORD-005',
      orderCode: 'ORD-005',
      date: '23/10/2023',
      createdAt: '2023-10-23T11:10:00',
      total: 940000,
      status: 'completed',
      items: 2,
      address: '202 Đường JKL, Quận 5, TP.HCM',
      paymentMethod: 'COD',
      note: 'Gọi điện trước khi giao',
      customerName: 'Hoàng Văn E',
      products: [
        {
          id: 11,
          name: 'Áo khoác thể thao',
          size: 'XL',
          quantity: 1,
          price: 650000,
          image: 'sports_jacket.jpg',
        },
        {
          id: 12,
          name: 'Găng tay thủ môn',
          size: 'L',
          quantity: 1,
          price: 290000,
          image: 'goalkeeper_gloves.jpg',
        }
      ]
    }
  ];

  useEffect(() => {
    // Fetch orders from API (using mock data for now)
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulate API call with timeout
        setTimeout(() => {
          setOrders(sampleOrders);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Calculate order statistics when orders change
    if (orders.length > 0) {
      const stats = {
        total: orders.length,
        completed: orders.filter(order => order.status === 'completed').length
      };
      setOrderStatistics(stats);
    }
  }, [orders]);

  // Handle click outside of search history
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchHistoryRef.current &&
        !searchHistoryRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSearchHistory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOrders = () => {
    let filteredOrders = [...orders];

    // Filter by search query
    if (searchQuery) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.createdAt) >= fromDate
      );
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // End of the day
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.createdAt) <= toDate
      );
    }

    // Sort orders by date
    filteredOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    // Group orders by month
    return groupOrdersByMonth(filteredOrders);
  };

  const groupOrdersByMonth = (ordersList) => {
    const grouped = {};

    ordersList.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleString("vi-VN", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(order);
    });

    return grouped;
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
    setSearchQuery("");
    setSortOrder("desc");
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Add to recent searches if not already there
    if (!recentSearches.includes(searchQuery.trim())) {
      setRecentSearches((prev) => [searchQuery.trim(), ...prev].slice(0, 5));
    }

    setSearchHistory(false);
  };

  const clearSearchHistory = () => {
    setRecentSearches([]);
  };

  const applySearchTerm = (term) => {
    setSearchQuery(term);
    setSearchHistory(false);
  };

  const getProductImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://placehold.co/60x60?text=No+Image";

    // Nếu đã là URL đầy đủ
    if (imageUrl.startsWith("http")) return imageUrl;

    // Mock URL cho demo
    return `https://example.com/images/${imageUrl}`;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  const filteredOrdersGroups = filterOrders();
  const isEmptyResults = Object.keys(filteredOrdersGroups).length === 0;

  return (
    <div className="orders-history-container">
      <div className="orders-header">
  
        <div className="header-content">
          <h1 className="page-title">Lịch sử đơn hàng</h1>

          <div className="order-statistics">
            <div className="stat-item">
              <div className="stat-value">{orderStatistics.total}</div>
              <div className="stat-label">Tổng đơn</div>
            </div>
            <div className="stat-item completed">
              <div className="stat-value">{orderStatistics.completed}</div>
              <div className="stat-label">Hoàn thành</div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-search-panel">
        <div
          className={`search-container ${searchFocused ? "focused" : ""}`}
          ref={searchInputRef}
        >
          <form onSubmit={handleSearch} className="search-form">
            <div className={`search-input ${searchFocused ? "focused" : ""}`}>
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng hoặc phương thức thanh toán"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true);
                  setSearchHistory(true);
                }}
                onBlur={() => setSearchFocused(false)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes />
                </button>
              )}
              <button type="submit" className="search-button">
                Tìm kiếm
              </button>
            </div>

            {searchHistory && (
              <div className="search-history" ref={searchHistoryRef}>
                {recentSearches.length > 0 && (
                  <div className="search-section">
                    <div className="section-header">
                      <h4>
                        <FaRegClock /> Tìm kiếm gần đây
                      </h4>
                      <button
                        className="clear-history"
                        onClick={clearSearchHistory}
                      >
                        <FaEraser /> Xóa
                      </button>
                    </div>
                    <ul>
                      {recentSearches.map((term, idx) => (
                        <li
                          key={`recent-${idx}`}
                          onClick={() => applySearchTerm(term)}
                        >
                          <FaRegClock className="item-icon" />
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="search-section">
                  <div className="section-header">
                    <h4>
                      <FaFilter /> Tìm kiếm nâng cao
                    </h4>
                  </div>
                  <div className="advanced-search-options">
                    <div className="search-option">
                      <FaThList className="option-icon" />
                      <span>Tìm theo phương thức thanh toán</span>
                      <FaAngleDown className="dropdown-icon" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="search-actions">
          <button className="filter-toggle" onClick={toggleFilters}>
            <FaFilter /> Bộ lọc {showFilters ? "▲" : "▼"}
          </button>
          <button className="sort-toggle" onClick={toggleSortOrder}>
            {sortOrder === "desc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
            {sortOrder === "desc" ? " Mới nhất" : " Cũ nhất"}
          </button>
          <div className="notification-bell">
            <FaRegBell />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-group date-range">
            <div className="filter-label">
              <FaCalendarAlt /> Khoảng thời gian:
            </div>
            <div className="date-inputs">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                placeholder="Từ ngày"
              />
              <span className="date-separator">đến</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                placeholder="Đến ngày"
              />
            </div>
          </div>
          <button className="reset-filters" onClick={resetFilters}>
            Xóa bộ lọc
          </button>
        </div>
      )}

      <div className="orders-list">
        {isEmptyResults ? (
          <div className="no-orders">Không tìm thấy đơn hàng nào</div>
        ) : (
          Object.entries(filteredOrdersGroups).map(
            ([monthYear, monthOrders]) => (
              <div key={monthYear} className="orders-month-group">
                <div className="month-header">
                  <h3>{monthYear}</h3>
                </div>

                <div className="month-orders">
                  {monthOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`order-item ${
                        expandedOrderId === order.id ? "expanded" : ""
                      }`}
                    >
                      <div
                        className="order-header"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="order-basic-info">
                          <span className="order-id">
                            Đơn hàng {order.orderCode}
                          </span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <div className="order-status-container">
                          <FaCheckCircle className="status-icon completed" />
                          <span className="order-status completed">
                            Đã giao hàng
                          </span>
                          {expandedOrderId === order.id ? (
                            <FaAngleUp className="toggle-icon" />
                          ) : (
                            <FaAngleDown className="toggle-icon" />
                          )}
                        </div>
                      </div>

                      <div className="order-content">
                        {order.products.slice(0, 2).map((product, index) => (
                          <div key={index} className="order-product">
                            <img
                              src={getProductImageUrl(product.image)}
                              alt={product.name}
                              className="product-image"
                            />
                            <div className="product-info">
                              <div className="product-name">
                                {product.name}
                              </div>
                              <div className="product-price-qty">
                                <span className="product-price">
                                  {product.price.toLocaleString()}đ
                                </span>
                                <span className="product-size-qty">
                                  Size: {product.size} | x{product.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {order.products.length > 2 && (
                          <div className="more-items">
                            + {order.products.length - 2} sản phẩm khác
                          </div>
                        )}

                        <div className="order-quick-info">
                          {order.address && (
                            <div className="quick-info-item">
                              <FaMapMarkerAlt className="info-icon" />
                              <span>{order.address}</span>
                            </div>
                          )}

                          {order.paymentMethod && (
                            <div className="quick-info-item">
                              <FaCreditCard className="info-icon" />
                              <span>{order.paymentMethod}</span>
                            </div>
                          )}

                          {order.note && (
                            <div className="quick-info-item">
                              <FaStickyNote className="info-icon" />
                              <span>{order.note}</span>
                            </div>
                          )}
                        </div>

                        <button
                          className="view-details-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderDetails(order);
                          }}
                        >
                          Chi tiết đơn hàng
                        </button>
                      </div>

                      {expandedOrderId === order.id && (
                        <div className="order-details">
                          <div className="details-row">
                            <span className="details-label">Mã đơn hàng:</span>
                            <span className="details-value">{order.orderCode}</span>
                          </div>
                          <div className="details-row">
                            <span className="details-label">Ngày đặt:</span>
                            <span className="details-value">{order.date}</span>
                          </div>
                          <div className="details-row">
                            <span className="details-label">Khách hàng:</span>
                            <span className="details-value">{order.customerName}</span>
                          </div>
                          <div className="details-row">
                            <span className="details-label">Thanh toán:</span>
                            <span className="details-value">{order.paymentMethod}</span>
                          </div>
                          <div className="details-row total-row">
                            <span className="details-label">
                              Tổng tiền đơn hàng:
                            </span>
                            <span className="details-value total-value">
                              {order.total.toLocaleString()}đ
                            </span>
                          </div>

                          <div className="order-actions">
                            <button className="rebuy-btn">Mua lại</button>
                            <button className="contact-btn">
                              Liên hệ hỗ trợ
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="order-footer">
                        <span className="order-total">
                          Tổng tiền: {order.total.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>

      {showOrderModal && selectedOrder && (
        <div className="order-detail-modal" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng {selectedOrder.orderCode}</h2>
              <button className="close-btn" onClick={closeOrderModal}>
                <FaTimes />
              </button>
              <div className="modal-status completed">
                Đã giao hàng
              </div>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <h3>Thông tin đơn hàng</h3>
                <div className="info-row">
                  <span className="info-label">Mã đơn hàng</span>
                  <span className="info-value">{selectedOrder.orderCode}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày đặt</span>
                  <span className="info-value">{selectedOrder.date}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Khách hàng</span>
                  <span className="info-value">{selectedOrder.customerName}</span>
                </div>
                {selectedOrder.note && (
                  <div className="info-row">
                    <span className="info-label">Ghi chú</span>
                    <span className="info-value">{selectedOrder.note}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Địa chỉ</span>
                  <span className="info-value">{selectedOrder.address}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phương thức thanh toán</span>
                  <span className="info-value">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="products-section">
                <h3>Chi tiết sản phẩm</h3>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Sản phẩm</th>
                      <th>Kích thước</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="product-img-cell">
                            <img
                              src={getProductImageUrl(product.image)}
                              alt={product.name}
                              className="product-img"
                            />
                            <button className="view-btn">
                              <FaEye /> Xem
                            </button>
                          </div>
                        </td>
                        <td>{product.name}</td>
                        <td>{product.size}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price.toLocaleString()} ₫</td>
                        <td>
                          {(product.price * product.quantity).toLocaleString()} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="total-label">
                        Tổng tiền:
                      </td>
                      <td className="total-value">
                        {selectedOrder.total.toLocaleString()} ₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="modal-actions">
                <button className="rebuy-btn">Mua lại</button>
                <button className="contact-btn">Liên hệ hỗ trợ</button>
                <button className="close-modal-btn" onClick={closeOrderModal}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordershistory;
