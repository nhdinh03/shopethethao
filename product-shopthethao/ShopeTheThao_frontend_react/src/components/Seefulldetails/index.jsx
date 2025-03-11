import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMinus,
  FiPlus,
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiPackage,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiEye,
  FiPlay,
  FiCompare,
  FiRotateCw,
  FiLayers,
  FiClock,
  FiGift,
  FiCheckCircle,
  FiMapPin,
  FiAlertCircle,
  FiBarChart,
} from "react-icons/fi";
import { mockProducts } from "../../data/mockData";
import ProductCard from "../ProductCard";
import BreadcrumbUser from "../../layouts/User/BreadcrumbUser/BreadcrumbUser";
import { generateProductDetailsBreadcrumb } from "../../layouts/User/BreadcrumbUser/BreadcrumbUserConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Seefulldetails.scss";

const Seefulldetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomActive, setZoomActive] = useState(false);
  const [breadcrumbData, setBreadcrumbData] = useState([]);
  const [showARPreview, setShowARPreview] = useState(false);
  const [show360View, setShow360View] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [currentStock, setCurrentStock] = useState(0);
  const [viewedCount, setViewedCount] = useState(0);
  const [storePickupAvailable, setStorePickupAvailable] = useState(true);
  const [isStickyAddToCart, setIsStickyAddToCart] = useState(false);
  const productRef = useRef(null);

  // Mock FAQ data
  const faqs = [
    {
      question: "Làm sao để chọn size phù hợp?",
      answer:
        "Bạn có thể tham khảo bảng size của chúng tôi và đo các số đo cơ thể để chọn size phù hợp nhất.",
    },
    {
      question: "Chính sách đổi trả như thế nào?",
      answer:
        "Chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ ngày mua hàng, với điều kiện sản phẩm còn nguyên tem mác.",
    },
    {
      question: "Thời gian giao hàng mất bao lâu?",
      answer:
        "Thời gian giao hàng thường từ 2-5 ngày tùy khu vực, bạn có thể theo dõi đơn hàng qua mã vận đơn.",
    },
  ];

  // Mock accessories data - using some related products as accessories
  const accessories = relatedProducts.slice(0, 3).map((product) => ({
    ...product,
    isAccessory: true,
  }));

  // Add this constant at the top of the component
  const fixedRatingDistribution = {
    5: 65,
    4: 20,
    3: 10,
    2: 3,
    1: 2
  };

  // Fetch product data
  useEffect(() => {
    // Simulate API fetch with timeout
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call
        // const response = await fetch(`/api/products/${productId}`);
        // const data = await response.json();

        // Using mock data for now
        setTimeout(() => {
          const foundProduct = mockProducts.find(
            (p) => p.id.toString() === productId
          );

          if (foundProduct) {
            setProduct(foundProduct);

            // Set default selected options
            if (foundProduct.colors && foundProduct.colors.length > 0) {
              setSelectedColor(foundProduct.colors[0]);
            }

            if (foundProduct.sizes && foundProduct.sizes.length > 0) {
              setSelectedSize(foundProduct.sizes[0]);
            }

            // Get related products (same category)
            const related = mockProducts
              .filter(
                (p) =>
                  p.category === foundProduct.category &&
                  p.id !== foundProduct.id
              )
              .slice(0, 4);
            setRelatedProducts(related);

            // Set breadcrumb data using the utility function
            setBreadcrumbData(generateProductDetailsBreadcrumb(foundProduct));
          } else {
            setError("Không tìm thấy sản phẩm");
          }

          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải thông tin sản phẩm");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Create a sample product data for demonstration
  const sampleProduct = {
    id: "jg-kaze-04",
    name: "Giày thể thao chạy bộ Jogarbola Kaze 'Navy' JG-KAZE-04 - Hàng Chính Hãng",
    brand: "Động Lực",
    price: 1190000,
    discountPercentage: 0,
    colors: ["#003366", "#FF0000", "#FFFFFF"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    stock: 50,
    rating: 4.8,
    reviews: 24,
    thumbnail: "/images/products/giay-jogarbola-navy-main.jpg",
    images: [
      "/images/products/giay-jogarbola-navy-1.jpg",
      "/images/products/giay-jogarbola-navy-2.jpg",
      "/images/products/giay-jogarbola-navy-3.jpg",
      "/images/products/giay-jogarbola-navy-4.jpg"
    ],
    description: "Giày thể thao chạy bộ Jogarbola Kaze với thiết kế hiện đại, êm ái, nhẹ nhàng, bền bỉ. Phần đế được thiết kế đặc biệt giúp tăng độ bám và chống trơn trượt hiệu quả.",
    material: "Vải lưới thoáng khí, đế cao su",
    origin: "Việt Nam",
    gender: "Nam",
    sku: "JG-KAZE-04"
  };

  // Override the product data with our sample for demonstration
  useEffect(() => {
    if (!loading && product) {
      // This is just for demonstration - in a real app you would use the actual API data
      setProduct(sampleProduct);
    }
  }, [loading, product]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  // Handle quantity changes
  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      selectedColor,
      selectedSize,
      quantity,
      totalPrice:
        product.discountPercentage > 0
          ? calculateDiscountedPrice(
              product.price,
              product.discountPercentage
            ) * quantity
          : product.price * quantity,
    };

    // Show success message
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    // In a real app, this would dispatch to a cart context or redux store

    // Hiện thông báo thành công
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  // Handle image zoom
  const handleImageZoom = () => {
    setZoomActive(!zoomActive);
  };

  // Handle product view
  const handleViewProduct = (id) => {
    navigate(`/seefulldetails/${id}`);
    window.scrollTo(0, 0);
  };

  // Add this new function
  const handleVideoClick = () => {
    // In a real app, you would get the video URL from your product data
    const productVideo =
      product.videoUrl || "https://www.youtube.com/embed/example";
    setVideoUrl(productVideo);
    setShowVideo(true);
  };

  // Phát hiện khi người dùng cuộn xuống
  useEffect(() => {
    const handleScroll = () => {
      if (productRef.current) {
        const productTop = productRef.current.getBoundingClientRect().top;
        setIsStickyAddToCart(productTop < -300);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Giả lập người đang xem sản phẩm
  useEffect(() => {
    if (product) {
      // Simulated fixed viewer count (16) instead of random
      setViewedCount(16);

      // Thời gian giao hàng dự kiến
      const today = new Date();
      const deliveryDate = new Date(today.setDate(today.getDate() + 3));
      setEstimatedDelivery(
        deliveryDate.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );

      // Cập nhật số lượng còn lại
      setCurrentStock(product.stock);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <div className="error-message">
            <h2>{error || "Không tìm thấy sản phẩm"}</h2>
            <Link to="/products" className="back-button">
              Quay lại trang sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page" ref={productRef}>
      <div className="container">
        {/* Use centralized BreadcrumbUser component with modern style */}
        <BreadcrumbUser
          extraData={{ product, breadcrumbs: breadcrumbData }}
          modern={true}
          withBackground={false}
        />

        {/* Banner khuyến mãi giới hạn thời gian */}
        <motion.div
          className="limited-time-offer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="offer-icon">
            <FiClock />
          </div>
          <div className="offer-content">
            <p>
              <strong>Ưu đãi giới hạn thời gian!</strong> Giảm thêm 10% cho đơn
              hàng trên 1.000.000đ. Sử dụng mã:{" "}
              <span className="promo-code">SPORT10</span>
            </p>
          </div>
        </motion.div>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="gallery-layout">
              {/* Vertical thumbnails on the left */}
              <div className="thumbnails-column">
                {[product.thumbnail, ...(product.images || [])].map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} - View ${index + 1}`} />
                  </div>
                ))}
              </div>

              {/* Main image on the right */}
              <div className={`main-image ${zoomActive ? "zoom-active" : ""}`}>
                <motion.img
                  src={selectedImage === 0 ? product.thumbnail : (product.images?.[selectedImage - 1] || product.thumbnail)}
                  alt={product.name}
                  onClick={handleImageZoom}
                  animate={{ scale: zoomActive ? 1.5 : 1 }}
                  transition={{ duration: 0.5 }}
                />
                {product.discountPercentage > 0 && (
                  <div className="product-badge discount">
                    -{product.discountPercentage}%
                  </div>
                )}
                {product.isNew && <div className="product-badge new">Mới</div>}
                <button className="zoom-icon" onClick={handleImageZoom}>
                  <FiEye />
                </button>
              </div>
            </div>

            {/* Media Controls */}
            <div className="media-controls">
              <button className="media-btn video" onClick={handleVideoClick}>
                <FiPlay /> Xem video
              </button>
              <button
                className="media-btn ar"
                onClick={() => setShowARPreview(true)}
              >
                <FiRotateCw /> Xem AR
              </button>
              <button
                className="media-btn view360"
                onClick={() => setShow360View(true)}
              >
                <FiRotateCw /> Xem 360°
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Product title with highlighting */}
            <h1 className="product-title">{product.name}</h1>
            
            {/* Detailed Meta Information */}
            <div className="product-meta">
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.round(product.rating) ? "filled" : ""}
                    />
                  ))}
                </div>
                <span>
                  {product.rating} ({product.reviews || 0} đánh giá)
                </span>
              </div>

              <div className="product-sku">
                Mã SP: <span>{product.sku || product.id}</span>
              </div>

              <div className="product-brand">
                Thương hiệu: <span className="brand-highlight">{product.brand}</span>
              </div>

              <div className="stock-status">
                Tình trạng:{" "}
                <span
                  className={product.stock > 0 ? "in-stock" : "out-of-stock"}
                >
                  {product.stock > 0
                    ? `Còn hàng (${product.stock})`
                    : "Hết hàng"}
                </span>
              </div>
            </div>

            {/* Price section with better visual hierarchy */}
            <div className="product-price highlighted-section">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="price-current">
                    {formatPrice(
                      calculateDiscountedPrice(
                        product.price,
                        product.discountPercentage
                      )
                    )}
                  </span>
                  <span className="price-original">
                    {formatPrice(product.price)}
                  </span>
                  <span className="price-saving">
                    Tiết kiệm:{" "}
                    {formatPrice(
                      product.price -
                        calculateDiscountedPrice(
                          product.price,
                          product.discountPercentage
                        )
                    )}
                  </span>
                </>
              ) : (
                <span className="price-current">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description and details in formatted box */}
            <div className="product-details-box">
              <h3>Thông tin sản phẩm</h3>
              <div className="details-list">
                <div className="detail-row">
                  <span className="detail-label">Thương hiệu:</span>
                  <span className="detail-value brand-highlight">{product.brand}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mô tả:</span>
                  <span className="detail-value">{product.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Chất liệu:</span>
                  <span className="detail-value">{product.material || "Polyester, Cotton"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Xuất xứ:</span>
                  <span className="detail-value">{product.origin || "Việt Nam"}</span>
                </div>
              </div>
            </div>

            {/* Live stats section with fixed viewer count */}
            <div className="live-stats">
              <div className="stat-item viewers">
                <FiEye />
                <span>{viewedCount} người đang xem sản phẩm này</span>
              </div>
              {product.stock < 10 && (
                <div className="stat-item low-stock">
                  <FiAlertCircle />
                  <span>Chỉ còn {product.stock} sản phẩm!</span>
                </div>
              )}
            </div>

            {/* Size Selection with improved UI */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-sizes">
                <h3>Kích thước giày</h3>
                <div className="size-options">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-option ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="selected-option">
                  Đã chọn: <span>{selectedSize}</span>
                </p>
                <a href="#size-chart" className="size-guide">
                  Bảng kích cỡ
                </a>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-colors">
                <h3>Màu sắc</h3>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${
                        selectedColor === color ? "active" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Color ${color}`}
                    >
                      {selectedColor === color && (
                        <span className="check-mark">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="selected-option">
                  Đã chọn: <span>{selectedColor}</span>
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart with enhanced UI */}
            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  <FiMinus />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="quantity-btn"
                  disabled={quantity >= product.stock}
                >
                  <FiPlus />
                </button>
              </div>

              <div className="action-buttons">
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <FiShoppingCart /> THÊM VÀO GIỎ HÀNG
                </button>

                <button
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                >
                  MUA NGAY
                </button>

                <button className="wishlist-btn" title="Yêu thích sản phẩm">
                  <FiHeart />
                </button>
              </div>
            </div>

            {/* Support Policies */}
            <div className="support-policies">
              <h4>Chính sách hỗ trợ</h4>
              <div className="policies-list">
                <div className="policy-item">
                  <FiTruck className="policy-icon" />
                  <span>Vận chuyển hoả tốc TOÀN QUỐC</span>
                </div>
                <div className="policy-item">
                  <FiRefreshCw className="policy-icon" />
                  <span>Hỗ trợ đổi trong 5 ngày</span>
                </div>
                <div className="policy-item">
                  <FiGift className="policy-icon" />
                  <span>Quà tặng hấp dẫn cho đơn hàng</span>
                </div>
                <div className="policy-item">
                  <FiShield className="policy-icon" />
                  <span>Bảo mật thông tin khách hàng</span>
                </div>
              </div>
            </div>

            {/* Product Benefits */}
            <div className="product-benefits">
              <div className="benefit-item">
                <FiTruck />
                <span>Giao hàng miễn phí cho đơn hàng trên 500.000đ</span>
              </div>
              <div className="benefit-item">
                <FiRefreshCw />
                <span>Đổi trả trong vòng 30 ngày</span>
              </div>
              <div className="benefit-item">
                <FiShield />
                <span>Bảo hành 12 tháng</span>
              </div>
              <div className="benefit-item">
                <FiPackage />
                <span>Sản phẩm chính hãng 100%</span>
              </div>
            </div>

            {/* Share */}
            <div className="product-share">
              <span>Chia sẻ:</span>
              <div className="social-icons">
                <a href="#facebook" className="social-icon facebook">
                  Facebook
                </a>
                <a href="#twitter" className="social-icon twitter">
                  Twitter
                </a>
                <a href="#pinterest" className="social-icon pinterest">
                  Pinterest
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Thêm section sản phẩm đi kèm */}
        <div className="bundle-products">
          <h2>Thường được mua cùng nhau</h2>
          <div className="bundle-container">
            <div className="bundle-product main">
              <img src={product.thumbnail} alt={product.name} />
              <div className="bundle-info">
                <h3>{product.name}</h3>
                <p className="price">{formatPrice(product.price)}</p>
              </div>
              <div className="bundle-check">
                <FiCheckCircle />
              </div>
            </div>

            <div className="bundle-plus">+</div>

            {accessories.slice(0, 1).map((item, index) => (
              <div className="bundle-product" key={index}>
                <img src={item.thumbnail} alt={item.name} />
                <div className="bundle-info">
                  <h3>{item.name}</h3>
                  <p className="price">{formatPrice(item.price)}</p>
                </div>
                <div className="bundle-check">
                  <input type="checkbox" id={`bundle-${index}`} />
                </div>
              </div>
            ))}

            <div className="bundle-summary">
              <div className="bundle-total">
                <p>Tổng cộng:</p>
                <p className="bundle-price">
                  {formatPrice(product.price + (accessories[0]?.price || 0))}
                </p>
              </div>
              <button className="bundle-add-btn">Thêm tất cả vào giỏ hàng</button>
            </div>
          </div>
        </div>

        {/* Product Tabs with improved UI */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`tab-btn ${
                activeTab === "specifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Thông số kỹ thuật
            </button>
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá ({product.reviews || 0})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === "description" && (
              <div className="tab-pane">
                <h3>Mô tả sản phẩm</h3>
                <div className="product-description">
                  <p>{product.description}</p>
                  <ul>
                    <li>
                      Chất liệu: {product.material || "Polyester, Cotton"}
                    </li>
                    <li>Xuất xứ: {product.origin || "Việt Nam"}</li>
                    <li>Thiết kế hiện đại, thoáng mát</li>
                    <li>Phù hợp cho các hoạt động thể thao và đi chơi</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="tab-pane">
                <h3>Thông số kỹ thuật</h3>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td>Thương hiệu</td>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <td>Chất liệu</td>
                      <td>{product.material || "Polyester, Cotton"}</td>
                    </tr>
                    <tr>
                      <td>Xuất xứ</td>
                      <td>{product.origin || "Việt Nam"}</td>
                    </tr>
                    <tr>
                      <td>Phù hợp với</td>
                      <td>{product.gender || "Nam/Nữ"}</td>
                    </tr>
                    <tr>
                      <td>Màu sắc</td>
                      <td>{product.colors?.join(", ")}</td>
                    </tr>
                    <tr>
                      <td>Kích cỡ</td>
                      <td>{product.sizes?.join(", ")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-pane">
                <h3>Đánh giá sản phẩm</h3>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {/* Reviews would be mapped here */}
                    <p>Hiện đang cập nhật đánh giá...</p>
                  </div>
                ) : (
                  <div className="no-reviews">
                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                    <button className="write-review-btn">
                      Viết đánh giá đầu tiên
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Thêm phần đánh giá chi tiết */}
        <div className="product-reviews">
          <h2>Đánh giá từ khách hàng</h2>
          <div className="review-summary">
            <div className="review-avg">
              <div className="big-rating">
                {product.rating?.toFixed(1) || "0.0"}
              </div>
              <div className="star-display">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={i < Math.round(product.rating) ? "filled" : ""}
                  />
                ))}
                <span>({product.reviews?.length || 0} đánh giá)</span>
              </div>
            </div>

            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div className="rating-bar" key={rating}>
                  <span>{rating} sao</span>
                  <div className="bar">
                    <div
                      className="fill"
                      style={{ width: `${fixedRatingDistribution[rating]}%` }}
                    ></div>
                  </div>
                  <span>{fixedRatingDistribution[rating]}%</span>
                </div>
              ))}
            </div>

            <div className="review-actions">
              <button className="write-review-btn">Viết đánh giá</button>
              <div className="review-filters">
                <select>
                  <option>Mới nhất</option>
                  <option>Điểm cao nhất</option>
                  <option>Điểm thấp nhất</option>
                </select>
              </div>
            </div>
          </div>

          <div className="customer-reviews">
            {/* Mẫu đánh giá */}
            {[1, 2, 3].map((i) => (
              <div className="review" key={i}>
                <div className="reviewer-info">
                  <div className="avatar">
                    <img
                      src={`https://i.pravatar.cc/50?img=${i + 10}`}
                      alt="Avatar"
                    />
                  </div>
                  <div>
                    <h4>Khách hàng {i}</h4>
                    <div className="review-stars">
                      {[...Array(5)].map((_, j) => (
                        <FiStar key={j} className={j < 4 ? "filled" : ""} />
                      ))}
                    </div>
                    <span className="review-date">Ngày {i} tháng 6, 2023</span>
                  </div>
                </div>
                <div className="review-content">
                  <p>
                    Sản phẩm rất tốt và chất lượng. Tôi đã mua và sử dụng được
                    một thời gian, rất hài lòng với sản phẩm này.
                  </p>
                </div>
                <div className="review-images">
                  <img src="/images/reviews/review1.jpg" alt="Review" />
                  <img src="/images/reviews/review2.jpg" alt="Review" />
                </div>
                <div className="review-helpful">
                  <span>Đánh giá này có hữu ích?</span>
                  <button>Có (12)</button>
                  <button>Không (2)</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add a promotional banner */}
        <div className="promotional-banner">
          <h2>Khuyến mãi hấp dẫn</h2>
          <p>Mua sắm ngay để nhận nhiều ưu đãi độc quyền.</p>
        </div>

        {/* Thêm section brand story */}
        <div className="brand-story">
          <div className="brand-image">
            <img src="/images/brands/nike-story.jpg" alt="Brand Story" />
          </div>
          <div className="brand-content">
            <h2>{product.brand} - Thương hiệu uy tín</h2>
            <p>
              Với hơn 20 năm kinh nghiệm trong ngành thể thao, {product.brand}{" "}
              luôn đồng hành cùng vận động viên trên toàn thế giới, mang đến
              những sản phẩm chất lượng cao và hiệu suất tuyệt vời.
            </p>
            <a href="#brand-page" className="brand-link">
              Tìm hiểu thêm về {product.brand}
            </a>
          </div>
        </div>

        {/* Add a customer feedback area */}
        <div className="customer-feedback">
          <div className="feedback-item">
            <h3>Hỗ trợ nhanh chóng</h3>
            <p>Tư vấn nhiệt tình, phản hồi trong vòng 24h.</p>
          </div>
          <div className="feedback-item">
            <h3>Dịch vụ tin cậy</h3>
            <p>Hơn 10.000 khách hàng đã hài lòng.</p>
          </div>
        </div>

        {/* Related Products with improved UI */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Sản phẩm liên quan</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="related-product-card"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleViewProduct(relatedProduct.id)}
                >
                  <ProductCard product={relatedProduct} index={index} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Add Compare Feature */}
        <div className="product-comparison">
          <button
            className="compare-btn"
            onClick={() => setShowComparison(true)}
          >
            <FiLayers /> So sánh sản phẩm
          </button>
          {showComparison && (
            <div className="comparison-table">{/* Comparison content */}</div>
          )}
        </div>

        {/* Enhanced Reviews Section */}
        <div className="product-reviews">
          <div className="review-summary">
            <div className="rating-distribution">{/* Rating bars */}</div>
            <div className="review-filters">{/* Filter options */}</div>
          </div>
          <div className="review-list">{/* Review items */}</div>
        </div>

        {/* FAQ Section */}
        <div className="product-faq">
          <h3>Câu hỏi thường gặp</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accessories Section */}
        <div className="product-accessories">
          <h3>Phụ kiện đề xuất</h3>
          <div className="accessories-grid">
            {accessories.map((item, index) => (
              <ProductCard key={index} product={item} compact={true} />
            ))}
          </div>
        </div>

        {/* Sticky add to cart button */}
        {isStickyAddToCart && (
          <div className="sticky-add-to-cart">
            <div className="container">
              <div className="sticky-product-info">
                <img src={product.thumbnail} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <span className="sticky-price">
                    {formatPrice(
                      calculateDiscountedPrice(
                        product.price,
                        product.discountPercentage
                      )
                    )}
                  </span>
                </div>
              </div>

              <div className="sticky-actions">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <FiShoppingCart /> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Thông báo thêm vào giỏ hàng thành công */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              className="cart-notification"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="notification-icon">
                <FiCheckCircle />
              </div>
              <div className="notification-content">
                <p>Đã thêm sản phẩm vào giỏ hàng!</p>
                <div className="notification-actions">
                  <button onClick={() => setShowNotification(false)}>
                    Tiếp tục mua sắm
                  </button>
                  <button onClick={() => navigate("/cart")}>
                    Xem giỏ hàng
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Video Modal */}
        {showVideo && (
          <div className="video-modal" onClick={() => setShowVideo(false)}>
            <div
              className="video-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowVideo(false)}>
                ×
              </button>
              {videoUrl && (
                <iframe
                  src={videoUrl}
                  title="Product Video"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Seefulldetails;
