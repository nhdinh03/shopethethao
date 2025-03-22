import React, { useEffect, useRef, useState } from "react";
import { Table, message, Button, Row, Select, Modal, Form, Col, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined } from "@ant-design/icons";
import { productsApi, suppliersApi, stock_ReceiptsAPi } from "api/Admin";
import moment from "moment";
import "./stock_receipts.scss";
import PaginationComponent from "components/User/PaginationComponent";
import brandsApi from "api/Admin/Brands/Brands";
import styles from "..//modalStyles.module.scss";
import dayjs from "dayjs";
import { PrintReceiptModal, StockReceiptForm, TableActions } from "components/Admin";

const Stock_Receipts = () => {
  const printRef = useRef(null);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stockReceipts, setStockReceipts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stockReceiptsRes = await stock_ReceiptsAPi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        const stockReceipts = stockReceiptsRes.data.map((receipt) => ({
          ...receipt,
        }));
        setStockReceipts(stockReceipts);
        setTotalItems(stockReceiptsRes.totalItems);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Không thể lấy danh sách dữ liệu. Vui lòng thử lại!");
      }
    };

    fetchData();
  }, [currentPage, pageSize, searchText, workSomeThing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await productsApi.getAll();
        setProducts(productsRes.data);
        const suppliersRes = await suppliersApi.getAll();
        setSuppliers(suppliersRes.data);
        const brandsRes = await brandsApi.getAll();
        setBrands(brandsRes.data);
      } catch (error) {
        message.error("Không thể lấy danh sách dữ liệu. Vui lòng thử lại!");
      }
    };

    fetchData();
  }, []);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddNew = () => {
    form.resetFields();
    setEditMode(false);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      id: record.id,
      supplierId: record.supplierId,
      brandId: record.brandId,
      orderDate: record.orderDate ? dayjs(record.orderDate) : null,
      receiptProducts: record.receiptProducts || [],
    });

    setEditMode(record);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { receiptProducts, supplierId, brandId, orderDate, ...restValues } = values;
  
      const parsedSupplierId = parseInt(supplierId, 10);
      const parsedBrandId = parseInt(brandId, 10);
  
      if (isNaN(parsedSupplierId) || isNaN(parsedBrandId)) {
        message.error("Supplier ID và Brand ID phải là số nguyên!");
        return;
      }
  
      if (moment(orderDate).isBefore(moment(), "day")) {
        message.error("Ngày nhập kho không được ở trong quá khứ!");
        return;
      }
  
      const invalidProducts = receiptProducts.filter((product) => {
        return product.quantity <= 0 || product.price <= 0;
      });
  
      if (invalidProducts.length > 0) {
        message.error("Số lượng và giá sản phẩm phải lớn hơn 0!");
        return;
      }
  
      const processedProducts = receiptProducts.map((product) => ({
        productId: product.productId,
        sizeId: product.sizeId,
        quantity: product.quantity,
        price: product.price,
        totalAmount: product.quantity * product.price,
      }));
  
      const res = {
        ...restValues,
        supplierId: parsedSupplierId,
        brandId: parsedBrandId,
        orderDate: values.orderDate ? values.orderDate.format("YYYY-MM-DD") : null,
        receiptProducts: processedProducts,
      };
  
      console.log("Sending request payload:", res);
  
      let response;
      if (editMode) {
        response = await stock_ReceiptsAPi.update(editMode.id, res);
      } else {
        response = await stock_ReceiptsAPi.create(res);
      }
  
      if (response.data?.validationErrors) {
        // Handle validation errors from backend
        const errors = response.data.validationErrors;
        errors.forEach(error => {
          const productName = error.productName;
          Object.entries(error.errors).forEach(([field, message]) => {
            message.error(`${productName}: ${message}`);
          });
        });
        return;
      }
  
      message.success(editMode ? 
        "Cập nhật phiếu nhập kho thành công!" : 
        "Thêm phiếu nhập kho thành công!"
      );
      
      setWorkSomeThing(!workSomeThing);
      setEditMode(null);
      setModalVisible(false);
      form.resetFields();
  
    } catch (error) {
      if (error.response?.data?.validationErrors) {
        const errors = error.response.data.validationErrors;
        errors.forEach(errorItem => {
          const errorMessage = Object.entries(errorItem.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          message.error(`${errorItem.productName}: ${errorMessage}`);
        });
      } else {
        message.error("Lỗi khi lưu phiếu nhập kho: " + (error.response?.data || error.message));
      }
    }
  };
  const handleViewReceipt = (record) => {
    console.log(record);
    setSelectedReceipt(record);
    setPrintModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await stock_ReceiptsAPi.delete(id);
      message.success(response.data || "Xóa Phiếu nhập kho thành công!");
      console.log(response);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Không thể xóa phiếu nhập!");
    }
  };

  // Modify handleSearch function to be more robust
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Improved data fetching with client-side filtering as well
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Server-side search via API
          const stockReceiptsRes = await stock_ReceiptsAPi.getByPage(
            currentPage,
            pageSize,
            searchText
          );
          
          let receipts = stockReceiptsRes.data.map((receipt) => ({
            ...receipt,
          }));
          
          // Additional client-side filtering
          if (searchText) {
            receipts = receipts.filter(receipt => 
              // Search by ID
              receipt.id?.toString().includes(searchText) ||
              // Search by supplier name
              receipt.supplierName?.toLowerCase().includes(searchText.toLowerCase()) ||
              // Search by brand name
              receipt.brandName?.toLowerCase().includes(searchText.toLowerCase()) ||
              // Search by product names (if any product name contains the search text)
              receipt.receiptProducts?.some(product => 
                product.productName?.toLowerCase().includes(searchText.toLowerCase())
              ) ||
              // Search by date
              moment(receipt.orderDate).format("DD/MM/YYYY").includes(searchText)
            );
          }
          
          setStockReceipts(receipts);
          setTotalItems(stockReceiptsRes.totalItems);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          message.error("Không thể lấy danh sách dữ liệu. Vui lòng thử lại!");
        }
      };

      fetchData();
    }, 500); // 500ms delay for debounce
    
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const columns = [
    { title: "🆔 ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "📅 Ngày nhập",
      dataIndex: "orderDate",
      key: "orderDate",
      align: "center",
      render: (orderDate) => moment(orderDate).format("DD/MM/YYYY"),
    },
    {
      title: "🏢 Nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      align: "center",
    },
    {
      title: "🏢 Thương Hiệu",
      dataIndex: "brandName",
      key: "brandName",
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productNames",
      key: "productNames",
      align: "center",
      render: (productNames) => (
        <div>
          {productNames?.map((product, index) => (
            <div key={index}>{product}</div>
          ))}
        </div>
      ),
    },
    {
      title: "⚙️ Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewReceipt}
            />
                ),
    },
  ];

  return (
    <div className="stock-receipts-page">
      <div className="content-wrapper">
        <h2 className="page-title">Phiếu Nhập Kho</h2>
        
        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={14} md={16} lg={18}>
            <Input
              placeholder="Tìm kiếm theo ID, nhà cung cấp, thương hiệu, sản phẩm, ngày..."
              prefix={<SearchOutlined />}
              className="search-input"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={10} md={8} lg={6} className="add-button-container">
            <Button
              type="primary"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleAddNew}
              className="add-btn"
            >
              Nhập Phiếu Mới
            </Button>
          </Col>
        </Row>

        <Modal
          title={editMode ? "Sửa Phiếu Nhập Kho" : "Thêm Phiếu Nhập Kho"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleModalOk}
          className={styles.modalWidth}
        >
          <StockReceiptForm
            form={form}
            suppliers={suppliers}
            brands={brands}
            products={products}
            editMode={editMode}
          />
        </Modal>
        
        <PrintReceiptModal
          visible={printModalVisible}
          onClose={() => setPrintModalVisible(false)}
          receipt={selectedReceipt}
          onPrint={handlePrint}
          printRef={printRef}
        />

        <div className="table-container">
          <Table
            columns={columns}
            pagination={false}
            loading={loading}
            dataSource={stockReceipts.map((receipt) => ({
              ...receipt,
              key: receipt.id,
              productNames: receipt.receiptProducts?.map(
                (product) => product.productName
              ),
              totalAmount: receipt.receiptProducts?.map(
                (product) =>
                  `${product.quantity} x ${product.price} = ${product.totalAmount}`
              ),
            }))}
          />
        </div>
        
        <div className="pagination-container">
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <Select
            value={pageSize}
            style={{ width: 120 }}
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

export default Stock_Receipts;
