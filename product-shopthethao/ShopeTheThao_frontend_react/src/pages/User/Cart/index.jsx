import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaInfoCircle,
} from "react-icons/fa";
import "./cart.scss";
import Loading from "pages/Loading/loading";
import debounce from "lodash/debounce";
import { ROUTES } from "router";


// Define breakpoints for responsive logic
const BREAKPOINTS = {
  MOBILE_S: 320,
  MOBILE_M: 375,
  MOBILE_L: 425,
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP_4K: 2560
};

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectAll, setSelectAll] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Refs for performance optimization
  const cartRef = useRef(null);

  // Handle window resize with debounce for performance
  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);

  // Fetch cart items - optimized with cached data check
  useEffect(() => {
    const cachedCart = sessionStorage.getItem("cachedCart");
    
    if (cachedCart) {
      try {
        const { data, timestamp } = JSON.parse(cachedCart);
        const isExpired = Date.now() - timestamp > 60000; // 1 minute expiration
        
        if (!isExpired) {
          setCartItems(data);
          setSelectedItems(data.map(item => item.id));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error parsing cached cart:", error);
      }
    }
    
    // If no valid cache, continue with normal loading
    setTimeout(() => {
      const savedCart = localStorage.getItem("cartItems");

      try {
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          setSelectedItems(parsedCart.map((item) => item.id));
          
          // Cache the result
          sessionStorage.setItem("cachedCart", JSON.stringify({
            data: parsedCart,
            timestamp: Date.now()
          }));
        } else {
          // Demo data if no saved cart
          const initialItems = [
            {
              id: 1,
              name: "Giày thể thao Nike Air Max",
              price: 1990000,
              quantity: 1,
              image:
                "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e777c881-5b62-4250-92a6-362967f54cca/air-force-1-07-shoes-WrLlWX.png",
            },
            {
              id: 2,
              name: "Áo thun Adidas climalite",
              price: 590000,
              quantity: 2,
              image:
                "https://assets.adidas.com/images/w_600,f_auto,q_auto/57d461193168475e81f2aae800d3cffe_9366/Ao_Thun_Ba_La_Sportswear_trang_GL5684_21_model.jpg",
            },
            {
              id: 3,
              name: "Quần short thể thao Puma",
              price: 450000,
              quantity: 1,
              image:
                'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/521159/01/mod01/fnd/PNA/fmt/png/Quần-short-Essentials-Regular-10"-Nam',
            },
          ];
          setCartItems(initialItems);
          setSelectedItems(initialItems.map((item) => item.id));
          
          // Cache the demo data
          sessionStorage.setItem("cachedCart", JSON.stringify({
            data: initialItems,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartItems([]);
        setSelectedItems([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Reduced loading time for better UX
  }, []);

  // Save cart to localStorage with throttling to prevent excessive writes
  useEffect(() => {
    if (!loading) {
      const saveCartToStorage = debounce(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        
        // Update cache
        sessionStorage.setItem("cachedCart", JSON.stringify({
          data: cartItems,
          timestamp: Date.now()
        }));
      }, 500);
      
      saveCartToStorage();
      return () => saveCartToStorage.cancel();
    }
  }, [cartItems, loading]);

  // Handle select all checkbox
  useEffect(() => {
    if (cartItems.length > 0 && selectedItems.length === cartItems.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, cartItems]);

  // Optimize quantity change with better debouncing
  const handleQuantityChange = useCallback(
    (id, change) => {
      setCartItems(
        cartItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
      );
    },
    [cartItems]
  );

  const debouncedHandleQuantityChange = useMemo(() => 
    debounce(handleQuantityChange, 300),
    [handleQuantityChange]
  );

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowConfirmation(true);
  };

  const handleRemoveItem = () => {
    if (itemToDelete) {
      setCartItems(cartItems.filter((item) => item.id !== itemToDelete));
      setSelectedItems(selectedItems.filter((id) => id !== itemToDelete));
      setShowConfirmation(false);
      setItemToDelete(null);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems([]);
  };

  const handleApplyCoupon = () => {
    // Mock coupon functionality
    if (couponCode.toUpperCase() === "GIAMGIA10") {
      setDiscount(10);
    } else if (couponCode.toUpperCase() === "GIAMGIA20") {
      setDiscount(20);
    } else {
      alert("Mã giảm giá không hợp lệ!");
      setDiscount(0);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Memoize selected cart items to prevent unnecessary recalculations
  const selectedCartItems = useMemo(
    () => cartItems.filter((item) => selectedItems.includes(item.id)),
    [cartItems, selectedItems]
  );

  // Memoize calculations for better performance
  const { subtotal, discountAmount, total } = useMemo(() => {
    const subtotal = selectedCartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discountAmount = (subtotal * discount) / 100;
    return {
      subtotal,
      discountAmount,
      total: subtotal - discountAmount,
    };
  }, [selectedCartItems, discount]);

  // Responsive image size based on screen width
  const getResponsiveImageSize = useCallback(() => {
    if (windowWidth >= BREAKPOINTS.DESKTOP_4K) return 120;
    if (windowWidth >= BREAKPOINTS.LAPTOP) return 100;
    if (windowWidth >= BREAKPOINTS.TABLET) return 80;
    if (windowWidth >= BREAKPOINTS.MOBILE_L) return 70;
    if (windowWidth >= BREAKPOINTS.MOBILE_M) return 60;
    return 50; // For smallest screens
  }, [windowWidth]);

  // Use intersection observer for better performance with many items
  useEffect(() => {
    if (!loading && cartRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );
      
      const cartItems = cartRef.current.querySelectorAll('.cart-item');
      cartItems.forEach(item => observer.observe(item));
      
      return () => {
        cartItems.forEach(item => observer.unobserve(item));
      };
    }
  }, [loading, cartItems.length]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">
        <FaShoppingCart className="cart-icon" /> Giỏ hàng của bạn
      </h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link to="/products" className="continue-shopping">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-container">
            <div className="cart-actions">
              <label className="select-all">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
                <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
              </label>
              <button
                onClick={() => confirmDelete("all")}
                className="clear-cart-btn"
              >
                <FaTrash /> Xóa giỏ hàng
              </button>
            </div>

            <div className="cart-items">
              <div className="cart-header">
                <span className="header-select"></span>
                <span className="header-product">Sản phẩm</span>
                <span className="header-price">Đơn giá</span>
                <span className="header-quantity">Số lượng</span>
                <span className="header-subtotal">Thành tiền</span>
                <span className="header-action">Xóa</span>
              </div>

              <div className="cart-items-list" ref={cartRef}>
                {cartItems.map((item) => (
                  <div
                    className={`cart-item ${
                      selectedItems.includes(item.id) ? "selected" : ""
                    }`}
                    key={item.id}
                  >
                    <div className="item-select">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                    </div>
                    <div className="item-product" data-label="Sản phẩm">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        width={getResponsiveImageSize()}
                        height={getResponsiveImageSize()}
                        loading="lazy"
                      />
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>
                          Mã SP: SP{item.id}000{item.id}
                        </p>
                        <div className="mobile-price">
                          {item.price.toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                    </div>
                    <div className="item-price" data-label="Đơn giá">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </div>
                    <div className="item-quantity" data-label="Số lượng">
                      <button
                        onClick={() =>
                          debouncedHandleQuantityChange(item.id, -1)
                        }
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleQuantityChange(
                            item.id,
                            newQuantity - item.quantity
                          );
                        }}
                        className="quantity-input"
                      />
                      <button
                        onClick={() =>
                          debouncedHandleQuantityChange(item.id, 1)
                        }
                        className="quantity-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="item-subtotal" data-label="Thành tiền">
                      <span className="price-value">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="item-action" data-label="Xóa">
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="remove-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <div className="coupon-section">
              <h3>Mã giảm giá</h3>
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon}>Áp dụng</button>
              </div>
              <div className="coupon-info">
                <FaInfoCircle />{" "}
                <span>Mã thử nghiệm: GIAMGIA10, GIAMGIA20</span>
              </div>
            </div>

            <div className="order-summary">
              <h3>Tổng đơn hàng</h3>
              <div className="summary-row">
                <span>Tạm tính ({selectedCartItems.length} sản phẩm):</span>
                <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá ({discount}%):</span>
                  <span>-{discountAmount.toLocaleString("vi-VN")} ₫</span>
                </div>
              )}
              <div className="summary-row shipping">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString("vi-VN")} ₫</span>
              </div>

              <div className="checkout-actions">
                <Link
                  to={selectedCartItems.length > 0 ?  ROUTES.USER.CHECKOUT: "#"}
                  className={`checkout-btn ${
                    selectedCartItems.length === 0 ? "disabled" : ""
                  }`}
                  onClick={(e) => {
                    if (selectedCartItems.length === 0) {
                      e.preventDefault();
                      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
                    }
                  }}
                >
                  Tiến hành thanh toán
                </Link>
                <Link to={ROUTES.SHOP.PRODUCTS} className="continue-shopping">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal with improved animation */}
      {showConfirmation && (
        <div className="confirmation-modal" style={{animation: 'modalFadeIn 0.3s ease'}}>
          <div className="confirmation-content">
            <h3>Xác nhận xóa</h3>
            <p>
              {itemToDelete === "all"
                ? "Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?"
                : "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"}
            </p>
            <div className="confirmation-buttons">
              <button
                className="confirm-btn"
                onClick={() => {
                  if (itemToDelete === "all") {
                    clearCart();
                  } else {
                    handleRemoveItem();
                  }
                }}
              >
                Xóa
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowConfirmation(false);
                  setItemToDelete(null);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
