import { useState, useEffect } from 'react';
import { Table, Typography, Tag, Select, message } from 'antd';
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      className: 'column-id',
    },
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'product',
      key: 'product',
      width: 300,
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
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size) => (
        <Tag color="blue">{size.name}</Tag>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity) => (
        <Tag color="green">{quantity}</Tag>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 150,
      render: (price) => (
        <span className="price-tag">
          {price.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 200,
      render: (method) => (
        <Tag color={method === 'Tiền mặt' ? 'orange' : 'purple'}>
          {method}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Quản Lý Hóa Đơn Chi Tiết</Title>
      <Table
        columns={columns}
        dataSource={detailedInvoices}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
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
  );
};

export default Detailed_Invoices;
