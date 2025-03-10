import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import './ProductCard.scss';

const ProductCard = ({ product, index, onQuickView, showAlternate }) => {
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: index * 0.1 }
    }
  };

  // Handle quick view click
  const handleQuickViewClick = (e) => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <motion.div 
      className="product-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="product-badges">
        {product.isNew && <span className="badge new">Mới</span>}
        {product.isBestSeller && <span className="badge bestseller">Bán chạy</span>}
        {product.discountPercentage > 0 && (
          <span className="badge discount">-{product.discountPercentage}%</span>
        )}
      </div>
      
      <Link to={`/products/${product.id}`} className="product-image-container">
        <img 
          src={product.thumbnail}
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
          <button className="action-btn quick-view-btn" title="Xem nhanh" onClick={handleQuickViewClick}>
            <FiEye />
          </button>
        </div>
      </Link>
      
      <div className="product-info">
        <Link to={`/products/${product.id}`} className="product-name">{product.name}</Link>
        
        <div className="product-category">{product.category}</div>
        
        <div className="product-rating">
          <FiStar className="star-icon filled" />
          <span>{product.rating}</span>
        </div>
        
        <div className="product-price">
          {product.discountPercentage > 0 ? (
            <>
              <span className="original-price">{formatPrice(product.price)}</span>
              <span className="discounted-price">
                {formatPrice(calculateDiscountedPrice(product.price, product.discountPercentage))}
              </span>
            </>
          ) : (
            <span className="current-price">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
