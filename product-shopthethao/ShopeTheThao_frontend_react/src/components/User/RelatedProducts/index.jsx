import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { FaShoppingCart, FaHeart, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.css';

const RelatedProducts = () => {
  // Sample data for demonstration
  const sampleProducts = [
    {
      id: 1,
      name: 'Nike Air Zoom Pegasus 38',
      price: 120,
      discountPrice: 99.99,
      rating: 4.5,
      image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/55b3c3ff-826c-4a7c-8af2-b1896e04e331/air-zoom-pegasus-38-running-shoe-D1tCt1.png'
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 21',
      price: 180,
      discountPrice: 159.99,
      rating: 4.8,
      image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/bd43ce71f589498ab6b9acb701561df5_9366/Ultraboost_21_Shoes_Black_FY0378_01_standard.jpg'
    },
    {
      id: 3,
      name: 'Under Armour HOVR Phantom 2',
      price: 150,
      discountPrice: 129.95,
      rating: 4.3,
      image: 'https://underarmour.scene7.com/is/image/Underarmour/3023017-103_PAIR?rp=standard-0pad|pdpMainDesktop&scl=1&fmt=jpg&qlt=85&resMode=sharp2&cache=on,on&bgc=f0f0f0&wid=566&hei=708&size=566,708'
    },
    {
      id: 4,
      name: 'Puma RS-X³ Puzzle',
      price: 110,
      discountPrice: 89.99,
      rating: 4.2,
      image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/371570/06/sv01/fnd/PNA/fmt/png/RS-X%C2%B3-Puzzle-Shoes'
    }
  ];

  const bannerImages = [
    {
      id: 1,
      image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/w_1824,c_limit/c00c74cc-2cef-46a1-9c19-c05c19ddfadf/nike-just-do-it.jpg',
      title: 'New Collection 2023'
    },
    {
      id: 2,
      image: 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/enUS/Images/running-ss22-ultraboost-launch-hp-masthead-d_tcm221-884250.jpg',
      title: 'Summer Sale Up to 40%'
    },
    {
      id: 3,
      image: 'https://www.sportsshoes.com/media/wysiwyg/2023/03/nb-fast-banner.jpg',
      title: 'Limited Edition Products'
    }
  ];

  // Custom arrow components for carousel
  const arrowStyles = {
    position: 'absolute',
    zIndex: 2,
    top: 'calc(50% - 25px)',
    width: 50,
    height: 50,
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  };

  const CustomPrevArrow = ({ onClick }) => (
    <div 
      className="carousel-arrow prev"
      style={{ ...arrowStyles, left: 15 }}
      onClick={onClick}
    >
      <FaChevronLeft style={{ color: '#333' }} />
    </div>
  );

  const CustomNextArrow = ({ onClick }) => (
    <div 
      className="carousel-arrow next"
      style={{ ...arrowStyles, right: 15 }}
      onClick={onClick}
    >
      <FaChevronRight style={{ color: '#333' }} />
    </div>
  );

  // Enhanced product card with action buttons
  const ProductCard = ({ product }) => {
    const [hovered, setHovered] = useState(false);
    
    return (
      <div 
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {product.discountPrice < product.price && (
          <div className="product-badge">
            {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
          </div>
        )}
        
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          
          <div className={`product-actions ${hovered ? 'visible' : ''}`}>
            <button className="action-btn cart-btn" title="Add to Cart">
              <FaShoppingCart />
            </button>
            <button className="action-btn wishlist-btn" title="Add to Wishlist">
              <FaHeart />
            </button>
            <button className="action-btn quickview-btn" title="Quick View">
              <FaSearch />
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            <span className="current-price">${product.discountPrice.toFixed(2)}</span>
            {product.discountPrice < product.price && (
              <span className="original-price">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((star, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "star filled" : "star"}>★</span>
              ))}
            </div>
            <span className="rating-number">({product.rating})</span>
          </div>
          <div className="product-cta">
            <button className="add-to-cart">
              <FaShoppingCart className="cart-icon" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="related-products-section">
      <div className="related-products-container">
        <div className="section-header">
          <h2 className="section-title">Related Products</h2>
          <div className="section-subtitle">Products customers also purchased</div>
          <div className="section-divider">
            <span className="divider-line"></span>
            <span className="divider-icon">★</span>
            <span className="divider-line"></span>
          </div>
        </div>
        
        <div className="products-grids">
          <div className="grid-item div1">
            <ProductCard product={sampleProducts[0]} />
          </div>
          
          <div className="grid-item div2">
            <ProductCard product={sampleProducts[1]} />
          </div>
          
          <div className="grid-item div3">
            <ProductCard product={sampleProducts[2]} />
          </div>
          
          <div className="grid-item div4">
            <ProductCard product={sampleProducts[3]} />
          </div>
          
          <div className="grid-item div5">
            <Carousel 
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              showIndicators={true}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              className="banner-slideshow"
              renderArrowPrev={(onClickHandler, hasPrev) => 
                hasPrev && <CustomPrevArrow onClick={onClickHandler} />
              }
              renderArrowNext={(onClickHandler, hasNext) => 
                hasNext && <CustomNextArrow onClick={onClickHandler} />
              }
            >
              {bannerImages.map(banner => (
                <div key={banner.id} className="banner-slide">
                  <div className="banner-overlay"></div>
                  <img src={banner.image} alt={banner.title} />
                  <div className="banner-content">
                    <div className="banner-tagline">Exclusive Offer</div>
                    <h3 className="banner-title">{banner.title}</h3>
                    <p className="banner-description">Discover our premium selection of athletic wear and equipment</p>
                    <button className="banner-button">Shop Now</button>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        
        <div className="view-all-container">
          <a href="/products" className="view-all-btn">View All Products</a>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;