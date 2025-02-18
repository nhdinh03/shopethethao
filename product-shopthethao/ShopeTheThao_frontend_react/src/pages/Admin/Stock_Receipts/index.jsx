import React, { useEffect, useRef, useState } from "react";
import { Table, message, Button, Row, Select, Modal, Form } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { productsApi, suppliersApi, stock_ReceiptsAPi } from "api/Admin";
import moment from "moment";
import "..//index.scss";
import PaginationComponent from "components/PaginationComponent";
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
      const { receiptProducts, supplierId, brandId, orderDate, ...restValues } =
        values;

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
        quantity: product.quantity,
        price: product.price,
        totalAmount: product.quantity * product.price,
      }));

      const res = {
        ...restValues,
        supplierId: parsedSupplierId,
        brandId: parsedBrandId,
        orderDate: values.orderDate
          ? values.orderDate.format("YYYY-MM-DD")
          : null,
        receiptProducts: processedProducts,
      };

      console.log("Sending request payload:", res);

            if (editMode) {
        await stock_ReceiptsAPi.update(editMode.id, res);
        message.success("Cập nhật phiếu nhập kho thành công!");
      } else {
        await stock_ReceiptsAPi.create(res);
        message.success("Thêm phiếu nhập kho thành công!");
      }

      setWorkSomeThing([!workSomeThing]);
      setEditMode(null);
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi lưu phiếu nhập kho!");
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
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Phiếu Nhập Kho</h2>
        <div className="header-container">
          <Button
            type="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleAddNew}
          >
            Nhập Phiếu Mới
    </Button>
                  </div>

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
                  </Row>

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
    </div>
  );
};

export default Stock_Receipts;
