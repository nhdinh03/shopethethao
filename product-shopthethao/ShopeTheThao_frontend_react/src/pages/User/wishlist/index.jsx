import React, { useState, useEffect } from 'react';
import { HeartFilled, ShoppingCartOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Row, Col, Card, Button, Empty, notification, Spin, Modal, Input, Select, Tooltip, Badge, Drawer, Rate } from 'antd';
import './wishlist.scss';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState('grid');
    const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
    const [quickViewVisible, setQuickViewVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    
    const { Option } = Select;

    // Mock data - replace with actual API call
    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            const mockItems = [
                {
                    id: 1,
                    name: 'Nike Air Max 2023',
                    image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5a2383-ef2a-4b81-91fb-c85a0d7957a2/air-jordan-1-low-shoes-459b4T.png',
                    price: 2500000,
                    discount: 10,
                    rating: 4.5,
                    category: 'Running',
                    brand: 'Nike',
                    sizes: ['39', '40', '41', '42', '43'],
                    description: 'The iconic Nike Air Max design returns with updated materials in a perfect combination of style, comfort and attitude.'
                },
                {
                    id: 2,
                    name: 'Adidas Ultraboost',
                    image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Giay_UltraBoost_1.0_DJen_GZ9256_01_standard.jpg',
                    price: 3200000,
                    discount: 0,
                    rating: 5,
                    category: 'Running',
                    brand: 'Adidas',
                    sizes: ['40', '41', '42', '43'],
                    description: 'Ultraboost shoes with responsive cushioning and a sock-like fit for high comfort during your runs.'
                },
                {
                    id: 3,
                    name: 'Puma RS-X',
                    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/380562/03/sv01/fnd/IND/fmt/png/RS-X-Efekt-Men\'s-Sneakers',
                    price: 1800000,
                    discount: 15,
                    rating: 4,
                    category: 'Casual',
                    brand: 'Puma',
                    sizes: ['39', '40', '42', '44'],
                    description: 'Chunky silhouette combined with RS technology for maximum comfort and retro design inspiration.'
                },
                {
                    id: 4,
                    name: 'New Balance 574',
                    image: 'https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?$pdpflexf2$&wid=440&hei=440',
                    price: 1950000,
                    discount: 5,
                    rating: 4.2,
                    category: 'Casual',
                    brand: 'New Balance',
                    sizes: ['39', '41', '42', '43'],
                    description: 'Iconic silhouette with premium materials and EVA foam midsole for great cushioning and support.'
                }
            ];
            setWishlistItems(mockItems);
            setFilteredItems(mockItems);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter and sort items
    useEffect(() => {
        let result = [...wishlistItems];
        
        // Apply search filter
        if (searchText) {
            result = result.filter(item => 
                item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                item.brand.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        
        // Apply sorting
        if (sortBy === 'price-asc') {
            result.sort((a, b) => getActualPrice(a) - getActualPrice(b));
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => getActualPrice(b) - getActualPrice(a));
        } else if (sortBy === 'discount') {
            result.sort((a, b) => b.discount - a.discount);
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }
        
        setFilteredItems(result);
    }, [wishlistItems, searchText, sortBy]);

    const getActualPrice = (item) => {
        return item.discount > 0 
            ? item.price - (item.price * item.discount / 100)
            : item.price;
    };

    const removeFromWishlist = (id, e) => {
        e && e.stopPropagation();
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
        notification.success({
            message: 'Removed from Wishlist',
            description: 'The product has been removed from your wishlist.',
            placement: 'bottomRight',
            duration: 2
        });
    };

    const addToCart = (product, e) => {
        e && e.stopPropagation();
        notification.success({
            message: 'Added to Cart',
            description: `${product.name} has been added to your cart.`,
            placement: 'bottomRight',
            duration: 2
        });
    };

    const showQuickView = (product, e) => {
        e && e.stopPropagation();
        setCurrentProduct(product);
        setQuickViewVisible(true);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(price);
    };

    const calculateDiscountedPrice = (price, discount) => {
        return price - (price * discount / 100);
    };

    const handleBulkRemove = () => {
        if (window.confirm(`Remove all ${filteredItems.length} items from wishlist?`)) {
            setWishlistItems([]);
            notification.success({
                message: 'Wishlist Cleared',
                description: 'All items have been removed from your wishlist.',
                placement: 'bottomRight',
                duration: 2
            });
        }
    };

    const renderQuickViewModal = () => {
        if (!currentProduct) return null;
        
        return (
            <Modal
                visible={quickViewVisible}
                title={currentProduct.name}
                onCancel={() => {
                    setQuickViewVisible(false);
                    setSelectedSize(null);
                }}
                footer={[
                    <Button 
                        key="remove" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            removeFromWishlist(currentProduct.id);
                            setQuickViewVisible(false);
                        }}
                    >
                        Remove from Wishlist
                    </Button>,
                    <Button
                        key="addToCart"
                        type="primary"
                        disabled={!selectedSize}
                        icon={<ShoppingCartOutlined />}
                        onClick={() => {
                            addToCart({...currentProduct, size: selectedSize});
                            setQuickViewVisible(false);
                            setSelectedSize(null);
                        }}
                    >
                        {selectedSize ? `Add to Cart (Size: ${selectedSize})` : 'Select Size First'}
                    </Button>
                ]}
                width={800}
                className="quick-view-modal"
                destroyOnClose
            >
                <div className="quick-view-content">
                    <Row gutter={24}>
                        <Col span={12}>
                            <div className="product-image">
                                <img src={currentProduct.image} alt={currentProduct.name} />
                                {currentProduct.discount > 0 && (
                                    <div className="discount-tag">-{currentProduct.discount}%</div>
                                )}
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="product-info">
                                <Rate disabled defaultValue={currentProduct.rating} allowHalf />
                                <div className="product-price modal-price">
                                    {currentProduct.discount > 0 ? (
                                        <>
                                            <div className="discounted-price">
                                                {formatPrice(calculateDiscountedPrice(currentProduct.price, currentProduct.discount))}
                                            </div>
                                            <div className="original-price">
                                                {formatPrice(currentProduct.price)}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="regular-price">
                                            {formatPrice(currentProduct.price)}
                                        </div>
                                    )}
                                </div>
                                <div className="product-description">
                                    <p>{currentProduct.description}</p>
                                </div>
                                <div className="product-category">
                                    <strong>Category:</strong> {currentProduct.category}
                                </div>
                                <div className="product-brand">
                                    <strong>Brand:</strong> {currentProduct.brand}
                                </div>
                                <div className="size-selection">
                                    <h4>Select Size:</h4>
                                    <div className="size-options">
                                        {currentProduct.sizes.map(size => (
                                            <Button
                                                key={size}
                                                className={selectedSize === size ? 'size-btn selected' : 'size-btn'}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    };

    const renderFilterDrawer = () => {
        return (
            <Drawer
                title="Filter Products"
                placement="right"
                onClose={() => setFilterDrawerVisible(false)}
                visible={filterDrawerVisible}
                width={300}
                className="filter-drawer"
            >
                <div className="filter-section">
                    <h4>Sort By</h4>
                    <Select 
                        style={{ width: '100%' }} 
                        value={sortBy}
                        onChange={value => setSortBy(value)}
                    >
                        <Option value="default">Default</Option>
                        <Option value="price-asc">Price: Low to High</Option>
                        <Option value="price-desc">Price: High to Low</Option>
                        <Option value="discount">Biggest Discount</Option>
                        <Option value="rating">Highest Rating</Option>
                    </Select>
                </div>
                
                <div className="filter-section">
                    <h4>Search</h4>
                    <Input 
                        placeholder="Search products..." 
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
                
                <div className="filter-footer">
                    <Button type="primary" block onClick={() => setFilterDrawerVisible(false)}>
                        Apply Filters
                    </Button>
                    <Button 
                        style={{ marginTop: 10 }}
                        block 
                        onClick={() => {
                            setSearchText('');
                            setSortBy('default');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            </Drawer>
        );
    };

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <div className="header-left">
                    <h1><HeartFilled /> My Wishlist</h1>
                    <p>{filteredItems.length} items in your wishlist</p>
                </div>
                <div className="header-right">
                    <div className="view-options">
                        <Button.Group>
                            <Tooltip title="Grid View">
                                <Button 
                                    type={viewMode === 'grid' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('grid')}
                                >
                                    Grid
                                </Button>
                            </Tooltip>
                            <Tooltip title="List View">
                                <Button 
                                    type={viewMode === 'list' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('list')}
                                >
                                    List
                                </Button>
                            </Tooltip>
                        </Button.Group>
                    </div>
                    
                    <div className="filter-options">
                        <Tooltip title="Filter and Sort">
                            <Badge count={searchText || sortBy !== 'default' ? '!' : 0}>
                                <Button 
                                    icon={<FilterOutlined />} 
                                    onClick={() => setFilterDrawerVisible(true)}
                                >
                                    Filter
                                </Button>
                            </Badge>
                        </Tooltip>
                    </div>
                    
                    {wishlistItems.length > 1 && (
                        <div className="clear-options">
                            <Button 
                                danger 
                                onClick={handleBulkRemove}
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : filteredItems.length > 0 ? (
                <div className={`wishlist-items ${viewMode}`}>
                    {viewMode === 'grid' ? (
                        <Row gutter={[16, 24]}>
                            {filteredItems.map(item => (
                                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                    <div 
                                        className="card-wrapper"
                                        onMouseEnter={() => setHoveredItemId(item.id)}
                                        onMouseLeave={() => setHoveredItemId(null)}
                                        onClick={() => showQuickView(item)}
                                    >
                                        <Card 
                                            hoverable 
                                            className="wishlist-card"
                                            cover={
                                                <div className="image-container">
                                                    <img alt={item.name} src={item.image} />
                                                    {item.discount > 0 && <span className="discount-label">-{item.discount}%</span>}
                                                    
                                                    {hoveredItemId === item.id && (
                                                        <div className="hover-buttons">
                                                            <Tooltip title="Quick View">
                                                                <Button 
                                                                    icon={<EyeOutlined />}
                                                                    className="hover-btn quick-view-btn"
                                                                    onClick={(e) => showQuickView(item, e)}
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <Card.Meta 
                                                title={item.name} 
                                                description={
                                                    <>
                                                        <div className="product-price">
                                                            {item.discount > 0 ? (
                                                                <>
                                                                    <span className="discounted-price">
                                                                        {formatPrice(calculateDiscountedPrice(item.price, item.discount))}
                                                                    </span>
                                                                    <span className="original-price">
                                                                        {formatPrice(item.price)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="regular-price">
                                                                    {formatPrice(item.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="product-rating">
                                                            <Rate disabled defaultValue={item.rating} allowHalf />
                                                        </div>
                                                    </>
                                                }
                                            />
                                            
                                            <div className="card-actions">
                                                <Button 
                                                    type="primary" 
                                                    icon={<ShoppingCartOutlined />}
                                                    onClick={(e) => showQuickView(item, e)}
                                                    block
                                                >
                                                    Add to Cart
                                                </Button>
                                                <Button 
                                                    danger 
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => removeFromWishlist(item.id, e)}
                                                    block
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </Card>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="list-view">
                            {filteredItems.map(item => (
                                <Card 
                                    key={item.id}
                                    className="list-card"
                                    onClick={() => showQuickView(item)}
                                    hoverable
                                >
                                    <Row gutter={16} align="middle">
                                        <Col xs={24} sm={8} md={6}>
                                            <div className="list-image-container">
                                                <img src={item.image} alt={item.name} />
                                                {item.discount > 0 && <span className="discount-label">-{item.discount}%</span>}
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={10} md={12}>
                                            <div className="list-item-details">
                                                <h3>{item.name}</h3>
                                                <div className="product-rating">
                                                    <Rate disabled defaultValue={item.rating} allowHalf />
                                                </div>
                                                <p className="item-brand">{item.brand}</p>
                                                <p className="item-category">{item.category}</p>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={6} md={6}>
                                            <div className="list-item-actions">
                                                <div className="product-price">
                                                    {item.discount > 0 ? (
                                                        <>
                                                            <span className="discounted-price">
                                                                {formatPrice(calculateDiscountedPrice(item.price, item.discount))}
                                                            </span>
                                                            <span className="original-price">
                                                                {formatPrice(item.price)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="regular-price">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    )}
                                                </div>
                                                <Button 
                                                    type="primary" 
                                                    icon={<ShoppingCartOutlined />}
                                                    onClick={(e) => showQuickView(item, e)}
                                                    className="list-action-btn"
                                                >
                                                    Add to Cart
                                                </Button>
                                                <Button 
                                                    danger 
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => removeFromWishlist(item.id, e)}
                                                    className="list-action-btn"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-wishlist">
                    <Empty 
                        description="Your wishlist is empty" 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                    <Button type="primary" size="large" href="/products">
                        Continue Shopping
                    </Button>
                </div>
            )}
            
            {renderQuickViewModal()}
            {renderFilterDrawer()}
        </div>
    );
}

export default Wishlist;
