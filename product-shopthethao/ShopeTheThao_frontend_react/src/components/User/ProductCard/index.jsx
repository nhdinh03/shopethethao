import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import './ProductCard.scss';

const ProductCard = ({ product, index, onQuickView, quickViewButton, showAlternate }) => {
  const navigate = useNavigate();

  if (!product) {
    console.error("Product data is undefined");
    return <div className="product-card error">Dữ liệu sản phẩm không hợp lệ</div>;
  }

  // Format price with VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  // Handle card click to navigate to product details
  const handleProductClick = (e) => {
    // Prevent navigation if the click was on a button inside the card
    if (e.target.closest('button')) {
      return;
    }
    window.scrollTo(0, 0);
    navigate(`/v1/shop/seefulldetails/${product.id}`, { replace: true });
  };

  // Handle quick view button click
  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView();
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: index * 0.1 }
    }
  };

  return (
    <motion.div 
      className="product-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onClick={handleProductClick}
    >
      <div className="product-badges">
        {product.isNew && <span className="badge new">Mới</span>}
        {product.isBestSeller && <span className="badge bestseller">Bán chạy</span>}
        {product.discountPercentage > 0 && (
          <span className="badge discount">-{product.discountPercentage}%</span>
        )}
      </div>
      
      <div className="product-image-container">
        <img 
          src={showAlternate && product.images?.[1] ? product.images[1] : product.thumbnail} 
          alt={product.name}
          className="product-image primary"
        />
        {product.alternateThumbnail && (
          <img 
            src={product.alternateThumbnail}
            alt={`${product.name} - alternate view`}
            className="product-image alternate"
          />
        )}
        <div className="product-actions">
          <button className="action-btn wishlist-btn" title="Thêm vào danh sách yêu thích">
            <FiHeart />
          </button>
          <button className="action-btn cart-btn" title="Thêm vào giỏ hàng">
            <FiShoppingCart />
          </button>
          <button className="action-btn quick-view-btn" title="Xem nhanh" onClick={handleQuickView}>
            <FiEye />
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} className={i < Math.round(product.rating) ? "filled" : ""} />
          ))}
          <span>({product.reviews || 0})</span>
        </div>
        
        <div className="product-price">
          {product.discountPercentage > 0 ? (
            <>
              <span className="discounted-price">
                {formatPrice(calculateDiscountedPrice(product.price, product.discountPercentage))}
              </span>
              <span className="original-price">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="current-price">{formatPrice(product.price)}</span>
          )}
        </div>
        
        {product.colors && product.colors.length > 0 && (
          <div className="product-colors">
            {product.colors.map((color, i) => (
              <span 
                key={i} 
                className="color-dot" 
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
      
      {quickViewButton && (
        <div className="quick-view-button-container">
          {quickViewButton}
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
