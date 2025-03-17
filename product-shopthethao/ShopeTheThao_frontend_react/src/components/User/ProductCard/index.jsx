import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProductCard.scss';

const ProductCard = ({ product, showBadge, badgeText }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const discountedPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <motion.div className="product-card">
      <div 
        className="product-image"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showBadge && badgeText && (
          <span className="badge" 
            style={{
              backgroundColor: 
                badgeText === 'Mới' ? '#00c853' :
                badgeText === 'Bán chạy' ? '#ff3d00' : '#2196f3'
            }}
          >
            {badgeText}
          </span>
        )}
        <Link to={`/product/${product.id}`}>
          <img 
            src={isHovered && product.alternateThumbnail ? product.alternateThumbnail : product.thumbnail} 
            alt={product.name}
            className={isHovered ? 'hover-image' : ''}
          />
        </Link>
      </div>
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-name">
          <h3>{product.name}</h3>
        </Link>
        <div className="product-price">
          <span className="current-price">
            {formatPrice(discountedPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="original-price">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {product.rating && (
          <div className="product-rating">
            <span>⭐ {product.rating}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
