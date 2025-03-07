import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiShoppingCart, FiHeart, FiShare2, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './QuickView.scss';

const QuickView = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Change quantity
  const changeQuantity = (amount) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  // Change selected image
  const changeImage = (index) => {
    setSelectedImage(index);
  };

  // Next image
  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  // Previous image
  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  // Modal click backdrop handler
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('quick-view-overlay')) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="quick-view-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div 
          className="quick-view-modal"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
          
          <div className="quick-view-content">
            <div className="product-images">
              <div className="main-image">
                <img 
                  src={product.images?.[selectedImage] || product.thumbnail} 
                  alt={product.name}
                />
                
                {product.discountPercentage > 0 && (
                  <span className="discount-badge">-{product.discountPercentage}%</span>
                )}
                
                {product.images && product.images.length > 1 && (
                  <>
                    <button className="nav-button prev" onClick={prevImage}>
                      <FiChevronLeft />
                    </button>
                    <button className="nav-button next" onClick={nextImage}>
                      <FiChevronRight />
                    </button>
                  </>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-gallery">
                  {product.images.map((img, index) => (
                    <div 
                      key={index} 
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => changeImage(index)}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="product-details">
              <div className="product-header">
                <span className="product-category">{product.category}</span>
                <h2 className="product-name">{product.name}</h2>
                
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={i < Math.round(product.rating) ? "filled" : ""} 
                      />
                    ))}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews || 0} đánh giá)
                  </span>
                </div>
                
                <div className="product-price">
                  {product.discountPercentage > 0 ? (
                    <>
                      <span className="discounted-price">
                        {formatPrice(calculateDiscountedPrice(product.price, product.discountPercentage))}
                      </span>
                      <span className="original-price">{formatPrice(product.price)}</span>
                      <span className="discount-tag">Tiết kiệm {product.discountPercentage}%</span>
                    </>
                  ) : (
                    <span className="current-price">{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
              
              <p className="product-description">{product.description || 'Không có mô tả chi tiết.'}</p>
              
              {product.colors && product.colors.length > 0 && (
                <div className="product-colors">
                  <h4>Màu sắc:</h4>
                  <div className="color-options">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {product.sizes && product.sizes.length > 0 && (
                <div className="product-sizes">
                  <h4>Kích cỡ:</h4>
                  <div className="size-options">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`size-option ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="product-actions">
                <div className="quantity-selector">
                  <button onClick={() => changeQuantity(-1)} disabled={quantity <= 1}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => changeQuantity(1)}>+</button>
                </div>
                
                <button className="add-to-cart-btn">
                  <FiShoppingCart /> Thêm vào giỏ hàng
                </button>
                
                <button className="wishlist-btn">
                  <FiHeart />
                </button>
              </div>
              
              <div className="product-meta">
                <div className="meta-item">
                  <strong>Mã sản phẩm:</strong> {product.sku || product.id}
                </div>
                {product.brand && (
                  <div className="meta-item">
                    <strong>Thương hiệu:</strong> {product.brand}
                  </div>
                )}
                <div className="meta-item">
                  <strong>Trạng thái:</strong> {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </div>
              </div>
              
              <div className="product-share">
                <button className="share-btn">
                  <FiShare2 /> Chia sẻ
                </button>
              </div>
              
              <Link to={`/products/${product.id}`} className="view-full-details">
                Xem chi tiết đầy đủ
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickView;
