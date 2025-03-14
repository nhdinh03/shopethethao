import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import './ProductFrame.scss';

const ProductFrame = ({ className }) => {
  // Mock data for demonstration
  const productData = {
    id: 'sample-1',
    name: 'Áo Thể Thao Pro-Active',
    category: 'Áo thun thể thao',
    price: 450000,
    originalPrice: 700000,
    rating: 4,
    reviewCount: 28,
    isNew: true
  };

  return (
    <div className={`product-frame ${className || ''}`}>
      <div className="product-image-placeholder">
        <div className="product-tag">Mới</div>
        <div className="product-actions">
          <button className="action-button" aria-label="Add to wishlist">
            <FiHeart />
          </button>
          <button className="action-button primary" aria-label="Add to cart">
            <FiShoppingBag />
          </button>
          <Link to={`/product/${productData.id}`} className="action-button" aria-label="View details">
            <FiEye />
          </Link>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">{productData.category}</div>
        <h3 className="product-name">{productData.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < productData.rating ? "filled" : ""}>★</span>
            ))}
          </div>
          <span className="rating-count">({productData.reviewCount})</span>
        </div>
        <div className="product-price">
          <span className="current-price">{new Intl.NumberFormat('vi-VN').format(productData.price)}₫</span>
          <span className="original-price">{new Intl.NumberFormat('vi-VN').format(productData.originalPrice)}₫</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFrame;
