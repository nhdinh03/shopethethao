import { useState, useEffect } from 'react';
import { Table, Typography, Tag, Select, message, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import detailedInvoicesAPI from 'api/Admin/DetailedInvoices/detailedInvoicesAPI';
import './detailedInvoices.scss';
import PaginationComponent from 'components/User/PaginationComponent';

const { Title } = Typography;

const Detailed_Invoices = () => {
  const [loading, setLoading] = useState(false);
  const [detailedInvoices, setDetailedInvoices] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await detailedInvoicesAPI.getByPage(currentPage, pageSize);
        if (isMounted) {
          setDetailedInvoices(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách hóa đơn chi tiết. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset page to 1 when page size changes
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Filter the invoice details based on search text
  const getFilteredInvoiceDetails = () => {
    if (!searchText) return detailedInvoices;
    
    return detailedInvoices.filter(detail => 
      (detail.product?.name?.toLowerCase().includes(searchText.toLowerCase())) ||
      (detail.size?.name?.toLowerCase().includes(searchText.toLowerCase())) ||
      (detail.product?.categorie?.name?.toLowerCase().includes(searchText.toLowerCase())) ||
      (detail.id?.toString().includes(searchText)) ||
      (detail.quantity?.toString().includes(searchText)) ||
      (detail.unitPrice?.toString().includes(searchText))
    );
  };

  const columns = [
    {
      title: "🆔 ID",
      dataIndex: 'id',
      key: 'id',
      width: 80,
      className: 'column-id',
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#f0f5ff",
          color: "#1677ff",
          fontWeight: 600,
          borderRight: "1px solid #f0f0f0"
        }
      })
    },
    {
      title: "📦 Thông tin sản phẩm",
      dataIndex: 'product',
      key: 'product',
      width: 300,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#f0f5ff",
          color: "#1677ff",
          fontWeight: 600,
          borderRight: "1px solid #f0f0f0"
        }
      }),
      render: (product) => (
        <div className="product-info-cell">
          <div className="product-image">
            {product.images && product.images.length > 0 ? (
              <img
                src={`http://localhost:8081/api/upload/${product.images[0].imageUrl}`}
                alt={product.name}
              />
            ) : (
              <div className="image-placeholder">N/A</div>
            )}
          </div>
          <div className="product-details">
            <div className="product-name">{product.name}</div>
            <div className="product-category">{product.categorie?.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "📏 Kích thước",
      dataIndex: 'size',
      key: 'size',
      width: 100,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#f0f5ff",
          color: "#1677ff",
          fontWeight: 600,
          borderRight: "1px solid #f0f0f0"
        }
      }),
      render: (size) => (
        <Tag color="blue">{size.name}</Tag>
      ),
    },
    {
      title: "📊 Số lượng",
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#f0f5ff",
          color: "#1677ff",
          fontWeight: 600,
          borderRight: "1px solid #f0f0f0"
        }
      }),
      render: (quantity) => (
        <Tag color="green">{quantity}</Tag>
      ),
    },
    {
      title: "💰 Đơn giá",
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 150,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#f0f5ff",
          color: "#1677ff",
          fontWeight: 600,
          borderRight: "1px solid #f0f0f0"
        }
      }),
      render: (price) => (
        <span className="price-tag">
          {price.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: "💳 Phương thức thanh toán",
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 200,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#f0f5ff",
          color: "#1677ff",
          fontWeight: 600,
          borderRight: "1px solid #f0f0f0"
        }
      }),
      render: (method) => (
        <Tag color={method === 'Tiền mặt' ? 'orange' : 'purple'}>
          {method}
        </Tag>
      ),
    },
  ];

  return (
    <div className="size-page">
      <div className="content-wrapper">
        <h2 className="page-title">Quản Lý Hóa Đơn Chi Tiết</h2>
        
        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm, kích thước, danh mục..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
              allowClear
            />
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={getFilteredInvoiceDetails()}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="detailed-invoices-table"
        />

        <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 10 }}>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <Select
            value={pageSize}
            style={{ width: 120, marginTop: 20 }}
            onChange={handlePageSizeChange}
          >
            <Select.Option value={5}>5 hàng</Select.Option>
            <Select.Option value={10}>10 hàng</Select.Option>
            <Select.Option value={20}>20 hàng</Select.Option>
            <Select.Option value={50}>50 hàng</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Detailed_Invoices;
