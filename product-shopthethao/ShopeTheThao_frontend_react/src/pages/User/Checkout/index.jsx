import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaAngleLeft, FaAngleRight, FaCreditCard, FaMoneyBill, FaWallet } from 'react-icons/fa';
import './Checkout.scss';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod'
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Fetch cart items from localStorage
    const fetchCartItems = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Only use selected items if there are any selected
        const selectedItemIds = localStorage.getItem('selectedItems') ? 
                               JSON.parse(localStorage.getItem('selectedItems')) : 
                               parsedCart.map(item => item.id);
        
        const filteredCart = parsedCart.filter(item => selectedItemIds.includes(item.id));
        setCartItems(filteredCart);
      } else {
        navigate('/cart');
      }
      setLoading(false);
    };

    fetchCartItems();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';
    if (!formData.province.trim()) newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    if (!formData.district.trim()) newErrors.district = 'Vui lòng chọn quận/huyện';
    if (!formData.ward.trim()) newErrors.ward = 'Vui lòng chọn phường/xã';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate order processing
      setLoading(true);
      
      setTimeout(() => {
        setOrderPlaced(true);
        setShowSuccessModal(true);
        setLoading(false);
        // Clear cart after successful order
        localStorage.removeItem('cartItems');
      }, 1500);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 0; // Free shipping
  const total = subtotal + shippingFee;

  // Create an order ID
  const orderId = `DH${Date.now().toString().slice(-6)}`;

  if (loading) {
    return <div className="loading-container">Đang xử lý...</div>;
  }

  if (orderPlaced && showSuccessModal) {
    return (
      <div className="success-overlay">
        <div className="success-modal">
          <div className="success-icon">
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2>Đặt hàng thành công!</h2>
          <p>Cảm ơn bạn đã mua sắm tại ShopTheThao</p>
          <div className="order-info">
            <p>Mã đơn hàng: <strong>{orderId}</strong></p>
            <p>Tổng giá trị: <strong>{total.toLocaleString('vi-VN')}₫</strong></p>
          </div>
          <button onClick={closeSuccessModal} className="continue-btn">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">
        <FaShoppingCart className="checkout-icon" /> Thanh toán
      </h1>

      <div className="checkout-breadcrumb">
        <Link to="/cart">Giỏ hàng</Link>
        <FaAngleRight />
        <span className="active">Thanh toán</span>
        <FaAngleRight />
        <span>Hoàn thành</span>
      </div>

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-section shipping-info">
            <h2>Thông tin giao hàng</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên <span className="required">*</span></label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Địa chỉ <span className="required">*</span></label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
                placeholder="Số nhà, tên đường"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="province">Tỉnh/Thành phố <span className="required">*</span></label>
                <select 
                  id="province" 
                  name="province" 
                  value={formData.province}
                  onChange={handleChange}
                  className={errors.province ? 'error' : ''}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
                {errors.province && <span className="error-message">{errors.province}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="district">Quận/Huyện <span className="required">*</span></label>
                <select 
                  id="district" 
                  name="district" 
                  value={formData.district}
                  onChange={handleChange}
                  className={errors.district ? 'error' : ''}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  <option value="Quận 1">Quận 1</option>
                  <option value="Quận 2">Quận 2</option>
                  <option value="Quận 3">Quận 3</option>
                </select>
                {errors.district && <span className="error-message">{errors.district}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="ward">Phường/Xã <span className="required">*</span></label>
                <select 
                  id="ward" 
                  name="ward" 
                  value={formData.ward}
                  onChange={handleChange}
                  className={errors.ward ? 'error' : ''}
                >
                  <option value="">Chọn Phường/Xã</option>
                  <option value="Phường 1">Phường 1</option>
                  <option value="Phường 2">Phường 2</option>
                  <option value="Phường 3">Phường 3</option>
                </select>
                {errors.ward && <span className="error-message">{errors.ward}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="note">Ghi chú đơn hàng (tùy chọn)</label>
              <textarea 
                id="note" 
                name="note" 
                value={formData.note}
                onChange={handleChange}
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
              ></textarea>
            </div>
          </div>
          
          <div className="checkout-section payment-method">
            <h2>Phương thức thanh toán</h2>
            
            <div className="payment-options">
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="cod" 
                  name="paymentMethod" 
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <label htmlFor="cod">
                  <FaMoneyBill className="payment-icon" />
                  <div>
                    <span>Thanh toán khi nhận hàng (COD)</span>
                    <small>Thanh toán bằng tiền mặt khi nhận hàng</small>
                  </div>
                </label>
              </div>
              
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="card" 
                  name="paymentMethod" 
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <label htmlFor="card">
                  <FaCreditCard className="payment-icon" />
                  <div>
                    <span>Thanh toán bằng thẻ tín dụng/ghi nợ</span>
                    <small>Hỗ trợ Visa, Mastercard, JCB</small>
                  </div>
                </label>
              </div>
              
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="momo" 
                  name="paymentMethod" 
                  value="momo"
                  checked={formData.paymentMethod === 'momo'}
                  onChange={handleChange}
                />
                <label htmlFor="momo">
                  <FaWallet className="payment-icon" />
                  <div>
                    <span>Ví điện tử (MoMo, ZaloPay, VNPay)</span>
                    <small>Quét mã QR để thanh toán</small>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="checkout-actions-mobile">
            <button type="submit" className="place-order-btn">
              Đặt hàng
            </button>
          </div>
        </form>
        
        <div className="order-summary">
          <h2>Đơn hàng của bạn</h2>
          
          <div className="order-items">
            {cartItems.map((item) => (
              <div className="order-item" key={item.id}>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  <span className="item-quantity">{item.quantity}</span>
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">
                    {item.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                  </p>
                </div>
                <div className="item-total">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row subtotal">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            
            <div className="total-row shipping">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}</span>
            </div>
            
            <div className="total-row final">
              <span>Tổng cộng:</span>
              <span className="total-amount">{total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
          
          <div className="checkout-actions">
            <Link to="/v1/user/cart" className="back-to-cart">
              <FaAngleLeft /> Quay lại giỏ hàng
            </Link>
            <button type="submit" onClick={handleSubmit} className="place-order-btn">
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
