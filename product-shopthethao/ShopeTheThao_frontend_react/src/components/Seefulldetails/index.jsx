import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FiEye
} from 'react-icons/fi';
import { mockProducts } from '../../data/mockData';
import ProductCard from '../ProductCard';
// Fix the import for BreadcrumbUser component - make sure to use the right path & default export
import BreadcrumbUser from '../../layouts/User/BreadcrumbUser/BreadcrumbUser';
import { generateProductDetailsBreadcrumb } from '../../layouts/User/BreadcrumbUser/BreadcrumbUserConfig';
import './Seefulldetails.scss';

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
  const [activeTab, setActiveTab] = useState('description');
  const [zoomActive, setZoomActive] = useState(false);
  const [breadcrumbData, setBreadcrumbData] = useState([]);

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
          const foundProduct = mockProducts.find(p => p.id.toString() === productId);
          
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
              .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
              .slice(0, 4);
            setRelatedProducts(related);
            
            // Set breadcrumb data using the utility function
            setBreadcrumbData(generateProductDetailsBreadcrumb(foundProduct));
          } else {
            setError('Không tìm thấy sản phẩm');
          }
          
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
      totalPrice: product.discountPercentage > 0 
        ? calculateDiscountedPrice(product.price, product.discountPercentage) * quantity
        : product.price * quantity
    };
    
    // Show success message
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    // In a real app, this would dispatch to a cart context or redux store
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');  
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
            <h2>{error || 'Không tìm thấy sản phẩm'}</h2>
            <Link to="/products" className="back-button">Quay lại trang sản phẩm</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Use centralized BreadcrumbUser component with modern style */}
        <BreadcrumbUser 
          extraData={{ product, breadcrumbs: breadcrumbData }} 
          modern={true} 
          withBackground={false}
        />
        
        {/* Product Main Section */}
        <div className="product-main">
          {/* Product Gallery */}
          <div className="product-gallery">
            {/* ...existing code... */}
            <div className={`main-image ${zoomActive ? 'zoom-active' : ''}`}>
              <img 
                src={product.images?.[selectedImage] || product.thumbnail} 
                alt={product.name} 
                onClick={handleImageZoom}
              />
              {product.discountPercentage > 0 && (
                <div className="product-badge discount">-{product.discountPercentage}%</div>
              )}
              {product.isNew && (
                <div className="product-badge new">Mới</div>
              )}
              <button className="zoom-icon" onClick={handleImageZoom}>
                <FiEye />
              </button>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} - View ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            {/* ...existing code... */}
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={i < Math.round(product.rating) ? 'filled' : ''} 
                    />
                  ))}
                </div>
                <span>{product.rating} ({product.reviews || 0} đánh giá)</span>
              </div>
              
              <div className="product-sku">
                Mã SP: <span>{product.sku || product.id}</span>
              </div>
              
              <div className="product-brand">
                Thương hiệu: <span>{product.brand}</span>
              </div>
              
              <div className="stock-status">
                Tình trạng: <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                  {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                </span>
              </div>
            </div>
            
            <div className="product-price">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="price-current">
                    {formatPrice(calculateDiscountedPrice(product.price, product.discountPercentage))}
                  </span>
                  <span className="price-original">
                    {formatPrice(product.price)}
                  </span>
                  <span className="price-saving">
                    Tiết kiệm: {formatPrice(product.price - calculateDiscountedPrice(product.price, product.discountPercentage))}
                  </span>
                </>
              ) : (
                <span className="price-current">{formatPrice(product.price)}</span>
              )}
            </div>
            
            <div className="product-short-desc">
              <p>{product.description}</p>
            </div>
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-colors">
                <h3>Màu sắc</h3>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${selectedColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Color ${color}`}
                    >
                      {selectedColor === color && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
                <p className="selected-option">Đã chọn: <span>{selectedColor}</span></p>
              </div>
            )}
            
            {/* Size Selection with improved UI */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-sizes">
                <h3>Kích cỡ</h3>
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
                <p className="selected-option">Đã chọn: <span>{selectedSize}</span></p>
                <a href="#size-chart" className="size-guide">Bảng kích cỡ</a>
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
                  <FiShoppingCart /> Thêm vào giỏ hàng
                </button>
                
                <button 
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                >
                  Mua ngay
                </button>
                
                <button className="wishlist-btn">
                  <FiHeart />
                </button>
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
                <a href="#facebook" className="social-icon facebook">Facebook</a>
                <a href="#twitter" className="social-icon twitter">Twitter</a>
                <a href="#pinterest" className="social-icon pinterest">Pinterest</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs with improved UI */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mô tả sản phẩm
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Thông số kỹ thuật
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({product.reviews || 0})
            </button>
          </div>
          
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Mô tả sản phẩm</h3>
                <div className="product-description">
                  <p>{product.description}</p>
                  <ul>
                    <li>Chất liệu: {product.material || 'Polyester, Cotton'}</li>
                    <li>Xuất xứ: {product.origin || 'Việt Nam'}</li>
                    <li>Thiết kế hiện đại, thoáng mát</li>
                    <li>Phù hợp cho các hoạt động thể thao và đi chơi</li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'specifications' && (
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
                      <td>{product.material || 'Polyester, Cotton'}</td>
                    </tr>
                    <tr>
                      <td>Xuất xứ</td>
                      <td>{product.origin || 'Việt Nam'}</td>
                    </tr>
                    <tr>
                      <td>Phù hợp với</td>
                      <td>{product.gender || 'Nam/Nữ'}</td>
                    </tr>
                    <tr>
                      <td>Màu sắc</td>
                      <td>{product.colors?.join(', ')}</td>
                    </tr>
                    <tr>
                      <td>Kích cỡ</td>
                      <td>{product.sizes?.join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
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
                    <button className="write-review-btn">Viết đánh giá đầu tiên</button>
                  </div>
                )}
              </div>
            )}
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
                  <ProductCard 
                    product={relatedProduct} 
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Seefulldetails;
