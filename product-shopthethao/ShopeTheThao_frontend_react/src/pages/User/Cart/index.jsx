import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './cart.scss';
import Loading from 'pages/Loading/loading';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [selectAll, setSelectAll] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch cart items from localStorage on component mount
    useEffect(() => {
        setTimeout(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
            setSelectedItems(parsedCart.map(item => item.id));
        } else {
            // Demo data if no saved cart
            const initialItems = [
                {
                    id: 1,
                    name: 'Giày thể thao Nike Air Max',
                    price: 1990000,
                    quantity: 1,
                    image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e777c881-5b62-4250-92a6-362967f54cca/air-force-1-07-shoes-WrLlWX.png',
                },
                {
                    id: 2,
                    name: 'Áo thun Adidas climalite',
                    price: 590000,
                    quantity: 2,
                    image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/57d461193168475e81f2aae800d3cffe_9366/Ao_Thun_Ba_La_Sportswear_trang_GL5684_21_model.jpg',
                },
                {
                    id: 3,
                    name: 'Quần short thể thao Puma',
                    price: 450000,
                    quantity: 1,
                    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/521159/01/mod01/fnd/PNA/fmt/png/Quần-short-Essentials-Regular-10"-Nam',
                },
            ];
            setCartItems(initialItems);
            setSelectedItems(initialItems.map(item => item.id));
        }
        setLoading(false);
        }
        , 500);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
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

    const handleQuantityChange = (id, change) => {
        setCartItems(
            cartItems.map(item => 
                item.id === id 
                ? { ...item, quantity: Math.max(1, item.quantity + change) } 
                : item
            )
        );
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleRemoveItem = () => {
        if (itemToDelete) {
            setCartItems(cartItems.filter(item => item.id !== itemToDelete));
            setSelectedItems(selectedItems.filter(id => id !== itemToDelete));
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
        if (couponCode.toUpperCase() === 'GIAMGIA10') {
            setDiscount(10);
        } else if (couponCode.toUpperCase() === 'GIAMGIA20') {
            setDiscount(20);
        } else {
            alert('Mã giảm giá không hợp lệ!');
            setDiscount(0);
        }
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Calculate totals based on selected items only
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const subtotal = selectedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

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
                    <Link to="/products" className="continue-shopping">Tiếp tục mua sắm</Link>
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
                            <button onClick={() => confirmDelete('all')} className="clear-cart-btn">
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
                            
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div 
                                        className={`cart-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                        key={item.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="item-select">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />
                                        </div>
                                        <div className="item-product" data-label="Sản phẩm">
                                            <img src={item.image} alt={item.name} />
                                            <div className="item-details">
                                                <h3>{item.name}</h3>
                                                <p>Mã SP: SP{item.id}000{item.id}</p>
                                                <div className="mobile-price">
                                                    {item.price.toLocaleString('vi-VN')} ₫
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item-price" data-label="Đơn giá">
                                            {item.price.toLocaleString('vi-VN')} ₫
                                        </div>
                                        <div className="item-quantity" data-label="Số lượng">
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, -1)}
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
                                                    handleQuantityChange(item.id, newQuantity - item.quantity);
                                                }}
                                                className="quantity-input"
                                            />
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                className="quantity-btn"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <div className="item-subtotal" data-label="Thành tiền">
                                            <span className="price-value">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                            </span>
                                        </div>
                                        <div className="item-action" data-label="Xóa">
                                            <button onClick={() => confirmDelete(item.id)} className="remove-btn">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
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
                                <FaInfoCircle /> <span>Mã thử nghiệm: GIAMGIA10, GIAMGIA20</span>
                            </div>
                        </div>
                        
                        <div className="order-summary">
                            <h3>Tổng đơn hàng</h3>
                            <div className="summary-row">
                                <span>Tạm tính ({selectedCartItems.length} sản phẩm):</span>
                                <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            {discount > 0 && (
                                <div className="summary-row discount">
                                    <span>Giảm giá ({discount}%):</span>
                                    <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
                                </div>
                            )}
                            <div className="summary-row shipping">
                                <span>Phí vận chuyển:</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="summary-row total">
                                <span>Tổng cộng:</span>
                                <span>{total.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            
                            <div className="checkout-actions">
                                <Link 
                                    to={selectedCartItems.length > 0 ? "/v1/user/checkout" : "#"}
                                    className={`checkout-btn ${selectedCartItems.length === 0 ? 'disabled' : ''}`}
                                    onClick={(e) => {
                                        if (selectedCartItems.length === 0) {
                                            e.preventDefault();
                                            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
                                        }
                                    }}
                                >
                                    Tiến hành thanh toán
                                </Link>
                                <Link to="/v1/shop/products" className="continue-shopping">Tiếp tục mua sắm</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation modal */}
            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <h3>Xác nhận xóa</h3>
                        <p>
                            {itemToDelete === 'all' 
                                ? 'Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?' 
                                : 'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?'}
                        </p>
                        <div className="confirmation-buttons">
                            <button 
                                className="confirm-btn"
                                onClick={() => {
                                    if (itemToDelete === 'all') {
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
