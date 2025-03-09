import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiChevronDown, FiX, FiHome, FiChevronRight, FiEye, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../../../components/ProductCard';
import QuickView from '../../../components/QuickView';
import { mockProducts } from '../../../data/mockData';
import './Products.scss';

const Products = () => {
  const products = mockProducts || [];
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    brand: [],
    priceRange: 2000000
  });
  const [sortOption, setSortOption] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const location = useLocation();
  const [showAlternate, setShowAlternate] = useState(null);

  // Calculate category and brand counts
  const categories = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  
  const brands = products.reduce((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {});

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => {
      if (type === 'category' || type === 'brand') {
        const updated = { ...prev };
        if (updated[type].includes(value)) {
          updated[type] = updated[type].filter(item => item !== value);
        } else {
          updated[type] = [...updated[type], value];
        }
        return updated;
      } else if (type === 'priceRange') {
        return { ...prev, priceRange: value };
      }
      return prev;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setActiveFilters({
      category: [],
      brand: [],
      priceRange: 2000000
    });
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (activeFilters.category.length > 0) {
      result = result.filter(product => activeFilters.category.includes(product.category));
    }
    
    // Apply brand filter
    if (activeFilters.brand.length > 0) {
      result = result.filter(product => activeFilters.brand.includes(product.brand));
    }
    
    // Apply price filter
    result = result.filter(product => {
      const finalPrice = product.discountPercentage 
        ? product.price * (1 - product.discountPercentage / 100) 
        : product.price;
      return finalPrice <= activeFilters.priceRange;
    });
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => {
          const priceA = a.discountPercentage ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.discountPercentage ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        result.sort((a, b) => {
          const priceA = a.discountPercentage ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.discountPercentage ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // popular
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }
    
    setFilteredProducts(result);
  }, [products, activeFilters, sortOption]);

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Simple loading simulation
  useEffect(() => {
    // Just simulate a brief loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Get path segments for breadcrumbs
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Handle quick view
  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  // Return the product page with products
  return (
    <div className="products-page">
      {/* Banner */}
      <div className="page-banner">
        <div className="container">
          <h1>Sản Phẩm Thể Thao</h1>
          <p>Khám phá bộ sưu tập quần áo và phụ kiện thể thao cao cấp</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumb-item">
            <FiHome /> Trang chủ
          </Link>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <FiChevronRight className="breadcrumb-separator" />
              <Link 
                to={`/${pathSegments.slice(0, index + 1).join('/')}`}
                className="breadcrumb-item"
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            </React.Fragment>
          ))}
        </div>

        {/* Product Count Summary */}
        <div className="product-summary">
          <span className="result-count">Hiển thị {filteredProducts.length} sản phẩm</span>
          {activeFilters.category.length > 0 || activeFilters.brand.length > 0 && (
            <button className="clear-filters-btn" onClick={resetFilters}>
              <FiRefreshCw /> Xóa bộ lọc
            </button>
          )}
        </div>
        
        {/* Toolbar */}
        <div className="products-toolbar">
          <button 
            className="filter-toggle" 
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FiFilter /> {filterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
          
          <div className="view-options">
            <span className="product-count">Tìm thấy {filteredProducts.length} sản phẩm</span>
            
            <div className="view-buttons">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <FiList />
              </button>
            </div>
            
            <div className="sort-dropdown">
              <select 
                aria-label="Sort products" 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="price-low-high">Giá: Thấp đến cao</option>
                <option value="price-high-low">Giá: Cao đến thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
              <FiChevronDown className="dropdown-icon" />
            </div>
          </div>
        </div>
        
        {/* Products Container */}
        <div className={`products-container ${filterOpen ? 'with-filters' : ''}`}>
          {/* Filters Sidebar */}
          {filterOpen && (
            <div className="filters-sidebar">
              <div className="filters-header">
                <h3>Bộ lọc sản phẩm</h3>
                <button 
                  className="close-filters"
                  onClick={() => setFilterOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="filter-section">
                <h4>Danh mục</h4>
                <div className="filter-options">
                  {Object.entries(categories).map(([category, count]) => (
                    <label className="checkbox-label" key={category}>
                      <input 
                        type="checkbox" 
                        checked={activeFilters.category.includes(category)}
                        onChange={() => handleFilterChange('category', category)}
                      /> 
                      {category} <span className="count">({count})</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <h4>Thương hiệu</h4>
                <div className="filter-options">
                  {Object.entries(brands).map(([brand, count]) => (
                    <label className="checkbox-label" key={brand}>
                      <input 
                        type="checkbox" 
                        checked={activeFilters.brand.includes(brand)}
                        onChange={() => handleFilterChange('brand', brand)}
                      /> 
                      {brand} <span className="count">({count})</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <h4>Khoảng giá</h4>
                <div className="price-range">
                  <input 
                    type="range" 
                    min="0" 
                    max="5000000" 
                    step="100000"
                    value={activeFilters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', parseInt(e.target.value))}
                  />
                  <div className="price-inputs">
                    <span>0đ - {formatPrice(activeFilters.priceRange)}</span>
                  </div>
                </div>
              </div>
              
              <div className="applied-filters">
                <h4>Đang áp dụng</h4>
                <div className="filters-tags">
                  {activeFilters.category.map(cat => (
                    <span className="filter-tag" key={`cat-${cat}`}>
                      {cat}
                      <button onClick={() => handleFilterChange('category', cat)}>
                        <FiX />
                      </button>
                    </span>
                  ))}
                  
                  {activeFilters.brand.map(brand => (
                    <span className="filter-tag" key={`brand-${brand}`}>
                      {brand}
                      <button onClick={() => handleFilterChange('brand', brand)}>
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                className="reset-filters"
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
          
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div 
              className={`products-grid view-${viewMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="product-item"
                  variants={itemVariants}
                  onMouseEnter={() => setShowAlternate(product.id)}
                  onMouseLeave={() => setShowAlternate(null)}
                >
                  <ProductCard 
                    product={product} 
                    index={index} 
                    onQuickView={() => openQuickView(product)} 
                    quickViewButton={
                      <button 
                        className="quick-view-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          openQuickView(product);
                        }}
                      >
                        <FiEye /> Xem nhanh
                      </button>
                    }
                    onClick={() => setShowAlternate(showAlternate === product.id ? null : product.id)}
                    showAlternate={showAlternate === product.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="no-products">
              <div className="empty-state">
                <div className="empty-icon">
                  <FiFilter size={50} />
                </div>
                <h3>Không tìm thấy sản phẩm phù hợp</h3>
                <p>Vui lòng thử lại với bộ lọc khác hoặc xem tất cả sản phẩm của chúng tôi.</p>
                <button className="reset-button" onClick={resetFilters}>
                  <FiRefreshCw /> Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn next">
              <span>Tiếp</span> →
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView 
          product={quickViewProduct} 
          onClose={closeQuickView} 
        />
      )}
    </div>
  );
};

export default Products;
