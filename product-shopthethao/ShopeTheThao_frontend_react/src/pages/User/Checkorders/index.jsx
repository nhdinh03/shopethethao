import { useState, useEffect, useRef } from "react";
import "./checkorders.scss";
import {
  FaSearch,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaAngleDown,
  FaAngleUp,
  FaTimes,
  FaEye,
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
  FaMoneyBillWave,
  FaTags,
  FaThList,
  FaRegBell,
} from "react-icons/fa";
import axios from "axios";
import Loading from "pages/Loading/loading";

function Checkorders() {
  const [activeTab, setActiveTab] = useState("all");
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
    pending: 0,
    delivered: 0,
    cancelled: 0,
  });

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    "Áo Arsenal",
    "Giày Nike",
    "Adidas",
  ]);
  const [searchHistory, setSearchHistory] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    priceRange: { min: "", max: "" },
    categories: [],
  });
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const searchInputRef = useRef(null);
  const searchHistoryRef = useRef(null);

  // API URL - replace with your actual API endpoint
  const API_URL = "https://api.shopethethao.com/orders";
  const IMAGE_BASE_URL = "https://api.shopethethao.com/images/";

  // Dữ liệu mẫu cho sản phẩm - đặt ngoài component để tránh tạo lại mỗi lần render
  const sampleOrderItems = [
    {
      id: 14,
      product: {
        id: 15,
        name: "Nguyễn Hoàng Dinh",
        quantity: 0,
        price: 1233211,
        description: "1111",
        status: true,
        categorie: {
          id: 2,
          name: "dinh431",
          description: "dinh43111",
        },
        sizes: [
          {
            id: 703,
            quantity: 101,
            price: 200000,
            size: {
              id: 1,
              name: "S",
              description: "1sss",
            },
          },
          {
            id: 704,
            quantity: 201,
            price: 180000,
            size: {
              id: 2,
              name: "L",
              description: "ssss",
            },
          },
        ],
        images: [
          {
            id: 808,
            imageUrl:
              "422a1a02-523e-4650-9516-bfdea3ebb972_Áo tập luyện chính hãng Arsenal 2024 25 2.jpg",
          },
        ],
      },
      size: {
        id: 2,
        name: "L",
        description: "ssss",
      },
      quantity: 10,
      unitPrice: 1500000,
      paymentMethod: "Thẻ tín dụng",
    },
  ];

  // Dữ liệu mẫu đơn hàng
  const sampleOrders = [
    {
      id: 1,
      orderCode: "#10",
      status: "cancelled",
      items: sampleOrderItems,
      total: 15000000,
      date: "20/02/2025 00:11",
      createdAt: "2025-02-20T00:11:00",
      address: "192 Đường ABC, Quận 10, TP.HCM",
      paymentMethod: "Thẻ tín dụng",
      note: "Giao hàng nhanh",
      customerName: "Hoàng Thị K",
      customerCode: "U10",
      trackingSteps: [
        {
          status: "ordered",
          time: "20/02/2025 00:11",
          title: "Đơn hàng đã đặt",
        },
        {
          status: "processing",
          time: "20/02/2025 08:30",
          title: "Đang xử lý",
        },
        {
          status: "cancelled",
          time: "21/02/2025 10:15",
          title: "Đã hủy",
        },
      ],
    },
    {
      id: 2,
      orderCode: "#11",
      status: "delivered",
      items: sampleOrderItems,
      total: 15000000,
      date: "15/02/2025 08:30",
      createdAt: "2025-02-15T08:30:00",
      address: "456 Đường Lê Lợi, Quận 3, TP.HCM",
      paymentMethod: "Thẻ tín dụng",
      note: "",
      customerName: "Nguyễn Văn A",
      customerCode: "U11",
      trackingSteps: [
        {
          status: "ordered",
          time: "15/02/2025 08:30",
          title: "Đơn hàng đã đặt",
        },
        {
          status: "processing",
          time: "15/02/2025 10:45",
          title: "Đang xử lý",
        },
        {
          status: "shipping",
          time: "16/02/2025 09:20",
          title: "Đang giao hàng",
        },
        {
          status: "delivered",
          time: "17/02/2025 14:30",
          title: "Đã nhận hàng",
        },
      ],
    },
    {
      id: 3,
      orderCode: "#12",
      status: "pending",
      items: sampleOrderItems,
      total: 15000000,
      date: "18/02/2025 15:22",
      createdAt: "2025-02-18T15:22:00",
      address: "789 Đường Hai Bà Trưng, Quận 1, TP.HCM",
      paymentMethod: "Thẻ tín dụng",
      note: "Giao giờ hành chính",
      customerName: "Trần Thị B",
      customerCode: "U12",
      trackingSteps: [
        {
          status: "ordered",
          time: "18/02/2025 15:22",
          title: "Đơn hàng đã đặt",
        },
        {
          status: "processing",
          time: "18/02/2025 16:45",
          title: "Đang xử lý",
        },
        {
          status: "shipping",
          time: "19/02/2025 08:30",
          title: "Đang giao hàng",
        },
      ],
    },
    {
      id: 4,
      orderCode: "#13",
      status: "pending",
      items: sampleOrderItems,
      total: 8500000,
      date: "01/01/2025 11:30",
      createdAt: "2025-01-01T11:30:00",
      address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      paymentMethod: "Chuyển khoản",
      note: "",
      customerName: "Lê Văn C",
      customerCode: "U13",
      trackingSteps: [
        {
          status: "ordered",
          time: "01/01/2025 11:30",
          title: "Đơn hàng đã đặt",
        },
        {
          status: "processing",
          time: "01/01/2025 14:45",
          title: "Đang xử lý",
        },
        {
          status: "shipping",
          time: "02/01/2025 09:20",
          title: "Đang giao hàng",
        },
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);

    // Mô phỏng gọi API bằng timeout
    const timeoutId = setTimeout(() => {
      try {
        // Trong thực tế sẽ sử dụng axios:
        // const fetchData = async () => {
        //   const response = await axios.get(API_URL);
        //   setOrders(response.data);
        //   setLoading(false);
        // };
        // fetchData();

        // Sử dụng dữ liệu mẫu
        setOrders(sampleOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    }, 1000);

    // Cleanup function to cancel the timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Calculate order statistics when orders change
    if (orders.length > 0) {
      const stats = {
        total: orders.length,
        pending: orders.filter((order) => order.status === "pending").length,
        delivered: orders.filter((order) => order.status === "delivered")
          .length,
        cancelled: orders.filter((order) => order.status === "cancelled")
          .length,
      };
      setOrderStatistics(stats);
    }
  }, [orders]);

  const filterOrders = () => {
    let filteredOrders = [...orders];

    // Filter by status
    if (activeTab !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === activeTab
      );
    }

    // Filter by search query
    if (searchQuery) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderCode.includes(searchQuery) ||
          order.items.some((item) =>
            item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
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

    // Group orders by month for better visualization
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

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Đang giao hàng";
      case "delivered":
        return "Đã nhận hàng";
      case "cancelled":
        return "Đã hủy";
      case "ordered":
        return "Đã đặt hàng";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang vận chuyển";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "shipping":
        return <FaTruck className="status-icon pending" />;
      case "delivered":
        return <FaCheckCircle className="status-icon delivered" />;
      case "cancelled":
        return <FaTimesCircle className="status-icon cancelled" />;
      case "ordered":
        return <FaBox className="status-icon ordered" />;
      case "processing":
        return <FaBox className="status-icon processing" />;
      default:
        return <FaBox className="status-icon" />;
    }
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

  const getProductImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://placehold.co/60x60?text=No+Image";

    // Nếu đã là URL đầy đủ
    if (imageUrl.startsWith("http")) return imageUrl;

    // Nếu là đường dẫn tương đối, thêm URL gốc
    return `${IMAGE_BASE_URL}${imageUrl}`;
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
    setSearchQuery("");
    setActiveTab("all");
    setSortOrder("desc");
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

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

  // Update suggestions as user types
  useEffect(() => {
    if (searchQuery.length > 1) {
      // In a real app, you'd call an API here
      const suggestions = generateSuggestions(searchQuery);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  // Generate mock suggestions based on the query
  const generateSuggestions = (query) => {
    const allSuggestions = [
      "Áo bóng đá Arsenal",
      "Áo bóng đá Chelsea",
      "Áo bóng đá Manchester United",
      "Giày Nike Mercurial",
      "Giày Adidas Predator",
      "Giày Puma Future",
      "Bộ quần áo thể thao",
      "Áo thun thể thao",
      "Quần short thể thao",
    ];

    return allSuggestions
      .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Add to recent searches if not already there
    if (!recentSearches.includes(searchQuery.trim())) {
      setRecentSearches((prev) => [searchQuery.trim(), ...prev].slice(0, 5));
    }

    setSearchHistory(false);
    // The actual search logic is already in the filterOrders function

    // Show animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1500);
  };

  // Clear search history
  const clearSearchHistory = () => {
    setRecentSearches([]);
  };

  // Use a suggestion or recent search - renamed from useSearchTerm to applySearchTerm
  const applySearchTerm = (term) => {
    setSearchQuery(term);
    setSearchHistory(false);
  };

  // Update price filter
  const updatePriceFilter = (type, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value },
    }));
  };

  // Apply price filter
  const applyPriceFilter = () => {
    setShowPriceFilter(false);
    // The filter logic would be part of the filterOrders function
  };

  if (loading) {
    return <Loading />;
  }

  const filteredOrdersGroups = filterOrders();
  const isEmptyResults = Object.keys(filteredOrdersGroups).length === 0;

  return (
    <div className="check-orders">
      <div className="orders-header">
        <h1 className="page-title">Đơn hàng của tôi</h1>

        <div className="order-statistics">
          <div className="stat-item">
            <div className="stat-value">{orderStatistics.total}</div>
            <div className="stat-label">Tổng đơn</div>
          </div>
          <div className="stat-item pending">
            <div className="stat-value">{orderStatistics.pending}</div>
            <div className="stat-label">Đang giao</div>
          </div>
          <div className="stat-item delivered">
            <div className="stat-value">{orderStatistics.delivered}</div>
            <div className="stat-label">Đã nhận</div>
          </div>
          <div className="stat-item cancelled">
            <div className="stat-value">{orderStatistics.cancelled}</div>
            <div className="stat-label">Đã hủy</div>
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
                placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm hoặc tên khách hàng"
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

                {searchSuggestions.length > 0 && (
                  <div className="search-section">
                    <div className="section-header">
                      <h4>
                        <FaTags /> Gợi ý tìm kiếm
                      </h4>
                    </div>
                    <ul>
                      {searchSuggestions.map((suggestion, idx) => (
                        <li
                          key={`suggestion-${idx}`}
                          onClick={() => applySearchTerm(suggestion)}
                        >
                          <FaSearch className="item-icon" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="search-section">
                  <div className="section-header">
                    <h4>
                      <FaFilter /> Lọc nâng cao
                    </h4>
                  </div>
                  <div className="advanced-search-options">
                    <div
                      className="search-option"
                      onClick={() => setShowPriceFilter(!showPriceFilter)}
                    >
                      <FaMoneyBillWave className="option-icon" />
                      <span>Khoảng giá</span>
                      <FaAngleDown className="dropdown-icon" />
                    </div>

                    {showPriceFilter && (
                      <div className="price-filter">
                        <div className="price-inputs">
                          <input
                            type="number"
                            placeholder="Giá từ"
                            value={searchFilters.priceRange.min}
                            onChange={(e) =>
                              updatePriceFilter("min", e.target.value)
                            }
                          />
                          <span className="price-separator">-</span>
                          <input
                            type="number"
                            placeholder="Giá đến"
                            value={searchFilters.priceRange.max}
                            onChange={(e) =>
                              updatePriceFilter("max", e.target.value)
                            }
                          />
                        </div>
                        <button
                          className="apply-price"
                          onClick={applyPriceFilter}
                        >
                          Áp dụng
                        </button>
                      </div>
                    )}

                    <div className="search-option">
                      <FaThList className="option-icon" />
                      <span>Danh mục</span>
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
            <span className="notification-badge">2</span>
          </div>
        </div>
      </div>

      {showAnimation && (
        <div className="search-animation">
          <div className="animation-content">
            <FaSpinner className="spinning" />
            <span>Đang tìm kiếm...</span>
          </div>
        </div>
      )}

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

      <div className="order-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả đơn hàng ({orderStatistics.total})
        </button>
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Đang giao hàng ({orderStatistics.pending})
        </button>
        <button
          className={`tab-btn ${activeTab === "delivered" ? "active" : ""}`}
          onClick={() => setActiveTab("delivered")}
        >
          Đã nhận hàng ({orderStatistics.delivered})
        </button>
        <button
          className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Đã hủy ({orderStatistics.cancelled})
        </button>
      </div>

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
                          {getStatusIcon(order.status)}
                          <span className={`order-status ${order.status}`}>
                            {getStatusText(order.status)}
                          </span>
                          {expandedOrderId === order.id ? (
                            <FaAngleUp className="toggle-icon" />
                          ) : (
                            <FaAngleDown className="toggle-icon" />
                          )}
                        </div>
                      </div>

                      <div className="order-content">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="order-product">
                            <img
                              src={
                                item.product.images &&
                                item.product.images.length > 0
                                  ? getProductImageUrl(
                                      item.product.images[0].imageUrl
                                    )
                                  : "https://placehold.co/60x60?text=No+Image"
                              }
                              alt={item.product.name}
                              className="product-image"
                            />
                            <div className="product-info">
                              <div className="product-name">
                                {item.product.name}
                              </div>
                              <div className="product-price-qty">
                                <span className="product-price">
                                  {item.unitPrice.toLocaleString()}đ
                                </span>
                                <span className="product-size-qty">
                                  Size: {item.size.name} | x{item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {order.items.length > 2 && (
                          <div className="more-items">
                            + {order.items.length - 2} sản phẩm khác
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
                          Chi tiết đơn hàng {order.orderCode}
                        </button>
                      </div>

                      {expandedOrderId === order.id && (
                        <div className="order-details">
                          <div className="order-tracking">
                            <h4>Trạng thái đơn hàng</h4>
                            <div className="tracking-timeline">
                              {order.trackingSteps.map((step, index) => (
                                <div
                                  key={index}
                                  className={`tracking-step ${step.status}`}
                                >
                                  <div className="step-icon" aria-hidden="true">
                                    {getStatusIcon(step.status)}
                                  </div>
                                  <div className="step-info">
                                    <div className="step-title">
                                      {step.title}
                                    </div>
                                    <div className="step-time">{step.time}</div>
                                  </div>
                                  {index < order.trackingSteps.length - 1 && (
                                    <div
                                      className="step-connector"
                                      aria-hidden="true"
                                    ></div>
                                  )}
                                </div>
                              ))}
                            </div>
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
                            {order.status === "pending" && (
                              <button className="cancel-btn">
                                Hủy đơn hàng
                              </button>
                            )}
                            {order.status === "delivered" && (
                              <button className="rebuy-btn">Mua lại</button>
                            )}
                            <button className="contact-btn">
                              Liên hệ shop
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
              <div className={`modal-status ${selectedOrder.status}`}>
                {getStatusText(selectedOrder.status)}
              </div>
            </div>

            <div className="modal-body">
              <div className="order-tracking modal-tracking">
                <h3>Trạng thái đơn hàng</h3>
                <div className="tracking-timeline">
                  {selectedOrder.trackingSteps.map((step, index) => (
                    <div key={index} className={`tracking-step ${step.status}`}>
                      <div className="step-icon" aria-hidden="true">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="step-info">
                        <div className="step-title">{step.title}</div>
                        <div className="step-time">{step.time}</div>
                      </div>
                      {index < selectedOrder.trackingSteps.length - 1 && (
                        <div
                          className="step-connector"
                          aria-hidden="true"
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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
                {selectedOrder.note && (
                  <div className="info-row">
                    <span className="info-label">Ghi chú</span>
                    <span className="info-value">{selectedOrder.note}</span>
                  </div>
                )}
              </div>

              <div className="info-section">
                <h3>Thông tin khách hàng</h3>
                <div className="info-row">
                  <span className="info-label">Tên khách hàng</span>
                  <span className="info-value">
                    {selectedOrder.customerName}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Mã khách hàng</span>
                  <span className="info-value">
                    {selectedOrder.customerCode}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Địa chỉ</span>
                  <span className="info-value">{selectedOrder.address}</span>
                </div>
              </div>

              <div className="products-section">
                <h3>Chi tiết sản phẩm</h3>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Kích thước</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="product-img-cell">
                            <img
                              src={
                                item.product.images &&
                                item.product.images.length > 0
                                  ? getProductImageUrl(
                                      item.product.images[0].imageUrl
                                    )
                                  : "https://placehold.co/60x60?text=No+Image"
                              }
                              alt={item.product.name}
                              className="product-img"
                            />
                            <button className="view-btn">
                              <FaEye /> Xem
                            </button>
                          </div>
                        </td>
                        <td>{item.size?.name || "N/A"}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unitPrice.toLocaleString()} ₫</td>
                        <td>
                          {(item.unitPrice * item.quantity).toLocaleString()} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="total-label">
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
                {selectedOrder.status === "pending" && (
                  <button className="cancel-btn">Hủy đơn hàng</button>
                )}
                {selectedOrder.status === "delivered" && (
                  <button className="rebuy-btn">Mua lại</button>
                )}
                <button className="contact-btn">Liên hệ shop</button>
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
}

export default Checkorders;
